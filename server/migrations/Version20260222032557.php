<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260222032557 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE call_log ADD appelant_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE call_log ADD CONSTRAINT FK_D663C42EB0DD082D FOREIGN KEY (appelant_id) REFERENCES appelant (id)');
        $this->addSql('CREATE INDEX IDX_D663C42EB0DD082D ON call_log (appelant_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE call_log DROP CONSTRAINT FK_D663C42EB0DD082D');
        $this->addSql('DROP INDEX IDX_D663C42EB0DD082D');
        $this->addSql('ALTER TABLE call_log DROP appelant_id');
    }
}
