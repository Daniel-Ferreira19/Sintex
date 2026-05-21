import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import MenuLink from "../MenuLink/MenuLink";
import "./Menu.css";
import logo from "./imagens/logo.png";

// Menu principal com links e busca de restaurantes.
export default function Menu() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const initialSearch = params.get("q") || "";
  const [searchTerm, setSearchTerm] = useState(initialSearch);

  const handleSearch = (event) => {
    event.preventDefault();
    const query = searchTerm.trim();
    // Envia o usuário para a página do cliente com o termo de busca.
    if (query) {
      navigate(`/client?q=${encodeURIComponent(query)}`);
    } else {
      navigate("/client");
    }
  };

  return (
    <nav className="Menu">
      <div className="MenuLogo">
        <img src={logo} alt="Sintex Logo" className="MenuLogoImage" />
      </div>  
      <div className="MenuLinks">
        <MenuLink to="/">Home</MenuLink>
        <MenuLink to="/about">About</MenuLink>
        <MenuLink to="/admin">Administrador</MenuLink>
        <MenuLink to="/client">Cliente</MenuLink>
      </div>

      <form className="MenuSearch" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Buscar restaurante"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />
        <button type="submit">Buscar</button>
      </form>
    </nav>
  );
}