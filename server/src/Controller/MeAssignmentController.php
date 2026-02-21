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
        $user = $this->getUser();

        if (!$user) {
            return $this->json(['error' => 'Utilisateur non connecté'], 401);
        }

        $assignments = $assignmentRepository->findBySecretaire($user->getId());

        $data = array_map(function($assignment) {
            return [
                'assignedAt' => $assignment->getCreatedAt()->format('Y-m-d H:i:s'),
                'client' => [
                    'id' => $assignment->getClient()->getId(),
                    'firstName' => $assignment->getClient()->getFirstName(),
                    'lastName' => $assignment->getClient()->getLastName(),
                    'specialty' => $assignment->getClient()->getSpecialty(),
                    'phone' => $assignment->getClient()->getPhone(),
                    'email' => $assignment->getClient()->getEmail(),
                    'address' => $assignment->getClient()->getAddress(),
                    'birthDate' => $assignment->getClient()->getBirthDate() ? $assignment->getClient()->getBirthDate()->format('Y-m-d') : null,
                ]
            ];
        }, $assignments);

        return $this->json($data, 200, [], ['json_encode_options' => JSON_UNESCAPED_UNICODE]);
    }
}