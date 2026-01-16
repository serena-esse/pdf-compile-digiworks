import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { Container, Row, Col, Card, Form, Button, Alert } from "react-bootstrap";
import Navbar2 from "./Navbar2";

// ✅ Base URL API (locale/prod)
// - CRA: usa REACT_APP_API_BASE
// - fallback: locale xampp
const API_BASE =
  process.env.REACT_APP_API_URL || "https://pdf.digiworks.it/backend";


const ClientDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();

  // ✅ se arrivi da navigate(..., { state: { client } }) ok
  // ✅ se refreshi la pagina, state sparisce -> useremo params.id
  const initialClient = location.state?.client || {};

  const [clientData, setClientData] = useState(initialClient);
  const [originalData, setOriginalData] = useState(initialClient);
  const [isEditing, setIsEditing] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // ✅ ID cliente robusto: prima da state, altrimenti da URL /client/:id
  const clientId = useMemo(() => {
    const fromState = clientData?.id;
    const fromParams = params?.id;
    return fromState || fromParams || null;
  }, [clientData?.id, params?.id]);

  // ✅ Funzione per caricare i dati aggiornati dal server
  const fetchClientData = async () => {
    try {
      setErrorMessage("");
      setSuccessMessage("");

      if (!clientId) {
        setErrorMessage("❌ ID cliente mancante (apri il dettaglio da Home).");
        return;
      }

      const response = await fetch(`${API_BASE}/api/get_client.php?id=${clientId}`);
      const result = await response.json();

      if (result.status === "success") {
        setClientData(result.client);
        setOriginalData(result.client);
      } else {
        setErrorMessage("❌ Errore nel recupero dati: " + result.message);
      }
    } catch (error) {
      setErrorMessage("⚠️ Errore di connessione al server.");
    }
  };

  // ✅ Fetch automatico al caricamento della pagina / quando cambia ID
  useEffect(() => {
    fetchClientData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setClientData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveChanges = async () => {
    try {
      setErrorMessage("");
      setSuccessMessage("");

      if (!clientId) {
        setErrorMessage("❌ ID cliente mancante.");
        return;
      }

      // ✅ assicura che l'ID sia presente nel payload
      const payload = { ...clientData, id: clientId };

      const response = await fetch(`${API_BASE}/api/update_client.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (result.status === "success") {
        setSuccessMessage("✅ Dati aggiornati con successo!");
        setIsEditing(false);
        // ✅ ricarica dati aggiornati
        fetchClientData();
      } else {
        setErrorMessage("❌ Errore nell'aggiornamento: " + result.message);
      }
    } catch (error) {
      setErrorMessage("⚠️ Errore di connessione al server.");
    }
  };

  const handleCancelEdit = () => {
    setClientData(originalData);
    setIsEditing(false);
    setSuccessMessage("");
    setErrorMessage("");
  };

  return (
    <>
      <Navbar2 />
      <div
        className="client-detail"
        style={{
          marginTop: "140px",
          marginBottom: "50px",
          backgroundColor: "#f8f9fa",
          padding: "20px",
        }}
      >
        <Container>
          <Row className="justify-content-center">
            <Col md={8}>
              <Card className="shadow-lg">
                <Card.Header style={{ backgroundColor: "#305e8b", color: "white" }}>
                  <Card.Title>
                    {(clientData?.nome || "")} {(clientData?.cognome || "")}
                  </Card.Title>
                </Card.Header>

                <Card.Body>
                  {successMessage && <Alert variant="success">{successMessage}</Alert>}
                  {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

                  <Form>
                    {[
                      { label: "Ragione Sociale", name: "ragione_sociale" },
                      { label: "Nome", name: "nome" },
                      { label: "Cognome", name: "cognome" },
                      { label: "Luogo di Nascita", name: "luogo_di_nascita" },
                      { label: "Data di Nascita", name: "data_nascita", type: "date" },
                      { label: "Indirizzo", name: "indirizzo" },
                      { label: "Località", name: "località" },
                      { label: "Provincia", name: "Provincia" },
                      { label: "CAP", name: "cap" },
                      { label: "Telefono", name: "telefono" },
                      { label: "Codice Fiscale/Partita IVA", name: "codice_fiscale" },
                      { label: "Email", name: "email", type: "email" },
                      { label: "SDI/Pec", name: "sdi_pec" },
                      { label: "Numero Carta d'Identità", name: "numero_carta_identita" },
                      { label: "Rilasciato da", name: "rilasciato_da" },

                      { label: "Numero da Migrare1", name: "numero_da_migrare1" },
                      { label: "Codice di Migrazione1", name: "codice_di_migrazione1" },
                      { label: "Operatore Cedente1", name: "Operatore_Cedente1" },
                      { label: "Tipologia1", name: "tipologia1" },

                      { label: "Numero da Migrare2", name: "numero_da_migrare2" },
                      { label: "Codice di Migrazione2", name: "codice_di_migrazione2" },
                      { label: "Operatore Cedente2", name: "Operatore_Cedente2" },
                      { label: "Tipologia2", name: "tipologia2" },

                      { label: "Numero da Migrare3", name: "numero_da_migrare3" },
                      { label: "Codice di Migrazione3", name: "codice_di_migrazione3" },
                      { label: "Operatore Cedente3", name: "Operatore_Cedente3" },
                      { label: "Tipologia3", name: "tipologia3" },

                      { label: "Note", name: "note", type: "textarea" },
                      { label: "Data Pratica", name: "data_pratica", type: "date" },
                      { label: "Luogo Pratica", name: "luogo_pratica" },

                      { label: "N° ReVOIP1000", name: "n_revoip1000", type: "number", max: 999 },
                      { label: "N° ReVOIPCHAGG", name: "n_revoipchagg", type: "number", max: 999 },
                      { label: "Costo Attivazione (€)", name: "costo_attivazione", type: "number", step: "0.01", max: 999.99 },
                      { label: "Canone Mensile (€)", name: "canone_mensile", type: "number", step: "0.01", max: 999.99 },
                    ].map((field, index) => (
                      <Form.Group className="mb-3" key={index}>
                        <Form.Label>{field.label}</Form.Label>
                        <Form.Control
                          type={field.type || "text"}
                          name={field.name}
                          value={clientData?.[field.name] ?? ""}
                          onChange={handleInputChange}
                          as={field.type === "textarea" ? "textarea" : "input"}
                          disabled={!isEditing}
                          max={field.max}
                          step={field.step}
                        />
                      </Form.Group>
                    ))}

                    {!isEditing ? (
                      <Button variant="warning" onClick={() => setIsEditing(true)} className="me-2">
                        Modifica
                      </Button>
                    ) : (
                      <>
                        <Button variant="success" onClick={handleSaveChanges} className="me-2">
                          Salva
                        </Button>
                        <Button variant="secondary" onClick={handleCancelEdit} className="me-2">
                          Annulla
                        </Button>
                      </>
                    )}

                    <Button variant="danger" onClick={() => navigate("/homepage")}>
                      Torna alla Home
                    </Button>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default ClientDetail;
