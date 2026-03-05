<?php
// router.php - Routeur pour le serveur built-in PHP

$uri = urldecode(
    parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH)
);

// Si c'est un fichier qui existe (CSS, JS, images)
if ($uri !== '/' && file_exists(__DIR__.$uri)) {
    return false;
}