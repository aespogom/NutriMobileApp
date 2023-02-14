import React from 'react';
// import logo from './logo.svg';
import './App.css';
import {Navbar, Nav} from 'react-bootstrap';
import Home from './Home'
import { FaHome } from "react-icons/fa";

import {Link, Route, BrowserRouter as Router, Routes} from 'react-router-dom'

function App() {
  return (
    <div className="App">
      <Router>
      <Navbar className='App-header'>
          <Navbar.Brand href="/"><FaHome/></Navbar.Brand>
          <Navbar.Brand>NutriApp</Navbar.Brand>
      </Navbar>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
