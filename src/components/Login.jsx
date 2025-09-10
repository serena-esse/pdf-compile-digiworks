//-----LOGIN----------

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar2 from "./Navbar2";

const LoginForm = () => {
  const [utente, setUtente] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    const data = {
      action: "login",
      utente: utente,
      password: password,
    };

    fetch("https://pdf.digiworks.it/backend/login.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          console.log("Login avvenuto con successo!");
          // Salva l'ID dell'utente nel local storage

          localStorage.setItem("userId", data.user_id);

          // Reindirizza l'utente alla home
          navigate("/homepage");
        } else {
          console.error("Errore durante il login:", data.error);
          // Gestisci gli errori di login, ad esempio, mostrare un messaggio di errore all'utente
        }
      })

      .catch((error) => {
        console.error("Errore durante il login:", error);
        // Gestisci altri errori, ad esempio, problemi di connessione
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
                    <h2 className="custom-welcome-text mb-5">Welcome!</h2>
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
                        onClick={handleLogin}
                        className="custom-button mr-2 px-3 py-2"
                      >
                        Accedi
                      </button>
                      <Link
                        to="/"
                        className="custom-button px-3 py-2"
                        style={{ textDecoration: "none" }}
                      >
                        Registrati
                      </Link>
                    </div>
                    <div className="additional-info mt-3">
                      {/* per inserire in futuro recupera password */}
                      {/* <p>
                        <a href="#" className="password custom-welcome-text">
                          Password dimenticata?
                        </a>
                      </p> */}
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

export default LoginForm;
