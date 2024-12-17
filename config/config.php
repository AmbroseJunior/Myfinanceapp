<?php
// Load the .env file variables
$envFile = fopen(__DIR__ . '/../.env', 'r');
if ($envFile) {
    while (($line = fgets($envFile)) !== false) {
        putenv(trim($line));
    }
    fclose($envFile);
}
