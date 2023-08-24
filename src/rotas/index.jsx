import {
  Navigate,
  Outlet,
  Route,
  createBrowserRouter,
  createRoutesFromElements
} from "react-router-dom";
import { pegandoItemNoLocalStorage } from "../utils/armazenamento.js";
import Login from "../paginas/login/index.jsx";
import Home from "../paginas/home/index.jsx";
import ErroDeRotas from "../erroDeRota/index.jsx";
import Cadastro from "../paginas/cadastro/index.jsx";
import CardsDaHome from "../componentes/Home/home/cartoesDaHome";
import PaginaDoCliente from "../componentes/Home/clientes/cliente";
import ListagemCobrancas from "../componentes/Home/cobranças/ListagemCobrancas";
import DetalharCliente from "../componentes/Home/clientes/detalharCliente";

function ProtecaoDeRotas({ redirecionar }) {
  const estarAutenticado = pegandoItemNoLocalStorage("token");
  return estarAutenticado ? <Outlet /> : <Navigate to={redirecionar} />;
}
function RedirecionamentoComToken({ redirecionar }) {
  const estarAutenticado = pegandoItemNoLocalStorage("token");
  return !estarAutenticado ? <Outlet /> : <Navigate to={redirecionar} />;
}

export const Rotas = createBrowserRouter(createRoutesFromElements(
  <>
    <Route element={<RedirecionamentoComToken redirecionar={"/home"} />}>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/cadastro" element={<Cadastro />} />
    </Route>
    <Route element={<ProtecaoDeRotas redirecionar={"/"} />}>
      <Route path="/home" element={<Home />}>
        <Route index element={<CardsDaHome />} />
        <Route path="clientes" element={<PaginaDoCliente />} />
        <Route
          path="clientes/detalhamento/:idCliente"
          element={<DetalharCliente />}
        />
        <Route path="cobrancas" element={<ListagemCobrancas />} />
      </Route>
    </Route>
    <Route path="*" element={<ErroDeRotas />} />
  </>
))

export default Rotas