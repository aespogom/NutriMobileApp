import React from 'react';
// import logo from './logo.svg';
import './App.css';
import {Navbar, Nav} from 'react-bootstrap';
import Home from './Home'
// import About from './About'
// import Users from './Users'
import {Link ,Route, BrowserRouter as Router, Routes} from 'react-router-dom'

function App() {
  return (
    <div className="App">
      <Router>
       <Navbar bg="primary" variant="dark">
          <Navbar.Brand href="#home">Navbar</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
          </Nav>
      </Navbar>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
      </Router>
    </div>
  );
}

export default App;
