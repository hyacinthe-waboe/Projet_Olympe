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
    public function index(RendezVousRepository $rdvRepo): JsonResponse
    {
        // 1. Définir la plage "Aujourd'hui"
        $now = new \DateTime();
        $endOfDay = (clone $now)->setTime(23, 59, 59);

        // 2. Chercher les RDV à venir aujourd'hui (triés par heure)
        // On utilise QueryBuilder pour être précis
        $rdvs = $rdvRepo->createQueryBuilder('r')
            ->where('r.start >= :now')
            ->andWhere('r.start <= :endOfDay')
            ->setParameter('now', $now)
            ->setParameter('endOfDay', $endOfDay)
            ->orderBy('r.start', 'ASC')
            ->setMaxResults(5) // On en prend 5 max pour l'affichage
            ->getQuery()
            ->getResult();

        // 3. Formater les données pour le Frontend
        $appointmentsData = array_map(function($rdv) {
            return [
                'id' => $rdv->getId(),
                'time' => $rdv->getStart()->format('H:i'), // Heure format 09:00
                'name' => 'RDV ' . $rdv->getAppelant()->getFirstname() . ' ' . $rdv->getAppelant()->getLastname(),
                // On pourrait ajouter le médecin si besoin :
                // 'doctor' => $rdv->getClient()->getLastName()
            ];
        }, $rdvs);

        return $this->json([
            'appointments' => $appointmentsData,
            // Pour l'instant, on ne renvoie que les RDV car le reste (Tâches, Messages) n'existe pas en BDD
        ]);
    }
}