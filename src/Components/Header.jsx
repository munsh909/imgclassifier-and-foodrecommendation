import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Link } from 'react-router-dom'

export default function Header() {
    return (
        <Navbar expand="lg" bg="light" variant="light" fixed="top">
          <Container fluid>
          <Navbar.Brand href="#home" className="mx-auto text-center">
            Food Recommendation System
          </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
              <Nav className="ms-auto">
                <Nav.Link as={Link} to="/">Home</Nav.Link>
                <Nav.Link href="#link">History</Nav.Link>
                <Nav.Link as={Link} to="/upload">Upload Image</Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      );
     }