import React from 'react';
// import logo from './logo.svg';
import './App.css';
import {Navbar, Nav} from 'react-bootstrap';
import Home from './Home'
import { FaHome } from "react-icons/fa";
import Model from './Model'

import {Link, Route, BrowserRouter as Router, Routes} from 'react-router-dom'

function App() {
  return (
    <div className="App">
      <Router>
      <Navbar className='App-header'>
          <Navbar.Brand href="/"><FaHome/></Navbar.Brand>
          <Navbar.Brand>NutriApp</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/model">Model</Nav.Link>
          </Nav>
      </Navbar>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/model" element={<Model />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
