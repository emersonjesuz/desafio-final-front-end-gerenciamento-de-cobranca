import { motion } from "framer-motion";
import { useContext } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import bolhaVerdeDeConfirma from "../../../assets/cadastro/bolha-verde-confirmacao.svg";
import setaBranca from "../../../assets/modal/seta-do-modal-icone.svg";
import ContextoDeNavegacaoDaHome from "../../../contexto/contextoDaNavegacao";
import ContextoDadosDoUsuario from "../../../contexto/contextoDosDadosDoUsuario";
import useRastrearPresenca from "../../../hooks/useRastrearPresenca";
import { formatarDataComparacao } from "../../../utils/formatacao";
import "./style.css";

export default function FiltrarLista() {
  const { setAbrirModalFiltrarLista } = useContext(ContextoDeNavegacaoDaHome);
  const {
    statusFiltroCobrancas,
    setStatusFiltroCobrancas,
    statusFiltroClientes,
    cobrancas,
    setListaCobrancasTratada,
    listaDeClientes,
    setListaTratada,
    setStatusFiltroClientes,
    setFiltroDeCobrancasDaHome,
    setFiltroDeClientesDaHome,
    setFiltroAtivoClientes,
    setFiltroAtivoCobrancas,
    parametrosDoFiltroCobrancas,
    setParametrosDoFiltroCobrancas,
    parametrosDoFiltroClientes,
    setParametrosDoFiltroClientes,
  } = useContext(ContextoDadosDoUsuario);
  const localizacao = useLocation().pathname;

  function filtrarLista() {
    event.preventDefault();
    event.stopPropagation();

    if (localizacao === "/home/cobrancas") {
      if (
        parametrosDoFiltroCobrancas.status === "" &&
        parametrosDoFiltroCobrancas.data === ""
      ) {
        return toast.error("Selecione ao menos um parâmetro de filtragem");
      }

      setFiltroAtivoCobrancas(true);
      if (
        parametrosDoFiltroCobrancas.status !== "" &&
        parametrosDoFiltroCobrancas.data !== ""
      ) {
        if (parametrosDoFiltroCobrancas.status === "pendente") {
          setListaCobrancasTratada(
            cobrancas.filter(
              (cobranca) =>
                formatarDataComparacao(cobranca.vencimento) ===
                parametrosDoFiltroCobrancas.data &&
                (cobranca.status === "pendente" ||
                  cobranca.status === "vencida")
            )
          );
        } else {
          setListaCobrancasTratada(
            cobrancas.filter(
              (cobranca) =>
                cobranca.status === parametrosDoFiltroCobrancas.status &&
                formatarDataComparacao(cobranca.vencimento) ===
                parametrosDoFiltroCobrancas.data
            )
          );
        }
      } else if (parametrosDoFiltroCobrancas.status !== "") {
        if (parametrosDoFiltroCobrancas.status === "pendente") {
          setListaCobrancasTratada(
            cobrancas.filter(
              (cobranca) =>
                cobranca.status === "pendente" || cobranca.status === "vencida"
            )
          );
        } else {
          setListaCobrancasTratada(
            cobrancas.filter(
              (cobranca) =>
                cobranca.status === parametrosDoFiltroCobrancas.status
            )
          );
        }
      } else if (parametrosDoFiltroCobrancas.data !== "") {
        setListaCobrancasTratada(
          cobrancas.filter(
            (cobranca) =>
              formatarDataComparacao(cobranca.vencimento) ===
              parametrosDoFiltroCobrancas.data
          )
        );
      }
    } else {
      if (!parametrosDoFiltroClientes) {
        return toast.error("Selecione ao menos um parâmetro de filtragem");
      }

      setFiltroAtivoClientes(true);
      setListaTratada(
        listaDeClientes.filter(
          (cliente) => cliente.status === parametrosDoFiltroClientes.status
        )
      );
    }

    toast.dismiss();
    setAbrirModalFiltrarLista(false);
  }

  useRastrearPresenca();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15, velocity: 1 }}
      key="reordenar-lista"
      className="container-do-modal-de-reordenar-lista"
      style={{ height: localizacao === "/home/clientes" && "28rem" }}
    >
      <form className="opcoes-do-filtro" onSubmit={filtrarLista}>
        {localizacao === "/home/clientes" ? (
          <div className="opcoes-status">
            <label htmlFor="status-filtro">
              Status
              <div className="container-do-radio">
                <div className="estilizacao-do-radio">
                  {statusFiltroClientes === "inadimplentes" && (
                    <img
                      src={bolhaVerdeDeConfirma}
                      alt="bolha verde"
                      className="bolha-confirmacao"
                    />
                  )}
                  <input
                    type="radio"
                    name="status-filtro"
                    id="1"
                    value="Inadimplente"
                    className="radio-status"
                    onClick={(e) => {
                      setStatusFiltroClientes("inadimplentes");
                      setParametrosDoFiltroClientes({
                        ...parametrosDoFiltroClientes,
                        status: e.target.value,
                      });
                    }}
                  />
                </div>
                <p>Inadimplentes</p>
              </div>
              <div className="container-do-radio">
                <div className="estilizacao-do-radio">
                  {statusFiltroClientes === "em dia" && (
                    <img
                      src={bolhaVerdeDeConfirma}
                      alt="bolha verde"
                      className="bolha-confirmacao"
                    />
                  )}
                  <input
                    type="radio"
                    name="status-filtro"
                    id="2"
                    value="Em dia"
                    className="radio-status"
                    onClick={(e) => {
                      setStatusFiltroClientes("em dia");
                      setParametrosDoFiltroClientes({
                        ...parametrosDoFiltroClientes,
                        status: e.target.value,
                      });
                    }}
                  />
                </div>
                <p>Em Dia</p>
              </div>
            </label>
          </div>
        ) : (
          <div className="opcoes-status">
            <label htmlFor="status-filtro">
              Status
              <div className="container-do-radio">
                <div className="estilizacao-do-radio">
                  {statusFiltroCobrancas === "pendentes" && (
                    <img
                      src={bolhaVerdeDeConfirma}
                      alt="bolha verde"
                      className="bolha-confirmacao"
                    />
                  )}
                  <input
                    type="radio"
                    name="status-filtro"
                    id="1"
                    value="pendente"
                    className="radio-status"
                    onClick={(e) => {
                      setStatusFiltroCobrancas("pendentes");
                      setParametrosDoFiltroCobrancas({
                        ...parametrosDoFiltroCobrancas,
                        status: e.target.value,
                      });
                    }}
                  />
                </div>
                <p>Pendentes</p>
              </div>
              <div className="container-do-radio">
                <div className="estilizacao-do-radio">
                  {statusFiltroCobrancas === "pagas" && (
                    <img
                      src={bolhaVerdeDeConfirma}
                      alt="bolha verde"
                      className="bolha-confirmacao"
                    />
                  )}
                  <input
                    type="radio"
                    name="status-filtro"
                    id="2"
                    value="pago"
                    className="radio-status"
                    onClick={(e) => {
                      setStatusFiltroCobrancas("pagas");
                      setParametrosDoFiltroCobrancas({
                        ...parametrosDoFiltroCobrancas,
                        status: e.target.value,
                      });
                    }}
                  />
                </div>
                <p>Pagas</p>
              </div>
            </label>
            <label htmlFor="data-filtro" className="opcoes-data">
              Data
              <input
                type="date"
                name="data-filtro"
                className="input-data"
                defaultValue={parametrosDoFiltroCobrancas.data}
                onChange={(e) => {
                  setParametrosDoFiltroCobrancas({
                    ...parametrosDoFiltroCobrancas,
                    data: e.target.value,
                  });
                }}
              />
            </label>
          </div>
        )}
        <div className="filtro-botoes">
          <button
            className="filtro-botao filtro-aplicar"
            type="submit"
            onClick={() => {
              setFiltroAtivoClientes(false);
              setFiltroAtivoCobrancas(false);
            }}
          >
            Aplicar
          </button>
          <button
            className="filtro-botao filtro-cancelar"
            type="button"
            onClick={() => {
              toast.dismiss();
              setListaTratada(listaDeClientes);
              setStatusFiltroClientes(false);
              setAbrirModalFiltrarLista(false);
              setFiltroDeCobrancasDaHome(false);
              setFiltroDeClientesDaHome(false);
              setFiltroAtivoClientes(false);
              setListaCobrancasTratada(cobrancas);
              setStatusFiltroCobrancas(false);
              setAbrirModalFiltrarLista(false);
              setFiltroAtivoCobrancas(false);
              setParametrosDoFiltroClientes(false);
              setParametrosDoFiltroCobrancas({
                status: "",
                data: "",
              });
            }}
          >
            Limpar
          </button>
        </div>
      </form>
      <img
        className="seta-do-modal-reordenar"
        src={setaBranca}
        alt="seta do modal"
      />
    </motion.div>
  );
}
