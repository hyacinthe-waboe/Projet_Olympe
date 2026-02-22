<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260222030414 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE call_log DROP CONSTRAINT fk_d663c42eb0dd082d');
        $this->addSql('DROP INDEX idx_d663c42eb0dd082d');
        $this->addSql('ALTER TABLE call_log ADD contact_name VARCHAR(255) DEFAULT NULL');
        $this->addSql('ALTER TABLE call_log DROP appelant_id');
        $this->addSql('ALTER TABLE call_log ALTER handled_by_id SET NOT NULL');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE call_log ADD appelant_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE call_log DROP contact_name');
        $this->addSql('ALTER TABLE call_log ALTER handled_by_id DROP NOT NULL');
        $this->addSql('ALTER TABLE call_log ADD CONSTRAINT fk_d663c42eb0dd082d FOREIGN KEY (appelant_id) REFERENCES appelant (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('CREATE INDEX idx_d663c42eb0dd082d ON call_log (appelant_id)');
    }
}
