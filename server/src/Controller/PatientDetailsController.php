<?php

namespace App\Controller;

use App\Entity\Appelant;
use App\Entity\RendezVous;
use App\Entity\Message;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api/patients')]
class PatientDetailsController extends AbstractController
{
    #[Route('/{id}/history', methods: ['GET'])]
    public function getPatientHistory(int $id, EntityManagerInterface $em): JsonResponse
    {
        $user = $this->getUser();
        if (!$user) return $this->json(['error' => 'Non autorisé'], 401);

        $patient = $em->getRepository(Appelant::class)->find($id);
        if (!$patient) return $this->json(['error' => 'Patient introuvable'], 404);

        $rdvs = $em->getRepository(RendezVous::class)->findBy(
            ['appelant' => $patient],
            ['start' => 'DESC']
        );

        $messages = $em->getRepository(Message::class)->findBy(
            ['appelant' => $patient], 
            ['createdAt' => 'DESC']
        );

        // 🛡️ LOGIQUE DE SÉCURITÉ : Filtrage des médecins traitants
        $userClients = $user->getClients(); // Les médecins de cette secrétaire
        $isAdmin = in_array('ROLE_ADMIN', $user->getRoles());
        
        $patientDoctors = $patient->getClients();
        $allowedDoctors = [];
        
        foreach ($patientDoctors as $doctor) {
            // Si c'est un Admin, ou si le médecin fait partie des affectations de la secrétaire
            if ($isAdmin || $userClients->contains($doctor)) {
                $allowedDoctors[] = 'Dr. ' . $doctor->getLastName();
            }
        }

        // 🧠 Les 3 cas possibles :
        if (count($patientDoctors) === 0) {
            $doctorsStr = 'Aucun médecin renseigné'; // Cas 1 : Vraiment vide
        } elseif (empty($allowedDoctors)) {
            $doctorsStr = 'Information masquée (Autre médecin)'; // Cas 2 : Masqué
        } else {
            $doctorsStr = implode(', ', $allowedDoctors);
            // Petit bonus : s'il a 2 médecins et qu'on a le droit d'en voir qu'un seul
            if (count($allowedDoctors) < count($patientDoctors)) {
                $doctorsStr .= ' (+ Autre médecin)';
            }
        }

        // Formatage de la date de naissance
        $birthDateStr = $patient->getBirthDate() ? $patient->getBirthDate()->format('d/m/Y') : 'Non renseignée';

        return $this->json([
            'info' => [
                'id' => $patient->getId(),
                'firstname' => $patient->getFirstname(),
                'lastname' => $patient->getLastname(),
                'phone' => $patient->getPhone(),
                'email' => $patient->getEmail(),
                'birthDate' => $birthDateStr, // 🟢 NOUVEAU
                'doctors' => $doctorsStr      // 🟢 NOUVEAU
            ],
            'appointments' => array_map(function($r) {
                $client = $r->getClient();
                $doctorName = $client ? $client->getLastName() : 'N/A';
                
                return [
                    'id' => $r->getId(),
                    'date' => $r->getStart() ? $r->getStart()->format('d/m/Y') : 'N/A',
                    'time' => $r->getStart() ? $r->getStart()->format('H:i') : '--:--',
                    'status' => $r->getStart() < new \DateTime() ? 'Passé' : 'À venir',
                    'doctor' => $doctorName
                ];
            }, $rdvs),
            'messages' => array_map(function($m) {
                $client = $m->getClient();
                $doctorName = $client ? $client->getLastName() : 'N/A';

                return [
                    'id' => $m->getId(),
                    'content' => $m->getContent(),
                    'date' => $m->getCreatedAt() ? $m->getCreatedAt()->format('d/m/Y H:i') : 'Date inconnue',
                    'doctor' => $doctorName
                ];
            }, $messages)
        ]);
    }
}