import React, { useState } from "react";
import { Navbar, Nav, Container, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";

const Navbar4 = () => {
  const [showModal, setShowModal] = useState(false);

  const handleModalOpen = () => setShowModal(true);
  const handleModalClose = () => setShowModal(false);

  return (
    <>
      <Navbar expand="lg" style={{ backgroundColor: "#ECECEC", top: 0, width: "100%", zIndex: 1030 }}>
        <Container className="justify-content-center align-items-center">
          {/* Voci di menu a sinistra */}
          <Nav className="mr-auto d-none d-lg-flex">
            <Nav.Link as={Link} to="/" style={{ color: "#000", marginLeft: "15px", marginRight: "15px" }}>
              ABOUT
            </Nav.Link>
            <Nav.Link as={Link} to="/scopridipiu" style={{ color: "#000", marginLeft: "15px", marginRight: "15px" }}>
              SCOPRI DI PIU'
            </Nav.Link>
          </Nav>

          {/* Logo al centro su schermi larghi */}
          <Navbar.Brand href="#" className="d-none d-lg-block">
            <img src="./assets/logo_about.png" width="100" height="auto" alt="Logo" id="logo4" />
          </Navbar.Brand>

          {/* Voci di menu a destra */}
          <Nav className="ml-auto d-none d-lg-flex">
            <Nav.Link as={Link} to="/contact" style={{ color: "#000", marginLeft: "15px", marginRight: "15px" }}>
              CONTATTI
            </Nav.Link>
            <Nav.Link as={Link} to="/register" style={{ color: "#000", marginLeft: "15px", marginRight: "15px" }}>
              REGISTRATI
            </Nav.Link>
          </Nav>

          {/* Toggle per il Modal su schermi piccoli */}
          <Navbar.Toggle aria-controls="basic-navbar-nav" onClick={handleModalOpen} />
        </Container>
      </Navbar>

      {/* Logo al centro su schermi piccoli */}
      <Navbar
        className="d-lg-none"
        expand="lg"
        style={{ backgroundColor: "#ECECEC", top: 0, width: "100%", zIndex: 1030 }}
      >
        <Container className="justify-content-center">
          <Navbar.Brand href="#">
            <img src="./assets/logo_about.png" width="100" height="auto" alt="Logo" id="logo4" />
          </Navbar.Brand>
        </Container>
      </Navbar>

      {/* Modal per schermi piccoli */}
      {showModal && (
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
              <Nav.Link as={Link} to="/" onClick={handleModalClose} style={{ color: "#2f7c72" }}>
                ABOUT
              </Nav.Link>
              <Nav.Link as={Link} to="/scopridipiu" onClick={handleModalClose} style={{ color: "#2f7c72" }}>
                SCOPRI DI PIU'
              </Nav.Link>
              <Nav.Link as={Link} to="/contact" onClick={handleModalClose} style={{ color: "#2f7c72" }}>
                CONTATTI
              </Nav.Link>
              <Nav.Link as={Link} to="/register" onClick={handleModalClose} style={{ color: "#2f7c72" }}>
                REGISTRATI
              </Nav.Link>
            </Nav>
          </Modal.Body>
        </Modal>
      )}
    </>
  );
};

export default Navbar4;
