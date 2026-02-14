<?php

namespace App\Repository;

use App\Entity\Assignment;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Assignment>
 */
class AssignmentRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Assignment::class);
    }

    /**
     * Trouve toutes les affectations d'une secrétaire
     * 
     * @param int $secretaireId L'ID de la secrétaire
     * @return Assignment[] Tableau des affectations
     */
    public function findBySecretaire(int $secretaireId): array
    {
        return $this->createQueryBuilder('a')
            ->where('a.secretaire = :secretaireId')
            ->setParameter('secretaireId', $secretaireId)
            ->orderBy('a.createdAt', 'DESC')
            ->getQuery()
            ->getResult();
    }

    /**
     * Trouve l'affectation d'un client spécifique
     * 
     * @param int $clientId L'ID du client
     * @return Assignment|null L'affectation ou null
     */
    public function findByClient(int $clientId): ?Assignment
    {
        return $this->createQueryBuilder('a')
            ->where('a.clientId = :clientId')
            ->setParameter('clientId', $clientId)
            ->getQuery()
            ->getOneOrNullResult();
    }

    /**
     * Vérifie si une affectation existe déjà
     * 
     * @param int $secretaireId L'ID de la secrétaire
     * @param int $clientId L'ID du client
     * @return bool True si l'affectation existe, false sinon
     */
    public function existsAssignment(int $secretaireId, int $clientId): bool
    {
        $result = $this->createQueryBuilder('a')
            ->select('COUNT(a.id)')
            ->where('a.secretaire = :secretaireId')
            ->andWhere('a.clientId = :clientId')
            ->setParameter('secretaireId', $secretaireId)
            ->setParameter('clientId', $clientId)
            ->getQuery()
            ->getSingleScalarResult();

        return $result > 0;
    }

    /**
     * Compte le nombre de clients affectés à une secrétaire
     * 
     * @param int $secretaireId L'ID de la secrétaire
     * @return int Nombre de clients
     */
    public function countClientsBySecretaire(int $secretaireId): int
    {
        return $this->createQueryBuilder('a')
            ->select('COUNT(a.id)')
            ->where('a.secretaire = :secretaireId')
            ->setParameter('secretaireId', $secretaireId)
            ->getQuery()
            ->getSingleScalarResult();
    }
}