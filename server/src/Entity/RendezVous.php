<?php

namespace App\Entity;

use App\Repository\RendezVousRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: RendezVousRepository::class)]
class RendezVous
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['rdv:read'])]
    private ?int $id = null;

    // 👇 ICI : On renomme la colonne en 'start_time' dans la BDD pour être propre
    #[ORM\Column(name: 'start_time', type: Types::DATETIME_MUTABLE)]
    #[Groups(['rdv:read'])]
    private ?\DateTimeInterface $start = null;

    // 👇 ICI : On renomme en 'end_time' pour éviter le crash SQL "Syntax Error"
    #[ORM\Column(name: 'end_time', type: Types::DATETIME_MUTABLE)]
    #[Groups(['rdv:read'])]
    private ?\DateTimeInterface $end = null;

    #[ORM\Column(length: 255)]
    #[Groups(['rdv:read'])]
    private ?string $title = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    #[Groups(['rdv:read'])]
    private ?string $description = null;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['rdv:read'])]
    private ?Client $client = null;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['rdv:read'])]
    private ?Appelant $appelant = null;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: true)] 
    private ?User $author = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getStart(): ?\DateTimeInterface
    {
        return $this->start;
    }

    public function setStart(\DateTimeInterface $start): static
    {
        $this->start = $start;
        return $this;
    }

    public function getEnd(): ?\DateTimeInterface
    {
        return $this->end;
    }

    public function setEnd(\DateTimeInterface $end): static
    {
        $this->end = $end;
        return $this;
    }

    public function getTitle(): ?string
    {
        return $this->title;
    }

    public function setTitle(string $title): static
    {
        $this->title = $title;
        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(?string $description): static
    {
        $this->description = $description;
        return $this;
    }

    public function getClient(): ?Client
    {
        return $this->client;
    }

    public function setClient(?Client $client): static
    {
        $this->client = $client;
        return $this;
    }

    public function getAppelant(): ?Appelant
    {
        return $this->appelant;
    }

    public function setAppelant(?Appelant $appelant): static
    {
        $this->appelant = $appelant;
        return $this;
    }

    public function getAuthor(): ?User
    {
        return $this->author;
    }

    public function setAuthor(?User $author): static
    {
        $this->author = $author;
        return $this;
    }
}