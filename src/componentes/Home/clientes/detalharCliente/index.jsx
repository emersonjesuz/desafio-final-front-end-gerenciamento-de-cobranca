import { AnimatePresence, motion } from "framer-motion";
import { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  formatarCep,
  formatarCpf,
  formatarTelefone,
} from "../../../../utils/formatacao";
import alternaIcone from "../../../../assets/home/alterna-a-ordem-icone.svg";
import canetaDeEditarVerdeIcone from "../../../../assets/home/caneta-editar-verde-icone.svg";
import clienteIconePreto from "../../../../assets/home/cliente-icone-preto.svg";
import ContextoDeNavegacaoDaHome from "../../../../contexto/contextoDaNavegacao";
import ContextoDadosDoUsuario from "../../../../contexto/contextoDosDadosDoUsuario";
import useRastrearPresenca from "../../../../hooks/useRastrearPresenca";
import EditarCliente from "../../../modais/EditarCliente";
import Cobranca from "../../cobranças/Cobranca";
import reordenarLista from "../../../../utils/reordenacao";
import "./style.css";

export default function DetalharCliente() {
  const {
    setAbrirModalDeCobranca,
    abrirEditarCliente,
    setAbrirEditarCliente,
    setEscolherQualTipoDoModalDeCobranca,
  } = useContext(ContextoDeNavegacaoDaHome);
  const { dadosDoDetalheDoCliente, setIdDoUsuarioASerDetalhado } = useContext(
    ContextoDadosDoUsuario
  );

  const [dadosOrdenados, setDadosOrdenados] = useState([]);
  const [ordem, setOrdem] = useState("decrescente");
  const path = useLocation().pathname.split("/");
  const rotaDoUsuario = path[path.length - 1];
  useEffect(() => {
    setIdDoUsuarioASerDetalhado(+rotaDoUsuario);
  }, []);

  const dadoDoCliente = {
    nome: Object.keys(dadosDoDetalheDoCliente).length
      ? dadosDoDetalheDoCliente.cliente.nome
      : "",
    email: Object.keys(dadosDoDetalheDoCliente).length
      ? dadosDoDetalheDoCliente.cliente.email
      : "",
    telefone: Object.keys(dadosDoDetalheDoCliente).length
      ? dadosDoDetalheDoCliente.cliente.telefone
      : "",
    cpf: Object.keys(dadosDoDetalheDoCliente).length
      ? dadosDoDetalheDoCliente.cliente.cpf
      : "",
    logradouro: Object.keys(dadosDoDetalheDoCliente).length
      ? dadosDoDetalheDoCliente.cliente.logradouro
      : "",
    bairro: Object.keys(dadosDoDetalheDoCliente).length
      ? dadosDoDetalheDoCliente.cliente.bairro
      : "",
    complemento: Object.keys(dadosDoDetalheDoCliente).length
      ? dadosDoDetalheDoCliente.cliente.complemento
      : "",
    cep: Object.keys(dadosDoDetalheDoCliente).length
      ? dadosDoDetalheDoCliente.cliente.cep
      : "",
    cidade: Object.keys(dadosDoDetalheDoCliente).length
      ? dadosDoDetalheDoCliente.cliente.cidade
      : "",
    estado: Object.keys(dadosDoDetalheDoCliente).length
      ? dadosDoDetalheDoCliente.cliente.estado
      : "",
  };

  useEffect(() => {
    const nomeCLiente = document.querySelector(".nome-do-cliente");
    const emailCLiente = document.querySelector(".email-do-cliente");
    const telefoneCLiente = document.querySelector(".telefone-do-cliente");
    const cpfCLiente = document.querySelector(".cpf-do-cliente");
    const enderecoCLiente = document.querySelector(".endereco-do-cliente");
    const bairroCLiente = document.querySelector(".bairro-do-cliente");
    const complementoCLiente = document.querySelector(
      ".complemento-do-cliente"
    );
    const cepCLiente = document.querySelector(".cep-do-cliente");
    const cidadeCLiente = document.querySelector(".cidade-do-cliente");
    const estadoCLiente = document.querySelector(".estado-do-cliente");

    nomeCLiente.textContent = dadoDoCliente.nome;
    emailCLiente.textContent = dadoDoCliente.email;
    telefoneCLiente.textContent = formatarTelefone(dadoDoCliente.telefone);
    cpfCLiente.textContent = formatarCpf(dadoDoCliente.cpf);

    if (dadoDoCliente.logradouro !== "") {
      enderecoCLiente.textContent = dadoDoCliente.logradouro;
    }
    if (dadoDoCliente.bairro !== "") {
      bairroCLiente.textContent = dadoDoCliente.bairro;
    }
    if (dadoDoCliente.complemento !== "") {
      complementoCLiente.textContent = dadoDoCliente.complemento;
    }
    if (dadoDoCliente.cep !== "") {
      cepCLiente.textContent = formatarCep(dadoDoCliente.cep);
    }
    if (dadoDoCliente.cidade !== "") {
      cidadeCLiente.textContent = dadoDoCliente.cidade;
    }
    if (dadoDoCliente.estado !== "") {
      estadoCLiente.textContent = dadoDoCliente.estado;
    }
  }, [dadosDoDetalheDoCliente]);

  useRastrearPresenca();
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15, velocity: 1 }}
      className="container-detalhar-cliente"
      key="detalhar-cliente"
    >
      <AnimatePresence mode="wait">
        {abrirEditarCliente && <EditarCliente />}
      </AnimatePresence>
      <div className="caixa-do-titulo-da-pagina-detalhar-cliente">
        <img src={clienteIconePreto} alt="icone do cliente" />
        <h1 className="nome-do-cliente"></h1>
      </div>
      <div className="caixa-dos-dados-do-cliente">
        <div className="titulo-da-caixa-dos-dados-e-botao">
          <h2>Dados do cliente</h2>
          <button
            onClick={() => {
              setAbrirEditarCliente(true);
            }}
          >
            <img src={canetaDeEditarVerdeIcone} alt="icone de uma caneta " />
            Dados do cliente
          </button>
        </div>
        <div className="dados-do-cliente-pagina-detalhar-cliente">
          <div className="cabecalho-dados-do-cliente-pagina-detalhar-cliente">
            <span id="cabecalho-email">E-mail</span>
            <span>Telefone</span>
            <span>CPF</span>
            <span></span>
            <span id="representa-cabecalho-cidade"></span>
          </div>
          <div
            style={{ marginBottom: "3rem" }}
            className="coluna-dados-do-cliente-pagina-detalhar-cliente"
          >
            <span id="coluna-email" className="email-do-cliente"></span>
            <span className="telefone-do-cliente"></span>
            <span className="cpf-do-cliente"></span>
            <span></span>
            <span id="representa-coluna-cidade"></span>
          </div>
        </div>
        <div className="dados-do-cliente-pagina-detalhar-cliente">
          <div className="cabecalho-dados-do-cliente-pagina-detalhar-cliente">
            <span id="cabecalho-endereco">Endereço</span>
            <span id="cabecalho-bairro">Bairro</span>
            <span id="cabecalho-complemento">Complemento</span>
            <span id="cabecalho-cep">CEP</span>
            <span id="cabecalho-cidade">Cidade</span>
            <span id="cabecalho-estado">UF</span>
          </div>
          <div className="coluna-dados-do-cliente-pagina-detalhar-cliente">
            <span id="coluna-endereco" className="endereco-do-cliente"></span>
            <span id="coluna-bairro" className="bairro-do-cliente"></span>
            <span
              id="coluna-completo"
              className="complemento-do-cliente"
            ></span>
            <span id="coluna-cep" className="cep-do-cliente"></span>
            <span id="coluna-cidade" className="cidade-do-cliente"></span>
            <span id="coluna-estado" className="estado-do-cliente"></span>
          </div>
        </div>
      </div>
      <div className="caixa-das-cobrancas-do-cliente">
        <div className="caixa-do-titulo-e-botao-da-caixa-de-cobrancas-do-cliente">
          <h2>Cobranças do Cliente</h2>
          <button
            type="button"
            onClick={() => {
              setEscolherQualTipoDoModalDeCobranca({
                tipoDoModal: true,
                idCobranca: "",
                nomeCliente: dadoDoCliente.nome,
              });
              setAbrirModalDeCobranca(true);
            }}
          >
            + Nova cobrança
          </button>
        </div>
        <table className="parte-das-cobrancas-do-cliente">
          <thead className="cabecalho-da-caixa-das-cobrancas-do-cliente">
            <tr>
              <th>
                <>
                  <img
                    src={alternaIcone}
                    alt="icone de alterna ordem"
                    onClick={() =>
                      reordenarLista(
                        "id",
                        ordem,
                        setOrdem,
                        setDadosOrdenados,
                        dadosDoDetalheDoCliente.cobrancas
                      )
                    }
                  />
                  <span>ID Cob.</span>
                </>
              </th>
              <th className="data-titulo-tabela">
                <>
                  <img
                    src={alternaIcone}
                    alt="icone de alterna ordem"
                    onClick={() =>
                      reordenarLista(
                        "data",
                        ordem,
                        setOrdem,
                        setDadosOrdenados,
                        dadosDoDetalheDoCliente.cobrancas
                      )
                    }
                  />
                  <span>Data de venc.</span>
                </>
              </th>
              <th>
                <span>Valor</span>
              </th>
              <th>
                <span>Status</span>
              </th>
              <th>
                <span>Descrição</span>
              </th>
            </tr>
          </thead>
          <tbody className="coluna-da-caixa-das-cobrancas-do-cliente">
            {Object.keys(dadosOrdenados).length > 0
              ? dadosOrdenados.map((dadosDaCobranca) => (
                  <Cobranca
                    key={dadosDaCobranca.id}
                    descricao={dadosDaCobranca.descricao}
                    idCliente={dadosDaCobranca.id_cliente}
                    idCobranca={dadosDaCobranca.id}
                    status={dadosDaCobranca.status}
                    valor={dadosDaCobranca.valor}
                    vencimento={dadosDaCobranca.vencimento}
                  />
                ))
              : Object.keys(dadosDoDetalheDoCliente).length > 0 &&
                dadosDoDetalheDoCliente.cobrancas.map((dadosDaCobranca) => (
                  <Cobranca
                    key={dadosDaCobranca.id}
                    descricao={dadosDaCobranca.descricao}
                    idCliente={dadosDaCobranca.id_cliente}
                    idCobranca={dadosDaCobranca.id}
                    status={dadosDaCobranca.status}
                    valor={dadosDaCobranca.valor}
                    vencimento={dadosDaCobranca.vencimento}
                  />
                ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
