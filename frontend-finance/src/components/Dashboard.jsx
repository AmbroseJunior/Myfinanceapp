import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Footer from "./Footer";
import Transactions from "./Transactions";

export default function Dashboard() {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || null);
    const [details, setDetails] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [error, setError] = useState("");
    const [showTransactionForm, setShowTransactionForm] = useState(false);
    const [formData, setFormData] = useState({
        fk_id_account: "",
        category: "",
        typeTransaction: "",
        amount: "",
        description: "",
        transactionDate: "",
    });

    // Category and transaction type mappings
    const categoryMapping = {
        1: "salary",
        2: "Rent",
        3: "Feeding",
        4: "Bills",
        5: "Leisure/Fun",
        6: "Investment",
        7: "Charity",
    };

    const transactionTypeMapping = {
        1: "Deposit",
        2: "Withdrawal",
    };

    useEffect(() => {
        if (user) {
            fetchTransactions();
            setUser(user);
        }
    }, [user]);

    const fetchTransactions = async () => {
        try {
            const response = await  fetch(`http://localhost/financeapp/Myfinanceapp/Backend-finance/api/transaction.php?id_user=${user.id_user}`);
            const data = await response.json();
            console.log("fetched transactions:", data);
            setTransactions(data || []); 
        } catch (error) {
            console.error("Error fetching transactions:", error);
        }
    };

    const handleFetchDetails = async () => {
        if (!user?.id_user) {
            setError("Invalid user ID");
            return;
        }
    
        try {
            const response = await fetch(
                `http://localhost/financeapp/Myfinanceapp/Backend-finance/api/getbyid.php?id_user=${user.id_user}`
            );
    
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
    
            const data = await response.json();
    
            if (data.id_user) {
                // Use the backend's current_balance value and update only that
                const updatedUser = { ...user, current_balance: parseFloat(data.current_balance) };
                setUser(updatedUser);
                localStorage.setItem("user", JSON.stringify(updatedUser));
    
                // Update the modal details
                setDetails(data);
                setError("");
                setShowDetailsModal(true);
            } else {
                setError(data.message || "Failed to fetch user details.");
            }
        } catch (err) {
            console.error("Error fetching user details:", err);
            setError(`An error occurred: ${err.message}`);
        }
    };
    
    const handleFormChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    
    const handleAddTransaction = async () => {
        const { category, typeTransaction, amount, description, transactionDate } = formData;
    
        if (!category || !typeTransaction || !amount || !description || !transactionDate || !user?.id_user) {
            console.warn("Please fill in all required fields.");
            return;
        }
    
        const categoryReverseMapping = Object.fromEntries(Object.entries(categoryMapping).map(([id, name]) => [name, id]));
        const transactionTypeReverseMapping = Object.fromEntries(Object.entries(transactionTypeMapping).map(([id, name]) => [name, id]));
    
        const payload = {
            id_user: user.id_user, 
            fk_id_category: parseInt(categoryReverseMapping[category]),
            fk_type_transaction: parseInt(transactionTypeReverseMapping[typeTransaction]),
            amount: parseFloat(amount),
            description: description.trim(),
            transaction_date: transactionDate,
        };
    
        try {
            const response = await fetch("http://localhost/financeapp/Myfinanceapp/Backend-finance/api/transaction.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
    
            const data = await response.json();
            console.log("Add Transaction Response:", data);
    
            if (data.status === 1) {
                // Update current balance in frontend
                const newBalance =
                    typeTransaction === "Deposit"
                        ? user.current_balance + parseFloat(amount)
                        : user.current_balance - parseFloat(amount);
    
                const updatedUser = { ...user, current_balance: newBalance };
                setUser(updatedUser);
                localStorage.setItem("user", JSON.stringify(updatedUser));
    
                fetchTransactions();
                setShowTransactionForm(false);
            } else {
                console.error("Failed to add transaction:", data.message);
            }
        } catch (error) {
            console.error("Error adding transaction:", error);
        }
    };
    
    
    
    const handleEditTransaction = async (updatedTransaction) => {
        if (!updatedTransaction.id_transaction || !user?.id_user) {
            console.warn("Invalid input: Missing required fields.");
            return;
        }
    
        const categoryReverseMapping = Object.fromEntries(Object.entries(categoryMapping).map(([id, name]) => [name, id]));
        const transactionTypeReverseMapping = Object.fromEntries(Object.entries(transactionTypeMapping).map(([id, name]) => [name, id]));
    
        const payload = {
            id_transaction: updatedTransaction.id_transaction,
            id_user: user.id_user,
            fk_id_category: parseInt(categoryReverseMapping[updatedTransaction.category]),
            fk_type_transaction: parseInt(transactionTypeReverseMapping[updatedTransaction.type_transaction]),
            amount: parseFloat(updatedTransaction.amount),
            description: updatedTransaction.description.trim(),
            transaction_date: updatedTransaction.transaction_date,
        };
    
        try {
            const response = await fetch("http://localhost/financeapp/Myfinanceapp/Backend-finance/api/transaction.php", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
    
            const data = await response.json();
            console.log("Edit Transaction Response:", data);
    
            if (data.status === 1) {
                console.log("Transaction updated successfully!");
    
                // Fetch updated user details to sync current_balance
                const userDetailsResponse = await fetch(
                    `http://localhost/financeapp/Myfinanceapp/Backend-finance/api/getbyid.php?id_user=${user.id_user}`
                );
                const userDetails = await userDetailsResponse.json();
    
                if (userDetails.id_user) {
                    const updatedUser = { ...user, current_balance: parseFloat(userDetails.current_balance) };
                    setUser(updatedUser);
                    localStorage.setItem("user", JSON.stringify(updatedUser));
                }
    
                fetchTransactions();
            } else {
                console.error("Failed to update transaction:", data.message);
            }
        } catch (error) {
            console.error("Error updating transaction:", error);
        }
    };
    
    
    
    const handleDeleteTransaction = async (id_transaction) => {
        if (!id_transaction) {
            console.warn("Invalid transaction ID.");
            return;
        }
    
        try {
            const response = await fetch("http://localhost/financeapp/Myfinanceapp/Backend-finance/api/transaction.php", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id_transaction }),
            });
    
            const data = await response.json();
            console.log("Delete Transaction Response:", data);
    
            if (data.status === 1) {
                console.log("Transaction deleted successfully!");
                fetchTransactions(); // Refresh transaction list
            } else {
                console.warn("Failed to delete transaction:", data.message);
            }
        } catch (error) {
            console.error("Error deleting transaction:", error);
        }
    };
    
    
    const handleCloseModal = () => {
        setShowDetailsModal(false);
        setDetails(null);
    };

    const handleLogout = () => {
        localStorage.removeItem("user");
        window.location.href = "/";
    };

    return (
        <div className="container">
            <h1>Welcome, {user?.name || "Guest"}</h1>
            <br />

            {/* User Profile Card */}
            <Card className="mb-4">
                <Card.Body>
                    <Card.Title>Your Profile</Card.Title>
                    {user ? (
                        <Card.Text>
                            <strong>Name:</strong> {user.name} <br />
                            <strong>Account Type:</strong> {user.account_type} <br />
                            <strong>Current Balance:</strong> ${user.current_balance} 
                        </Card.Text>
                    ) : (
                        <p>No user information available.</p>
                    )}
                    <Button variant="primary" onClick={handleFetchDetails}>
                        More Details
                    </Button>
                </Card.Body>
            </Card>

             {/* Transactions Card */}
             <Card className="mb-4">
                <Card.Body>
                    <Card.Title>Transactions</Card.Title>
                    <Button 
                        variant="primary" 
                        onClick={() => setShowTransactionForm(true)} 
                        style={{ marginBottom: "20px" }}
                    >
                        Add Transaction
                    </Button>
                    {transactions.length > 0 ? (
                        <Transactions
                        transactions={transactions}
                        categoryMapping={categoryMapping}
                        transactionTypeMapping={transactionTypeMapping}
                        onEditTransaction={handleEditTransaction}
                        onDeleteTransaction={handleDeleteTransaction}
                    />
                    
                    ) : (
                        <p>No transactions found.</p>
                    )}
                </Card.Body>
            </Card>

            {/* Details Modal */}
            <Modal show={showDetailsModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>User Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {details ? (
                        <div>
                            <p><strong>ID:</strong> {details.id_user}</p>
                            <p><strong>Name:</strong> {details.name}</p>
                            <p><strong>Account Type:</strong> {details.account_type}</p>
                            <p><strong>Current Balance:</strong> ${details.current_balance}</p>
                            <p><strong>Bank:</strong> {details.Bank || "N/A"}</p>
                        </div>
                    ) : (
                        <p>Loading details...</p>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
            {/* Transaction Form Modal */}
            <Modal show={showTransactionForm} onHide={() => setShowTransactionForm(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Transaction</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Category</Form.Label>
                            <Form.Control
                                as="select"
                                name="category"
                                value={formData.category}
                                onChange={handleFormChange}
                            >
                                <option value="">Select Category</option>
                                {Object.values(categoryMapping).map((category) => (
                                    <option key={category} value={category}>
                                        {category}
                                    </option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Type</Form.Label>
                            <Form.Control
                                as="select"
                                name="typeTransaction"
                                value={formData.typeTransaction}
                                onChange={handleFormChange}
                            >
                                <option value="">Select Type</option>
                                {Object.values(transactionTypeMapping).map((type) => (
                                    <option key={type} value={type}>
                                        {type}
                                    </option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Amount</Form.Label>
                            <Form.Control
                                type="number"
                                name="amount"
                                value={formData.amount}
                                onChange={handleFormChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                type="text"
                                name="description"
                                value={formData.description}
                                onChange={handleFormChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Date</Form.Label>
                            <Form.Control
                                type="date"
                                name="transactionDate"
                                value={formData.transactionDate}
                                onChange={handleFormChange}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowTransactionForm(false)}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleAddTransaction}>
                        Save Transaction
                    </Button>
                </Modal.Footer>
            </Modal>
            {/* Logout Button */}
            <Button variant="danger" onClick={handleLogout}>Logout</Button>
            <Footer />
        </div>
    );
}