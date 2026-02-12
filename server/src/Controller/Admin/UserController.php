<?php

namespace App\Controller\Admin;

use App\Entity\User;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api/admin/users', name: 'api_admin_users_')]
class UserController extends AbstractController
{
    /**
     * Liste toutes les secrétaires pour l'Admin
     */
    #[Route('', name: 'index', methods: ['GET'])]
    public function index(UserRepository $userRepository): JsonResponse
    {
        // On utilise la méthode personnalisée du Repository
        $users = $userRepository->findByRole('ROLE_SECRETAIRE');

        return $this->json($users, 200, [], ['groups' => 'user:read']);
    }

    /**
     * Active ou désactive un compte secrétaire
     */
    #[Route('/{id}/toggle', name: 'toggle', methods: ['PATCH'])]
    public function toggle(User $user, EntityManagerInterface $em): JsonResponse
    {
        // Inversion de l'état (true -> false / false -> true)
        $user->setIsActivate(!$user->isIsActivate());
        $em->flush();

        return $this->json([
            'id' => $user->getId(),
            'fullName' => $user->getFirstName() . ' ' . $user->getLastName(),
            'isActivate' => $user->isIsActivate()
        ]);
    }
}