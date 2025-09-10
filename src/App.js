import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

//css
import "../src/components/login.css";
import "../src/components/navbar.css";
import "../src/components/footer.css";
import "../src/components/homepage.css";
import "../src/components/register.css";

//import components
import Login from "../src/components/Login";
import Register from "./components/Register";
import Footer from "./components/Footer";
import HomePage from "./components/HomePage";
import ClientForm from "./components/ClientForm";
import ClientDetail from "./components/ClientDetail";
import ReVoip from "./components/ReVoip";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Register />} />
        <Route path="/homepage" element={<HomePage />} />
        <Route path="/clientform" element={<ClientForm />} />
        <Route path="/client/:id" element={<ClientDetail />} />
       
        <Route path="/revoip" element={<ReVoip />} />
        {/* Aggiungi altre rotte qui */}
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
