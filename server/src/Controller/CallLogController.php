<?php

namespace App\Controller;

use App\Entity\CallLog;
use App\Repository\CallLogRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api/calls')]
class CallLogController extends AbstractController
{
#[Route('', methods: ['GET'])]
    public function getHistory(CallLogRepository $repo): JsonResponse
    {
        $user = $this->getUser();
        if (!$user) return $this->json(['error' => 'Non autorisé'], 401);

        if (in_array('ROLE_ADMIN', $user->getRoles())) {
            // 🟢 MODIF : L'admin voit tout SAUF ce qui est archivé (caché de la liste)
            $calls = $repo->findBy(['isArchived' => false], ['createdAt' => 'DESC']);
        } else {
            // 🟢 MODIF : La secrétaire voit ses appels NON archivés
            $calls = $repo->findBy(['handledBy' => $user, 'isArchived' => false], ['createdAt' => 'DESC']);
        }

        return $this->json($calls, 200, [], ['groups' => 'call:read']);
    }

#[Route('', methods: ['POST'])]
    // 🟢 AJOUTE BIEN \App\Repository\AppelantRepository $appRepo ICI 👇
    public function saveCall(Request $request, EntityManagerInterface $em, \App\Repository\AppelantRepository $appRepo): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $user = $this->getUser();

        if (!$user) return $this->json(['error' => 'Non connecté'], 401);

        $call = new CallLog();
        $call->setCreatedAt(new \DateTimeImmutable());
        $call->setHandledBy($user);
        $call->setPhoneNumber($data['number']);
        $call->setStatus($data['status']);
        $call->setContactName($data['contactName'] ?? null);
        $call->setNote($data['note'] ?? null);

        // 🟢 LA PARTIE MANQUANTE EST LÀ : ON SAUVEGARDE L'ID DU PATIENT
        if (!empty($data['appelantId'])) {
            $appelant = $appRepo->find($data['appelantId']);
            if ($appelant) {
                $call->setAppelant($appelant);
            }
        }

        $em->persist($call);
        $em->flush();

        return $this->json($call, 201, [], ['groups' => 'call:read']);
    }

#[Route('/{id}', methods: ['DELETE'])]
    public function deleteCall(int $id, CallLogRepository $repo, EntityManagerInterface $em): JsonResponse
    {
        $call = $repo->find($id);
        if (!$call) return $this->json(['error' => 'Non trouvé'], 404);

        // 🟢 MODIF : Le "Soft Delete". On ne supprime plus, on cache !
        $call->setIsArchived(true);
        $em->flush();
        return $this->json(['message' => 'Appel masqué de la liste principale']);
    }

    // 🟢 NOUVELLE ROUTE : Récupérer l'historique d'appels d'un patient précis
    #[Route('/patient/{patientId}', methods: ['GET'])]
    public function getPatientCalls(int $patientId, CallLogRepository $repo): JsonResponse
    {
        // On cherche tous les appels liés à cet ID patient, du plus récent au plus ancien
        $calls = $repo->findBy(['appelant' => $patientId], ['createdAt' => 'DESC']);

        return $this->json($calls, 200, [], ['groups' => 'call:read']);
    }

    // 🟢 NOUVELLE ROUTE : La suppression DÉFINITIVE pour le 360°
    #[Route('/patient/{patientId}/clear', methods: ['DELETE'])]
    public function clearPatientCalls(int $patientId, CallLogRepository $repo, EntityManagerInterface $em): JsonResponse
    {
        $calls = $repo->findBy(['appelant' => $patientId]);
        foreach ($calls as $call) {
            $em->remove($call); // Ici, c'est la VRAIE suppression
        }
        $em->flush();
        return $this->json(['message' => 'Historique des appels vidé définitivement']);
    }
}