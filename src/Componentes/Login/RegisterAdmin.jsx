import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import logo from "../../Componentes/Menu/imagens/logo.png";
import seta from "../../Componentes/Login/imagens/seta.png";
import "./Login.css";

// Esta página mostra o formulário para criar o primeiro administrador.
export default function RegisterAdmin() {
  // Aqui guardamos o email, a senha e o nome do restaurante.
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [restaurant, setRestaurant] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.email) setEmail(location.state.email);
    if (location.state?.password) setSenha(location.state.password);
  }, [location.state]);

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!email || !senha || !restaurant) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    try {
      // Enviamos os dados para o PHP salvar no banco.
      const response = await fetch("/php/register.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: senha, restaurant }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        if (data.status === "admin_already_exists") {
          alert(data.message);
          navigate("/login", { replace: true });
          return;
        }

        alert(data.message || "Erro ao cadastrar administrador.");
        return;
      }

      localStorage.setItem("userRole", "admin");
      const from = location.state && location.state.from ? location.state.from.pathname : "/admin";
      navigate(from, { replace: true });
    } catch (error) {
      console.error(error);
      alert("Erro ao conectar com o servidor. Tente novamente mais tarde.");
    }
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
