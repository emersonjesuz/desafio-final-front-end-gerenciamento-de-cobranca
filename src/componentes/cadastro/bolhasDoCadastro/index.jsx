import bolhaVerdeImg from "../../../assets/cadastro/bolha-verde.svg";
import bolhaVerdeDeConfirmacaoImg from "../../../assets/cadastro/bolha-verde-confirmacao.svg";
import bolhaTransparenteImg from "../../../assets/cadastro/bolha-transparente.svg";
import linhaVerdeImg from "../../../assets/cadastro/linha-verde.svg";
import "./style.css";
import { useEffect, useState } from "react";
export default function BolhasDoCadastro({ confirmacaoDasEtapas }) {
  const [trocarBolha, setTrocarBolha] = useState({
    primeiraBolha: "",
    segundaBolha: "",
    terceiraBolha: "",
  });

  function modificarBolha() {
    if (confirmacaoDasEtapas === 1) {
      setTrocarBolha({
        primeiraBolha: bolhaVerdeImg,
        segundaBolha: bolhaTransparenteImg,
        terceiraBolha: bolhaTransparenteImg,
      });
    } else if (confirmacaoDasEtapas === 2) {
      setTrocarBolha({
        primeiraBolha: bolhaVerdeDeConfirmacaoImg,
        segundaBolha: bolhaVerdeImg,
        terceiraBolha: bolhaTransparenteImg,
      });
    } else if (confirmacaoDasEtapas === 3) {
      setTrocarBolha({
        primeiraBolha: bolhaVerdeDeConfirmacaoImg,
        segundaBolha: bolhaVerdeDeConfirmacaoImg,
        terceiraBolha: bolhaVerdeDeConfirmacaoImg,
      });
    }
  }

  useEffect(() => {
    modificarBolha();
  }, [confirmacaoDasEtapas]);

  return (
    <div className="caixa-das-bolhas-do-cadastro">
      <img src={trocarBolha.primeiraBolha} alt="bolha" />
      <img src={linhaVerdeImg} alt="linha verde" />
      <img src={trocarBolha.segundaBolha} alt="bolha" />
      <img src={linhaVerdeImg} alt="linha verde" />
      <img src={trocarBolha.terceiraBolha} alt="bolha" />
    </div>
  );
}
