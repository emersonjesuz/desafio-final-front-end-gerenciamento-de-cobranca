import { useContext } from "react";
import ContextoDeNavegacaoDaHome from "../../../../contexto/contextoDaNavegacao";
import ContextoDadosDoUsuario from "../../../../contexto/contextoDosDadosDoUsuario";
import { formatarCpf } from "../../../../utils/formatacao";
import "./style.css";

export default function QuantidadeDeClientes({
  cardDoTipoDeCliente,
  tipoDeCliente,
  tituloDoCartao,
  dadosDoClientes,
}) {
  const { redirecionar } = useContext(ContextoDeNavegacaoDaHome);
  const {
    setListaTratada,
    listaDeClientes,
    setFiltroAtivoClientes,
    setParametrosDoFiltroClientes,
    parametrosDoFiltroClientes,
    setFiltroDeClientesDaHome,
    setStatusFiltroClientes,
  } = useContext(ContextoDadosDoUsuario);

  function filtrarERedirecionarParaClientes() {
    const filtroDeclintes = listaDeClientes.filter(
      (clientes) => clientes.status === dadosDoClientes[0].status
    );
    setListaTratada(filtroDeclintes);
    setFiltroAtivoClientes(true);
    setParametrosDoFiltroClientes({
      ...parametrosDoFiltroClientes,
      status: filtroDeclintes[0].status,
    });
    setStatusFiltroClientes(
      filtroDeclintes[0].status.toLowerCase() === "inadimplente"
        ? "inadimplentes"
        : "em dia"
    );
    setFiltroDeClientesDaHome(true);
    redirecionar("/home/clientes");
  }

  function formatarNome(nome) {
    const novoNome = nome.split(" ");
    return novoNome[0];
  }

  return (
    <div className="detalhe-clientes">
      <div className="quantidade-clientes">
        <div className="quantidade-clientes-titulo">
          <img src={cardDoTipoDeCliente} alt="icone do tipo de cliente" />
          <h2 className="quantidade-clientes-titulo-texto">
            Clientes {tituloDoCartao}
          </h2>
        </div>
        <div className="quantidade-clientes-valor">
          <span className={tipoDeCliente}>08</span>
        </div>
      </div>
      <div className="divisor-clientes"></div>

      <div className="tabela-clientes">
        <div className="cabecalho-tabela-cliente">
          <span>Cliente</span>
          <span>ID da clie.</span>
          <span>CPF</span>
        </div>

        <div className="colunas-da-tabela-cliente">
          {dadosDoClientes.map((cliente) => (
            <div key={cliente.id}>
              <span className="clientes-texto">
                {formatarNome(cliente.nome)}
              </span>
              <span>{cliente.id}</span>
              <span>{formatarCpf(cliente.cpf)}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="quantidade-clientes-botao">
        <p
          style={{ cursor: "pointer" }}
          onClick={() => filtrarERedirecionarParaClientes()}
          className="link-botao-grande"
        >
          Ver todos
        </p>
      </div>
    </div>
  );
}
