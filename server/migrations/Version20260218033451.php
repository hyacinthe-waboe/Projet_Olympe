<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260218033451 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE message ADD appelant_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE message ADD CONSTRAINT FK_B6BD307FB0DD082D FOREIGN KEY (appelant_id) REFERENCES appelant (id)');
        $this->addSql('CREATE INDEX IDX_B6BD307FB0DD082D ON message (appelant_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE message DROP CONSTRAINT FK_B6BD307FB0DD082D');
        $this->addSql('DROP INDEX IDX_B6BD307FB0DD082D');
        $this->addSql('ALTER TABLE message DROP appelant_id');
    }
}
