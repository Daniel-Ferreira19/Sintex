import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import logo from "../../Componentes/Menu/imagens/logo.png";
import seta from "../../Componentes/Login/imagens/seta.png";
import "./Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const adminStored = typeof window !== "undefined" ? localStorage.getItem("adminAccount") : null;
  const adminExists = !!adminStored;

  const handleLogin = (event) => {
    event.preventDefault();

    // Validação simples (depois você pode conectar com uma API)
    const storedAdmin = adminStored ? JSON.parse(adminStored) : null;

    if (storedAdmin && email === storedAdmin.email && senha === storedAdmin.password) {
      localStorage.setItem("userRole", "admin");
      const from = location.state && location.state.from ? location.state.from.pathname : "/admin";
      navigate(from, { replace: true });
      return;
    }

    // fallback: credenciais internas (só se nenhum admin cadastrado)
    if (!storedAdmin && email === "admin@sintex.com" && senha === "123456") {
      localStorage.setItem("userRole", "admin");
      const from = location.state && location.state.from ? location.state.from.pathname : "/admin";
      navigate(from, { replace: true });
      return;
    }

    if (email && senha) {
      alert("Login como cliente!");
      localStorage.setItem("userRole", "client");
      navigate("/client");
    } else {
      alert("Por favor, preencha todos os campos.");
    }
  };

  return (
    <div className="LoginContainer">
      <form className="LoginForm" onSubmit={handleLogin}>
        <div className="LoginLogoBox">
          <div className="BackLinkBox">
            <Link className="BackLink" to="/">
              <img src={seta} alt="Voltar para Home" />
            </Link>
            <img src={logo} alt="Sintex Logo" className="LoginLogo" />
          </div>
        </div>

        <h2>Entrar no Sintex</h2>

        <div className="InputGroup">
          <label htmlFor="email">E-mail</label>
          <input
            type="email"
            id="email"
            placeholder="seu-email@exemplo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="InputGroup">
          <label htmlFor="senha">Senha</label>
          <input
            type="password"
            id="senha"
            placeholder="Digite sua senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="LoginButton">Acessar</button>

        <div className="LoginFooter">
          <a href="#recuperar">Esqueceu a senha?</a>
          <span> <a type="button" className="HighlightLink" onClick={() => navigate('/register-admin', { state: { from: location.state && location.state.from } })}>
            Cadastre-se
          </a></span>
        </div>
      </form>
    </div>
  );
}