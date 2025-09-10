// import React from "react";
// import { Page, Text, View, Document, StyleSheet, PDFViewer } from "@react-pdf/renderer";

// // Definisci gli stili per il documento PDF
// const styles = StyleSheet.create({
//   page: {
//     flexDirection: "column",
//     backgroundColor: "#E4E4E4",
//     padding: 20,
//   },
//   section: {
//     margin: 10,
//     padding: 10,
//     flexGrow: 1,
//   },
//   title: {
//     fontSize: 24,
//     textAlign: "center",
//     marginBottom: 20,
//   },
//   subtitle: {
//     fontSize: 18,
//     marginBottom: 10,
//   },
//   text: {
//     fontSize: 14,
//     textAlign: "justify",
//   },
//   label: {
//     fontSize: 14,
//     fontWeight: "bold",
//     marginTop: 10,
//   },
// });

// // Definisci il documento PDF
// const MyDocument = () => (
//   <Document>
//     <Page size="A4" style={styles.page}>
//       <View style={styles.section}>
//         <Text style={styles.title}>Richiesta NASPI</Text>
//       </View>
//       <View style={styles.section}>
//         <Text style={styles.subtitle}>Dati del Richiedente</Text>
//         <Text style={styles.label}>Nome:</Text>
//         <Text style={styles.text}>Mario Rossi</Text>
//         <Text style={styles.label}>Codice Fiscale:</Text>
//         <Text style={styles.text}>RSSMRA80A01H501Z</Text>
//         <Text style={styles.label}>Data di Nascita:</Text>
//         <Text style={styles.text}>01/01/1980</Text>
//         <Text style={styles.label}>Indirizzo:</Text>
//         <Text style={styles.text}>Via Roma 123, 00100 Roma (RM)</Text>
//       </View>
//       <View style={styles.section}>
//         <Text style={styles.subtitle}>Dati del Lavoro</Text>
//         <Text style={styles.label}>Ultimo Datore di Lavoro:</Text>
//         <Text style={styles.text}>Azienda XYZ S.p.A.</Text>
//         <Text style={styles.label}>Periodo di Lavoro:</Text>
//         <Text style={styles.text}>01/01/2015 - 31/12/2023</Text>
//         <Text style={styles.label}>Motivo della Cessazione:</Text>
//         <Text style={styles.text}>Licenziamento per giustificato motivo oggettivo</Text>
//       </View>
//       <View style={styles.section}>
//         <Text style={styles.subtitle}>Dichiarazione del Richiedente</Text>
//         <Text style={styles.text}>
//           Dichiaro di essere a conoscenza delle sanzioni penali previste in caso di dichiarazioni mendaci, formazione o
//           uso di atti falsi, richiamate dall'art. 76 del DPR 445/2000.
//         </Text>
//       </View>
//       <View style={styles.section}>
//         <Text style={styles.text}>Firma del Richiedente: ____________________________</Text>
//         <Text style={styles.text}>Data: ________________</Text>
//       </View>
//     </Page>
//   </Document>
// );

// // Componente principale che visualizza il PDF
// const PdfNaspi = () => (
//   <div style={{ width: "100vw", height: "100vh" }}>
//     <PDFViewer style={{ width: "100%", height: "100%" }}>
//       <MyDocument />
//     </PDFViewer>
//   </div>
// );

// export default PdfNaspi;

import React from "react";
import { Page, Text, View, Document, StyleSheet, PDFViewer } from "@react-pdf/renderer";
import { useLocation } from "react-router-dom";

// Definisci gli stili per il documento PDF
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#E4E4E4",
    padding: 20,
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    textAlign: "center",
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 10,
  },
  text: {
    fontSize: 14,
    textAlign: "justify",
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 10,
  },
});

// Definisci il documento PDF
const MyDocument = ({ cliente }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.title}>Richiesta NASPI</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.subtitle}>Dati del Richiedente</Text>
        <Text style={styles.label}>Nome:</Text>
        <Text style={styles.text}>{cliente.nome}</Text>
        <Text style={styles.label}>Cognome:</Text>
        <Text style={styles.text}>{cliente.cognome}</Text>
        <Text style={styles.label}>Codice Fiscale:</Text>
        <Text style={styles.text}>{cliente.codice_fiscale}</Text>
        <Text style={styles.label}>Data di Nascita:</Text>
        <Text style={styles.text}>{cliente.data_nascita}</Text>
        <Text style={styles.label}>Indirizzo:</Text>
        <Text style={styles.text}>{cliente.indirizzo}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.subtitle}>Dati del Lavoro</Text>
        <Text style={styles.label}>Ultimo Datore di Lavoro:</Text>
        <Text style={styles.text}>Azienda XYZ S.p.A.</Text>
        <Text style={styles.label}>Periodo di Lavoro:</Text>
        <Text style={styles.text}>01/01/2015 - 31/12/2023</Text>
        <Text style={styles.label}>Motivo della Cessazione:</Text>
        <Text style={styles.text}>Licenziamento per giustificato motivo oggettivo</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.subtitle}>Dichiarazione del Richiedente</Text>
        <Text style={styles.text}>
          Dichiaro di essere a conoscenza delle sanzioni penali previste in caso di dichiarazioni mendaci, formazione o
          uso di atti falsi, richiamate dall'art. 76 del DPR 445/2000.
        </Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.text}>Firma del Richiedente: ____________________________</Text>
        <Text style={styles.text}>Data: ________________</Text>
      </View>
    </Page>
  </Document>
);

// Componente principale che visualizza il PDF
const PdfNaspi = () => {
  const location = useLocation();
  const { cliente } = location.state;

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <PDFViewer style={{ width: "100%", height: "100%" }}>
        <MyDocument cliente={cliente} />
      </PDFViewer>
    </div>
  );
};

export default PdfNaspi;
