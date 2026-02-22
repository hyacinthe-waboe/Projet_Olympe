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
        $user = $this->getUser(); // Récupère l'utilisateur qui regarde le message

        return [
            'id' => $msg->getId(),
            // Logique de titre : Nom patient ou Nom secrétaire
            'from' => $appelant 
                ? ($appelant->getFirstname() . ' ' . $appelant->getLastname()) 
                : $msg->getSenderName(),
            'snippet' => substr($msg->getContent(), 0, 60) . '...',
            'fullContent' => $msg->getContent(),
            'date' => $msg->getCreatedAt()->format('d/m H:i'),
            'doctorName' => $msg->getClient() ? $msg->getClient()->getLastName() : 'N/A',
            'isRead' => $msg->isRead(),
            'adminNote' => $msg->getAdminNote(),
            
            // 🟢 AJOUT : Identification du type pour le Front
            'senderType' => $appelant ? 'patient' : 'secretary',
            
            // 🟢 AJOUT : Email dynamique (Patient ou Secrétaire)
            'contactEmail' => $appelant 
                ? ($appelant->getEmail() ?: "Non renseigné") 
                : ($user ? $user->getEmail() : "secretariat@olympe.com"),

            'patient' => $appelant ? [
                'id' => $appelant->getId(),
                'phone' => $appelant->getPhone(),
                'lastname' => $appelant->getLastname(),
                'firstname' => $appelant->getFirstname(),
            ] : null
        ];
    }

//Récupérer uniquement les messages non lus autorisés
    #[Route('/unread', methods: ['GET'])]
    public function getUnread(MessageRepository $repo, \App\Repository\AssignmentRepository $assignmentRepo): JsonResponse 
    {
        $user = $this->getUser();
        if (!$user) return $this->json(['error' => 'Non autorisé'], 401);

        $isAdmin = in_array('ROLE_ADMIN', $user->getRoles());
        
        // Si c'est l'admin, il voit tous les messages non lus
        if ($isAdmin) {
            $messages = $repo->findBy(['isRead' => false], ['createdAt' => 'DESC']);
        } else {
            // ✅ FILTRE SÉCURITÉ : On cherche les médecins affectés à la secrétaire
            $assignments = $assignmentRepo->findBySecretaire($user->getId());
            $clientIds = array_map(function($a) {
                return $a->getClient()->getId();
            }, $assignments);

            if (empty($clientIds)) {
                return $this->json(['messages' => []]);
            }
            
            // On cherche les messages non lus destinés à SES médecins
            $messages = $repo->findBy([
                'isRead' => false,
                'client' => $clientIds
            ], ['createdAt' => 'DESC']);
        }

        // On n'envoie que les 5 plus récents pour le dashboard
        $recentMessages = array_slice($messages, 0, 5);

        return $this->json(['messages' => array_map([$this, 'serializeMessage'], $recentMessages)]);
    }

    // Récupérer uniquement tous les messages autorisés
    #[Route('/all', methods: ['GET'])]
    public function getAll(MessageRepository $repo, \App\Repository\AssignmentRepository $assignmentRepo): JsonResponse 
    {
        $user = $this->getUser();
        if (!$user) return $this->json(['error' => 'Non autorisé'], 401);

        $isAdmin = in_array('ROLE_ADMIN', $user->getRoles());
        
        if ($isAdmin) {
            $messages = $repo->findBy([], ['createdAt' => 'DESC']);
        } else {
            // ✅ FILTRE SÉCURITÉ : Exactement comme pour l'Agenda et le Dashboard
            $assignments = $assignmentRepo->findBySecretaire($user->getId());
            $clientIds = array_map(function($a) {
                return $a->getClient()->getId();
            }, $assignments);

            if (empty($clientIds)) {
                return $this->json(['messages' => []]);
            }
            
            // On cherche uniquement les messages destinés à ses médecins
            $messages = $repo->findBy(['client' => $clientIds], ['createdAt' => 'DESC']);
        }

        return $this->json(['messages' => array_map([$this, 'serializeMessage'], $messages)]);
    }

    // NOUVEAU : Route pour "Dé-traiter" (Remettre en non-lu)
    #[Route('/{id}/unread', name: 'api_messages_mark_unread', methods: ['POST'])]
    public function markAsUnread(int $id, MessageRepository $repo, EntityManagerInterface $em): JsonResponse {
        $msg = $repo->find($id);
        if (!$msg) return $this->json(['error' => 'Message introuvable'], 404);
        $msg->setIsRead(true);
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
        $user = $this->getUser(); // 🟢 Récupère la secrétaire connectée

        $msg = new Message();
        $msg->setContent($data['content'] ?? '');
        
        // 🟢 RÉGLAGE DU NOM : On ignore "secretariat" envoyé par le front
        // On prend le vrai nom/prénom de l'utilisateur Symfony
        if ($user) {
            $msg->setSenderName($user->getFirstName() . ' ' . $user->getLastName());
        } else {
            $msg->setSenderName('Secrétariat Olympe');
        }

        $msg->setIsRead(true);
        $msg->setCreatedAt(new \DateTimeImmutable());
        
        // 🟢 LIAISON MÉDECIN (Indispensable pour que la secrétaire le voie dans son flux)
        // On gère les deux formats de clés possibles (clientId ou client_id)
        $clientId = $data['clientId'] ?? $data['client_id'] ?? null;
        if ($clientId) {
            $client = $clientRepo->find($clientId);
            if ($client) $msg->setClient($client);
        }

// 🟢 LIAISON PATIENT ET AUTO-ROUTAGE (Correction ArrayCollection)
        $appelantId = $data['appelantId'] ?? $data['appelant_id'] ?? null;
        if ($appelantId) {
            $appelant = $appRepo->find($appelantId);
            if ($appelant) {
                $msg->setAppelant($appelant);
                
                // ✨ RECHERCHE INTELLIGENTE ET SÉCURISÉE DU MÉDECIN :
                if (!$msg->getClient()) {
                    // 1. On vérifie si la méthode getClients existe sur l'Appelant
                    if (method_exists($appelant, 'getClients')) {
                        // 2. On récupère la collection (liste) de médecins
                        $medecins = $appelant->getClients();
                        
                        // 3. S'il y a au moins 1 médecin dans la liste, on prend le premier
                        if (count($medecins) > 0) {
                            $msg->setClient($medecins[0]);
                        }
                    }
                }
            }
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