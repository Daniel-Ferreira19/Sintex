import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import logo from "../../Componentes/Menu/imagens/logo.png";
import seta from "../../Componentes/Login/imagens/seta.png";
import "./Login.css";

// Esta página mostra o formulário de login para o administrador.
export default function Login() {
  // Guardamos o email e a senha que a pessoa digitou.
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mensagem, setMensagem] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // Quando apertar o botão, vamos tentar entrar com o email e a senha.
  const handleLogin = async (event) => {
  event.preventDefault();

  if (!email || !senha) {
    setMensagem("Por favor, preencha email e senha.");
    return;
  }

  try {
    const resposta = await fetch("/php/login.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password: senha,
      }),
    });

    const resultado = await resposta.json();

    if (!resultado.success) {
      setMensagem(resultado.message);
      return;
    }

    localStorage.setItem("userRole", "admin");

    const paginaAnterior =
      location.state?.from?.pathname || "/admin";

    navigate(paginaAnterior, { replace: true });

  } catch (erro) {
    console.error(erro);
    setMensagem("Erro ao conectar com o servidor.");
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

        {mensagem && <div className="LoginMessage">{mensagem}</div>}
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