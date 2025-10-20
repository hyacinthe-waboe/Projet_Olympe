<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20251020212930 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE client ALTER phone TYPE VARCHAR(255)');
        $this->addSql('ALTER TABLE client ALTER phone DROP NOT NULL');
        $this->addSql('ALTER TABLE client RENAME COLUMN addresse TO address');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('ALTER TABLE client ALTER phone TYPE INT');
        $this->addSql('ALTER TABLE client ALTER phone SET NOT NULL');
        $this->addSql('ALTER TABLE client RENAME COLUMN address TO addresse');
    }
}
