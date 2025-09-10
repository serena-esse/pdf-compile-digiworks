import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Alert,
} from "react-bootstrap";
import Navbar2 from "./Navbar2";

const ClientDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [clientData, setClientData] = useState(location.state?.client || {});
  const [originalData, setOriginalData] = useState(clientData);
  const [isEditing, setIsEditing] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // ✅ Funzione per caricare i dati aggiornati dal server
  const fetchClientData = async () => {
    try {
      const response = await fetch(
        `https://pdf.digiworks.it/backend/api/get_client.php?id=${clientData.id}`
      );
      const result = await response.json();
      if (result.status === "success") {
        setClientData(result.client); // ✅ Aggiorna lo stato con i dati aggiornati
        setOriginalData(result.client);
      } else {
        setErrorMessage("❌ Errore nel recupero dati: " + result.message);
      }
    } catch (error) {
      setErrorMessage("⚠️ Errore di connessione al server.");
    }
  };

  // ✅ Effettua il fetch automatico al caricamento della pagina
  useEffect(() => {
    fetchClientData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setClientData({ ...clientData, [name]: value });
  };

  const handleSaveChanges = async () => {
    try {
      const response = await fetch(
        "https://pdf.digiworks.it/backend/api/update_client.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(clientData),
        }
      );

      const result = await response.json();
      if (result.status === "success") {
        setSuccessMessage("✅ Dati aggiornati con successo!");
        setErrorMessage("");
        setIsEditing(false);

        // ✅ Ricarica i dati aggiornati dopo il salvataggio
        fetchClientData();
      } else {
        setErrorMessage("❌ Errore nell'aggiornamento: " + result.message);
        setSuccessMessage("");
      }
    } catch (error) {
      setErrorMessage("⚠️ Errore di connessione al server.");
    }
  };

  const handleCancelEdit = () => {
    setClientData(originalData);
    setIsEditing(false);
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
                <Card.Header
                  style={{ backgroundColor: "#305e8b", color: "white" }}
                >
                  <Card.Title>
                    {clientData.nome} {clientData.cognome}
                  </Card.Title>
                </Card.Header>
                <Card.Body>
                  {successMessage && (
                    <Alert variant="success">{successMessage}</Alert>
                  )}
                  {errorMessage && (
                    <Alert variant="danger">{errorMessage}</Alert>
                  )}

                  <Form>
                    {[
                      { label: "Ragione Sociale", name: "ragione_sociale" },
                      { label: "Nome", name: "nome" },
                      { label: "Cognome", name: "cognome" },
                      { label: "Luogo di Nascita", name: "luogo_di_nascita" },
                      {
                        label: "Data di Nascita",
                        name: "data_nascita",
                        type: "date",
                      },
                      { label: "Indirizzo", name: "indirizzo" },
                      { label: "Località", name: "località" },
                      { label: "Provincia", name: "Provincia" },
                      { label: "CAP", name: "cap" },
                      { label: "Telefono", name: "telefono" },
                      {
                        label: "Codice Fiscale/Partita IVA",
                        name: "codice_fiscale",
                      },
                      { label: "Email", name: "email", type: "email" },
                      { label: "SDI/Pec", name: "sdi_pec" },
                      {
                        label: "Numero Carta d'Identità",
                        name: "numero_carta_identita",
                      },
                      { label: "Rilasciato da", name: "rilasciato_da" },
                      {
                        label: "Numero da Migrare1",
                        name: "numero_da_migrare1",
                      },
                      {
                        label: "Codice di Migrazione1",
                        name: "codice_di_migrazione1",
                      },
                      {
                        label: "Operatore Cedente1",
                        name: "Operatore_Cedente1",
                      },
                      { label: "Tipologia1", name: "tipologia1" },
                      {
                        label: "Numero da Migrare2",
                        name: "numero_da_migrare2",
                      },
                      {
                        label: "Codice di Migrazione2",
                        name: "codice_di_migrazione2",
                      },
                      {
                        label: "Operatore Cedente2",
                        name: "Operatore_Cedente2",
                      },
                      { label: "Tipologia2", name: "tipologia2" },
                      {
                        label: "Numero da Migrare3",
                        name: "numero_da_migrare3",
                      },
                      {
                        label: "Codice di Migrazione3",
                        name: "codice_di_migrazione3",
                      },
                      {
                        label: "Operatore Cedente3",
                        name: "Operatore_Cedente3",
                      },
                      { label: "Tipologia3", name: "tipologia3" },
                      { label: "Note", name: "note", type: "textarea" },
                      {
                        label: "Data Pratica",
                        name: "data_pratica",
                        type: "date",
                      },
                      { label: "Luogo Pratica", name: "luogo_pratica" },
                      {
                        label: "N° ReVOIP1000",
                        name: "n_revoip1000",
                        type: "number",
                        max: 999,
                      },
                      {
                        label: "N° ReVOIPCHAGG",
                        name: "n_revoipchagg",
                        type: "number",
                        max: 999,
                      },
                      {
                        label: "Costo Attivazione (€)",
                        name: "costo_attivazione",
                        type: "number",
                        step: "0.01",
                        max: 999.99,
                      },
                      {
                        label: "Canone Mensile (€)",
                        name: "canone_mensile",
                        type: "number",
                        step: "0.01",
                        max: 999.99,
                      },
                    ].map((field, index) => (
                      <Form.Group className="mb-3" key={index}>
                        <Form.Label>{field.label}</Form.Label>
                        <Form.Control
                          type={field.type || "text"}
                          name={field.name}
                          value={clientData[field.name] || ""}
                          onChange={handleInputChange}
                          as={field.type === "textarea" ? "textarea" : "input"}
                          disabled={!isEditing}
                          max={field.max}
                          step={field.step}
                        />
                      </Form.Group>
                    ))}

                    {!isEditing ? (
                      <Button
                        variant="warning"
                        onClick={() => setIsEditing(true)}
                        className="me-2"
                      >
                        Modifica
                      </Button>
                    ) : (
                      <>
                        <Button
                          variant="success"
                          onClick={handleSaveChanges}
                          className="me-2"
                        >
                          Salva
                        </Button>
                        <Button
                          variant="secondary"
                          onClick={handleCancelEdit}
                          className="me-2"
                        >
                          Annulla
                        </Button>
                      </>
                    )}

                    <Button
                      variant="danger"
                      onClick={() => navigate("/homepage")}
                    >
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
