import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { limparArmazenamentoDoLocalStorage } from "../../../utils/armazenamento";
import setaBrancaDoModalIcone from "../../../assets/modal/seta-do-modal-icone.svg";
import editarIcone from "../../../assets/modal/editar-icone.svg";
import sairIcone from "../../../assets/modal/sair-logout-icone.svg";
import ContextoDeNavegacaoDaHome from "../../../contexto/contextoDaNavegacao";
import ContextoDadosDoUsuario from "../../../contexto/contextoDosDadosDoUsuario";
import "./style.css";

export default function ModalDeEditarESair() {
  const { setAbrirModalAtualizarCadastro, setAbrirPopup } = useContext(
    ContextoDeNavegacaoDaHome
  );

  const { dadosDoPerfilDoUsuario } = useContext(ContextoDadosDoUsuario);
  const redirecionar = useNavigate();

  function deslogarDaPagina() {
    redirecionar("/");
    limparArmazenamentoDoLocalStorage();
  }

  function configurarModalEditarUsuario() {
    dadosDoPerfilDoUsuario;
    setAbrirModalAtualizarCadastro(true);
  }

  function fecharAoClicarFora() {
    const modal = document.querySelector(
      ".container-do-pop-up-de-editar-e-sair"
    );
    if (modal && !modal.contains(event.target)) {
      document.removeEventListener("click", fecharAoClicarFora);
      setAbrirPopup(false);
    }
  }

  useEffect(() => {
    event.stopPropagation();
    document.addEventListener("click", fecharAoClicarFora);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15, velocity: 1 }}
      key="editar-ou-sair"
      className="container-do-pop-up-de-editar-e-sair"
    >
      <img
        className="seta-do-modal"
        src={setaBrancaDoModalIcone}
        alt="seta do modal"
      />
      <div>
        <img
          onClick={configurarModalEditarUsuario}
          src={editarIcone}
          alt="icone de editar"
        />
      </div>
      <div>
        <img onClick={deslogarDaPagina} src={sairIcone} alt="icone de sair " />
      </div>
    </motion.div>
  );
}
