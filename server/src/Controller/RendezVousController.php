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

    // 📅 LISTE DES RDV
    #[Route('', name: 'api_rendezvous_index', methods: ['GET'])]
    public function index(Request $request): JsonResponse
    {
        $clientId = $request->query->get('client_id');

        if ($clientId) {
            $rdvs = $this->rendezVousRepository->findBy(['client' => $clientId]);
        } else {
            $rdvs = $this->rendezVousRepository->findAll();
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
                'appelantId' => $rdv->getAppelant()->getId(), // Utile pour l'édition
                'appelantName' => $rdv->getAppelant()->getFirstname() . ' ' . $rdv->getAppelant()->getLastname(),
                'author' => $rdv->getAuthor() ? $rdv->getAuthor()->getEmail() : 'Système'
            ];
        }, $rdvs);

        return $this->json($data);
    }

    // ➕ CRÉATION
    #[Route('', name: 'api_rendezvous_create', methods: ['POST'])]
    public function create(Request $request, ClientRepository $clientRepository, AppelantRepository $appelantRepository): JsonResponse {
        $data = json_decode($request->getContent(), true);
        
        // Validation basique (Le frontend fera la validation horaire 8h-18h)
        if (empty($data['start']) || empty($data['end']) || empty($data['clientId']) || empty($data['appelantId'])) {
            return $this->json(['error' => 'Données incomplètes'], 400);
        }

        $client = $clientRepository->find($data['clientId']);
        $appelant = $appelantRepository->find($data['appelantId']);
        
        if (!$client || !$appelant) return $this->json(['error' => 'Liaison introuvable'], 404);

        $rdv = new RendezVous();
        try {
            $rdv->setStart(new \DateTime($data['start']));
            $rdv->setEnd(new \DateTime($data['end']));
        } catch (\Exception $e) { return $this->json(['error' => 'Date invalide'], 400); }

        $rdv->setTitle($data['title'] ?? 'Rendez-vous');
        $rdv->setDescription($data['description'] ?? '');
        $rdv->setClient($client);
        $rdv->setAppelant($appelant);
        $rdv->setAuthor($this->getUser()); // Peut être null, c'est autorisé maintenant

        $this->entityManager->persist($rdv);
        $this->entityManager->flush();

        return $this->json(['message' => 'RDV créé', 'id' => $rdv->getId()], 201);
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