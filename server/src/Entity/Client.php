<?php

namespace App\Entity;

// ERREUR N°1 CORRIGÉE : Ajout de la ligne "use ApiPlatform\Metadata\ApiResource;"
use ApiPlatform\Metadata\ApiResource;
use App\Repository\ClientRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ApiResource]
#[ORM\Entity(repositoryClass: ClientRepository::class)]
class Client
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $name = null;

    #[ORM\Column(length: 255)]
    private ?string $email = null;

    // AMÉLIORATION : Le numéro de téléphone est maintenant un string (mieux pour les zéros et les indicatifs)
    #[ORM\Column(length: 255, nullable: true)]
    private ?string $phone = null;

    // AMÉLIORATION : Correction de la faute de frappe "addresse" -> "address"
    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $address = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    // ERREUR N°2 CORRIGÉE : "getString" est devenu "getName"
    public function getName(): ?string
    {
        // "string" est devenu "name"
        return $this->name;
    }

    // ERREUR N°2 CORRIGÉE : "setString" est devenu "setName"
    public function setName(string $name): static
    {
        // "string" est devenu "name"
        $this->name = $name;

        return $this;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): static
    {
        $this->email = $email;

        return $this;
    }

    // Adapté pour le type string
    public function getPhone(): ?string
    {
        return $this->phone;
    }

    // Adapté pour le type string
    public function setPhone(?string $phone): static
    {
        $this->phone = $phone;

        return $this;
    }

    // Adapté à la correction de la faute de frappe
    public function getAddress(): ?string
    {
        return $this->address;
    }

    // Adapté à la correction de la faute de frappe
    public function setAddress(?string $address): static
    {
        $this->address = $address;

        return $this;
    }
}