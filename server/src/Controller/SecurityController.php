<?php

namespace App\Controller;

use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class SecurityController extends AbstractController
{
    #[Route(path: '/login', name: 'app_login', methods: ['POST'])]
    public function login(): Response
    {
        // Si l'utilisateur est connecté (authentification réussie)
        if ($this->getUser()) {
            return $this->json([
                'message' => 'Connexion réussie',
                'user' => [
                    'id' => $this->getUser()->getId(),
                    'email' => $this->getUser()->getUserIdentifier(),
                    'firstName' => $this->getUser()->getFirstName(),
                    'lastName' => $this->getUser()->getLastName(),
                    'roles' => $this->getUser()->getRoles(),
                ]
            ]);
        }

        // Si pas connecté après tentative → Erreur 401
        return $this->json([
            'error' => 'Identifiants incorrects'
        ], 401);
    }

    #[Route(path: '/logout', name: 'app_logout')]
    public function logout(): void
    {
        throw new \LogicException('This method can be blank - it will be intercepted by the logout key on your firewall.');
    }

    #[Route('/api/me', name: 'api_me', methods: ['GET'])]
    public function me(): JsonResponse
    {
        $user = $this->getUser();

        if (!$user) {
            return $this->json(['error' => 'Non connecté'], 401);
        }

        return $this->json([
            'id' => $user->getId(),
            'email' => $user->getUserIdentifier(),
            'firstName' => $user->getFirstName(),
            'lastName' => $user->getLastName(),
            'roles' => $user->getRoles(),
        ]);
    }
}