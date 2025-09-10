import React, { useState } from "react";
import { Navbar, Nav, Container, NavDropdown, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";

const Navbar2 = () => {
  const [showModal, setShowModal] = useState(false);

  const handleModalOpen = () => setShowModal(true);
  const handleModalClose = () => setShowModal(false);

  const handleLogout = async () => {
    try {
      const response = await fetch(
        "https://pdf.digiworks.it/backend/logout.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log(data.message);
        window.location.href = "/login";
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <>
      {/* Navbar per schermi grandi */}
      <Navbar expand="lg" className="custom-navbar fixed-top">
        <Container fluid>
          <Navbar.Toggle
            aria-controls="basic-navbar-nav"
            onClick={handleModalOpen}
          />

          <Nav className="mx-auto gap-5 d-none d-lg-flex">
            <Nav.Link as={Link} to="/" className="nav-link-custom">
              REGISTER
            </Nav.Link>
            <Nav.Link as={Link} to="/login" className="nav-link-custom">
              LOGIN
            </Nav.Link>
            <Nav.Link as={Link} to="/scopridipiu" className="nav-link-custom">
              CLIENTI
            </Nav.Link>
            <Nav.Link as={Link} to="/scopridipiu" className="nav-link-custom">
              PDF
            </Nav.Link>
            <NavDropdown
              title="PROFILE"
              id="basic-nav-dropdown"
              className="nav-link-custom"
            >
              <NavDropdown.Item as={Link} to="/profilepage">
                My Profile
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/login">
                Login
              </NavDropdown.Item>
              <NavDropdown.Item as="button" onClick={handleLogout}>
                Logout
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Container>
      </Navbar>

      {/* Modal per schermi piccoli */}
      <Modal
        show={showModal}
        onHide={handleModalClose}
        backdrop={false}
        dialogClassName="custom-modal"
        style={{ marginTop: "70px" }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Menu</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Nav className="flex-column">
            <Nav.Link
              as={Link}
              to="/"
              onClick={handleModalClose}
              style={{ color: "#2f7c72" }}
            >
              REGISTER
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/login"
              onClick={handleModalClose}
              style={{ color: "#2f7c72" }}
            >
              LOGIN
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/scopridipiu"
              onClick={handleModalClose}
              style={{ color: "#2f7c72" }}
            >
              CLIENTI
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/scopridipiu"
              onClick={handleModalClose}
              style={{ color: "#2f7c72" }}
            >
              PDF
            </Nav.Link>

            <NavDropdown
              title={<span style={{ color: "#2f7c72" }}>Profile</span>}
              id="basic-nav-dropdown-modal"
              className="nav-link-custom"
            >
              <NavDropdown.Item
                as={Link}
                to="/profilepage"
                onClick={handleModalClose}
              >
                My Profile
              </NavDropdown.Item>
              <NavDropdown.Item
                as={Link}
                to="/login"
                onClick={handleModalClose}
              >
                Login
              </NavDropdown.Item>
              <NavDropdown.Item as="button" onClick={handleLogout}>
                Logout
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Navbar2;
