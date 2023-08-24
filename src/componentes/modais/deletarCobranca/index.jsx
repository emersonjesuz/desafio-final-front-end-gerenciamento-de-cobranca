import { motion } from "framer-motion";
import { useContext } from "react";
import { toast } from "react-toastify";
import apiBack from "../../../conexao/apiBackEnd";
import ContextoDadosDoUsuario from "../../../contexto/contextoDosDadosDoUsuario";
import xSairIcone from "../../../assets/formularios/x-sair-icone.svg";
import avisoExclusaoCobranca from "../../../assets/modal/aviso-exclusao-cobranca.svg";
import ContextoDeNavegacaoDaHome from "../../../contexto/contextoDaNavegacao";
import "./style.css";

export default function ModalDeletarCobranca() {
  const { setAbrirModalDeletarCobranca, cobrancaParaDelecao } = useContext(
    ContextoDeNavegacaoDaHome
  );

  const {
    cobrancas,
    setCobrancas,
    setListaCobrancasTratada,
    dadosDoDetalheDoCliente,
    setDadosDoDetalheDoCliente,
  } = useContext(ContextoDadosDoUsuario);

  const deletarCobranca = async (idCobrancaParaDelecao) => {
    try {
      await apiBack.delete(`/cobrancas/deletar/${idCobrancaParaDelecao}`);
      atualizarListaDeCobrancas(cobrancaParaDelecao.idCobranca);
      toast.success("Cobrança excluída com sucesso!");
      setAbrirModalDeletarCobranca(false);
    } catch (erro) {
      toast.error(erro.response.mensagem);
    }
  };

  async function atualizarListaDeCobrancas(idCobrancaDeletada) {
    try {
      if (Object.keys(dadosDoDetalheDoCliente).length) {
        const cobrancasDoDetalharClienteDiferenteDaExcluida =
          dadosDoDetalheDoCliente.cobrancas.filter(
            (cobranca) => cobranca.id !== idCobrancaDeletada
          );

        setDadosDoDetalheDoCliente({
          cliente: dadosDoDetalheDoCliente.cliente,
          cobrancas: cobrancasDoDetalharClienteDiferenteDaExcluida,
        });
      }
      const cobrancaAtualizada = cobrancas.filter(
        (cobranca) => cobranca.id !== idCobrancaDeletada
      );
      setCobrancas(cobrancaAtualizada);
      setListaCobrancasTratada(cobrancaAtualizada);
    } catch (error) {
      toast.error("Oops, estamos com problemas internos!");
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15, velocity: 1 }}
      className="container-do-modal-deletar-cobranca"
      key="modal-cadastro-cobranca"
    >
      <div className="caixa-do-modal-deletar-cobranca">
        <img
          className="x-de-sair-do-modal-de-delecao"
          onClick={() => setAbrirModalDeletarCobranca(false)}
          src={xSairIcone}
          alt="icone de sair"
        />
        <div className="cabecalho-modal-deletar-cobranca">
          <img src={avisoExclusaoCobranca} alt="icone de cobranca" />
          <h2>Tem certeza que deseja excluir esta cobrança?</h2>
          <div className="caixa-dos-botoes-deletar-cobranca">
            <button
              type="button"
              onClick={() => setAbrirModalDeletarCobranca(false)}
              id="botaoNão"
            >
              Não
            </button>
            <button
              id="botaoSim"
              onClick={() => {
                cobrancaParaDelecao.status !== "pago"
                  ? deletarCobranca(cobrancaParaDelecao.idCobranca)
                  : toast.error("Esta cobrança não pode ser excuída!");
                setAbrirModalDeletarCobranca(false);
              }}
            >
              Sim
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
