import { motion } from "framer-motion";
import { useContext, useEffect, useState } from "react";
import cobrancasIconePreto from "../../../../assets/home/cobrancas-icone-preto.svg";
import filtroIcone from "../../../../assets/home/filtro-icone.svg";
import erroNaBusca from "../../../../assets/home/erro_na_busca.png";
import lupaDePesquisaIcone from "../../../../assets/home/lupa-de-pesquisa-icone.svg";
import useRastrearPresenca from "../../../../hooks/useRastrearPresenca";
import Cobranca from "../Cobranca";
import alternaOrdemIcone from "../../../../assets/home/alterna-a-ordem-icone.svg";
import ContextoDadosDoUsuario from "../../../../contexto/contextoDosDadosDoUsuario";
import ContextoDeNavegacaoDaHome from "../../../../contexto/contextoDaNavegacao";
import useLimparEstados from "../../../../hooks/useLimparEstados";
import reordenarLista from "../../../../utils/reordenacao";
import "./style.css";

export default function ListagemCobrancas() {
  const {
    cobrancas,
    listaCobrancasTratada,
    filtroAtivoCobrancas,
    setListaCobrancasTratada,
    setStatusFiltroCobrancas,
    setParametrosDoFiltroCobrancas,
    filtroDeCobrancasDaHome,
    setFiltroDeCobrancasDaHome,
    setFiltroAtivoCobrancas,
  } = useContext(ContextoDadosDoUsuario);
  const { setAbrirModalFiltrarLista, abrirModalFiltrarLista } = useContext(
    ContextoDeNavegacaoDaHome
  );
  const [ordem, setOrdem] = useState("decrescente");
  const [pesquisa, setPesquisa] = useState("");
  const [listaFiltrada, setListaFiltrada] = useState(false);

  useRastrearPresenca();
  useLimparEstados();

  function pesquisarCobrancas() {
    const inputNumero = Number(pesquisa);
    const inputMinusculo = pesquisa.toLowerCase();

    if (isNaN(inputNumero) && filtroAtivoCobrancas) {
      setListaCobrancasTratada(
        listaFiltrada.filter((cobranca) =>
          cobranca.cliente.toLowerCase().startsWith(inputMinusculo)
        )
      );
    } else if (inputNumero && filtroAtivoCobrancas) {
      setListaCobrancasTratada(
        listaFiltrada.filter((cobranca) =>
          cobranca.id.toString().startsWith(inputNumero)
        )
      );
    } else if (isNaN(inputNumero)) {
      setListaCobrancasTratada(
        cobrancas.filter((cobranca) =>
          cobranca.cliente.toLowerCase().startsWith(inputMinusculo)
        )
      );
    } else if (inputNumero) {
      setListaCobrancasTratada(
        cobrancas.filter((cobranca) =>
          cobranca.id.toString().startsWith(inputNumero)
        )
      );
    } else if (filtroAtivoCobrancas) {
      setListaCobrancasTratada(listaFiltrada);
    } else {
      setListaCobrancasTratada(cobrancas);
    }
  }

  useEffect(() => {
    document.querySelector("input[name='pesquisa']").value = "";
    setPesquisa("");

    if (filtroAtivoCobrancas) {
      setListaFiltrada(listaCobrancasTratada);
    } else {
      setListaFiltrada(false);
    }
  }, [filtroAtivoCobrancas]);

  useEffect(() => {
    pesquisarCobrancas();
  }, [pesquisa, listaFiltrada]);

  useEffect(() => {
    if (filtroAtivoCobrancas) {
      setListaFiltrada(listaCobrancasTratada);
    }
  }, []);

  useEffect(() => {
    if (!filtroDeCobrancasDaHome) {
      document.querySelector("input[name='pesquisa']").value = "";
      setPesquisa("");
      setAbrirModalFiltrarLista(false);
      setListaCobrancasTratada(cobrancas);
      setListaFiltrada(false);
      setStatusFiltroCobrancas(false);
      setFiltroAtivoCobrancas(false);
      setParametrosDoFiltroCobrancas({
        status: "",
        data: "",
      });
    }
    setFiltroDeCobrancasDaHome(false);
  }, [cobrancas]);

  return (
    <motion.div
      key="listagem-de-cobrancas"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15, velocity: 1 }}
      className="container-pagina-cobrancas"
    >
      <div className="menu-de-cobrancas">
        <div className="titulo-cobrancas">
          <img src={cobrancasIconePreto} alt="icone da página de cobranças" />
          <h2>Cobranças</h2>
        </div>
        <div className="caixa-de-pesquisa-e-filtro">
          <div className="botao-do-filtro-do-menu-de-cobrancas">
            <img
              src={filtroIcone}
              alt="icone de filtro"
              onClick={() => {
                if (abrirModalFiltrarLista) {
                  setStatusFiltroCobrancas(false);
                }
                setAbrirModalFiltrarLista(!abrirModalFiltrarLista);
              }}
              style={{
                borderStyle: filtroAtivoCobrancas && "solid",
                borderColor: filtroAtivoCobrancas && "var(--cor-rosa)",
                borderWidth: filtroAtivoCobrancas && "3px",
                borderRadius: filtroAtivoCobrancas && "1.5rem",
              }}
            />
          </div>
          <div className="input-de-pesquisa-do-menu-de-cobrancas">
            <input
              type="text"
              aria-label
              placeholder="Pesquisa"
              name="pesquisa"
              onChange={(e) => setPesquisa(e.target.value)}
            />
            <img src={lupaDePesquisaIcone} alt="lupa de pesquisa" />
          </div>
        </div>
      </div>
      <table className="tabela-de-cobrancas">
        <thead className="colunas-da-tabela-de-cobrancas">
          <tr className="cabecalho-da-tabela-de-cobrancas">
            <th className="item-cobranca">
              <img
                src={alternaOrdemIcone}
                alt="icone para alternar a ordem de exibição"
                onClick={() =>
                  reordenarLista(
                    "cliente",
                    ordem,
                    setOrdem,
                    setListaCobrancasTratada,
                    cobrancas,
                    listaFiltrada
                  )
                }
              />
              <p>Cliente</p>
            </th>
            <th className="item-cobranca">
              <img
                src={alternaOrdemIcone}
                alt="icone para alternar a ordem de exibição"
                onClick={() =>
                  reordenarLista(
                    "id",
                    ordem,
                    setOrdem,
                    setListaCobrancasTratada,
                    cobrancas,
                    listaFiltrada
                  )
                }
              />
              <p>ID Cobr.</p>
            </th>
            <th className="item-cobranca valor-titulo">
              <p>Valor</p>
            </th>
            <th className="item-cobranca">
              <p>Data de venc.</p>
            </th>
            <th className="item-cobranca titulo-status-cobranca">
              <p>Status</p>
            </th>
            <th className="descricao-cobranca">
              <p>Descrição</p>
            </th>
          </tr>
        </thead>
        <tbody className="colunas-da-tabela-de-cobrancas corpo-da-tabela-de-cobrancas">
          {(() => {
            if (
              !listaCobrancasTratada.length > 0 &&
              !pesquisa &&
              !filtroAtivoCobrancas
            ) {
              return cobrancas.map((cobranca) => (
                <Cobranca
                  key={cobranca.id}
                  cliente={cobranca.cliente}
                  idCobranca={cobranca.id}
                  valor={cobranca.valor}
                  vencimento={cobranca.vencimento}
                  status={cobranca.status}
                  descricao={cobranca.descricao}
                />
              ));
            } else if (listaCobrancasTratada.length > 0) {
              return listaCobrancasTratada.map((cobranca) => (
                <Cobranca
                  key={cobranca.id}
                  cliente={cobranca.cliente}
                  idCobranca={cobranca.id}
                  valor={cobranca.valor}
                  vencimento={cobranca.vencimento}
                  status={cobranca.status}
                  descricao={cobranca.descricao}
                />
              ));
            } else {
              return (
                <tr style={{ height: "100%" }}>
                  <td style={{ height: "100%" }}>
                    <img
                      src={erroNaBusca}
                      alt="feedback para o usuário de que nenhum resultado foi encontrado"
                      className="feedback-erro-pesquisa-cobranca"
                    />
                  </td>
                </tr>
              );
            }
          })()}
        </tbody>
      </table>
    </motion.div>
  );
}
