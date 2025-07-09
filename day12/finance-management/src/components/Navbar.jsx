import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';

export default function AppNavbar({ darkMode, toggleDarkMode }) {
  const navigate = useNavigate();
  const token = localStorage.getItem('financeapp_token');

  const handleLogout = () => {
    localStorage.removeItem('financeapp_token');
    navigate('/auth/signin');
  };

  return (
    <Navbar bg="light" variant="light" expand="lg" className="mb-4 neu-navbar p-2">
      <Container>
        <Navbar.Brand as={Link} to="/">Trackmoney.c</Navbar.Brand>
        {/* Desktop: Hamburger left, dark mode right of logout */}
        <div className="d-none d-lg-flex align-items-center ms-auto">
          <Navbar.Toggle aria-controls="main-navbar-nav" />
        </div>
        {/* Mobile: Hamburger left, dark mode right */}
        <div className="d-flex align-items-center d-lg-none">
          <Navbar.Toggle aria-controls="main-navbar-nav" />
        </div>
        <Navbar.Collapse id="main-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/dashboard">Dashboard</Nav.Link>
            <Nav.Link as={Link} to="/transactions">Transactions</Nav.Link>
            <Nav.Link as={Link} to="/budgets">Budgets</Nav.Link>
            <Nav.Link as={Link} to="/reports">Reports</Nav.Link>
            <Nav.Link as={Link} to="/goals">Goals</Nav.Link>
          </Nav>
          <Nav className="align-items-center">
            {token ? (
              <>
                <Nav.Link as={Link} to="/auth/profile">Profile</Nav.Link>
                <Nav.Link as={Link} to="#" onClick={handleLogout}>Logout</Nav.Link>
                <button
                  className="dark-toggle ms-2 position-static"
                  style={{ position: 'static', marginLeft: 12 }}
                  onClick={toggleDarkMode}
                  title="Toggle dark mode"
                >
                  {darkMode ? '🌙' : '☀️'}
                </button>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/auth/signin">Sign In</Nav.Link>
                <button
                  className="dark-toggle ms-2 position-static"
                  style={{ position: 'static', marginLeft: 12 }}
                  onClick={toggleDarkMode}
                  title="Toggle dark mode"
                >
                  {darkMode ? '🌙' : '☀️'}
                </button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

