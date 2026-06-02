import { Link } from 'react-router-dom';
import './About.css';

export default function About() {
  return (
    <div className="about-container">
      <header className="about-header">
        <h1>About Sintex</h1>
        <p>Sistema Integrado de Tecnologia e Experiência</p>
      </header>

      <section className="about-content">
        <h2>Quem somos</h2>
        <p>
          O <strong>Sintex</strong> é um projeto desenvolvido com o objetivo de
          integrar tecnologia, inovação e praticidade, oferecendo soluções
          digitais modernas e acessíveis.
        </p>

        <h2>Missão</h2>
        <p>
          Nossa missão é criar aplicações eficientes, intuitivas e seguras,
          contribuindo para o aprendizado e o desenvolvimento tecnológico.
        </p>

        <h2>Visão</h2>
        <p>
          Ser um projeto de referência em organização, usabilidade e boas
          práticas de desenvolvimento.
        </p>
      </section>

      <section className="developers-section">
        <h2>Desenvolvedores</h2>
        <p className="developers-subtitle">Conheça a equipe por trás do Sintex</p>
        
        <div className="developers-grid">
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="developer-card">
            <div className="developer-icon">👨‍💻</div>
            <h3>Desenvolvedor 1</h3>
            <p>Frontend Developer</p>
            <span className="github-link">GitHub Profile →</span>
          </a>
          
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="developer-card">
            <div className="developer-icon">👩‍💻</div>
            <h3>Desenvolvedor 2</h3>
            <p>Backend Developer</p>
            <span className="github-link">GitHub Profile →</span>
          </a>
          
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="developer-card">
            <div className="developer-icon">👨‍💻</div>
            <h3>Desenvolvedor 3</h3>
            <p>Full Stack Developer</p>
            <span className="github-link">GitHub Profile →</span>
          </a>
        </div>
      </section>
    </div>
  );
}