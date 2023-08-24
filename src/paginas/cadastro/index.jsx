import { motion } from "framer-motion";
import { useState } from "react";
import { ToastContainer } from "react-toastify";
import BarraDeEtapasDoCadastro from "../../componentes/cadastro/barraDeEtapasDoCadastro";
import CaixaDasAcoesDoCadastro from "../../componentes/cadastro/caixaDasAcoesDoCadastro";
import CaixaDeConfirmacaoDeCadastro from "../../componentes/cadastro/caixaDeConfirmaçãoDeCadastro";
import FormularioDoCadastro from "../../componentes/cadastro/formularioDeCadastro";
import useRastrearPresenca from "../../hooks/useRastrearPresenca";
import "./style.css";

export default function Cadastro() {
  const [confirmacaoDasEtapas, setConfirmacaoDasEtapas] = useState(1);

  function avancarEtapaDoCadastro() {
    if (confirmacaoDasEtapas === 3) return;

    setConfirmacaoDasEtapas(confirmacaoDasEtapas + 1);
  }
  useRastrearPresenca();
  return (
    <motion.div
      key="cadastro-de-usuario"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15, velocity: 1 }}
      className="container-cadastro"
    >
      <ToastContainer
        hideProgressBar={true}
        closeOnClick={true}
        pauseOnHover={false}
        theme="colored"
        style={{ fontSize: "2rem" }}
      />
      <div className="lista-de-acoes-do-cadastro">
        <div className="tamanho-da-caixa-da-lista-de-acoes">
          <div className="caixa-da-lista-de-acoes">
            <CaixaDasAcoesDoCadastro
              confirmacaoDasEtapas={confirmacaoDasEtapas}
            />
          </div>
        </div>
      </div>
      <div className="formulario-do-cadastro">
        {confirmacaoDasEtapas !== 3 ? (
          <div className="container-formulario-do-cadastro">
            <FormularioDoCadastro
              setConfirmacaoDasEtapas={setConfirmacaoDasEtapas}
              avancarEtapaDoCadastro={avancarEtapaDoCadastro}
              confirmacaoDasEtapas={confirmacaoDasEtapas}
            />
          </div>
        ) : (
          <CaixaDeConfirmacaoDeCadastro />
        )}
        <div className="caixa-da-barra-de-etapa-do-cadastro">
          <BarraDeEtapasDoCadastro
            confirmacaoDasEtapas={confirmacaoDasEtapas}
          />
        </div>
      </div>
    </motion.div>
  );
}
