import React from 'react';
import './App.css';
import {Navbar, Container} from 'react-bootstrap';
import Home from './Home'
import { FaHome } from "react-icons/fa";

import {Route, BrowserRouter as Router, Routes} from 'react-router-dom'

function App() {
  return (
    <div className="App" id='App'>
      <Router>
        <Navbar className='green-bg' variant="light" expand="lg">
          <Container>
            <Navbar.Brand href="/" className='d-flex align-items-center'>
              <FaHome className='me-2'/>
              <span>NutriApp</span>
            </Navbar.Brand>
          </Container>
        </Navbar>
        <Container>
          <div className='py-5'>
            <Routes>
              <Route path="/" element={<Home />} />
            </Routes>
          </div>
        </Container>
      </Router>
    </div>
  );
}

export default App;
