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
     * Permet à la secrétaire connectée de voir SES clients
     */
    #[Route('', name: 'list', methods: ['GET'])]
    public function getMyAssignments(AssignmentRepository $assignmentRepository): JsonResponse
    {
        // 1. On récupère l'utilisateur connecté (c'est AUTOMATIQUE et SÉCURISÉ par Symfony)
        $user = $this->getUser();

        // 2. On vérifie au cas où (même si le security.yaml protège déjà)
        if (!$user) {
            return $this->json(['error' => 'Utilisateur non connecté'], 401);
        }

        // 3. On demande au repository : "Donne-moi les affectations de CETTE secrétaire"
        // (Note : on utilise l'ID de l'utilisateur connecté, pas un ID envoyé dans l'URL qui pourrait être falsifié)
        $assignments = $assignmentRepository->findBySecretaire($user->getId());

        // 4. On prépare les données pour le Front (React)
        $data = array_map(function($assignment) {
            return [
                'clientId' => $assignment->getClientId(), // C'est l'info CRUCIALE pour le Front
                'assignedAt' => $assignment->getCreatedAt()->format('Y-m-d H:i:s')
            ];
        }, $assignments);

        return $this->json($data);
    }
}