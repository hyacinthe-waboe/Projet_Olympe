<?php

namespace App\Controller;

use App\Entity\Task;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api/tasks')]
class TaskController extends AbstractController
{
    #[Route('', methods: ['GET'])]
    public function getTasks(EntityManagerInterface $em): JsonResponse
    {
        $user = $this->getUser();
        if (!$user) {
            return $this->json(['error' => 'Non autorisé'], 401);
        }

        // 👑 MODE SUPERVISION : Si Admin, on récupère TOUTES les tâches.
        // Sinon, on ne récupère que les tâches de la secrétaire connectée.
        if (in_array('ROLE_ADMIN', $user->getRoles())) {
            $tasks = $em->getRepository(Task::class)->findBy([], ['createdAt' => 'DESC']);
        } else {
            $tasks = $em->getRepository(Task::class)->findBy(['owner' => $user], ['createdAt' => 'DESC']);
        }

        $data = [];
        foreach ($tasks as $task) {
            $owner = $task->getOwner();
            $data[] = [
                'id' => $task->getId(),
                'title' => $task->getTitle(),
                'isDone' => $task->isDone(),
                'createdAt' => $task->getCreatedAt()->format('Y-m-d H:i'),
                // ✨ NOUVEAU : On envoie le nom du créateur pour que l'Admin s'y retrouve
                'ownerName' => $owner ? $owner->getFirstname() . ' ' . $owner->getLastname() : 'Inconnu'
            ];
        }

        return $this->json($data);
    }

    #[Route('', methods: ['POST'])]
    public function createTask(Request $request, EntityManagerInterface $em): JsonResponse
    {
        $user = $this->getUser();
        if (!$user) return $this->json(['error' => 'Non autorisé'], 401);

        $data = json_decode($request->getContent(), true);
        if (empty($data['title'])) {
            return $this->json(['error' => 'Le titre est requis'], 400);
        }

        $task = new Task();
        $task->setTitle($data['title']);
        $task->setIsDone(false); // Par défaut, non terminée
        $task->setCreatedAt(new \DateTimeImmutable());
        $task->setOwner($user); // 🔒 On associe la tâche à la secrétaire

        $em->persist($task);
        $em->flush();

        return $this->json(['message' => 'Tâche créée avec succès', 'id' => $task->getId()]);
    }

    #[Route('/{id}/toggle', methods: ['PUT'])]
    public function toggleTask(int $id, EntityManagerInterface $em): JsonResponse
    {
        $user = $this->getUser();
        
        // On cherche d'abord la tâche par son ID uniquement
        $task = $em->getRepository(Task::class)->find($id);
        if (!$task) {
            return $this->json(['error' => 'Tâche introuvable'], 404);
        }

        // 🔒 SÉCURITÉ : On autorise SI c'est le propriétaire OU SI c'est l'Admin
        if ($task->getOwner() !== $user && !in_array('ROLE_ADMIN', $user->getRoles())) {
            return $this->json(['error' => 'Accès refusé'], 403);
        }

        // On inverse le statut
        $task->setIsDone(!$task->isDone());
        $em->flush();

        return $this->json(['message' => 'Statut mis à jour', 'isDone' => $task->isDone()]);
    }

    #[Route('/{id}', methods: ['DELETE'])]
    public function deleteTask(int $id, EntityManagerInterface $em): JsonResponse
    {
        $user = $this->getUser();
        
        // On cherche la tâche
        $task = $em->getRepository(Task::class)->find($id);
        if (!$task) {
            return $this->json(['error' => 'Tâche introuvable'], 404);
        }

        // 🔒 SÉCURITÉ : On autorise SI c'est le propriétaire OU SI c'est l'Admin
        if ($task->getOwner() !== $user && !in_array('ROLE_ADMIN', $user->getRoles())) {
            return $this->json(['error' => 'Accès refusé'], 403);
        }

        $em->remove($task);
        $em->flush();

        return $this->json(['message' => 'Tâche supprimée']);
    }
}