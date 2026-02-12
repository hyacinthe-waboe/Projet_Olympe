<?php

namespace App\DataFixtures;

use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class AppFixtures extends Fixture
{
    private UserPasswordHasherInterface $hasher;

    public function __construct(UserPasswordHasherInterface $hasher)
    {
        $this->hasher = $hasher;
    }

    public function load(ObjectManager $manager): void
    {
        // Création du compte ADMINISTRATEUR
        $admin = new User();
        $admin->setEmail('admin@olympe.com');
        $admin->setFirstname('Jean');
        $admin->setLastname('Admin');
        $admin->setRoles(['ROLE_ADMIN']);
        $admin->setIsActivate(true);
        
        // On définit le mot de passe "admin123"
        $password = $this->hasher->hashPassword($admin, 'admin123');
        $admin->setPassword($password);

        $manager->persist($admin);

        // Création d'un compte SECRÉTAIRE (pour tester les accès plus tard)
        $secretaire = new User();
        $secretaire->setEmail('secret@olympe.com');
        $secretaire->setFirstname('Sophie');
        $secretaire->setLastname('Secrétaire');
        $secretaire->setRoles(['ROLE_SECRETAIRE']);
        $secretaire->setIsActivate(true);
        
        $passwordSec = $this->hasher->hashPassword($secretaire, 'secret123');
        $secretaire->setPassword($passwordSec);

        $manager->persist($secretaire);

        // On enregistre tout en base de données
        $manager->flush();
    }
}