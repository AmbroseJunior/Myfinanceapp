import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Home from './components/Home';
import Login from './components/login';
import Register from './components/register';
import './css/App.css';

function App() {

  return (
    <div className="App">
      <Router>
        <Routes>
          {/* Add your routes here */}

          <Route path="/" element={<Home />} />
          <Route path="Login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path='/Dashboard' element={<Dashboard />} />
        
          {/* Add more routes here */}

        </Routes>
      </Router>
    </div>    
  );
}

export default App;