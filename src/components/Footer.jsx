import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { FaArrowUp } from "react-icons/fa";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="footer  py-4">
      <Container>
        <Row className="align-items-center">
          {/* Logo */}
          <Col md={4} className="text-center mb-3">
            <img src="logo.png" width={300} alt="logo" />
          </Col>

          {/* Link utili */}
          <Col md={4} className="text-center mb-3">
            <ul className="list-unstyled">
              <li><a href="/" >Home</a></li>
              <li><a href="/contact">Contatti</a></li>
              <li><a href="/privacy">Privacy Policy</a></li>
            </ul>
          </Col>

          {/* Pulsante "Torna su" */}
          <Col md={4} className="text-center">
            <Button variant="light" onClick={scrollToTop}>
              <FaArrowUp /> Torna su
            </Button>
          </Col>
        </Row>

        {/* Copyright */}
        <Row className="mt-3">
          <Col className="text-center">
            <p className="mb-0">&copy; {new Date().getFullYear()} Tutti i diritti riservati.</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
