import React, { useState, useEffect } from "react";
import { Navbar, Nav, Container, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";

const Navbar1 = () => {
  const [showModal, setShowModal] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const handleModalOpen = () => setShowModal(true);
  const handleModalClose = () => setShowModal(false);

  // Gestisce lo scroll della pagina
  const handleScroll = () => {
    const scrolled = window.scrollY > 100;
    setIsScrolled(scrolled);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <Navbar expand="lg" className={`custom-navbar fixed-top ${isScrolled ? "navbar-transparent" : ""}`}>
        <Container fluid>
          {/* <Navbar.Brand href="#">
            <img src="./assets/logo3.png" width="70" height="auto" alt="Logo" style={{ marginLeft: "40px" }} />
          </Navbar.Brand> */}

          {/* Toggle per il Modal su schermi piccoli */}
          <Navbar.Toggle aria-controls="basic-navbar-nav" onClick={handleModalOpen} />

          {/* Voci di menu */}
          <Nav className="ms-auto gap-5 d-none d-lg-flex justify-content-center w-100">
            <Nav.Link as={Link} to="/" className="nav-link-custom">
              REGISTER
            </Nav.Link>
            <Nav.Link as={Link} to="/login" className="nav-link-custom">
              LOGIN
            </Nav.Link>
            <Nav.Link as={Link} to="/contact" className="nav-link-custom">
              CLIENTI
            </Nav.Link>
            <Nav.Link as={Link} to="/register" className="nav-link-custom">
              PDF
            </Nav.Link>
          </Nav>
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

export default Navbar1;
