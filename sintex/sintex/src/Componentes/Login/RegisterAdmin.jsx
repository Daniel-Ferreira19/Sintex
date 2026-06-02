import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import logo from "../../Componentes/Menu/imagens/logo.png";
import seta from "../../Componentes/Login/imagens/seta.png";
import "./Login.css";

export default function RegisterAdmin() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [restaurant, setRestaurant] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const handleRegister = (e) => {
    e.preventDefault();

    if (!email || !senha || !restaurant) {
      alert("Preencha todos os campos.");
      return;
    }

    const existing = localStorage.getItem("adminAccount");
    if (existing) {
      alert("Já existe um administrador cadastrado. Faça login.");
      navigate("/login");
      return;
    }

    const account = { email, password: senha, restaurant };
    localStorage.setItem("adminAccount", JSON.stringify(account));
    localStorage.setItem("userRole", "admin");

    // redireciona para a rota original protegida, se houver
    const from = location.state && location.state.from ? location.state.from.pathname : "/admin";
    navigate(from, { replace: true });
  };

  return (
    <div className="LoginContainer">
      <form className="LoginForm" onSubmit={handleRegister}>
        <div className="LoginLogoBox">
          <div className="BackLinkBox">
            <Link className="BackLink" onClick={() => navigate(-1)}>
              <img src={seta} alt="Voltar para Home" />
            </Link>
            <img src={logo} alt="Sintex Logo" className="LoginLogo" />
          </div>
        </div>

        <h2>Cadastrar Administrador</h2>

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

        <div className="InputGroup">
          <label htmlFor="restaurant">Restaurante</label>
          <input
            type="text"
            id="restaurant"
            placeholder="Nome / local do restaurante"
            value={restaurant}
            onChange={(e) => setRestaurant(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="LoginButton">Cadastrar</button>

        <div className="LoginFooter">
          <span>Após o cadastro você será redirecionado para o painel.</span>
        </div>
      </form>
    </div>
  );
}
