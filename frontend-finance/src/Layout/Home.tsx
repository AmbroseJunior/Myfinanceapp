import React from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import './Home.css';

function Home() {
  return (
    <div className="body">
      <div className="container">
        <Card className="text-center card">
          <Card.Header>DSR</Card.Header>
          <Card.Body>
            <Card.Title>Special Finance Tracker</Card.Title>
            <Button className="button">Get Started</Button>
          </Card.Body>
          <Card.Footer className="text-muted">Last updated 3 mins ago</Card.Footer>
        </Card>
      </div>
    </div>
  );
}

export default Home;
