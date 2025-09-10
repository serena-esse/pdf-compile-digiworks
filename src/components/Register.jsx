//Registrazione

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar2 from "./Navbar2";

const Register = () => {
  const [utente, setUtente] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // Stato per memorizzare il messaggio di errore
  const navigate = useNavigate();

  const handleRegister = () => {
    // Logica per la registrazione
    const data = {
      action: "register",
      utente: utente,
      password: password,
    };

    fetch("https://pdf.digiworks.it/backend/register.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          console.log("Registrazione avvenuta con successo!");
          // Reindirizza l'utente alla pagina di login dopo la registrazione
          navigate("/login");
        } else {
          console.error("Errore durante la registrazione:", data.error);
          // Aggiorna il messaggio di errore
          if (data.error === "Utente già esistente") {
            setErrorMessage(
              "Il nome utente è già in uso. Per favore, scegli un altro nome utente."
            );
          } else {
            setErrorMessage(
              "Errore durante la registrazione. Per favore, riprova."
            );
          }
        }
      })
      .catch((error) => {
        console.error("Errore durante la registrazione:", error);
        // Gestisce altri errori, ad esempio, problemi di connessione
        setErrorMessage(
          "Errore di connessione. Per favore, riprova più tardi."
        );
      });
  };

  return (
    <>
      <Navbar2 />
      <div className="app">
        <main className="main" id="home">
          <div className="background">
            <div className="d-flex flex-column min-vh-100 justify-content-center align-items-center">
              <div className="container-lg">
                <div className="row justify-content-center align-items-center">
                  <div className="col-12 text-center form-container">
                    {errorMessage && (
                      <div className="alert-container">
                        <div
                          className="alert custom-alert alert-dismissible fade show"
                          role="alert"
                        >
                          {errorMessage}
                          <button
                            type="button"
                            className="btn-close"
                            aria-label="Close"
                            onClick={() => setErrorMessage("")}
                          ></button>
                        </div>
                      </div>
                    )}

                    <h2 className="mb-5 custom-welcome-text">Registrazione</h2>

                    <div className="mb-4">
                      <label htmlFor="utente">
                        <input
                          type="text"
                          placeholder="utente"
                          value={utente}
                          onChange={(e) => setUtente(e.target.value)}
                          className="p-3 border-0 bg-light"
                        />
                      </label>
                    </div>
                    <div className="mb-4">
                      <label htmlFor="password">
                        <input
                          type="password"
                          placeholder="Password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="p-3 border-0 bg-light"
                        />
                      </label>
                    </div>

                    <div className="mt-4 d-flex justify-content-center">
                      <button
                        onClick={handleRegister}
                        className="custom-button mr-2 px-3 py-2"
                      >
                        Registrati
                      </button>
                    </div>

                    <div className="additional-info mt-3">
                      <p>
                        <Link
                          to="/login"
                          className="password custom-welcome-text"
                          style={{ textDecoration: "none" }}
                        >
                          Hai già un account? Accedi qui.
                        </Link>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Register;
