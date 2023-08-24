import { useContext } from "react";
import editarIcone from "../../../../assets/home/caneta-editar-preta-icone.svg";
import excluirIcone from "../../../../assets/home/lixeira-icone.svg";
import ContextoDeNavegacaoDaHome from "../../../../contexto/contextoDaNavegacao";
import ContextoDadosDoUsuario from "../../../../contexto/contextoDosDadosDoUsuario";
import { formatarData, formatarValor } from "../../../../utils/formatacao";
import "./style.css";

export default function Cobranca({
  cliente,
  idCobranca,
  valor,
  vencimento,
  status,
  descricao,
  idCliente,
}) {
  const {
    setEscolherQualTipoDoModalDeCobranca,
    setAbrirModalDeCobranca,
    setAbrirModalDeletarCobranca,
    setCobrancaParaDelecao,
    setAbrirModalDetalheDaCobranca,
  } = useContext(ContextoDeNavegacaoDaHome);

  const { setIdDoUsuarioASerDetalhado, setIdDaCobrancaASerDetalhado } =
    useContext(ContextoDadosDoUsuario);

  return (
    <tr className="registro-da-tabela-de-cobrancas">
      {cliente && (
        <td
          onClick={() => {
            setAbrirModalDetalheDaCobranca(true);
            setIdDaCobrancaASerDetalhado(idCobranca);
          }}
          className="item-cobranca"
        >
          <p className="cobranca-texto">{cliente}</p>
        </td>
      )}
      <td
        onClick={() => {
          setAbrirModalDetalheDaCobranca(true);
          setIdDaCobrancaASerDetalhado(idCobranca);
        }}
        className="item-cobranca"
      >
        <p className="cobranca-texto">{idCobranca}</p>
      </td>
      {cliente ? (
        <>
          <td
            onClick={() => {
              setAbrirModalDetalheDaCobranca(true);
              setIdDaCobrancaASerDetalhado(idCobranca);
            }}
            className="item-cobranca"
          >
            <p className="cobranca-texto">{formatarValor(valor)}</p>
          </td>
          <td
            onClick={() => {
              setAbrirModalDetalheDaCobranca(true);
              setIdDaCobrancaASerDetalhado(idCobranca);
            }}
            className="item-cobranca"
          >
            <p className="cobranca-texto">{formatarData(vencimento)}</p>
          </td>
        </>
      ) : (
        <>
          <td
            onClick={() => {
              setAbrirModalDetalheDaCobranca(true);
              setIdDaCobrancaASerDetalhado(idCobranca);
            }}
            className="item-cobranca"
          >
            <p className="cobranca-texto">{formatarData(vencimento)}</p>
          </td>
          <td
            onClick={() => {
              setAbrirModalDetalheDaCobranca(true);
              setIdDaCobrancaASerDetalhado(idCobranca);
            }}
            className="item-cobranca"
          >
            <p className="cobranca-texto">{formatarValor(valor)}</p>
          </td>
        </>
      )}
      <td
        onClick={() => {
          setAbrirModalDetalheDaCobranca(true);
          setIdDaCobrancaASerDetalhado(idCobranca);
        }}
        className="item-cobranca status-cobranca"
      >
        <p className={`cobranca-${status === "pago" ? "paga" : status}`}>
          {status === "pago"
            ? status.at(0).toUpperCase() + status.slice(1, 3) + "a"
            : status.at(0).toUpperCase() + status.slice(1)}
        </p>
      </td>
      <td
        className={
          cliente
            ? " descricao-cobranca "
            : "descricao-detalhar-cliente  descricao-cobranca "
        }
      >
        <>
          <p
            onClick={() => {
              setAbrirModalDetalheDaCobranca(true);
              setIdDaCobrancaASerDetalhado(idCobranca);
            }}
            className="cobranca-texto "
          >
            {descricao}
          </p>
          <div className="botoes-cobranca">
            <img
              onClick={() => {
                setIdDoUsuarioASerDetalhado(idCliente);
                setEscolherQualTipoDoModalDeCobranca({
                  tipoDoModal: false,
                  idCobranca,
                  nomeCliente: cliente,
                });
                setAbrirModalDeCobranca(true);
                setIdDaCobrancaASerDetalhado(idCobranca);
              }}
              className="botao-editar"
              src={editarIcone}
              alt="ícone com formato de caneta para realizar edição de cobrança"
            />
            <img
              className="botao-excluir"
              style={{ cursor: "pointer" }}
              onClick={() => {
                setCobrancaParaDelecao({ idCobranca, status, vencimento });
                setAbrirModalDeletarCobranca(true);
              }}
              src={excluirIcone}
              alt="ícone com formato de lixeira para realizar exclusão de cobrança"
            />
          </div>
        </>
      </td>
    </tr>
  );
}
