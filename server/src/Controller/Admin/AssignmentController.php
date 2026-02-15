<?php

namespace App\Controller\Admin;

use App\Entity\Assignment;
use App\Entity\Client; // Import important !
use App\Repository\AssignmentRepository;
use App\Repository\ClientRepository; // Import important !
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api/admin/assignments', name: 'api_admin_assignments_')]
class AssignmentController extends AbstractController
{
    /**
     * Liste toutes les affectations
     */
    #[Route('', name: 'index', methods: ['GET'])]
    public function index(AssignmentRepository $assignmentRepository): JsonResponse
    {
        $assignments = $assignmentRepository->findAll();

        $data = array_map(function($assignment) {
            return [
                'id' => $assignment->getId(),
                'createdAt' => $assignment->getCreatedAt()->format('Y-m-d H:i:s'),
                // Infos Secrétaire
                'secretaire' => [
                    'id' => $assignment->getSecretaire()->getId(),
                    'nomComplet' => $assignment->getSecretaire()->getFirstName() . ' ' . $assignment->getSecretaire()->getLastName(),
                ],
                // Infos Client (Médecin) - Nouvelle structure
                'client' => [
                    'id' => $assignment->getClient()->getId(),
                    'nomComplet' => $assignment->getClient()->getFirstName() . ' ' . $assignment->getClient()->getLastName(),
                ]
            ];
        }, $assignments);

        return $this->json($data, 200, [], ['json_encode_options' => JSON_UNESCAPED_UNICODE]);
    }

    /**
     * Liste les affectations d'une secrétaire spécifique
     */
    #[Route('/secretaire/{secretaireId}', name: 'by_secretaire', methods: ['GET'])]
    public function getBySecretaire(
        int $secretaireId,
        AssignmentRepository $assignmentRepository,
        UserRepository $userRepository
    ): JsonResponse {
        $secretaire = $userRepository->find($secretaireId);
        
        if (!$secretaire || !in_array('ROLE_SECRETAIRE', $secretaire->getRoles())) {
            return $this->json(['error' => 'Secrétaire invalide'], 404);
        }

        $assignments = $assignmentRepository->findBySecretaire($secretaireId);

        $data = array_map(function($assignment) {
            return [
                'id' => $assignment->getId(),
                'assignedAt' => $assignment->getCreatedAt()->format('Y-m-d H:i:s'),
                'client' => [
                    'id' => $assignment->getClient()->getId(),
                    'nomComplet' => $assignment->getClient()->getFirstName() . ' ' . $assignment->getClient()->getLastName(),
                ]
            ];
        }, $assignments);

        return $this->json($data, 200, [], ['json_encode_options' => JSON_UNESCAPED_UNICODE]);
    }

    /**
     * Créer une nouvelle affectation
     */
    #[Route('', name: 'create', methods: ['POST'])]
    public function create(
        Request $request,
        EntityManagerInterface $em,
        AssignmentRepository $assignmentRepository,
        UserRepository $userRepository,
        ClientRepository $clientRepository // On injecte le repo Client
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);

        // 1. Validation basique
        if (empty($data['secretaireId']) || empty($data['clientId'])) {
            return $this->json(['error' => 'secretaireId et clientId requis'], 400);
        }

        // 2. Récupération de la secrétaire
        $secretaire = $userRepository->find($data['secretaireId']);
        if (!$secretaire || !in_array('ROLE_SECRETAIRE', $secretaire->getRoles())) {
            return $this->json(['error' => 'Secrétaire invalide'], 404);
        }

        // 3. Récupération du Client (C'est ICI que ça change)
        $client = $clientRepository->find($data['clientId']);
        if (!$client) {
            return $this->json(['error' => 'Client (Médecin) introuvable'], 404);
        }

        // 4. Vérification doublon (On utilise l'ID du client récupéré)
        if ($assignmentRepository->existsAssignment($secretaire->getId(), $client->getId())) {
            return $this->json(['error' => 'Cette affectation existe déjà'], 409);
        }

        // 5. Création
        $assignment = new Assignment();
        $assignment->setSecretaire($secretaire);
        $assignment->setClient($client); // On passe l'OBJET Client, pas l'ID
        $assignment->setCreatedAt(new \DateTime());

        $em->persist($assignment);
        $em->flush();

        return $this->json(['message' => 'Affectation créée avec succès'], 201);
    }

    /**
     * Supprimer une affectation
     */
    #[Route('/{id}', name: 'delete', methods: ['DELETE'])]
    public function delete(
        int $id,
        EntityManagerInterface $em,
        AssignmentRepository $assignmentRepository
    ): JsonResponse {
        $assignment = $assignmentRepository->find($id);

        if (!$assignment) {
            return $this->json(['error' => 'Affectation non trouvée'], 404);
        }

        $em->remove($assignment);
        $em->flush();

        return $this->json(['message' => 'Affectation supprimée']);
    }
}