<?php

namespace App\DataFixtures;

use App\Entity\User;
use App\Entity\Client;     // Importé pour l'Étape 2
use App\Entity\Assignment; // Importé pour l'Étape 2
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
        // 1. Création du compte ADMINISTRATEUR (Jean Admin)
        $admin = new User();
        $admin->setEmail('admin@olympe.com');
        $admin->setFirstName('Jean'); // Attention au CamelCase : firstName
        $admin->setLastName('Admin');
        $admin->setRoles(['ROLE_ADMIN']);
        $admin->setIsActivate(true);
        $admin->setPassword($this->hasher->hashPassword($admin, 'admin123'));
        $manager->persist($admin);

        // 2. Création du compte SECRÉTAIRE (Sophie)
        $secretaire = new User();
        $secretaire->setEmail('secret@olympe.com');
        $secretaire->setFirstName('Sophie');
        $secretaire->setLastName('Secrétaire');
        $secretaire->setRoles(['ROLE_SECRETAIRE']);
        $secretaire->setIsActivate(true);
        $secretaire->setPassword($this->hasher->hashPassword($secretaire, 'secret123'));
        $manager->persist($secretaire);

        // 3. ÉTAPE 2 : Création d'un MÉDECIN (Client)
        $medecin = new Client();
        $medecin->setFirstName('Gregory');
        $medecin->setLastName('House');
        $medecin->setEmail('house@princeton.com');
        $medecin->setSpecialty('Diagnostic');
        $medecin->setIsActive(true);
        $manager->persist($medecin);

        // 4. ÉTAPE 2 : Création de l'AFFECTATION
        // On lie Sophie la secrétaire au Dr House
        $affectation = new Assignment();
        $affectation->setSecretaire($secretaire);
        $affectation->setClient($medecin); // On utilise la nouvelle relation d'objet
        $affectation->setCreatedAt(new \DateTime());
        $manager->persist($affectation);

        // Enregistrement final
        $manager->flush();
    }
}