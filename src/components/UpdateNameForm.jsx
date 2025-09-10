//-------------------UPDATE NAME----------------------

import React, { useState, useEffect } from "react";
import { FaArrowLeft } from "react-icons/fa";
import Navbar2 from "./Navbar2";
import { Form, Button, Container, Row, Col, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

const UpdateNameForm = () => {
  // Stato per memorizzare nome e cognome
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  // Stato per gestire i messaggi di successo e di errore
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  // Recupera l'ID utente dal localStorage
  const userId = localStorage.getItem("userId");

  // Effetto per verificare se l'utente è autenticato
  useEffect(() => {
    if (!userId) {
      navigate("/login");
    }
  }, [navigate, userId]);

  // Funzione per gestire l'invio del form, Previene il comportamento predefinito del form
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // RICHIESTA FETCH - POST al server per aggiornare nome e cognome
      const response = await fetch(
        "https://pdf.digiworks.it/backend/api/save_name_surname.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id_user: userId, name, surname }), // Invio sia nome che cognome
        }
      );

      // Controlla se la risposta è ok
      if (!response.ok) {
        throw new Error(`Errore HTTP! Status: ${response.status}`);
      }

      // Ottieni i dati della risposta
      const data = await response.json();

      // Controlla se ci sono errori nei dati
      if (data.status === "error") {
        throw new Error(data.message);
      }

      // Imposta il messaggio di successo
      setSuccessMessage("Nome e cognome inseriti con successo!");
      setErrorMessage(""); // Pulisce eventuali messaggi di errore
    } catch (error) {
      // Gestione degli errori
      console.error("Errore nell'aggiornamento di nome e cognome:", error);
      setErrorMessage("Impossibile aggiornare nome e cognome.");
      setSuccessMessage(""); // Pulisce il messaggio di successo
    }
  };

  return (
    <>
      <Navbar2 />
      <div
        className="min-vh-100 d-flex justify-content-center align-items-center mb-4 mt-4"
        style={{ background: "linear-gradient(135deg, #0097b2, #7ed957)" }}
      >
        <Container style={{ marginTop: "80px" }}>
          <Row className="justify-content-center">
            <Col
              lg={6}
              className="bg-light p-5 rounded shadow d-flex justify-content-center align-items-center"
            >
              <div className="text-left w-100">
                <Link
                  to="/profilepage"
                  className="text-dark mb-3 d-inline-block"
                  style={{ color: "#555" }}
                >
                  <FaArrowLeft /> Indietro
                </Link>
                <h2 className="mb-4">Inserisci Nome e Cognome</h2>
                <Form onSubmit={handleSubmit}>
                  {successMessage && (
                    <Alert variant="success">{successMessage}</Alert>
                  )}
                  {errorMessage && (
                    <Alert variant="danger">{errorMessage}</Alert>
                  )}
                  <Form.Group className="mb-3 row" controlId="formName">
                    <Form.Label className="col-sm-3">Nome</Form.Label>
                    <Col sm={9}>
                      <Form.Control
                        type="text"
                        placeholder="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </Col>
                  </Form.Group>
                  <Form.Group className="mb-3 row" controlId="formSurname">
                    <Form.Label className="col-sm-3">Cognome</Form.Label>
                    <Col sm={9}>
                      <Form.Control
                        type="text"
                        placeholder="surname"
                        value={surname}
                        onChange={(e) => setSurname(e.target.value)}
                        required
                      />
                    </Col>
                  </Form.Group>
                  <Form.Group className="mb-3 row">
                    <Col sm={9} className="offset-sm-3">
                      <Button
                        variant="primary"
                        type="submit"
                        className="w-90"
                        style={{
                          maxWidth: "200px",
                          backgroundColor: "#2F7C72",
                          borderColor: "#2F7C72",
                        }}
                      >
                        Update
                      </Button>
                    </Col>
                  </Form.Group>
                </Form>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default UpdateNameForm;

//☑️1) CARICAMENTO NOME E COGNOME DA PARTE DELL'UTENTE
//Nel file del form dove inserire nome,cognome, fare una RICHIESTA POST al file php save_name_surname, (inviando il dato nome, cognome, id utente ) che li salva nel database nella tabella name_surname
