import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar2 from "./Navbar2";
import { Container, Row, Col, Button, ListGroup, Alert } from "react-bootstrap";
import {
  FaCheckSquare,
  FaRegSquare,
  FaInfoCircle,
  FaTrash,
} from "react-icons/fa";

const HomePage = () => {
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const navigate = useNavigate();

  // **Carica la lista clienti dal database**
  useEffect(() => {
    fetch("https://pdf.digiworks.it/backend/api/get_client.php")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Errore HTTP: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("📥 Dati ricevuti:", data); // DEBUG: Guarda i dati in console
        if (data && Array.isArray(data.clienti)) {
          setClients(data.clienti);
        } else {
          console.error(
            "⚠️ La risposta dell'API non contiene un array valido di clienti:",
            data
          );
        }
      })
      .catch((error) =>
        console.error("❌ Errore nel recupero dei clienti:", error)
      );
  }, []);

  const handleClientClick = (client) => {
    setSelectedClient(
      selectedClient && selectedClient.id === client.id ? null : client
    );
  };

  const handleMoreInfoClick = (e, client) => {
    e.stopPropagation();
    navigate(`/client/${client.id}`, { state: { client } });
  };

  const handleDeleteClient = async (clientId) => {
    if (
      !window.confirm(
        `Sei sicuro di voler eliminare il cliente con ID: ${clientId}?`
      )
    ) {
      return;
    }

    try {
      const response = await fetch(
        "https://pdf.digiworks.it/backend/api/delete_client.php",
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: clientId }),
        }
      );

      const result = await response.json();
      if (result.status === "success") {
        setClients(clients.filter((client) => client.id !== clientId));
        setSelectedClient(null);
      } else {
        console.error("Errore eliminazione cliente:", result.message);
      }
    } catch (error) {
      console.error("Errore di rete:", error);
    }
  };

  return (
    <>
      <Navbar2 />
      <div className="home-page" style={{ fontFamily: "Arial, sans-serif" }}>
        <header className="home-header custom-color text-white modern-font"></header>

        <Container>
          {/* Introduzione */}
          <Row className="my-5 text-center">
            <Col>
              <p className="info-text">
                La tua area clienti dove poter inserire i loro dati e avere un
                archivio completo e consultabile. Seleziona il cliente
                desiderato e scarica direttamente il modulo Pdf autocompilato
                con i suoi dati!
              </p>
            </Col>
          </Row>

          {/* Pulsante "Carica" per aggiungere un nuovo cliente */}
          <Row className="my-5">
            <Col>
              <div className="area-clienti position-relative text-center">
                <h2 className="section-title">Inserisci un nuovo cliente</h2>
                <Button
                  variant="primary"
                  onClick={() => navigate("/clientform")}
                  style={{ backgroundColor: "#086053", borderColor: "#086053" }}
                >
                  Carica Cliente
                </Button>
              </div>
            </Col>
          </Row>

          {/* Lista clienti e lista pratiche */}
          <Row className="my-5">
            <Col md={6}>
              <div className="p-3 shadow-sm">
                <h2 className="section-title">Lista Clienti</h2>

                {/* Messaggio se non ci sono clienti */}
                {clients.length === 0 && (
                  <Alert variant="warning">Nessun cliente disponibile.</Alert>
                )}

                <ListGroup id="my-list-group">
                  {clients.map((client, index) => (
                    <ListGroup.Item
                      key={index}
                      action
                      onClick={() => handleClientClick(client)}
                      className={`client-item d-flex justify-content-between align-items-center ${
                        selectedClient && selectedClient.id === client.id
                          ? "selected-client"
                          : ""
                      }`}
                    >
                      <div className="d-flex flex-grow-1 align-items-center">
                        {selectedClient && selectedClient.id === client.id ? (
                          <FaCheckSquare className="me-2 text-success" />
                        ) : (
                          <FaRegSquare className="me-2" />
                        )}
                        <div className="d-flex flex-column">
  <strong>
    {client.nome} {client.cognome}
  </strong>

  <small className="text-muted">
    {client.ragione_sociale && client.ragione_sociale.trim() !== ""
      ? client.ragione_sociale
      : "Privato"}
  </small>
</div>

                      </div>

                      {/* Pulsanti "Info" e "Elimina" */}
                      <div className="d-flex">
                        <Button
                          variant="info"
                          size="sm"
                          className="me-2"
                          onClick={(e) => handleMoreInfoClick(e, client)}
                        >
                          <FaInfoCircle />
                        </Button>

                        <Button
                          variant="danger"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteClient(client.id);
                          }}
                        >
                          <FaTrash />
                        </Button>
                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </div>
            </Col>

            {/* Lista pratiche */}
            <Col md={6}>
              <div className="p-3 shadow-sm">
                <h2 className="section-title">Lista Pratiche</h2>
                <div className="d-flex flex-wrap justify-content-center">
                  {/* Pulsante per la pratica REVOIP */}
                  <Button
                    variant="outline-success"
                    className="m-2 practice-button"
                    onClick={() =>
                      navigate("/revoip", { state: { client: selectedClient } })
                    }
                    style={{ minWidth: "120px" }}
                  >
                    ReVoip PDF
                  </Button>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default HomePage;
