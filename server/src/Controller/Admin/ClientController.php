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

        $data = array_map(function($client) {
            return [
                'id' => $client->getId(),
                'email' => $client->getEmail(),
                'firstName' => $client->getFirstName(),
                'lastName' => $client->getLastName(),
                'phone' => $client->getPhone(),
                'specialty' => $client->getSpecialty(),
                'address' => $client->getAddress(),
                'birthDate' => $client->getBirthDate() ? $client->getBirthDate()->format('Y-m-d') : null,
                'instructions' => $client->getInstructions(),
                'wzApiKey' => $client->getWzApiKey(),
                'isActive' => $client->isActive(),
            ];
        }, $clients);

        return $this->json($data);
    }

    /**
     * Crée un nouveau client
     */
    #[Route('', name: 'create', methods: ['POST'])]
    public function create(Request $request, EntityManagerInterface $em): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        // ✅ VALIDATION STRICTE NOM/PRÉNOM
        if (empty($data['email']) || empty($data['lastName']) || empty($data['firstName'])) {
            return $this->json(['error' => 'Email, Nom et Prénom obligatoires'], 400);
        }

        $client = new Client();
        $client->setEmail($data['email']);
        $client->setFirstName($data['firstName']); // Direct
        $client->setLastName($data['lastName']);   // Direct
        $client->setPhone($data['phone'] ?? null);
        $client->setSpecialty($data['specialty'] ?? null);
        $client->setAddress($data['address'] ?? null);
        
        if (!empty($data['birthDate'])) {
            try { $client->setBirthDate(new \DateTime($data['birthDate'])); } catch (\Exception $e) {}
        }

        $client->setInstructions($data['instructions'] ?? null);
        $client->setWzApiKey($data['wzApiKey'] ?? null);
        $client->setIsActive(true); 

        $em->persist($client);
        $em->flush();

        return $this->json([
            'id' => $client->getId(),
            'email' => $client->getEmail(),
            'firstName' => $client->getFirstName(),
            'lastName' => $client->getLastName(),
            'phone' => $client->getPhone(),
            'specialty' => $client->getSpecialty(),
            'address' => $client->getAddress(),
            'birthDate' => $client->getBirthDate() ? $client->getBirthDate()->format('Y-m-d') : null,
        ], 201);
    }
    
    /**
     * Met à jour un client existant
     */
    #[Route('/{id}', name: 'update', methods: ['PUT'])]
    public function update(int $id, Request $request, ClientRepository $clientRepository, EntityManagerInterface $em): JsonResponse
    {
        $client = $clientRepository->find($id);

        if (!$client) {
            return $this->json(['error' => 'Client introuvable'], 404);
        }

        $data = json_decode($request->getContent(), true);

        if (isset($data['email'])) $client->setEmail($data['email']);
        if (isset($data['firstName'])) $client->setFirstName($data['firstName']);
        if (isset($data['lastName'])) $client->setLastName($data['lastName']);
        if (isset($data['phone'])) $client->setPhone($data['phone']);
        if (isset($data['specialty'])) $client->setSpecialty($data['specialty']);
        if (isset($data['address'])) $client->setAddress($data['address']);
        if (isset($data['instructions'])) $client->setInstructions($data['instructions']);
        if (isset($data['wzApiKey'])) $client->setWzApiKey($data['wzApiKey']);
        
        if (!empty($data['birthDate'])) {
            try { $client->setBirthDate(new \DateTime($data['birthDate'])); } catch (\Exception $e) {}
        }

        $em->flush();

        return $this->json([
            'message' => 'Client mis à jour',
            'id' => $client->getId(),
            'firstName' => $client->getFirstName(),
            'lastName' => $client->getLastName()
        ]);
    }
    
    #[Route('/{id}', name: 'delete', methods: ['DELETE'])]
    public function delete(int $id, ClientRepository $clientRepository, EntityManagerInterface $em): JsonResponse
    {
        $client = $clientRepository->find($id);
        if (!$client) return $this->json(['error' => 'Client introuvable'], 404);

        try {
            $em->remove($client);
            $em->flush();
        } catch (\Doctrine\DBAL\Exception\ForeignKeyConstraintViolationException $e) {
            return $this->json(['error' => 'Impossible de supprimer ce client car il est lié à des patients ou des affectations.'], 409);
        } catch (\Exception $e) {
            return $this->json(['error' => 'Erreur serveur'], 500);
        }

        return $this->json(['message' => 'Client supprimé']);
    }
}