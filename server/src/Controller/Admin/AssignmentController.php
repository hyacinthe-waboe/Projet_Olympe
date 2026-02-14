<?php

namespace App\Controller\Admin;

use App\Entity\Assignment;
use App\Repository\AssignmentRepository;
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
                'secretaireId' => $assignment->getSecretaire()->getId(),
                'secretaireEmail' => $assignment->getSecretaire()->getEmail(),
                'secretaireNom' => $assignment->getSecretaire()->getFirstName() . ' ' . $assignment->getSecretaire()->getLastName(),
                'clientId' => $assignment->getClientId(),
                'createdAt' => $assignment->getCreatedAt()->format('Y-m-d H:i:s')
            ];
        }, $assignments);

        return $this->json($data);
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
        // Vérifier que la secrétaire existe
        $secretaire = $userRepository->find($secretaireId);
        if (!$secretaire) {
            return $this->json(['error' => 'Secrétaire non trouvée'], 404);
        }

        // Vérifier que c'est bien une secrétaire
        if (!in_array('ROLE_SECRETAIRE', $secretaire->getRoles())) {
            return $this->json(['error' => 'Cet utilisateur n\'est pas une secrétaire'], 400);
        }

        $assignments = $assignmentRepository->findBySecretaire($secretaireId);

        $data = array_map(function($assignment) {
            return [
                'id' => $assignment->getId(),
                'clientId' => $assignment->getClientId(),
                'createdAt' => $assignment->getCreatedAt()->format('Y-m-d H:i:s')
            ];
        }, $assignments);

        return $this->json([
            'secretaire' => [
                'id' => $secretaire->getId(),
                'email' => $secretaire->getEmail(),
                'nom' => $secretaire->getFirstName() . ' ' . $secretaire->getLastName()
            ],
            'assignments' => $data,
            'total' => count($data)
        ]);
    }

    /**
     * Créer une nouvelle affectation
     */
    #[Route('', name: 'create', methods: ['POST'])]
    public function create(
        Request $request,
        EntityManagerInterface $em,
        AssignmentRepository $assignmentRepository,
        UserRepository $userRepository
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);

        // Validation champs requis
        if (empty($data['secretaireId']) || empty($data['clientId'])) {
            return $this->json([
                'error' => 'Les champs secretaireId et clientId sont obligatoires'
            ], 400);
        }

        // Vérifier que la secrétaire existe
        $secretaire = $userRepository->find($data['secretaireId']);
        if (!$secretaire) {
            return $this->json(['error' => 'Secrétaire non trouvée'], 404);
        }

        // Vérifier que c'est bien une secrétaire
        if (!in_array('ROLE_SECRETAIRE', $secretaire->getRoles())) {
            return $this->json(['error' => 'Cet utilisateur n\'est pas une secrétaire'], 400);
        }

        // Vérifier que l'affectation n'existe pas déjà
        if ($assignmentRepository->existsAssignment($data['secretaireId'], $data['clientId'])) {
            return $this->json([
                'error' => 'Cette affectation existe déjà'
            ], 409);
        }

        // Créer l'affectation
        $assignment = new Assignment();
        $assignment->setSecretaire($secretaire);
        $assignment->setClientId($data['clientId']);
        $assignment->setCreatedAt(new \DateTime());

        $em->persist($assignment);
        $em->flush();

        return $this->json([
            'message' => 'Affectation créée avec succès',
            'assignment' => [
                'id' => $assignment->getId(),
                'secretaireId' => $assignment->getSecretaire()->getId(),
                'secretaireEmail' => $assignment->getSecretaire()->getEmail(),
                'secretaireNom' => $assignment->getSecretaire()->getFirstName() . ' ' . $assignment->getSecretaire()->getLastName(),
                'clientId' => $assignment->getClientId(),
                'createdAt' => $assignment->getCreatedAt()->format('Y-m-d H:i:s')
            ]
        ], 201);
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

        $deletedData = [
            'id' => $assignment->getId(),
            'secretaireId' => $assignment->getSecretaire()->getId(),
            'clientId' => $assignment->getClientId()
        ];

        $em->remove($assignment);
        $em->flush();

        return $this->json([
            'message' => 'Affectation supprimée avec succès',
            'deleted' => $deletedData
        ]);
    }
}