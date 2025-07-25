import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

export default function Header() {
    return (
        <Navbar expand="lg" bg="light" variant="light" fixed="top">
          <Container fluid>
          <Navbar.Brand href="#home" className="mx-auto text-center">
            Food Recommendation System
          </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
                <Nav.Link href="#home">Home</Nav.Link>
                <Nav.Link href="#link">History</Nav.Link>
                <Nav.link href="#upload">Upload Image</Nav.link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      );
    
}