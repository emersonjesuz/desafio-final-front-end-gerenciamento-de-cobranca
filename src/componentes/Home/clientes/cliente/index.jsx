import { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { formatarCpf, formatarTelefone } from "../../../../utils/formatacao";
import alternaOrdemIcone from "../../../../assets/home/alterna-a-ordem-icone.svg";
import clienteIconePreto from "../../../../assets/home/cliente-icone-preto.svg";
import erroNaBusca from "../../../../assets/home/erro_na_busca.png";
import cobrancasCriarIcone from "../../../../assets/home/cobrancas-criar-icone.svg";
import filtroIcone from "../../../../assets/home/filtro-icone.svg";
import lupaDePesquisaIcone from "../../../../assets/home/lupa-de-pesquisa-icone.svg";
import ContextoDeNavegacaoDaHome from "../../../../contexto/contextoDaNavegacao";
import ContextoDadosDoUsuario from "../../../../contexto/contextoDosDadosDoUsuario";
import reordenarLista from "../../../../utils/reordenacao";
import useRastrearPresenca from "../../../../hooks/useRastrearPresenca";
import useLimparEstados from "../../../../hooks/useLimparEstados";
import "./style.css";

export default function PaginaDoCliente() {
  const {
    filtroAtivoClientes,
    setStatusFiltroClientes,
    listaDeClientes,
    setIdDoUsuarioASerDetalhado,
    listaTratada,
    setListaTratada,
    filtroDeClientesDaHome,
    setFiltroDeClientesDaHome,
    setFiltroAtivoClientes,
    setParametrosDoFiltroClientes,
  } = useContext(ContextoDadosDoUsuario);
  const {
    setAbrirModalDeCobranca,
    setAbrirModalCadastrarCliente,
    redirecionar,
    setEscolherQualTipoDoModalDeCobranca,
    setAbrirModalFiltrarLista,
    abrirModalFiltrarLista,
  } = useContext(ContextoDeNavegacaoDaHome);
  const [ordem, setOrdem] = useState("decrescente");
  const [pesquisa, setPesquisa] = useState("");
  const [listaFiltrada, setListaFiltrada] = useState("");

  useLimparEstados();
  useRastrearPresenca();

  function pesquisarClientes() {
    const inputNumero = Number(pesquisa);
    const inputMinusculo = pesquisa.toLowerCase();

    if (isNaN(inputNumero) && filtroAtivoClientes) {
      setListaTratada(
        listaFiltrada.filter(
          (cliente) =>
            cliente.nome.toLowerCase().startsWith(inputMinusculo) ||
            cliente.email.toLowerCase().startsWith(inputMinusculo)
        )
      );
    } else if (inputNumero && filtroAtivoClientes) {
      setListaTratada(
        listaFiltrada.filter((cliente) =>
          cliente.cpf.toString().startsWith(inputNumero)
        )
      );
    } else if (isNaN(inputNumero)) {
      setListaTratada(
        listaDeClientes.filter(
          (cliente) =>
            cliente.nome.toLowerCase().startsWith(inputMinusculo) ||
            cliente.email.toLowerCase().startsWith(inputMinusculo)
        )
      );
    } else if (inputNumero) {
      setListaTratada(
        listaDeClientes.filter((cliente) =>
          cliente.cpf.toString().startsWith(inputNumero)
        )
      );
    } else if (filtroAtivoClientes) {
      setListaTratada(listaFiltrada);
    } else {
      setListaTratada(listaDeClientes);
    }
  }

  useEffect(() => {
    if (filtroAtivoClientes) {
      setListaFiltrada(listaTratada);
    }
  }, []);

  useEffect(() => {
    document.querySelector("input[name='pesquisa']").value = "";
    setPesquisa("");

    if (filtroAtivoClientes) {
      setListaFiltrada(listaTratada);
    } else {
      setListaFiltrada(false);
    }
  }, [filtroAtivoClientes]);

  useEffect(() => {
    pesquisarClientes();
  }, [pesquisa, listaFiltrada]);

  useEffect(() => {
    if (!filtroDeClientesDaHome) {
      document.querySelector("input[name='pesquisa']").value = "";
      setPesquisa("");
      setListaTratada(listaDeClientes);
      setStatusFiltroClientes(false);
      setListaFiltrada(false);
      setFiltroAtivoClientes(false);
      setParametrosDoFiltroClientes(false);
    }
    setFiltroDeClientesDaHome(false);
  }, [listaDeClientes]);

  function formatarNome(nome) {
    const novoNome = nome.split(" ");
    return novoNome[0];
  }

  return (
    <motion.div
      key="pagina-listagem-cliente"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15, velocity: 1 }}
      className="container-pagina-cliente"
    >
      <div className="menu-do-cliente">
        <div className="titulo-do-menu-do-cliente">
          <img src={clienteIconePreto} alt="icone do perfil" />
          <h2>Clientes</h2>
        </div>
        <div className="caixa-do-menu-do-cliente">
          <div className="botao-de-adicionar-cliente">
            <button
              onClick={() => {
                setAbrirModalCadastrarCliente(true);
              }}
            >
              + Adicionar cliente
            </button>
          </div>
          <div className="botao-do-filtro-do-menu-do-cliente">
            <img
              src={filtroIcone}
              alt="icone de filtro"
              onClick={() => {
                if (!filtroAtivoClientes) {
                  setStatusFiltroClientes(false);
                }
                setAbrirModalFiltrarLista(!abrirModalFiltrarLista);
              }}
              style={{
                borderStyle: filtroAtivoClientes && "solid",
                borderColor: filtroAtivoClientes && "var(--cor-rosa)",
                borderWidth: filtroAtivoClientes && "3px",
              }}
            />
          </div>
          <div className="input-de-pesquisa-do-menu-do-cliente">
            <input
              type="text"
              placeholder="Pesquisa"
              name="pesquisa"
              onChange={(e) => setPesquisa(e.target.value)}
            />
            <img src={lupaDePesquisaIcone} alt="lupa de pesquisa" />
          </div>
        </div>
      </div>
      <div className="tabela-com-os-clientes-da-pagina-clientes">
        <div className="cabecalho-da-tabela-da-pagina-clientes">
          <div>
            <img
              src={alternaOrdemIcone}
              alt="icone para alterna a ordem"
              onClick={() =>
                reordenarLista(
                  "nome",
                  ordem,
                  setOrdem,
                  setListaTratada,
                  listaDeClientes,
                  listaFiltrada
                )
              }
            />
            <span>Cliente</span>
          </div>
          <div>
            <span>CPF</span>
          </div>
          <div>
            <span>E-mail</span>
          </div>
          <div>
            <span>Telefone</span>
          </div>
          <div>
            <span>Status</span>
          </div>
          <div>
            <span>Criar Cobrança</span>
          </div>
        </div>
        <div className="lista-da-tabela-da-pagina-clientes">
          {(() => {
            if (!listaTratada.length && !pesquisa && !filtroAtivoClientes) {
              return listaDeClientes.map((cliente) => (
                <div
                  key={cliente.id}
                  className="coluna-lista-da-tabela-da-pagina-de-cliente"
                >
                  <div>
                    <span
                      className="clientes-texto   nome-do-cliente"
                      onClick={() => {
                        setIdDoUsuarioASerDetalhado(cliente.id);
                        redirecionar(`clientes/detalhamento/${cliente.id}`);
                      }}
                    >
                      {formatarNome(cliente.nome)}
                    </span>
                  </div>
                  <div>
                    <span className="clientes-texto">
                      {formatarCpf(cliente.cpf)}
                    </span>
                  </div>
                  <div>
                    <span className="clientes-texto">{cliente.email}</span>
                  </div>
                  <div>
                    <span>{formatarTelefone(cliente.telefone)}</span>
                  </div>
                  <div>
                    <span
                      className={`${
                        cliente.status === "Em dia" ? "em-dia" : "inadimplente"
                      }`}
                    >
                      {cliente.status}
                    </span>
                  </div>
                  <div>
                    <img
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        setIdDoUsuarioASerDetalhado(cliente.id);
                        setAbrirModalDeCobranca(true);
                        setEscolherQualTipoDoModalDeCobranca({
                          tipoDoModal: true,
                          idCobranca: "",
                        });
                      }}
                      src={cobrancasCriarIcone}
                      alt="icone de criação de cobranças"
                    />
                  </div>
                </div>
              ));
            } else if (listaTratada && listaTratada.length > 0) {
              return listaTratada.map((cliente) => (
                <div
                  key={cliente.id}
                  className="coluna-lista-da-tabela-da-pagina-de-cliente"
                >
                  <div>
                    <span
                      className="clientes-texto   nome-do-cliente"
                      onClick={() => {
                        setIdDoUsuarioASerDetalhado(cliente.id);
                        redirecionar(`clientes/detalhamento/${cliente.id}`);
                      }}
                      onMouseOver={() => {
                        event.target.closest(
                          ".coluna-lista-da-tabela-da-pagina-de-cliente"
                        ).style.backgroundColor = "var(--cor-cinza-8)";
                      }}
                      onMouseOut={() => {
                        event.target.closest(
                          ".coluna-lista-da-tabela-da-pagina-de-cliente"
                        ).style.backgroundColor = "var(--cor-cinza-9)";
                      }}
                    >
                      {formatarNome(cliente.nome)}
                    </span>
                  </div>
                  <div>
                    <span className="clientes-texto">
                      {formatarCpf(cliente.cpf)}
                    </span>
                  </div>
                  <div>
                    <span className="clientes-texto">{cliente.email}</span>
                  </div>
                  <div>
                    <span>{formatarTelefone(cliente.telefone)}</span>
                  </div>
                  <div>
                    <span
                      className={`${
                        cliente.status === "Em dia" ? "em-dia" : "inadimplente"
                      }`}
                    >
                      {cliente.status}
                    </span>
                  </div>
                  <div>
                    <img
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        setIdDoUsuarioASerDetalhado(cliente.id);
                        setEscolherQualTipoDoModalDeCobranca({
                          tipoDoModal: true,
                          idCobranca: "",
                          nomeCliente: cliente.nome,
                        });
                        setAbrirModalDeCobranca(true);
                      }}
                      src={cobrancasCriarIcone}
                      alt="icone  de cobranças"
                    />
                  </div>
                </div>
              ));
            } else {
              return (
                <img
                  src={erroNaBusca}
                  alt="feedback para o usuário de que nenhum resultado foi encontrado"
                  className="feedback-erro-pesquisa-cliente"
                />
              );
            }
          })()}
        </div>
      </div>
    </motion.div>
  );
}
