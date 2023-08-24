import { AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router";
import { toast, ToastContainer } from "react-toastify";
import BarraDoMenuLateral from "../../componentes/Home/BarraDoMenuLateral";
import Cabecalho from "../../componentes/Home/cabecalho";
import apiBack from "../../conexao/apiBackEnd";
import ContextoDeNavegacaoDaHome from "../../contexto/contextoDaNavegacao";
import ContextoDadosDoUsuario from "../../contexto/contextoDosDadosDoUsuario";
import useRastrearPresenca from "../../hooks/useRastrearPresenca";
import "../../index.css";
import CadastroDoClienteModal from "../../componentes/modais/CadastroDoCliente";
import ModalDeCobranca from "../../componentes/modais/configuraCobranca";
import ModalDeletarCobranca from "../../componentes/modais/deletarCobranca";
import ModalDetalheDaCobranca from "../../componentes/modais/detalheDaCobranca";
import AtualizarCadastroDoUsuarioModal from "../../componentes/modais/EditarUsuario/index";
import FiltrarLista from "../../componentes/modais/FiltrarLista";
import ModalDeEditarESair from "../../componentes/modais/modalDeEditarESair";
import {
  limparArmazenamentoDoLocalStorage,
  pegandoItemNoLocalStorage,
} from "../../utils/armazenamento";
import "./style.css";

export default function Home() {
  const redirecionar = useNavigate();
  const [idDoUsuarioASerDetalhado, setIdDoUsuarioASerDetalhado] = useState(0);
  const [idDaCobrancaASerDetalhado, setIdDaCobrancaASerDetalhado] = useState(0);
  const [listaDeClientes, setListaDeClientes] = useState([]);
  const [cobrancas, setCobrancas] = useState([]);
  const [listaTratada, setListaTratada] = useState([]);
  const [dadosDoDetalheDoCliente, setDadosDoDetalheDoCliente] = useState([]);
  const [abrirModalDeCobranca, setAbrirModalDeCobranca] = useState(false);
  const [listaCobrancasTratada, setListaCobrancasTratada] = useState(false);
  const [abrirPopup, setAbrirPopup] = useState(false);
  const [abrirModalDetalheDaCobranca, setAbrirModalDetalheDaCobranca] =
    useState(false);
  const [statusFiltroClientes, setStatusFiltroClientes] = useState(false);
  const [filtroDeCobrancasDaHome, setFiltroDeCobrancasDaHome] = useState(false);
  const [filtroDeClientesDaHome, setFiltroDeClientesDaHome] = useState(false);
  const [statusFiltroCobrancas, setStatusFiltroCobrancas] = useState(false);
  const [filtroAtivoClientes, setFiltroAtivoClientes] = useState(false);
  const [filtroAtivoCobrancas, setFiltroAtivoCobrancas] = useState(false);
  const [abrirEditarCliente, setAbrirEditarCliente] = useState(false);
  const [abrirModalFiltrarLista, setAbrirModalFiltrarLista] = useState(false);
  const [abrirModalCadastrarCliente, setAbrirModalCadastrarCliente] =
    useState(false);
  const [abrirModalAtualizarCadastro, setAbrirModalAtualizarCadastro] =
    useState(false);
  const [parametrosDoFiltroClientes, setParametrosDoFiltroClientes] =
    useState(false);
  const [abrirModalDeletarCobranca, setAbrirModalDeletarCobranca] =
    useState(false);
  const [buscarListaDeCliente, setBuscarListaDeCliente] = useState(false);
  const [
    escolherQualTipoDoModalDeCobranca,
    setEscolherQualTipoDoModalDeCobranca,
  ] = useState({
    tipoDoModal: false,
    idCobranca: "",
    nomeCliente: "",
  });
  const [parametrosDoFiltroCobrancas, setParametrosDoFiltroCobrancas] =
    useState({
      status: "",
      data: "",
    });
  const [dadosDoPerfilDoUsuario, setDadosDoPerfilDoUsuario] = useState({});
  const [cobrancaParaDelecao, setCobrancaParaDelecao] = useState({});

  async function bucandoDadosDoPerfilDoUsuario() {
    try {
      const { data } = await apiBack.get("/usuario/perfil");
      if (!data) {
        limparArmazenamentoDoLocalStorage();
      }
      setDadosDoPerfilDoUsuario(data.usuario);
    } catch (erro) {
      const statusCode = erro.response.status;
      if (statusCode === 401) {
        limparArmazenamentoDoLocalStorage();
        redirecionar("/");
        return;
      }
      limparArmazenamentoDoLocalStorage();
    }
  }
  async function buscarCobrancas() {
    try {
      const { data } = await apiBack.get("/cobrancas");
      setCobrancas(data);
      setListaCobrancasTratada(data);
    } catch (error) {
      if (error.status === 401) return limparArmazenamentoDoLocalStorage();
      toast.error("Oops, estamos com problemas internos!");
    }
  }

  const listarClientes = async () => {
    try {
      const { data } = await apiBack.get(`/clientes`);

      setListaDeClientes(data.clientes);
      setListaTratada(data.clientes);
    } catch (error) {
      if (error.status === 401) return limparArmazenamentoDoLocalStorage();
      toast.error("Oops, estamos com problemas internos!");
    }
  };

  const detalhaCliente = async () => {
    const id = idDoUsuarioASerDetalhado;
    if (!id) return;
    try {
      const { data } = await apiBack.get(`/cliente/detalhes/${id}`);
      setDadosDoDetalheDoCliente({ ...data, id });
    } catch (erro) {
      if (erro.response.status === 401)
        return limparArmazenamentoDoLocalStorage();
      toast.error(erro.response.data.mensagem);
    }
  };
  const token = pegandoItemNoLocalStorage("token");
  function verificandoToken() {
    if (!token) redirecionar("/");
  }
  useEffect(() => {
    verificandoToken();
  });

  useEffect(() => {
    detalhaCliente();
  }, [idDoUsuarioASerDetalhado]);

  useEffect(() => {
    listarClientes();
    setBuscarListaDeCliente(false);
  }, [buscarListaDeCliente]);

  useEffect(() => {
    buscarCobrancas();
    bucandoDadosDoPerfilDoUsuario();
  }, []);

  useRastrearPresenca();
  return (
    <ContextoDadosDoUsuario.Provider
      value={{
        dadosDoPerfilDoUsuario,
        setDadosDoPerfilDoUsuario,
        dadosDoDetalheDoCliente,
        setDadosDoDetalheDoCliente,
        listaDeClientes,
        setListaDeClientes,
        cobrancas,
        setCobrancas,
        setIdDoUsuarioASerDetalhado,
        listaTratada,
        setListaTratada,
        listaCobrancasTratada,
        setListaCobrancasTratada,
        statusFiltroCobrancas,
        setStatusFiltroCobrancas,
        statusFiltroClientes,
        setStatusFiltroClientes,
        filtroAtivoClientes,
        filtroAtivoCobrancas,
        setFiltroAtivoClientes,
        setFiltroAtivoCobrancas,
        filtroDeCobrancasDaHome,
        setFiltroDeCobrancasDaHome,
        filtroDeClientesDaHome,
        setFiltroDeClientesDaHome,
        parametrosDoFiltroCobrancas,
        setParametrosDoFiltroCobrancas,
        parametrosDoFiltroClientes,
        setParametrosDoFiltroClientes,
        idDaCobrancaASerDetalhado,
        setIdDaCobrancaASerDetalhado,
      }}
    >
      <ContextoDeNavegacaoDaHome.Provider
        value={{
          redirecionar,
          setAbrirPopup,
          abrirPopup,
          setAbrirModalAtualizarCadastro,
          abrirModalDeCobranca,
          setAbrirModalDeCobranca,
          abrirEditarCliente,
          setAbrirEditarCliente,
          abrirModalCadastrarCliente,
          setAbrirModalCadastrarCliente,
          escolherQualTipoDoModalDeCobranca,
          setEscolherQualTipoDoModalDeCobranca,
          abrirModalFiltrarLista,
          setAbrirModalFiltrarLista,
          abrirModalDeletarCobranca,
          setAbrirModalDeletarCobranca,
          cobrancaParaDelecao,
          setCobrancaParaDelecao,
          abrirModalDetalheDaCobranca,
          setAbrirModalDetalheDaCobranca,
          buscarListaDeCliente,
          setBuscarListaDeCliente,
        }}
      >
        <div className="home">
          <BarraDoMenuLateral />
          <div style={{ width: "10.7rem" }}></div>
          <div className="principal">
            <div className="caixa-do-cabecalho">
              <Cabecalho />
              <div className="divisor-cabecalho" />
            </div>
            <Outlet />
          </div>
          <AnimatePresence mode="wait">
            {abrirModalCadastrarCliente && <CadastroDoClienteModal />}
          </AnimatePresence>
          <AnimatePresence mode="wait">
            {abrirModalAtualizarCadastro && <AtualizarCadastroDoUsuarioModal />}
          </AnimatePresence>
          <AnimatePresence mode="wait">
            {abrirModalDeCobranca && <ModalDeCobranca />}
          </AnimatePresence>
          <AnimatePresence mode="wait">
            {abrirModalDetalheDaCobranca && <ModalDetalheDaCobranca />}
          </AnimatePresence>
          <AnimatePresence mode="wait">
            {abrirModalDeletarCobranca && <ModalDeletarCobranca />}
          </AnimatePresence>
          <AnimatePresence mode="wait">
            {abrirPopup && <ModalDeEditarESair />}
          </AnimatePresence>
          <AnimatePresence mode="wait">
            {abrirModalFiltrarLista && <FiltrarLista />}
          </AnimatePresence>
        </div>
        <ToastContainer
          hideProgressBar={true}
          closeOnClick={true}
          pauseOnHover={false}
          theme="colored"
          style={{ fontSize: "2rem" }}
        />
      </ContextoDeNavegacaoDaHome.Provider>
    </ContextoDadosDoUsuario.Provider>
  );
}
