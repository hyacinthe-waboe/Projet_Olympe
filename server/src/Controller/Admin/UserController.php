<?php

namespace App\Controller\Admin;

use App\Entity\User;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;

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

    // Transformation manuelle pour éviter les problèmes de sérialisation
    $data = array_map(function($user) {
        return [
            'id' => $user->getId(),
            'email' => $user->getEmail(),
            'firstName' => $user->getFirstName(),
            'lastName' => $user->getLastName(),
            'isActivate' => $user->isActivate(),
            'roles' => $user->getRoles()
        ];
    }, $users);

    return $this->json($data);
}
    /**
     * Crée une nouvelle secrétaire
     */
    #[Route('', name: 'create', methods: ['POST'])]
    public function create(
        Request $request,
        EntityManagerInterface $em,
        UserPasswordHasherInterface $passwordHasher,
        ValidatorInterface $validator,
        UserRepository $userRepository
    ): JsonResponse {
        // 1. Récupération des données JSON
        $data = json_decode($request->getContent(), true);

        // 2. Validation basique des champs requis
        $requiredFields = ['email', 'password', 'firstName', 'lastName'];
        foreach ($requiredFields as $field) {
            if (empty($data[$field])) {
                return $this->json([
                    'error' => "Le champ '$field' est obligatoire"
                ], 400);
            }
        }

        // 3. Vérification que l'email n'existe pas déjà
        $existingUser = $userRepository->findOneBy(['email' => $data['email']]);
        if ($existingUser) {
            return $this->json([
                'error' => 'Un utilisateur avec cet email existe déjà'
            ], 409); // 409 Conflict
        }

        // 4. Création de l'entité User
        $user = new User();
        $user->setEmail($data['email']);
        $user->setFirstName($data['firstName']);
        $user->setLastName($data['lastName']);
        
        // Par défaut, une nouvelle secrétaire est activée
        $user->setIsActivate($data['isActivate'] ?? true);
        
        // Attribution du rôle SECRETAIRE
        $user->setRoles(['ROLE_SECRETAIRE']);

        // 5. Hash du mot de passe
        $hashedPassword = $passwordHasher->hashPassword($user, $data['password']);
        $user->setPassword($hashedPassword);

        // 6. Validation de l'entité avec les contraintes Symfony
        $errors = $validator->validate($user);
        if (count($errors) > 0) {
            $errorMessages = [];
            foreach ($errors as $error) {
                $errorMessages[] = $error->getMessage();
            }
            return $this->json([
                'error' => 'Validation échouée',
                'details' => $errorMessages
            ], 400);
        }

        // 7. Sauvegarde en base de données
        $em->persist($user);
        $em->flush();

        // 8. Réponse avec les données de l'utilisateur créé
        return $this->json([
            'message' => 'Secrétaire créée avec succès',
            'user' => [
                'id' => $user->getId(),
                'email' => $user->getEmail(),
                'firstName' => $user->getFirstName(),
                'lastName' => $user->getLastName(),
                'isActivate' => $user->isActivate(),
                'roles' => $user->getRoles()
            ]
        ], 201); // 201 Created
    }

    /**
     * Met à jour une secrétaire existante
     */
    #[Route('/{id}', name: 'update', methods: ['PUT'])]
    public function update(
        int $id,
        Request $request,
        EntityManagerInterface $em,
        UserPasswordHasherInterface $passwordHasher,
        ValidatorInterface $validator,
        UserRepository $userRepository
    ): JsonResponse {
        // 1. Récupération de l'utilisateur
        $user = $userRepository->find($id);
        
        if (!$user) {
            return $this->json([
                'error' => 'Utilisateur non trouvé'
            ], 404);
        }

        // 2. Vérification que c'est bien une secrétaire
        if (!in_array('ROLE_SECRETAIRE', $user->getRoles())) {
            return $this->json([
                'error' => 'Seules les secrétaires peuvent être modifiées via cette route'
            ], 403); // 403 Forbidden
        }

        // 3. Récupération des données JSON
        $data = json_decode($request->getContent(), true);

        // 4. Mise à jour des champs fournis (partial update)
        if (isset($data['email'])) {
            // Vérifier que le nouvel email n'est pas déjà pris par un autre utilisateur
            $existingUser = $userRepository->findOneBy(['email' => $data['email']]);
            if ($existingUser && $existingUser->getId() !== $user->getId()) {
                return $this->json([
                    'error' => 'Cet email est déjà utilisé par un autre utilisateur'
                ], 409);
            }
            $user->setEmail($data['email']);
        }

        if (isset($data['firstName'])) {
            $user->setFirstName($data['firstName']);
        }

        if (isset($data['lastName'])) {
            $user->setLastName($data['lastName']);
        }

        if (isset($data['isActivate'])) {
            $user->setIsActivate($data['isActivate']);
        }

        // 5. Mise à jour du mot de passe uniquement s'il est fourni
        if (isset($data['password']) && !empty($data['password'])) {
            $hashedPassword = $passwordHasher->hashPassword($user, $data['password']);
            $user->setPassword($hashedPassword);
        }

        // 6. Validation
        $errors = $validator->validate($user);
        if (count($errors) > 0) {
            $errorMessages = [];
            foreach ($errors as $error) {
                $errorMessages[] = $error->getMessage();
            }
            return $this->json([
                'error' => 'Validation échouée',
                'details' => $errorMessages
            ], 400);
        }

        // 7. Sauvegarde
        $em->flush();

        // 8. Réponse
        return $this->json([
            'message' => 'Secrétaire mise à jour avec succès',
            'user' => [
                'id' => $user->getId(),
                'email' => $user->getEmail(),
                'firstName' => $user->getFirstName(),
                'lastName' => $user->getLastName(),
                'isActivate' => $user->isActivate(),
                'roles' => $user->getRoles()
            ]
        ]);
    }

    /**
     * Supprime une secrétaire
     */
    #[Route('/{id}', name: 'delete', methods: ['DELETE'])]
    public function delete(
        int $id,
        EntityManagerInterface $em,
        UserRepository $userRepository
    ): JsonResponse {
        // 1. Récupération de l'utilisateur
        $user = $userRepository->find($id);
        
        if (!$user) {
            return $this->json([
                'error' => 'Utilisateur non trouvé'
            ], 404);
        }

        // 2. Vérification que c'est bien une secrétaire
        if (!in_array('ROLE_SECRETAIRE', $user->getRoles())) {
            return $this->json([
                'error' => 'Seules les secrétaires peuvent être supprimées via cette route'
            ], 403);
        }

        // 3. Protection : empêcher la suppression si l'utilisateur a des affectations
        // (Cette partie sera importante quand tu créeras les affectations)
        // Pour l'instant, on peut supprimer directement
        
        // 4. Suppression
        $em->remove($user);
        $em->flush();

        // 5. Réponse
        return $this->json([
            'message' => 'Secrétaire supprimée avec succès',
            'deletedId' => $id
        ]);
    }

    /**
     * Active ou désactive un compte secrétaire
     */
    #[Route('/{id}/toggle', name: 'toggle', methods: ['PATCH'])]
    public function toggle(User $user, EntityManagerInterface $em): JsonResponse
    {
        // Inversion de l'état (true -> false / false -> true)
        $user->setIsActivate(!$user->isActivate());
        $em->flush();

        return $this->json([
            'id' => $user->getId(),
            'fullName' => $user->getFirstName() . ' ' . $user->getLastName(),
            'isActivate' => $user->isActivate()
        ]);
    }
}