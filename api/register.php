<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

include '../includes/connect.php';

$data = json_decode(file_get_contents('php://input'));

if (empty($data->name) || empty($data->email) || empty($data->password) || empty($data->bank)) {
    echo json_encode(['status' => 0, 'message' => 'Name, email, password, and bank are required']);
    exit;
}

try {
    $name = trim($data->name);
    $email = trim($data->email);
    $password = password_hash(trim($data->password), PASSWORD_BCRYPT); // Securely hash the password
    $accountType = isset($data->accountType) ? trim($data->accountType) : 'Savings';
    $currentBalance = isset($data->currentBalance) ? (float)$data->currentBalance : 0.00;
    $bank = trim($data->bank);
    $createdAt = date('Y-m-d H:i:s');

    // Check if the email already exists
    $checkSql = "SELECT * FROM user WHERE email = :email";
    $checkStmt = $conn->prepare($checkSql);
    $checkStmt->bindParam(':email', $email);
    $checkStmt->execute();

    if ($checkStmt->fetch(PDO::FETCH_ASSOC)) {
        echo json_encode(['status' => 0, 'message' => 'Email is already registered']);
        exit;
    }

    // Insert user into `user` table
    $userSql = "INSERT INTO user (name, email, password, account_type, current_balance, created_at) 
                VALUES (:name, :email, :password, :account_type, :current_balance, :created_at)";
    $userStmt = $conn->prepare($userSql);

    $userStmt->execute([
        ':name' => $name,
        ':email' => $email,
        ':password' => $password,
        ':account_type' => $accountType,
        ':current_balance' => $currentBalance,
        ':created_at' => $createdAt,
    ]);

    // Get the last inserted user ID
    $userId = $conn->lastInsertId();

    // Insert user's account into `account` table
    $accountSql = "INSERT INTO account (fk_id_user, fk_id_type_account, Bank, created_at) 
                   VALUES (:fk_id_user, :fk_id_type_account, :bank, :created_at)";
    $accountStmt = $conn->prepare($accountSql);

    $accountStmt->execute([
        ':fk_id_user' => $userId,
        ':fk_id_type_account' => 1, // Assuming 1 = Savings in `type_account`
        ':bank' => $bank,
        ':created_at' => $createdAt,
    ]);

    echo json_encode(['status' => 1, 'message' => 'User registered successfully']);
} catch (PDOException $e) {
    echo json_encode(['status' => 0, 'message' => 'Database error: ' . $e->getMessage()]);
}
