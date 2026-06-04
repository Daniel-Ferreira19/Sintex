import { Link } from 'react-router-dom';
import './About.css';
import daniel from './fotos/daniel.jpg';
import victor from './fotos/barcelos.jpg';
import layanne from './fotos/layanne.jpg';

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
          <a href="https://github.com/barcelos00" target="_blank" rel="noopener noreferrer" className="developer-card">
            <div className="developer-icon"> <img src={victor} alt="victor" /> </div>
            <h3>Victor Barcelos</h3>
            <p>Full Stack Developer</p>
            <span className="github-link">GitHub Profile →</span>
          </a>
          
          <a href="https://github.com/Daniel-Ferreira19" target="_blank" rel="noopener noreferrer" className="developer-card">
            <div className="developer-icon"> <img src={daniel} alt="daniel" /> </div>
            <h3>Daniel Ferreira</h3>
            <p>Full Stack Developer</p>
            <span className="github-link">GitHub Profile →</span>
          </a>
          
          <a href="https://github.com/layannesousa2025" target="_blank" rel="noopener noreferrer" className="developer-card">
            <div className="developer-icon"> <img src={layanne} alt="layanne" /> </div>
            <h3>Layanne Sousa</h3>
            <p>Full Stack Developer</p>
            <span className="github-link">GitHub Profile →</span>
          </a>
        </div>
      </section>
    </div>
  );
}