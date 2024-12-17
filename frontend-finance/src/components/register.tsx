import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState } from "react";
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

export default function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [accountType, setAccountType] = useState("Savings");
    const [currentBalance, setCurrentBalance] = useState(0.0);
    const [bank, setBank] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        if (!name || !email || !password || !bank) {
            setError('Please fill in all required fields');
            return;
        }

        try {
            const response = await api.post('/api/register.php', {
                name,
                email,
                password,
                accountType, // Include account type
                currentBalance, // Include current balance
                bank,
            });

            if (response.data.status === 1) {
                setMessage('Registration successful! Redirecting to login...');
                setTimeout(() => {
                    navigate('/login');
                }, 2000); // Redirect after 2 seconds
            } else {
                setError(response.data.message || 'Failed to register');
            }
        } catch (error) {
            console.error('Registration error:', error);
            setError('An error occurred. Please try again.');
        }
    };

    return (
        <Card style={{ width: '30rem' }}>
            <Card.Img variant="top" src="../../src/img/bg.jpg" />
            <Card.Body>
                <Form onSubmit={handleRegister}>
                    <Form.Group controlId="formBasicName">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="Enter email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Enter password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group controlId="formBasicAccountType">
                        <Form.Label>Account Type</Form.Label>
                        <Form.Control
                            as="select"
                            value={accountType}
                            onChange={(e) => setAccountType(e.target.value)}
                        >
                            <option value="Savings">Savings</option>
                            <option value="Credit Card">Credit Card</option>
                            <option value="Current">Current</option>
                        </Form.Control>
                    </Form.Group>

                    <Form.Group controlId="formBasicBalance">
                        <Form.Label>Current Balance</Form.Label>
                        <Form.Control
                            type="number"
                            placeholder="Enter balance"
                            value={currentBalance}
                            onChange={(e) => setCurrentBalance(parseFloat(e.target.value))}
                        />
                    </Form.Group>

                    <Form.Group controlId="formBasicBank">
                        <Form.Label>Bank</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter bank name"
                            value={bank}
                            onChange={(e) => setBank(e.target.value)}
                        />
                    </Form.Group>
                    <br />

                    {error && <p className="text-danger">{error}</p>}
                    {message && <p className="text-success">{message}</p>}

                    <Button variant="primary" type="submit">
                        Register
                    </Button>
                    <br />
                    <Button variant="link" onClick={() => navigate('/login')}>
                        Already have an account? Login
                    </Button>
                </Form>
            </Card.Body>
        </Card>
    );
}
