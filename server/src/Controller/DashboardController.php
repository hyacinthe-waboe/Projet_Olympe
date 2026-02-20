<?php

namespace App\Controller;

use App\Repository\RendezVousRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api/dashboard')]
class DashboardController extends AbstractController
{
    #[Route('', name: 'api_dashboard_index', methods: ['GET'])]
    public function index(RendezVousRepository $rdvRepo, \App\Repository\AssignmentRepository $assignmentRepo): JsonResponse
    {
        $now = new \DateTime();
        $endOfDay = (clone $now)->setTime(23, 59, 59);
        $user = $this->getUser();
        $isAdmin = in_array('ROLE_ADMIN', $user->getRoles());

        $qb = $rdvRepo->createQueryBuilder('r')
            ->where('r.start >= :now')
            ->andWhere('r.start <= :endOfDay')
            ->setParameter('now', $now)
            ->setParameter('endOfDay', $endOfDay);

        // ✅ FILTRE SÉCURITÉ : Si ce n'est pas l'admin, on filtre par médecins affectés
        if (!$isAdmin) {
            $assignments = $assignmentRepo->findBySecretaire($user->getId());
            $clientIds = array_map(function($a) {
                return $a->getClient()->getId();
            }, $assignments);

            if (empty($clientIds)) {
                // Si la secrétaire n'a aucun médecin, on renvoie un tableau vide tout de suite
                return $this->json(['appointments' => []]);
            }
            
            $qb->andWhere('r.client IN (:clients)')
               ->setParameter('clients', $clientIds);
        }

        $rdvs = $qb->orderBy('r.start', 'ASC')
            ->setMaxResults(5)
            ->getQuery()
            ->getResult();

        $appointmentsData = array_map(function($rdv) {
            return [
                'id' => $rdv->getId(),
                'time' => $rdv->getStart()->format('H:i'),
                'name' => 'RDV ' . $rdv->getAppelant()->getFirstname() . ' ' . $rdv->getAppelant()->getLastname(),
            ];
        }, $rdvs);

        return $this->json([
            'appointments' => $appointmentsData,
        ]);
    }
}