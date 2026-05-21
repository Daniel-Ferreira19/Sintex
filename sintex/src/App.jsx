<<<<<<< HEAD
import { Routes, Route } from "react-router";
export default function App() {
  return (
     <Routes>
      <Route path="/" element={<App />} />
    </Routes>
=======
import { Routes, Route } from "react-router-dom";
import Home from "./Pages/Home/Home";
import About from "./Pages/About/About";
import Admin from "./Pages/Admin/Admin";
import Client from "./Pages/Client/Client";
import Menu from "./Componentes/Menu/Menu";
import LayoutMenu from "./Pages/LayoutMenu/LayoutMenu";
import PaginaDeErro from "./PaginaDeErro/paginaderro";
export default function App() {
  return (
    <>
      <Menu />
      <Routes>
        <Route path="/" element={<LayoutMenu />}>
          <Route path="client" element={<Client />} />
          <Route index element={<Home />} />
        </Route>

        <Route path="admin" element={<Admin />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<PaginaDeErro />} />
      </Routes>

    </>
>>>>>>> cb53c9c (Victor: parte do cabeçalho e organização suave de cores)
  )
}