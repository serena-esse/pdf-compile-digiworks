import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { PDFDocument } from "pdf-lib";
import { saveAs } from "file-saver";
import Navbar2 from "./Navbar2";
import { Container, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFilePdf,
  faDownload,
  faEye,
} from "@fortawesome/free-solid-svg-icons";

const fillPdf = async (client, setPreviewUrl) => {
  try {
    console.log("📥 Dati cliente ricevuti per il PDF:", client); // DEBUG

    const response = await fetch(
      "https://pdf.digiworks.it/Condizioni_generali_REVOIP.pdf"
    );
    if (!response.ok) {
      throw new Error(`Errore HTTP! Stato: ${response.status}`);
    }
    const existingPdfBytes = await response.arrayBuffer();
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const form = pdfDoc.getForm();

    const costoAttivazioneNum = parseFloat(client.costo_attivazione) || 0;
    const canoneMensileNum = parseFloat(client.canone_mensile) || 0;

    const formatDate = (date) => {
      if (!date || date === "0000-00-00") return ""; // Se è null o non valida, ritorna stringa vuota
      const [year, month, day] = date.split("-"); // Divide la data in parti
      return `${day}-${month}-${year}`; // Ritorna nel formato DD-MM-YYYY
    };
    const campoMap = {
      Ragione_Sociale: client.ragione_sociale || "Non disponibile",
      Nome: (client.nome || "") + " " + (client.cognome || ""),
      Comune_di_nascita: client.luogo_di_nascita || "Non disponibile",
      Indirizzo_sede_legale: client.indirizzo || "Non disponibile",
      Città: client.località || "Non disponibile",
      Prov: client.Provincia || "Non disponibile",
      CAP: client.cap || "00000",
      p_iva: client.codice_fiscale || "N/A",
      Telefono: client.telefono || "N/A",
      Indirizzo_email: client.email || "N/A",
      SDI_Pec: client.sdi_pec || "N/A",
      Carta_Identita: client.numero_carta_identita || "N/A",
      Data_di_nascita: formatDate(client.data_nascita),
      Codice_di_Migrazione1: client.codice_di_migrazione1 || "",
      Codice_di_Migrazione2: client.codice_di_migrazione2 || "",
      Codice_di_Migrazione3: client.codice_di_migrazione3 || "",
      Numero_da_Migrare1: client.numero_da_migrare1 || "",
      Numero_da_Migrare2: client.numero_da_migrare2 || "",
      Numero_da_Migrare3: client.numero_da_migrare3 || "",
      Operatore_Cedente1: client.Operatore_Cedente1 || "",
      Operatore_Cedente2: client.Operatore_Cedente2 || "",
      Operatore_Cedente3: client.Operatore_Cedente3 || "",
      Tipologia1: client.tipologia1 || "",
      Tipologia2: client.tipologia2 || "",
      Tipologia3: client.tipologia3 || "",
      NOTE: client.note || "",
      LUOGO: client.luogo_pratica || "",
      LUOGO_2: client.luogo_pratica || "",
      LUOGO_3: client.luogo_pratica || "",
      Luogo: client.luogo_pratica || "",
      DATA: formatDate(client.data_pratica),
      DATA_2: formatDate(client.data_pratica),
      DATA_3: formatDate(client.data_pratica),
      Data: formatDate(client.data_pratica),
      Rilasciato_da: client.rilasciato_da || "",
      N_ReVOIP1000: client.n_revoip1000?.toString() || "",
      N_ReVOIPCHAGG: client.n_revoipchagg?.toString() || "",
      Costo_Attivazione: ` ${costoAttivazioneNum.toFixed(2)}`,
      Canone_Mensile: ` ${canoneMensileNum.toFixed(2)}`,
    };

    Object.keys(campoMap).forEach((campo) => {
      const field = form.getTextField(campo);
      if (field) {
        field.setText(campoMap[campo]);
      } else {
        console.warn(`Campo non trovato nel PDF: ${campo}`);
      }
    });

    form.flatten();
    const pdfBytes = await pdfDoc.save();
    const pdfBlob = new Blob([pdfBytes], { type: "application/pdf" });
    const previewUrl = URL.createObjectURL(pdfBlob);
    setPreviewUrl(previewUrl);
  } catch (error) {
    console.error(
      "❌ Errore durante il caricamento o la lettura del PDF:",
      error
    );
    alert("⚠️ Si è verificato un problema nella generazione del PDF.");
  }
};

const ReVoip = () => {
  const location = useLocation();
  const { client } = location.state;
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleDownload = () => {
    if (previewUrl) {
      fetch(previewUrl)
        .then((res) => res.blob())
        .then((blob) => saveAs(blob, "Condizioni_generali_REVOIP.pdf"));
    }
  };

  return (
    <>
      <Navbar2 />
      <div className="bg-light py-5" style={{ minHeight: "100vh" }}>
        <Container className="text-center" style={{ marginTop: "200px" }}>
          <FontAwesomeIcon
            icon={faFilePdf}
            size="4x"
            className="mb-4"
            style={{ color: "#305e8b" }}
          />
          <h1 style={{ marginTop: "20px" }}>Genera PDF</h1>
          <p className="lead mb-5">
            Visualizza e scarica il PDF compilato per il cliente selezionato.
          </p>
          <Button
            style={{ backgroundColor: "#305e8b", borderColor: "#305e8b" }}
            onClick={() => fillPdf(client, setPreviewUrl)}
          >
            <FontAwesomeIcon icon={faEye} className="me-2" />
            Visualizza Anteprima PDF
          </Button>

          {previewUrl && (
            <>
              <div style={{ marginTop: "20px", marginBottom: "20px" }}>
                <iframe
                  src={previewUrl}
                  width="100%"
                  height="600px"
                  style={{ border: "1px solid #305e8b" }}
                  title="Anteprima PDF"
                ></iframe>
              </div>
              <Button
                style={{ backgroundColor: "#305e8b", borderColor: "#305e8b" }}
                onClick={handleDownload}
              >
                <FontAwesomeIcon icon={faDownload} className="me-2" />
                Scarica PDF
              </Button>
            </>
          )}
        </Container>
      </div>
    </>
  );
};

export default ReVoip;
