<<<<<<< HEAD
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router";
=======
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router-dom";
>>>>>>> cb53c9c (Victor: parte do cabeçalho e organização suave de cores)
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
<<<<<<< HEAD
  <StrictMode>
    <BrowseRouter>
      <App />
    </BrowseRouter>
  </StrictMode>,
)
=======
  <BrowserRouter> 
    <App />
  </BrowserRouter>
)
>>>>>>> cb53c9c (Victor: parte do cabeçalho e organização suave de cores)
