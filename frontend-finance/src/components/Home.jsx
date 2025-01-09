import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';
import '../css/app.css'; // Updated with modern styles
import heroImage from '../img/bg.jpg';
import homeImage from '../img/dollar.jpg';
import Footer from './Footer';

export default function Home() {
  return (
    <div className="home-container">
      <Card className="home-card">
        <Card.Img variant="top" src={heroImage} className="home-card-img" alt="Hero" />
        <Card.Body>
          <Card.Title className="home-title">Welcome to Finance App Tracker</Card.Title>
          <Card.Text className="home-text">
            Track your income, expenses, and savings with ease.
          </Card.Text>
          <div className="home-buttons">
            <Link to="/Login">
              <Button variant="primary" className="home-btn btn-primary">Login</Button>
            </Link>
            <Link to="/Register">
              <Button variant="secondary" className="home-btn btn-secondary">Register</Button>
            </Link>
          </div>
        </Card.Body>
        <Card.Img variant="bottom" src={homeImage} className="home-card-img" alt="Home" />
      </Card>
      <Footer />
    </div>
  );
}
