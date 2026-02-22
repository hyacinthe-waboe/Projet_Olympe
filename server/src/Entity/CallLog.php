<?php

namespace App\Entity;

use App\Repository\CallLogRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: CallLogRepository::class)]
class CallLog
{
    #[ORM\Id, ORM\GeneratedValue, ORM\Column]
    #[Groups(['call:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 50)]
    #[Groups(['call:read'])]
    private ?string $status = null; // incoming, outgoing, missed, completed

    #[ORM\Column(length: 20)]
    #[Groups(['call:read'])]
    private ?string $phoneNumber = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['call:read'])]
    private ?string $contactName = null; // 🟢 On sauvegarde le nom direct pour éviter les bugs

    #[ORM\Column(type: 'text', nullable: true)]
    #[Groups(['call:read'])]
    private ?string $note = null;

    #[ORM\Column]
    #[Groups(['call:read'])]
    private ?\DateTimeImmutable $createdAt = null;

    // 🟢 C'est ICI que se joue la confidentialité
    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $handledBy = null;

    // 🟢 ON RECONNECTE LE PATIENT
    #[ORM\ManyToOne(targetEntity: Appelant::class)]
    #[Groups(['call:read'])]
    private ?Appelant $appelant = null;
    
    // 🟢 L'interrupteur magique pour le "Soft Delete"
    #[ORM\Column(type: 'boolean', options: ['default' => false])]
    #[Groups(['call:read'])]
    private bool $isArchived = false;


    // --- GETTERS ET SETTERS ---
    public function getId(): ?int { return $this->id; }
    public function getStatus(): ?string { return $this->status; }
    public function setStatus(string $status): static { $this->status = $status; return $this; }
    public function getPhoneNumber(): ?string { return $this->phoneNumber; }
    public function setPhoneNumber(string $phoneNumber): static { $this->phoneNumber = $phoneNumber; return $this; }
    public function getContactName(): ?string { return $this->contactName; }
    public function setContactName(?string $contactName): static { $this->contactName = $contactName; return $this; }
    public function getNote(): ?string { return $this->note; }
    public function setNote(?string $note): static { $this->note = $note; return $this; }
    public function getCreatedAt(): ?\DateTimeImmutable { return $this->createdAt; }
    public function setCreatedAt(\DateTimeImmutable $createdAt): static { $this->createdAt = $createdAt; return $this; }
    public function getHandledBy(): ?User { return $this->handledBy; }
    public function setHandledBy(?User $handledBy): static { $this->handledBy = $handledBy; return $this; }
    public function getAppelant(): ?Appelant { return $this->appelant; }
    public function setAppelant(?Appelant $appelant): static { $this->appelant = $appelant; return $this; }
    public function isArchived(): bool { return $this->isArchived; }
    public function setIsArchived(bool $isArchived): static { $this->isArchived = $isArchived; return $this; }
}