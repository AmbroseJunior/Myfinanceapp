<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

include '../includes/connect.php';

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: *");

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET': // Fetch transactions
        $id_user = $_GET['id_user'] ?? null;

        if ($id_user) {
            try {
                $sql = "
                    SELECT t.id_transaction, t.fk_id_account, t.fk_id_category, t.fk_type_transaction, 
                    t.amount, t.description, t.transaction_date, a.Bank
                    FROM transaction t
                    LEFT JOIN account a ON t.fk_id_account = a.id_account
                    WHERE a.fk_id_user = :id_user
                ";
                $stmt = $conn->prepare($sql);
                $stmt->bindParam(':id_user', $id_user, PDO::PARAM_INT);
                $stmt->execute();
                $transactions = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
                if ($transactions) {
                    echo json_encode($transactions);
                } else {
                    echo json_encode(['status' => 0, 'message' => 'No transactions found']);
                }
            } catch (Exception $e) {
                echo json_encode(['status' => 0, 'message' => 'Database error', 'error' => $e->getMessage()]);
            }
        } else {
            echo json_encode(['status' => 0, 'message' => 'Invalid id_user']);
        }
        
        break;

    case 'POST': // Add a transaction
        $data = json_decode(file_get_contents('php://input'), true);

        if (
            isset($data['id_account'], $data['category'], $data['type_transaction'], 
                  $data['amount'], $data['description'], $data['transaction_date'])
        ) {
            try {
                $sql = "
                    INSERT INTO transaction (fk_id_account, fk_id_category, fk_type_transaction, 
                    amount, description, transaction_date, created_at, updated_at) 
                    VALUES (:fk_id_account, :fk_id_category, :fk_type_transaction, :amount, 
                            :description, :transaction_date, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
                ";
                $stmt = $conn->prepare($sql);
                $stmt->bindParam(':fk_id_account', $data['id_account'], PDO::PARAM_INT);
                $stmt->bindParam(':fk_id_category', $data['category'], PDO::PARAM_INT);
                $stmt->bindParam(':fk_type_transaction', $data['type_transaction'], PDO::PARAM_INT);
                $stmt->bindParam(':amount', $data['amount']);
                $stmt->bindParam(':description', $data['description']);
                $stmt->bindParam(':transaction_date', $data['transaction_date']);
        
                if ($stmt->execute()) {
                    echo json_encode(['status' => 1, 'message' => 'Transaction added successfully']);
                } else {
                    echo json_encode([
                        'status' => 0, 
                        'message' => 'Failed to add transaction',
                        'error' => $stmt->errorInfo()
                    ]);
                }
            } catch (Exception $e) {
                echo json_encode(['status' => 0, 'message' => 'Database error', 'error' => $e->getMessage()]);
            }
        } else {
            echo json_encode(['status' => 0, 'message' => 'Invalid input: Missing required fields']);
        }
        
        break;

    case 'PUT': // Update a transaction
        $data = json_decode(file_get_contents('php://input'), true);

        if (
            isset($data['id_transaction'], $data['id_account'], $data['category'], 
                  $data['type_transaction'], $data['amount'], $data['description'], $data['transaction_date'])
        ) {
            $sql = "
                UPDATE transaction 
                SET fk_id_account = :fk_id_account, fk_id_category = :fk_id_category, 
                    fk_type_transaction = :fk_type_transaction, amount = :amount, 
                    description = :description, transaction_date = :transaction_date, 
                    updated_at = CURRENT_TIMESTAMP 
                WHERE id_transaction = :id_transaction
            ";
            $stmt = $conn->prepare($sql);
            $stmt->bindParam(':id_transaction', $data['id_transaction'], PDO::PARAM_INT);
            $stmt->bindParam(':fk_id_account', $data['id_account'], PDO::PARAM_INT);
            $stmt->bindParam(':fk_id_category', $data['category'], PDO::PARAM_INT);
            $stmt->bindParam(':fk_type_transaction', $data['type_transaction'], PDO::PARAM_INT);
            $stmt->bindParam(':amount', $data['amount']);
            $stmt->bindParam(':description', $data['description']);
            $stmt->bindParam(':transaction_date', $data['transaction_date']);

            if ($stmt->execute()) {
                echo json_encode(['status' => 1, 'message' => 'Transaction updated successfully']);
            } else {
                echo json_encode([
                    'status' => 0, 
                    'message' => 'Failed to update transaction',
                    'error' => $stmt->errorInfo()
                ]);
            }
        } else {
            echo json_encode(['status' => 0, 'message' => 'Invalid input: Missing required fields']);
        }
        break;

    case 'DELETE': // Delete a transaction
        $data = json_decode(file_get_contents('php://input'), true);

        if (isset($data['id_transaction'])) {
            $sql = "DELETE FROM transaction WHERE id_transaction = :id_transaction";
            $stmt = $conn->prepare($sql);
            $stmt->bindParam(':id_transaction', $data['id_transaction'], PDO::PARAM_INT);

            if ($stmt->execute()) {
                echo json_encode(['status' => 1, 'message' => 'Transaction deleted successfully']);
            } else {
                echo json_encode([
                    'status' => 0, 
                    'message' => 'Failed to delete transaction',
                    'error' => $stmt->errorInfo()
                ]);
            }
        } else {
            echo json_encode(['status' => 0, 'message' => 'Invalid input: Missing transaction ID']);
        }
        break;
}
