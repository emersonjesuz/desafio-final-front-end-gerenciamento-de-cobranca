import { motion } from "framer-motion";
import { useContext, useEffect, useState } from "react";
import clienteEmDiaIcone from "../../../../assets/home/cliente-em-dia-icone.svg";
import clienteInadimplentesIcone from "../../../../assets/home/cliente-inadimplente-icone.svg";
import iconeCobrancasPagas from "../../../../assets/home/cobrancas-pagas-icone.svg";
import iconeCobrancasPrevistas from "../../../../assets/home/cobrancas-previstas-icone.svg";
import iconeCobrancasVencidas from "../../../../assets/home/cobrancas-vencidas-icone.svg";
import apiBack from "../../../../conexao/apiBackEnd";
import ContextoDadosDoUsuario from "../../../../contexto/contextoDosDadosDoUsuario";
import useLimparEstados from "../../../../hooks/useLimparEstados";
import useRastrearPresenca from "../../../../hooks/useRastrearPresenca";
import { formatarValor } from "../../../../utils/formatacao";
import CartaoDeCobrancas from "../cartaoDeCobrancas";
import QuantidadeDeClientes from "../quantidadeDeClientes";
import QuantidadeDeCobranca from "../quantidadeDeCobranca";
import "./style.css";

export default function CardsDaHome() {
  const { cobrancas, listaDeClientes } = useContext(ContextoDadosDoUsuario);
  const [valoresDasCobrancas, setValoresDasCobrancas] = useState({});

  useLimparEstados();
  useRastrearPresenca();

  async function saldoCobranca() {
    const { data } = await apiBack.get("/cobrancas/saldo");

    setValoresDasCobrancas(data);
  }

  useEffect(() => {
    saldoCobranca();
  }, []);

  const miniListaDeCobrancaVencidas = cobrancas
    .filter((cobranca) => cobranca.status === "vencida")
    .slice(0, 4);
  const miniListaDeCobrancaPagas = cobrancas
    .filter((cobranca) => cobranca.status === "pago")
    .slice(0, 4);
  const miniListaDeCobrancaPendentes = cobrancas
    .filter((cobranca) => cobranca.status === "pendente")
    .slice(0, 4);

  const miniListaDeClienteEmDia = listaDeClientes
    .filter((cliente) => cliente.status === "Em dia")
    .slice(0, 4);
  const miniListaDeClienteInadimplete = listaDeClientes
    .filter((cliente) => cliente.status === "Inadimplente")
    .slice(0, 4);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15, velocity: 1 }}
      className="caixa-do-painel-quantidade-cobranca"
      key="cardsInicial"
    >
      <div className="painel-quantidade-cartao-de-cobrancas">
        <CartaoDeCobrancas
          iconeDaCobranca={iconeCobrancasPagas}
          nomeDaCobranca="Cobranças Pagas"
          tipoCobranca="cobrancas-pagas"
          valorCobranca={formatarValor(valoresDasCobrancas.pagas)}
        />
        <CartaoDeCobrancas
          iconeDaCobranca={iconeCobrancasVencidas}
          nomeDaCobranca="Cobranças Vencidas"
          tipoCobranca="cobrancas-vencidas"
          valorCobranca={formatarValor(valoresDasCobrancas.vencidas)}
        />
        <CartaoDeCobrancas
          iconeDaCobranca={iconeCobrancasPrevistas}
          nomeDaCobranca="Cobranças Previstas"
          tipoCobranca="cobrancas-previstas"
          valorCobranca={formatarValor(valoresDasCobrancas.pendentes)}
        />
      </div>
      <div className="painel-quantidade-cobranca">
        <QuantidadeDeCobranca
          nomeDaCobranca={"Cobranças Vencidas"}
          tipoDeCobranca="cobranca-vencidas-value"
          dadosDaCobranca={miniListaDeCobrancaVencidas}
        />
        <QuantidadeDeCobranca
          nomeDaCobranca={"Cobranças Previstas"}
          tipoDeCobranca="cobranca-previstas-value"
          dadosDaCobranca={miniListaDeCobrancaPendentes}
        />
        <QuantidadeDeCobranca
          nomeDaCobranca={"Cobranças Pagas"}
          tipoDeCobranca="cobranca-pagas-value"
          dadosDaCobranca={miniListaDeCobrancaPagas}
        />
      </div>
      <div className="painel-quantidade-cliente">
        <QuantidadeDeClientes
          cardDoTipoDeCliente={clienteInadimplentesIcone}
          tipoDeCliente="cliente-inadimplente-value"
          tituloDoCartao={"inadimplente"}
          dadosDoClientes={miniListaDeClienteInadimplete}
        />
        <QuantidadeDeClientes
          cardDoTipoDeCliente={clienteEmDiaIcone}
          tipoDeCliente="cliente-em-dia-value"
          tituloDoCartao={"em dia"}
          dadosDoClientes={miniListaDeClienteEmDia}
        />
      </div>
    </motion.div>
  );
}
