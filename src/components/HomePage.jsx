import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar2 from "./Navbar2";
import { Container, Row, Col, Button, ListGroup, Alert } from "react-bootstrap";
import {
  FaCheckSquare,
  FaRegSquare,
  FaInfoCircle,
  FaTrash,
  FaCopy,
} from "react-icons/fa";

const HomePage = () => {
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const navigate = useNavigate();

  // ✅ Base URL (DEV + PROD)
  const API_BASE =
    process.env.REACT_APP_API_URL || "http://localhost:8080/backend";

  // ✅ Carica lista clienti
  useEffect(() => {
    fetch(`${API_BASE}/api/get_client.php`, { credentials: "include" })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Errore HTTP: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("📥 Dati ricevuti:", data);
        if (data && Array.isArray(data.clienti)) {
          setClients(data.clienti);
        } else {
          console.error(
            "⚠️ La risposta dell'API non contiene un array valido di clienti:",
            data
          );
          setClients([]);
        }
      })
      .catch((error) => {
        console.error("❌ Errore nel recupero dei clienti:", error);
        setClients([]);
      });
  }, [API_BASE]);

  const handleClientClick = (client) => {
    setSelectedClient((prev) => (prev && prev.id === client.id ? null : client));
  };

  const handleMoreInfoClick = (e, client) => {
    e.stopPropagation();
    navigate(`/client/${client.id}`, { state: { client } });
  };

  const handleDeleteClient = async (clientId) => {
    if (!window.confirm(`Sei sicuro di voler eliminare il cliente con ID: ${clientId}?`)) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/api/delete_client.php`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: clientId }),
        credentials: "include",
      });

      const result = await response.json();

      if (result.status === "success") {
        setClients((prev) => prev.filter((client) => client.id !== clientId));
        setSelectedClient((prev) => (prev?.id === clientId ? null : prev));
      } else {
        console.error("Errore eliminazione cliente:", result.message);
        alert(result.message || "Errore durante l'eliminazione.");
      }
    } catch (error) {
      console.error("Errore di rete:", error);
      alert("Errore di rete durante l'eliminazione.");
    }
  };

  const handleDuplicateClient = async (clientId) => {
    try {
      const response = await fetch(`${API_BASE}/api/duplicate_client.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: clientId }),
        credentials: "include",
      });

      const result = await response.json();

      if (result.status === "success" && result.client) {
        setClients((prev) => [result.client, ...prev]);
        setSelectedClient(result.client);
      } else {
        console.error("Errore duplicazione:", result.message);
        alert(result.message || "Errore durante la duplicazione.");
      }
    } catch (error) {
      console.error("Errore di rete:", error);
      alert("Errore di rete durante la duplicazione.");
    }
  };

  return (
    <>
      <Navbar2 />
      <div className="home-page" style={{ fontFamily: "Arial, sans-serif" }}>
        <header className="home-header custom-color text-white modern-font" />

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

          {/* Carica nuovo cliente */}
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

          {/* Lista clienti + pratiche */}
          <Row className="my-5">
            <Col md={6}>
              <div className="p-3 shadow-sm">
                <h2 className="section-title">Lista Clienti</h2>

                {clients.length === 0 && (
                  <Alert variant="warning">Nessun cliente disponibile.</Alert>
                )}

                <ListGroup id="my-list-group">
                  {clients.map((client) => (
                    <ListGroup.Item
                      key={client.id}
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
                            {client.ragione_sociale &&
                            client.ragione_sociale.trim() !== ""
                              ? client.ragione_sociale
                              : "Privato"}
                          </small>
                        </div>
                      </div>

                      {/* Pulsanti */}
                      <div className="d-flex">
                        <Button
                          variant="info"
                          size="sm"
                          className="me-2"
                          onClick={(e) => handleMoreInfoClick(e, client)}
                          title="Dettagli"
                        >
                          <FaInfoCircle />
                        </Button>

                        <Button
                          variant="secondary"
                          size="sm"
                          className="me-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDuplicateClient(client.id);
                          }}
                          title="Duplica"
                        >
                          <FaCopy />
                        </Button>

                        <Button
                          variant="danger"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteClient(client.id);
                          }}
                          title="Elimina"
                        >
                          <FaTrash />
                        </Button>
                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </div>
            </Col>

            <Col md={6}>
              <div className="p-3 shadow-sm">
                <h2 className="section-title">Lista Pratiche</h2>
                <div className="d-flex flex-wrap justify-content-center">
                  <Button
                    variant="outline-success"
                    className="m-2 practice-button"
                    disabled={!selectedClient}
                    onClick={() =>
                      navigate("/revoip", { state: { client: selectedClient } })
                    }
                    style={{ minWidth: "120px" }}
                    title={
                      selectedClient
                        ? "Apri pratica ReVoip"
                        : "Seleziona prima un cliente"
                    }
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
