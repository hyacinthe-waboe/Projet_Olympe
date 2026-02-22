<?php

namespace App\Controller;

use App\Entity\Appelant;
use App\Entity\Client;
use App\Repository\AppelantRepository;
use App\Repository\ClientRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api/appelants')]
class AppelantController extends AbstractController
{
    private $entityManager;
    private $appelantRepository;

    public function __construct(EntityManagerInterface $entityManager, AppelantRepository $appelantRepository)
    {
        $this->entityManager = $entityManager;
        $this->appelantRepository = $appelantRepository;
    }

    // 📋 LISTE COMPLÈTE
    #[Route('', name: 'api_appelants_index', methods: ['GET'])]
    public function index(): JsonResponse
    {
        $appelants = $this->appelantRepository->findAll();
        
        $data = array_map(function($appelant) {
            $linkedClient = null;
            if (!$appelant->getClients()->isEmpty()) {
                $client = $appelant->getClients()->first();
                $linkedClient = [
                    'id' => $client->getId(),
                    'nomComplet' => $client->getFirstName() . ' ' . $client->getLastName()
                ];
            }

            return [
                'id' => $appelant->getId(),
                'lastname' => $appelant->getLastname(),
                'firstname' => $appelant->getFirstname(),
                'phone' => $appelant->getPhone(),
                'email' => $appelant->getEmail(),
                'birthDate' => $appelant->getBirthDate() ? $appelant->getBirthDate()->format('Y-m-d') : null,
                'linkedClient' => $linkedClient
            ];
        }, $appelants);

        return $this->json($data);
    }

    // 🔍 RECHERCHE RAPIDE
    #[Route('/search', name: 'api_appelants_search', methods: ['GET'])]
    public function search(Request $request): JsonResponse
    {
        $phone = $request->query->get('phone');
        if (!$phone) return $this->json(['error' => 'Numéro requis'], 400);

        $appelant = $this->appelantRepository->findOneBy(['phone' => $phone]);
        if (!$appelant) return $this->json(null);

        return $this->json($appelant, 200, [], ['groups' => 'appelant:read']);
    }

    // 💾 CRÉATION / MODIFICATION (Avec Nom/Prénom séparés)
    #[Route('/nouveau', name: 'api_appelants_create', methods: ['POST'])]
    public function createOrUpdate(Request $request, ClientRepository $clientRepository): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $phone = $data['phone'] ?? null;
        $clientId = $data['client_id'] ?? $data['linkedClient'] ?? null; 

        // Validation stricte
        if (empty($phone)) {
             return $this->json(['error' => 'Téléphone obligatoire'], 400);
        }
        
        // ✅ CHANGEMENT : On attend Nom ET Prénom distincts
        $lastname = $data['lastname'] ?? null;
        $firstname = $data['firstname'] ?? null;

        if (empty($lastname) || empty($firstname)) {
            return $this->json(['error' => 'Le Nom et le Prénom sont obligatoires'], 400);
        }

        // 1. Recherche existant (Dédoublonnage)
        $appelant = $this->appelantRepository->findOneBy(['phone' => $phone]);

        // 2. Création si n'existe pas
        if (!$appelant) {
            $appelant = new Appelant();
            $appelant->setPhone($phone);
        }

        // 3. Mise à jour des infos
        $appelant->setLastname($lastname);
        $appelant->setFirstname($firstname);
        if (isset($data['email'])) $appelant->setEmail($data['email']);
        
        if (!empty($data['birthDate'])) {
            try { $appelant->setBirthDate(new \DateTime($data['birthDate'])); } catch (\Exception $e) {}
        }

        // 4. Liaison Médecin (Correction pour la synchronisation)
        if ($clientId) {
            $client = $clientRepository->find($clientId);
            if ($client) {
                // 🛡️ On vide les anciens liens avant d'ajouter le nouveau
                foreach ($appelant->getClients() as $oldClient) {
                    $appelant->removeClient($oldClient);
                }
                $appelant->addClient($client);
            }
        }

        $this->entityManager->persist($appelant);
        $this->entityManager->flush();

        return $this->json([
            'id' => $appelant->getId(),
            'lastname' => $appelant->getLastname(),
            'firstname' => $appelant->getFirstname(),
            'phone' => $appelant->getPhone(),
            'email' => $appelant->getEmail(),
            'birthDate' => $appelant->getBirthDate() ? $appelant->getBirthDate()->format('Y-m-d') : null,
        ], 201);
    }
    
// 🗑️ SUPPRESSION (Version Blindée)
    #[Route('/{id}', name: 'app_appelant_delete', methods: ['DELETE'])]
    public function delete(int $id, \App\Repository\RendezVousRepository $rdvRepo): JsonResponse
    {
        try {
            $appelant = $this->appelantRepository->find($id);

            if (!$appelant) {
                return $this->json(['error' => 'Patient introuvable'], 404);
            }

            // 🛡️ SÉCURITÉ 1 : On vérifie si le patient a des RDV
            $hasRdvs = $rdvRepo->findOneBy(['appelant' => $appelant]);
            if ($hasRdvs) {
                return $this->json([
                    // ✍️ NOUVEAU TEXTE PLUS PRO
                    'error' => 'Ce dossier patient contient des rendez-vous. Suppression impossible.'
                ], 400);
            }

            // 🛡️ TENTATIVE DE SUPPRESSION
            $this->entityManager->remove($appelant);
            $this->entityManager->flush();

            return $this->json(['message' => 'Patient supprimé avec succès']);

        } catch (\Doctrine\DBAL\Exception\ForeignKeyConstraintViolationException $e) {
            return $this->json([
                // ✍️ NOUVEAU TEXTE PLUS PRO
                'error' => 'Ce patient possède un historique (messages, etc.). Suppression impossible.'
            ], 400);
        } catch (\Throwable $e) {
            return $this->json([
                'error' => 'Erreur système : ' . $e->getMessage()
            ], 500);
        }
    }

    // 🟢 NOUVELLE ROUTE : Le "Bouton Nucléaire" pour vider tout l'historique 360°
    #[Route('/{id}/clear-history', name: 'app_appelant_clear_history', methods: ['DELETE'])]
    public function clearFullHistory(
        int $id, 
        \App\Repository\AppelantRepository $appRepo, 
        \Doctrine\ORM\EntityManagerInterface $em
    ): JsonResponse {
        $appelant = $appRepo->find($id);
        
        if (!$appelant) {
            return $this->json(['error' => 'Patient introuvable'], 404);
        }

        // 1. On supprime tous les Messages
        foreach ($appelant->getMessages() as $msg) {
            $em->remove($msg);
        }

        // 2. On supprime tous les Appels (CallLog)
        $calls = $em->getRepository(\App\Entity\CallLog::class)->findBy(['appelant' => $appelant]);
        foreach ($calls as $call) {
            $em->remove($call);
        }

        // 3. On supprime tous les Rendez-Vous
        // (Si ton entité s'appelle autrement que RendezVous, adapte le nom ici !)
        $rdvs = $em->getRepository(\App\Entity\RendezVous::class)->findBy(['appelant' => $appelant]);
        foreach ($rdvs as $rdv) {
            $em->remove($rdv);
        }

        // On valide la destruction de tout l'historique
        $em->flush();

        return $this->json(['message' => 'Historique complet (RDV, Messages, Appels) effacé définitivement.']);
    }
}