import React, { useState } from "react";

import { Navbar, Nav, Container, NavDropdown, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import logo2 from "../components/logo3.png";
import icon from "../components/icons.png";

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
      <Navbar expand="lg" className="custom-navbar color-navbar">
        <Container fluid>
          <Navbar.Brand as={Link} to="#">
            <img
              src={logo2}
              width="70"
              height="auto"
              alt="Logo"
              style={{ marginLeft: "40px" }}
            />
          </Navbar.Brand>

          <Navbar.Toggle
            aria-controls="basic-navbar-nav"
            onClick={handleModalOpen}
          />

          <Nav className="ms-auto gap-5 d-none d-lg-flex">
            <Nav.Link as={Link} to="/homepage" className="nav-link-custom">
              HOME
            </Nav.Link>
            <Nav.Link as={Link} to="/" className="nav-link-custom">
              ABOUT
            </Nav.Link>
            <Nav.Link as={Link} to="/scopridipiu" className="nav-link-custom">
              SCOPRI DI PIU'
            </Nav.Link>
            <NavDropdown
              title={
                <img
                  src={icon}
                  width="40"
                  height="40"
                  alt="Logout"
                  className="d-inline-block align-top"
                />
              }
              id="basic-nav-dropdown"
              className="nav-link-custom"
              style={{ marginRight: "50px" }}
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
              to="/homepage"
              onClick={handleModalClose}
              style={{ color: "#2f7c72" }}
            >
              HOME
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/"
              onClick={handleModalClose}
              style={{ color: "#2f7c72" }}
            >
              ABOUT
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/scopridipiu"
              onClick={handleModalClose}
              style={{ color: "#2f7c72" }}
            >
              SCOPRI DI PIU'
            </Nav.Link>

            <NavDropdown
              title={<span style={{ color: "#2f7c72" }}>USER</span>}
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
