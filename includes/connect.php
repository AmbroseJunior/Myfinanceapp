<?php

//cors headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

//connection to database
$host = getenv("DB_HOST") ?: "localhost";
$db = getenv("DB_NAME") ?: "financeapp";
$user = getenv("DB_USER") ?: "root";
$pass = getenv("DB_PASS") ?: "Nnamdi90!";

try {
    $conn = new PDO("mysql:host=$host;dbname=$db;charset=utf8", $user, $pass);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo "Connection failed: " . $e->getMessage();
}
