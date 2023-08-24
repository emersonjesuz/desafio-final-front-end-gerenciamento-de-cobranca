import { AnimatePresence, motion } from "framer-motion";
import { useContext, useEffect } from "react";
import { useLocation } from "react-router-dom";
import opcoesDoUsuarioIcone from "../../../assets/home/opcoes-usuario-icone.svg";
import ContextoDeNavegacaoDaHome from "../../../contexto/contextoDaNavegacao";
import CreateContextDadosDoUsuario from "../../../contexto/contextoDosDadosDoUsuario";
import useRastrearPresenca from "../../../hooks/useRastrearPresenca";
import "./style.css";

export default function Cabecalho() {
  const { dadosDoPerfilDoUsuario } = useContext(CreateContextDadosDoUsuario);

  const { setAbrirPopup, abrirPopup, redirecionar } = useContext(
    ContextoDeNavegacaoDaHome
  );

  const localizacao = useLocation().pathname;

  function editandoNomeDoUsuario() {
    const nomeDoUsuario = document.querySelector(".nome-usuario");
    try {
      const nome = dadosDoPerfilDoUsuario.nome.trim().split(" ")[0];
      nomeDoUsuario.textContent = nome;
    } catch {
      nomeDoUsuario.textContent = "";
    }
  }

  function pegandoAsDuasLetrasDoNome() {
    const asDuasLetrasDoNome = document.querySelector(".imagem-usuario");
    try {
      const letrasDoNome = dadosDoPerfilDoUsuario.nome.trim().split("");
      const priemiraLetra = letrasDoNome[0];
      const terceiraLetra = letrasDoNome[2];
      asDuasLetrasDoNome.textContent =
        priemiraLetra.toUpperCase() + terceiraLetra.toUpperCase();
    } catch {
      asDuasLetrasDoNome.textContent = "";
    }
  }

  useEffect(() => {
    editandoNomeDoUsuario();
    pegandoAsDuasLetrasDoNome();
  }, [dadosDoPerfilDoUsuario]);
  useRastrearPresenca();
  return (
    <motion.header
      key="home"
      iinitial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15, velocity: 1 }}
      className="cabecalho">
      {localizacao === "/home" && (
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15, velocity: 1 }}
          className="cabecalho-home"
        >
          Resumo das cobranças
        </motion.h1>
      )}
      {localizacao.startsWith("/home/clientes") && (
        <p className="cabecalho-clientes">
          <motion.span
            key="cabecalho-clientes-titulo"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15, velocity: 1 }}
            style={{ cursor: "pointer" }}
            onClick={() => redirecionar("/home/clientes")}
          >
            Clientes
          </motion.span>
          <AnimatePresence mode="wait">
            {localizacao.startsWith("/home/clientes/detalhamento/") && (
              <motion.span
                key="cabecalho-detalhamento-clientes-titulo"
                className="cabecalho-detalhar-cliente"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15, velocity: 1 }}
              >
                <span>&gt;</span>
                <span>Detalhes do cliente</span>
              </motion.span>
            )}
          </AnimatePresence>
        </p>
      )}
      {localizacao === "/home/cobrancas" && (
        <p className="cabecalho-cobrancas">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15, velocity: 1 }}
            style={{ cursor: "pointer" }}
          >
            Cobranças
          </motion.span>
        </p>
      )}
      <div className="campo-usuario">
        <div className="imagem-usuario"></div>
        <h4 className="nome-usuario"></h4>

        <div className="caixa-do-botao-opcoes">
          <img
            className="opcoes-usuario"
            onClick={() => setAbrirPopup(!abrirPopup)}
            src={opcoesDoUsuarioIcone}
            alt="icone para aperee opções para o usuario"
          />
        </div>
      </div>
    </motion.header>
  );
}
