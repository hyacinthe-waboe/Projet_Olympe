<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260218221009 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE user_client (user_id INT NOT NULL, client_id INT NOT NULL, PRIMARY KEY (user_id, client_id))');
        $this->addSql('CREATE INDEX IDX_A2161F68A76ED395 ON user_client (user_id)');
        $this->addSql('CREATE INDEX IDX_A2161F6819EB6921 ON user_client (client_id)');
        $this->addSql('ALTER TABLE user_client ADD CONSTRAINT FK_A2161F68A76ED395 FOREIGN KEY (user_id) REFERENCES "user" (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE user_client ADD CONSTRAINT FK_A2161F6819EB6921 FOREIGN KEY (client_id) REFERENCES client (id) ON DELETE CASCADE');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE user_client DROP CONSTRAINT FK_A2161F68A76ED395');
        $this->addSql('ALTER TABLE user_client DROP CONSTRAINT FK_A2161F6819EB6921');
        $this->addSql('DROP TABLE user_client');
    }
}
