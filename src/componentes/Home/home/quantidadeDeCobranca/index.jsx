import { useContext } from "react";
import ContextoDeNavegacaoDaHome from "../../../../contexto/contextoDaNavegacao";
import ContextoDadosDoUsuario from "../../../../contexto/contextoDosDadosDoUsuario";
import { formatarValor } from "../../../../utils/formatacao";
import "./style.css";
export default function QuantidadeDeCobranca({
  nomeDaCobranca,
  tipoDeCobranca,
  dadosDaCobranca,
}) {
  const {
    setParametrosDoFiltroCobrancas,
    setStatusFiltroCobrancas,
    parametrosDoFiltroCobrancas,
    cobrancas,
    setFiltroAtivoCobrancas,
    setFiltroDeCobrancasDaHome,
    setListaCobrancasTratada,
  } = useContext(ContextoDadosDoUsuario);
  const { redirecionar } = useContext(ContextoDeNavegacaoDaHome);

  function redirecionarCobrancasEFiltrar() {
    const filtrandoCobrancas = cobrancas.filter(
      (cobranca) => cobranca.status === dadosDaCobranca[0].status
    );

    setListaCobrancasTratada(filtrandoCobrancas);
    setStatusFiltroCobrancas(
      filtrandoCobrancas[0].status.toLowerCase() === "pago"
        ? "pagas"
        : "pendentes"
    );
    setParametrosDoFiltroCobrancas({
      ...parametrosDoFiltroCobrancas,
      status: filtrandoCobrancas[0].status,
    });
    setFiltroAtivoCobrancas(true);
    setFiltroDeCobrancasDaHome(true);
    redirecionar("/home/cobrancas");
  }
  function formatarNome(nome) {
    const novoNome = nome.split(" ");
    return novoNome[0];
  }
  return (
    <div className="detalhe-cobrancas">
      <div className="quantidade-cobrancas">
        <h2 className="quantidade-cobrancas-titulo">{nomeDaCobranca}</h2>
        <div className="quantidade-cobrancas-valor">
          <span className={tipoDeCobranca}>08</span>
        </div>
      </div>
      <div className="divisor-cobrancas"></div>
      <div className="tabela-cobrancas">
        <div className="cabecalho-da-tabela-cobrancas">
          <span>Cliente</span>
          <span>ID da cob.</span>
          <span>Valor</span>
        </div>

        <div className="colunas-da-tabela-cobrancas">
          {dadosDaCobranca.map((cobranca) => (
            <div key={cobranca.id}>
              <span className="clientes-texto">
                {formatarNome(cobranca.cliente)}
              </span>
              <span>{cobranca.id}</span>
              <span>{formatarValor(cobranca.valor)}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="caixa-link-ver-todos-de-cobranca">
        <p
          style={{ cursor: "pointer" }}
          onClick={() => {
            redirecionarCobrancasEFiltrar();
          }}
          className="link"
        >
          Ver todos
        </p>
      </div>
    </div>
  );
}
