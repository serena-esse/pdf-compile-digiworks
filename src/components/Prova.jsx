import React, { useState, useEffect } from "react";
import { Container, Table, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";

const Prova = () => {
  const [clienti, setClienti] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // RICHIESTA GET per recuperare tutti i clienti
  useEffect(() => {
    fetch("https://pdf.digiworks.it/backend/api/get_client.php")
      .then((response) => response.json())
      .then((data) => {
        if (data && Array.isArray(data.clienti)) {
          setClienti(data.clienti);
        } else {
          console.error(
            "La risposta dell'API non contiene un array di clienti:",
            data
          );
        }
      })
      .catch((error) =>
        console.error("Errore nel recupero dei clienti:", error)
      );
  }, []);

  const handlePdfClick = (cliente) => {
    // Naviga al componente PdfNaspi con i dati del cliente
    navigate("/pdf-naspi", { state: { cliente } });
  };

  return (
    <Container className="mt-5">
      <h2>Lista Clienti</h2>
      {error && <div className="alert alert-danger mt-3">{error}</div>}
      {clienti.length > 0 ? (
        <Table striped bordered hover className="mt-5">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Cognome</th>
              <th>Data di Nascita</th>
              <th>Indirizzo</th>
              <th>Codice Fiscale</th>
              <th>Data Pratica</th>
              <th>Azione</th>
            </tr>
          </thead>
          <tbody>
            {clienti.map((cliente, index) => (
              <tr key={index}>
                <td>{cliente.nome}</td>
                <td>{cliente.cognome}</td>
                <td>{cliente.data_nascita}</td>
                <td>{cliente.indirizzo}</td>
                <td>{cliente.codice_fiscale}</td>
                <td>{cliente.data_pratica}</td>
                <td>
                  <Button
                    variant="primary"
                    onClick={() => handlePdfClick(cliente)}
                  >
                    Pdf Naspi
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <div className="alert alert-info mt-3">Nessun cliente trovato.</div>
      )}
    </Container>
  );
};

export default Prova;
