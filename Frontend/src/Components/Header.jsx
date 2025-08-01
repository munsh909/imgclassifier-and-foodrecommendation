import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <Navbar 
      expand="lg" 
      fixed="top"
      style={{ backgroundColor: '#000000' }}  // solid black background
      variant="dark" // bootstrap dark variant (white text by default)
    >
      <Container fluid>
        <Navbar.Brand
          href="#home"
          className="mx-auto text-center"
          style={{ color: '#24b47e', fontWeight: '600' }} // dark green highlight
        >
          Food Recommendation System
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" style={{ borderColor: '#24b47e' }} />
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
          <Nav className="ms-auto">
            {/* Nav.Link uses as={Link} so react-router handles navigation */}
            <Nav.Link as={Link} to="/" style={{ color: '#fff' }} activeStyle={{ color: '#24b47e' }}>
              Home
            </Nav.Link>
            <Nav.Link as={Link} to="/account" style={{ color: '#fff' }} activeStyle={{ color: '#24b47e' }}>
              Account
            </Nav.Link>
            <Nav.Link as={Link} to="/upload" style={{ color: '#fff' }} activeStyle={{ color: '#24b47e' }}>
              Upload Image
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}