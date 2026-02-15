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
use Symfony\Component\Serializer\SerializerInterface;

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

    // 🔍 RECHERCHE RAPIDE (Par téléphone)
    // C'est ce qui servira quand le téléphone sonne !
    #[Route('/search', name: 'api_appelants_search', methods: ['GET'])]
    public function search(Request $request): JsonResponse
    {
        $phone = $request->query->get('phone');

        if (!$phone) {
            return $this->json(['error' => 'Numéro de téléphone requis'], 400);
        }

        // On cherche le patient
        $appelant = $this->appelantRepository->findOneBy(['phone' => $phone]);

        if (!$appelant) {
            return $this->json(null); // Pas trouvé, renvoie null (c'est normal)
        }

        return $this->json($appelant, 200, [], ['groups' => 'appelant:read']);
    }

    // 💾 CRÉATION INTELLIGENTE (Gestion des doublons)
    // Si le patient existe déjà, on le met à jour. Sinon, on le crée.
    #[Route('/nouveau', name: 'api_appelants_create', methods: ['POST'])]
    public function createOrUpdate(Request $request, ClientRepository $clientRepository): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $phone = $data['phone'] ?? null;
        $clientId = $data['client_id'] ?? null; // Pour quel médecin il appelle ?

        if (!$phone || !$clientId) {
            return $this->json(['error' => 'Téléphone et ID médecin obligatoires'], 400);
        }

        // 1. Est-ce que ce patient existe déjà ?
        $appelant = $this->appelantRepository->findOneBy(['phone' => $phone]);

        // 2. Si non, on le crée
        if (!$appelant) {
            $appelant = new Appelant();
            $appelant->setPhone($phone);
        }

        // 3. Mise à jour des infos (si fournies)
        if (isset($data['lastname'])) $appelant->setLastname($data['lastname']);
        if (isset($data['firstname'])) $appelant->setFirstname($data['firstname']);

        // 4. On lie ce patient au médecin concerné (si pas déjà fait)
        $client = $clientRepository->find($clientId);
        if ($client) {
            $appelant->addClient($client);
        }

        // 5. Sauvegarde
        $this->entityManager->persist($appelant);
        $this->entityManager->flush();

        return $this->json([
            'message' => 'Dossier patient mis à jour',
            'id' => $appelant->getId(),
            'phone' => $appelant->getPhone(),
            'nom' => $appelant->getLastname()
        ], 201);
    }
}