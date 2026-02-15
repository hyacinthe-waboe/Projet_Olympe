<?php

namespace App\Controller;

use App\Repository\AssignmentRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api/me/assignments', name: 'api_me_assignments_')]
class MeAssignmentController extends AbstractController
{
    /**
     * Permet à la secrétaire connectée de voir SES clients (Médecins)
     */
    #[Route('', name: 'list', methods: ['GET'])]
    public function getMyAssignments(AssignmentRepository $assignmentRepository): JsonResponse
    {
        // 1. On récupère l'utilisateur connecté
        $user = $this->getUser();

        if (!$user) {
            return $this->json(['error' => 'Utilisateur non connecté'], 401);
        }

        // 2. On récupère les affectations
        $assignments = $assignmentRepository->findBySecretaire($user->getId());

        // 3. Transformation des données pour le Front (React)
        // On renvoie maintenant l'objet "client" complet avec le nom !
        $data = array_map(function($assignment) {
            return [
                'assignedAt' => $assignment->getCreatedAt()->format('Y-m-d H:i:s'),
                'client' => [
                    'id' => $assignment->getClient()->getId(),
                    'firstName' => $assignment->getClient()->getFirstName(),
                    'lastName' => $assignment->getClient()->getLastName(),
                    'specialty' => $assignment->getClient()->getSpecialty(),
                    'phone' => $assignment->getClient()->getPhone(),
                ]
            ];
        }, $assignments);

        return $this->json($data, 200, [], ['json_encode_options' => JSON_UNESCAPED_UNICODE]);
    }
}