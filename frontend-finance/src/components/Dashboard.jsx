import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Footer from "./Footer";

export default function Dashboard() {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || null);
    const [details, setDetails] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [error, setError] = useState("");
    const [showTransactionForm, setShowTransactionForm] = useState(false);
    const [formData, setFormData] = useState({
        accountId: "",
        category: "",
        typeTransaction: "",
        amount: "",
        description: "",
        transactionDate: "",
    });

    useEffect(() => {
        if (!user) {
            setUser(null); // Clear the user state for consistency
            return;
        }

        const fetchTransactions = async () => {
            try {
                const response = await fetch(`/api/transaction.php?userId=${user.id_user}`);
                const data = await response.json();
                setTransactions(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error("Error fetching transactions:", error);
            }
        };

        fetchTransactions();
    }, [user]);

    const handleFetchDetails = async () => {
        if (!user || !user.id_user) {
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
                setDetails(data);
                setError("");
                setShowDetailsModal(true); // Clear any previous error
            } else {
                setError(data.message || "Failed to fetch user details.");
            }
        } catch (err) {
            console.error("Error fetching user details:", err);
            setError(`An error occurred while fetching user details. ${err.message}`);
        }
    };
    

    const handleFormChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAddTransaction = async () => {
        const { accountId, category, typeTransaction, amount, description, transactionDate } = formData;

        if (!accountId || !category || !typeTransaction || !amount || !description || !transactionDate) {
            console.warn("Please fill in all required fields.");
            return;
        }

        try {
            const response = await fetch("/api/transaction.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id_account: accountId,
                    category,
                    type_transaction: typeTransaction,
                    amount,
                    description,
                    transaction_date: transactionDate,
                }),
            });

            const data = await response.json();

            if (data.status === 1) {
                setTransactions([
                    ...transactions,
                    { ...formData, id_transaction: Date.now() },
                ]);

                // Update user's current balance dynamically
                const updatedBalance =
                    typeTransaction === "Debit"
                        ? user.current_balance - parseFloat(amount)
                        : user.current_balance + parseFloat(amount);
                setUser({ ...user, current_balance: updatedBalance.toFixed(2) });

                setShowTransactionForm(false);
            } else {
                console.warn("Failed to add transaction:", data.message);
            }
        } catch (error) {
            console.error("Error adding transaction:", error);
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
                            <strong>Current Balance:</strong> ${user.current_balance} <br />
                        </Card.Text>
                    ) : (
                        <p>No user information available.</p>
                    )}
                    <Button variant="primary" onClick={handleFetchDetails}>
                        More Details
                    </Button>
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
            {/* Transactions Card */}
            <Card className="mb-4">
                <Card.Body>
                    <Card.Title>Transactions</Card.Title>
                    <Button variant="primary" onClick={() => setShowTransactionForm(true)}>
                        Add Transaction
                    </Button>
                    {transactions.length > 0 ? (
                        <ul>
                            {transactions.map((t) => (
                                <li key={t.id_transaction}>
                                    {t.description} - ${t.amount} ({t.transaction_date})
                                    <Button variant="warning" size="sm" className="ms-2">
                                        Edit
                                    </Button>
                                    <Button variant="danger" size="sm" className="ms-2">
                                        Delete
                                    </Button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No transactions found.</p>
                    )}
                </Card.Body>
            </Card>

            {/* Transaction Form Modal */}
            <Modal show={showTransactionForm} onHide={() => setShowTransactionForm(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Transaction</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Account</Form.Label>
                            <Form.Control
                                type="text"
                                name="accountId"
                                value={formData.accountId}
                                onChange={handleFormChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Category</Form.Label>
                            <Form.Control
                                type="text"
                                name="category"
                                value={formData.category}
                                onChange={handleFormChange}
                            />
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
                                <option value="Credit">Credit</option>
                                <option value="Debit">Debit</option>
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

            <Button variant="danger" onClick={handleLogout}>
                Logout
            </Button>
            <Footer />
        </div>
    );
}
