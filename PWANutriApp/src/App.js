import React from 'react';
import './App.css';
import {Navbar} from 'react-bootstrap';
import Home from './Home'
import { FaHome } from "react-icons/fa";

import {Route, BrowserRouter as Router, Routes} from 'react-router-dom'

function App() {
  return (
    <div className="App" id='App'>
      <Router>
      <Navbar bg="light" variant="light">
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
