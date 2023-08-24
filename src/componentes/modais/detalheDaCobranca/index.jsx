import { motion } from "framer-motion";
import { useContext, useEffect } from "react";
import { toast } from "react-toastify";
import cobrancasIconePequenoPreto from "../../../assets/home/cobrancas-icone-pequeno-preto.svg";
import apiBack from "../../../conexao/apiBackEnd";
import ContextoDeNavegacaoDaHome from "../../../contexto/contextoDaNavegacao";
import ContextoDadosDoUsuario from "../../../contexto/contextoDosDadosDoUsuario";
import useRastrearPresenca from "../../../hooks/useRastrearPresenca";
import { formatarData, formatarValor } from "../../../utils/formatacao";
import "./style.css";

export default function ModalDetalheDaCobranca() {
  const { setAbrirModalDetalheDaCobranca } = useContext(
    ContextoDeNavegacaoDaHome
  );

  const { idDaCobrancaASerDetalhado } = useContext(ContextoDadosDoUsuario);
  async function detlharCobranca(id) {
    try {
      const { data } = await apiBack.get(`/cobranca/detalhe/${id}`);

      preencherCartaoDetalharCliente(data[0]);
    } catch (error) {
      toast.error("ouve um erro interno!");
    }
  }

  function preencherCartaoDetalharCliente(dados) {
    const nome = document.querySelector("#nome");
    const descricao = document.querySelector("#descricao");
    const vencimento = document.querySelector("#vencimento");
    const valor = document.querySelector("#valor");
    const idCobranca = document.querySelector("#idCobranca");
    const status = document.querySelector("#status");

    nome.value = dados.cliente;
    descricao.value = dados.descricao;
    vencimento.value = formatarData(dados.vencimento);
    valor.value = formatarValor(dados.valor);
    idCobranca.value = dados.id;
    status.textContent = dados.status;

    status.classList.add(
      dados.status === "pago"
        ? "detalhe-cobranca-paga"
        : dados.status === "pendente"
        ? "detalhe-cobranca-pendente"
        : "detalhe-cobranca-vencida"
    );
  }

  useEffect(() => {
    detlharCobranca(idDaCobrancaASerDetalhado);
  }, [idDaCobrancaASerDetalhado]);

  useRastrearPresenca();
  return (
    <motion.div
      key="detalhamento-da-cobranca"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15, velocity: 1 }}
      className="modal-detalhe-da-cobranca"
    >
      <div className="conteudo-modal">
        <div className="icone-titulo-modal-detalhe-da-cobranca">
          <img src={cobrancasIconePequenoPreto} alt="icone de cobranca" />
          <h1>Detalhe a Cobrança</h1>
          <span
            className="fechar-modal-detalhe-da-cobranca"
            onClick={() => {
              setAbrirModalDetalheDaCobranca(false);
            }}
          >
            &times;
          </span>
        </div>

        <form className="formulario-modal-detalhe-da-cobranca">
          <div className="linha-modal-detalhe-da-cobranca">
            <div className="caixa-input-modal-detalhe-da-cobranca">
              <label>Nome</label>
              <input
                type="text"
                className="formulario-input"
                name="nome"
                id="nome"
                disabled
              />
            </div>
          </div>

          <div className="caixa-da-descricao-modal-detalhe-da-cobranca">
            <label>Descrição</label>
            <textarea
              rows={3}
              aria-disabled={true}
              id="descricao"
              className="caixa-descricao-detalhe-de-cobranca"
              name="descricao"
              type="text"
              disabled
            ></textarea>
          </div>
          <div className="caixa-do-vencimento-e-valor-modal-detalhe-da-cobranca">
            <div>
              <label>Vencimento:</label>
              <input id="vencimento" name="vencimento" type="text" disabled />
            </div>
            <div>
              <label>Valor:</label>
              <input id="valor" name="valor" type="text" disabled />
            </div>
          </div>

          <div className="caixa-do-vencimento-e-valor-modal-detalhe-da-cobranca">
            <div>
              <label>ID cobranças</label>
              <input
                name="idCobrancas"
                id="idCobranca"
                type="number"
                disabled
              />
            </div>
            <div>
              <label>Status</label>
              <span id="status" name="status" type="text" disabled></span>
            </div>
          </div>
        </form>
      </div>
    </motion.div>
  );
}
