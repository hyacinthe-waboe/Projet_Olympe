<?php

namespace App\Controller;

use App\Entity\Message;
use App\Repository\AppelantRepository;
use App\Repository\ClientRepository;
use App\Repository\MessageRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api/messages')]
class MessageController extends AbstractController
{
    private function serializeMessage(Message $msg): array 
    {
        $appelant = $msg->getAppelant();
        return [
            'id' => $msg->getId(),
            'from' => $msg->getSenderName(),
            'snippet' => substr($msg->getContent(), 0, 60) . '...',
            'fullContent' => $msg->getContent(),
            'date' => $msg->getCreatedAt()->format('d/m H:i'),
            'doctorName' => $msg->getClient()->getLastName(),
            'isRead' => $msg->isRead(),
            'adminNote' => $msg->getAdminNote(),
            // Données réelles du patient pour le panneau Info
            'patient' => $appelant ? [
                'phone' => $appelant->getPhone(),
                'email' => "Non renseigné",
                'lastname' => $appelant->getLastname(),
                'firstname' => $appelant->getFirstname(),
            ] : null
        ];
    }

    //Récupérer uniquement les messages non lus autorisés
    #[Route('/unread', methods: ['GET'])]
    public function getUnread(MessageRepository $repo): JsonResponse {
        /** @var \App\Entity\User $user */
        $user = $this->getUser();
        if (!$user) return $this->json(['error' => 'Non autorisé'], 401);

        // Si c'est l'admin, il voit tout. Sinon, on filtre par ses clients.
        $criteria = ['isRead' => false];
        if (!in_array('ROLE_ADMIN', $user->getRoles())) {
            $criteria['client'] = $user->getClients()->toArray();
        }

        $messages = $repo->findBy($criteria, ['createdAt' => 'DESC']);
        return $this->json(['messages' => array_map([$this, 'serializeMessage'], $messages)]);
    }

    //Récupérer uniquement tous les messages autorisés
    #[Route('/all', methods: ['GET'])]
    public function getAll(MessageRepository $repo): JsonResponse {
        /** @var \App\Entity\User $user */
        $user = $this->getUser();
        if (!$user) return $this->json(['error' => 'Non autorisé'], 401);

        $criteria = [];
        if (!in_array('ROLE_ADMIN', $user->getRoles())) {
            $criteria['client'] = $user->getClients()->toArray();
        }

        $messages = $repo->findBy($criteria, ['createdAt' => 'DESC']);
        return $this->json(['messages' => array_map([$this, 'serializeMessage'], $messages)]);
    }

    // NOUVEAU : Route pour "Dé-traiter" (Remettre en non-lu)
    #[Route('/{id}/unread', name: 'api_messages_mark_unread', methods: ['POST'])]
    public function markAsUnread(int $id, MessageRepository $repo, EntityManagerInterface $em): JsonResponse {
        $msg = $repo->find($id);
        if (!$msg) return $this->json(['error' => 'Message introuvable'], 404);
        $msg->setIsRead(false);
        $em->flush();
        return $this->json(['status' => 'Remis en non lu']);
    }

    #[Route('/{id}/read', methods: ['POST'])]
    public function markAsRead(int $id, MessageRepository $repo, EntityManagerInterface $em): JsonResponse {
        $msg = $repo->find($id);
        if (!$msg) return $this->json(['error' => 'Message introuvable'], 404);
        $msg->setIsRead(true);
        $em->flush();
        return $this->json(['status' => 'Marqué comme lu']);
    }

    #[Route('', methods: ['POST'])]
    public function create(Request $request, EntityManagerInterface $em, ClientRepository $clientRepo, AppelantRepository $appRepo): JsonResponse {
        $data = json_decode($request->getContent(), true);
        $msg = new Message();
        $msg->setContent($data['content']);
        $msg->setSenderName($data['senderName']);
        $msg->setIsRead(false);
        $msg->setCreatedAt(new \DateTimeImmutable());
        
        $client = $clientRepo->find($data['client_id']);
        if ($client) $msg->setClient($client);

        // Optionnel : Lier à un patient si l'ID est fourni
        if (!empty($data['appelant_id'])) {
            $appelant = $appRepo->find($data['appelant_id']);
            if ($appelant) $msg->setAppelant($appelant);
        }

        $em->persist($msg);
        $em->flush();
        return $this->json(['status' => 'Message créé'], 201);
    }

    // 📝 SAUVEGARDER UNE NOTE ADMINISTRATIVE
    #[Route('/{id}/note', name: 'api_messages_save_note', methods: ['POST'])]
    public function saveNote(int $id, Request $request, MessageRepository $repo, EntityManagerInterface $em): JsonResponse 
    {
        $msg = $repo->find($id);
        if (!$msg) return $this->json(['error' => 'Message introuvable'], 404);

        $data = json_decode($request->getContent(), true);
        $msg->setAdminNote($data['note'] ?? null);
        $em->flush();

        return $this->json(['status' => 'Note sauvegardée']);
    }

    // 🗑️ SUPPRIMER UN MESSAGE
    #[Route('/{id}', name: 'api_messages_delete', methods: ['DELETE'])]
    public function delete(int $id, MessageRepository $repo, EntityManagerInterface $em): JsonResponse 
    {
        $msg = $repo->find($id);
        if (!$msg) return $this->json(['error' => 'Message introuvable'], 404);
        
        $em->remove($msg);
        $em->flush();
        
        return $this->json(['status' => 'Message supprimé']);
    }

    // Une route pour récupérer uniquement LES médecins de la secrétaire connectée
    #[Route('/my-clients', methods: ['GET'])]
    public function getMyClients(): JsonResponse {
        /** @var \App\Entity\User $user */
        $user = $this->getUser();
        if (!$user) return $this->json([], 401);

        // Si c'est l'admin, on pourrait tous les renvoyer, mais pour la secrétaire :
        $clients = [];
        foreach ($user->getClients() as $c) {
            $clients[] = ['id' => $c->getId(), 'lastName' => $c->getLastName()];
        }
        
        return $this->json($clients);
    }

    // 🛠️ ROUTE DE TEST RAPIDE V2 (Mode Bulldozer)
    #[Route('/link-test', methods: ['GET'])]
    public function linkTest(
        \App\Repository\UserRepository $userRepo, 
        \App\Repository\ClientRepository $clientRepo, 
        \Doctrine\ORM\EntityManagerInterface $em
    ): JsonResponse {
        // 1. On cherche directement ton compte admin
        $user = $userRepo->findOneBy(['email' => 'admin@olympe.com']); 
        
        // 2. On prend tous les médecins existants
        $clients = $clientRepo->findAll(); 

        if (!$user) {
            return $this->json(['error' => "Le compte admin@olympe.com n'a pas été trouvé."]);
        }
        if (empty($clients)) {
            return $this->json(['error' => "Il n'y a AUCUN médecin dans ta base de données ! Crées-en un d'abord."]);
        }

        // 3. On prend le tout premier médecin de la liste et on le lie !
        $client = $clients[0]; 
        $user->addClient($client);
        $em->flush();

        return $this->json([
            'status' => 'Succès !',
            'message' => 'Le Dr. ' . $client->getLastName() . ' est maintenant affecté à ' . $user->getEmail()
        ]);
    }
}