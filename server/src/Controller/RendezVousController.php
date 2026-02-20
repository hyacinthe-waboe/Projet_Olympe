<?php

namespace App\Controller;

use App\Entity\RendezVous;
use App\Repository\AppelantRepository;
use App\Repository\ClientRepository;
use App\Repository\RendezVousRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api/rendezvous')]
class RendezVousController extends AbstractController
{
    private $entityManager;
    private $rendezVousRepository;

    public function __construct(EntityManagerInterface $entityManager, RendezVousRepository $rendezVousRepository)
    {
        $this->entityManager = $entityManager;
        $this->rendezVousRepository = $rendezVousRepository;
    }

// 📅 LISTE DES RDV (SÉCURISÉE)
    #[Route('', name: 'api_rendezvous_index', methods: ['GET'])]
    public function index(Request $request, \App\Repository\AssignmentRepository $assignmentRepo): JsonResponse
    {
        $clientId = $request->query->get('client_id');
        $user = $this->getUser();
        
        // 1. On vérifie si l'utilisateur est Admin
        $isAdmin = in_array('ROLE_ADMIN', $user->getRoles());

        if ($clientId) {
            // Si on demande un médecin précis (via le menu déroulant)
            $rdvs = $this->rendezVousRepository->findBy(['client' => $clientId]);
        } else {
            // Si on veut la vue globale de l'Agenda
            if ($isAdmin) {
                // L'Admin voit tout le monde
                $rdvs = $this->rendezVousRepository->findAll();
            } else {
                // La secrétaire ne voit QUE les médecins qu'on lui a affectés
                $assignments = $assignmentRepo->findBySecretaire($user->getId());
                
                // On extrait juste les IDs de ses médecins
                $clientIds = array_map(function($a) {
                    return $a->getClient()->getId();
                }, $assignments);
                
                if (empty($clientIds)) {
                    $rdvs = []; // Si elle n'a aucun médecin, son agenda est vide
                } else {
                    // Magie de Doctrine : on cherche les RDV où le client est DANS sa liste
                    $rdvs = $this->rendezVousRepository->findBy(['client' => $clientIds]);
                }
            }
        }

        $data = array_map(function($rdv) {
            return [
                'id' => $rdv->getId(),
                'title' => $rdv->getTitle(),
                'start' => $rdv->getStart()->format(\DateTime::ATOM),
                'end' => $rdv->getEnd()->format(\DateTime::ATOM),
                'description' => $rdv->getDescription(),
                'clientId' => $rdv->getClient()->getId(),
                'clientName' => $rdv->getClient()->getFirstName() . ' ' . $rdv->getClient()->getLastName(),
                'appelantId' => $rdv->getAppelant()->getId(),
                'appelantName' => $rdv->getAppelant()->getFirstname() . ' ' . $rdv->getAppelant()->getLastname(),
                'author' => $rdv->getAuthor() ? $rdv->getAuthor()->getEmail() : 'Système'
            ];
        }, $rdvs);

        return $this->json($data);
    }

    // ➕ CRÉATION D'UN NOUVEAU RDV (C'est ce qui manquait !)
    #[Route('', name: 'api_rendezvous_create', methods: ['POST'])]
    public function create(Request $request, ClientRepository $clientRepository, AppelantRepository $appelantRepository): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        // 1. Sécurité : vérifier que les champs obligatoires sont là
        if (empty($data['start']) || empty($data['end']) || empty($data['clientId']) || empty($data['appelantId'])) {
            return $this->json(['error' => 'Données incomplètes (dates, médecin ou patient manquant)'], 400);
        }

        // 2. Chercher le Médecin et le Patient dans la BDD
        $client = $clientRepository->find($data['clientId']);
        $appelant = $appelantRepository->find($data['appelantId']);

        if (!$client || !$appelant) {
            return $this->json(['error' => 'Médecin ou Patient introuvable'], 404);
        }

        // 3. Créer le nouveau Rendez-vous
        $rdv = new RendezVous();
        $rdv->setTitle($data['title'] ?? 'Rendez-vous');
        $rdv->setDescription($data['description'] ?? '');
        
        try {
            $rdv->setStart(new \DateTime($data['start']));
            $rdv->setEnd(new \DateTime($data['end']));
        } catch (\Exception $e) {
            return $this->json(['error' => 'Format de date invalide'], 400);
        }

        $rdv->setClient($client);
        $rdv->setAppelant($appelant);
        $rdv->setAuthor($this->getUser()); // On enregistre qui a créé le RDV

        // 4. Sauvegarder dans la base de données
        $this->entityManager->persist($rdv);
        $this->entityManager->flush();

        return $this->json(['message' => 'Rendez-vous créé avec succès'], 201);
    }

    // ✏️ MODIFICATION (NOUVEAU)
    #[Route('/{id}', name: 'api_rendezvous_update', methods: ['PUT'])]
    public function update(int $id, Request $request, ClientRepository $clientRepository, AppelantRepository $appelantRepository): JsonResponse
    {
        $rdv = $this->rendezVousRepository->find($id);
        if (!$rdv) return $this->json(['error' => 'RDV introuvable'], 404);

        $data = json_decode($request->getContent(), true);

        // Mise à jour des champs si fournis
        if (!empty($data['start'])) {
            try { $rdv->setStart(new \DateTime($data['start'])); } catch (\Exception $e) {}
        }
        if (!empty($data['end'])) {
            try { $rdv->setEnd(new \DateTime($data['end'])); } catch (\Exception $e) {}
        }
        if (isset($data['title'])) $rdv->setTitle($data['title']);
        if (isset($data['description'])) $rdv->setDescription($data['description']);

        // Changement de liaisons
        if (!empty($data['clientId'])) {
            $client = $clientRepository->find($data['clientId']);
            if ($client) $rdv->setClient($client);
        }
        if (!empty($data['appelantId'])) {
            $appelant = $appelantRepository->find($data['appelantId']);
            if ($appelant) $rdv->setAppelant($appelant);
        }

        $this->entityManager->flush();

        return $this->json(['message' => 'RDV modifié']);
    }
    
    // 🗑️ SUPPRESSION
    #[Route('/{id}', name: 'api_rendezvous_delete', methods: ['DELETE'])]
    public function delete(int $id): JsonResponse
    {
        $rdv = $this->rendezVousRepository->find($id);
        if (!$rdv) return $this->json(['error' => 'RDV introuvable'], 404);

        $this->entityManager->remove($rdv);
        $this->entityManager->flush();

        return $this->json(['message' => 'RDV supprimé']);
    }
}