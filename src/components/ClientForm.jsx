import React, { useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";
import Navbar2 from "./Navbar2";
import {
  Form,
  Button,
  Container,
  Row,
  Col,
  Alert,
  Spinner,
} from "react-bootstrap";

const ClientForm = () => {
  const [clientData, setClientData] = useState({
    nome: "",
    cognome: "",
    ragione_sociale: "",
    data_nascita: "",
    email: "",
    telefono: "",
    indirizzo: "",
    località: "",
    Provincia: "",
    cap: "",
    codice_fiscale: "",
    luogo_di_nascita: "",
    sdi_pec: "",
    numero_carta_identita: "",
    rilasciato_da: "",
    numero_da_migrare1: "",
    codice_di_migrazione1: "",
    Operatore_Cedente1: "",
    tipologia1: "",
    numero_da_migrare2: "",
    codice_di_migrazione2: "",
    Operatore_Cedente2: "",
    tipologia2: "",
    numero_da_migrare3: "",
    codice_di_migrazione3: "",
    Operatore_Cedente3: "",
    tipologia3: "",
    note: "",
    data_pratica: "",
    luogo_pratica: "",
    n_revoip1000: "",
    n_revoipchagg: "",
    costo_attivazione: "",
    canone_mensile: "",
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // ✅ Gestisce il cambiamento degli input nel form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setClientData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // ✅ Ottiene la data attuale in formato YYYY-MM-DD
  const getCurrentDate = () => new Date().toISOString().split("T")[0];

  // ✅ Invia il form al server
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    let data = { ...clientData };

    // 🔹 Converte numeri e decimali
    data.n_revoip1000 = parseInt(data.n_revoip1000) || 0;
    data.n_revoipchagg = parseInt(data.n_revoipchagg) || 0;
    data.costo_attivazione =
      parseFloat(data.costo_attivazione.replace(",", ".")) || 0.0;
    data.canone_mensile =
      parseFloat(data.canone_mensile.replace(",", ".")) || 0.0;

    console.log("📤 JSON inviato al server:", JSON.stringify(data, null, 2));

    try {
      const response = await fetch(
        "https://pdf.digiworks.it/backend/api/save_client.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );

      const result = await response.json();
      console.log("✅ Risposta dal server:", result);

      if (result.status === "success") {
        setSuccessMessage("✅ Cliente caricato con successo!");
        setErrorMessage("");
      } else {
        setErrorMessage(`❌ Errore: ${result.message}`);
        setSuccessMessage("");
      }
    } catch (error) {
      console.error("❌ Errore nella richiesta:", error);
      setErrorMessage("⚠️ Si è verificato un problema con il server.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar2 />
      <div
        className="min-vh-100 d-flex justify-content-center align-items-center mb-4 mt-4"
        style={{ background: "#305D57" }}
      >
        <Container style={{ marginTop: "80px" }}>
          <Row className="justify-content-center">
            <Col
              lg={6}
              className="bg-dark text-white p-5 rounded-start position-relative"
              style={{
                backgroundImage: `url(https://www.canva.com/design/DAGdw2zzz6Y/wecFPp0CunBJkW9Z27T9mg/edit?utm_content=DAGdw2zzz6Y&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton)`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            ></Col>

            <Col
              lg={6}
              className="bg-light p-5 rounded-end d-flex justify-content-center align-items-center shadow"
            >
              <div className="text-left w-100">
                <Link to="/homepage" className="text-dark mb-3 d-inline-block">
                  <FaArrowLeft /> Torna Indietro
                </Link>
                <h2 className="mb-4">Dati Cliente</h2>

                {successMessage && (
                  <Alert variant="success">{successMessage}</Alert>
                )}
                {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

                <Form onSubmit={handleSubmit}>
                  {Object.keys(clientData).map((key, index) => (
                    <Form.Group className="mb-3 row" key={index}>
                      <Form.Label className="col-sm-3">
                        {key.replace(/_/g, " ")}
                      </Form.Label>
                      <Col sm={9}>
                        <Form.Control
                          type={
                            ["data_nascita", "data_pratica"].includes(key)
                              ? "date"
                              : "text"
                          }
                          name={key}
                          value={clientData[key] || ""}
                          onChange={handleInputChange}
                          placeholder={`Inserisci ${key.replace(/_/g, " ")}`}
                        />
                      </Col>
                    </Form.Group>
                  ))}

                  <Form.Group className="mb-3">
                    <Button
                      variant="primary"
                      type="submit"
                      className="w-100"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                        />
                      ) : (
                        "Carica"
                      )}
                    </Button>
                  </Form.Group>
                  {successMessage && (
                    <Alert variant="success">{successMessage}</Alert>
                  )}
                  {errorMessage && (
                    <Alert variant="danger">{errorMessage}</Alert>
                  )}
                </Form>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default ClientForm;
