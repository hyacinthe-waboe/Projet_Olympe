<?php

namespace App\Controller\Admin;

use App\Entity\Client;
use App\Repository\ClientRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api/admin/clients', name: 'api_admin_clients_')]
class ClientController extends AbstractController
{
    /**
     * Liste tous les clients (médecins)
     */
    #[Route('', name: 'index', methods: ['GET'])]
    public function index(ClientRepository $clientRepository): JsonResponse
    {
        $clients = $clientRepository->findAll();
        return $this->json($clients);
    }

    /**
     * Crée un nouveau client
     */
    #[Route('', name: 'create', methods: ['POST'])]
    public function create(Request $request, EntityManagerInterface $em): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        // Validation rapide
        if (empty($data['email']) || empty($data['lastName'])) {
            return $this->json(['error' => 'Email et Nom obligatoires'], 400);
        }

        $client = new Client();
        $client->setEmail($data['email']);
        $client->setFirstName($data['firstName'] ?? ''); // ?? '' évite le bug si vide
        $client->setLastName($data['lastName']);
        $client->setPhone($data['phone'] ?? null);
        $client->setSpecialty($data['specialty'] ?? null);
        $client->setInstructions($data['instructions'] ?? null);
        $client->setWzApiKey($data['wzApiKey'] ?? null);
        $client->setIsActive(true); // Actif par défaut

        $em->persist($client);
        $em->flush();

        return $this->json($client, 201);
    }
}