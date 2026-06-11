import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import logo from "../../Componentes/Menu/imagens/logo.png";
import seta from "../../Componentes/Login/imagens/seta.png";
import "./Login.css";

export default function RegisterAdmin() {
  const routeState = useLocation().state || {};
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: routeState.email || "",
    senha: routeState.password || "",
    restaurant: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Garçom calibrado para bater na rota externa do Apache
      const response = await fetch("http://localhost/sintex-api/register.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.senha,      // 'password' casa com o PHP
          restaurant: formData.restaurant // 'restaurant' casa com o PHP
        }),
      });

      const result = await response.json();

      if (!result.success) {
        alert(result.message);
        if (result.status === "admin_already_exists") {
          navigate("/login", { replace: true });
        }
        return;
      }

      // Cadastro concluído com sucesso!
      alert(result.message);
      localStorage.setItem("userRole", "admin");
      navigate(routeState.from?.pathname || "/admin", { replace: true });

    } catch (error) {
      alert("Erro ao conectar com o servidor local.");
    }
  };

  return (
    <div className="LoginContainer">
      <form className="LoginForm" onSubmit={handleSubmit}>
        <div className="LoginLogoBox">
          <div className="BackLinkBox">
            <Link className="BackLink" onClick={() => navigate(-1)}><img src={seta} alt="Voltar" /></Link>
            <img src={logo} alt="Sintex Logo" className="LoginLogo" />
          </div>
        </div>

        <h2>Cadastrar Administrador</h2>

        <div className="InputGroup">
          <label>E-mail</label>
          <input name="email" type="email" value={formData.email} onChange={handleChange} required />
        </div>

        <div className="InputGroup">
          <label>Senha</label>
          <input name="senha" type="password" value={formData.senha} onChange={handleChange} required />
        </div>

        <div className="InputGroup">
          <label>Restaurante</label>
          <input name="restaurant" type="text" value={formData.restaurant} onChange={handleChange} required />
        </div>

        <button type="submit" className="LoginButton">Cadastrar</button>
      </form>
    </div>
  );
}












