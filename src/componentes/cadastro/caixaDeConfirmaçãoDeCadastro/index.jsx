import "./style.css";
import bolhaGrandeDeConfirmacaoImg from "../../../assets/cadastro/bolha-grande-de-confirmacao.svg";
import { Link } from "react-router-dom";

export default function CaixaDeConfirmacaoDeCadastro() {
  return (
    <>
      <div className="caixa-de-confirmacao-de-cadastro">
        <div>
          <img src={bolhaGrandeDeConfirmacaoImg}
            alt="imagem de confirmação"
          />
          <h1>Cadastro realizado com sucesso!</h1>
        </div>
        <Link to="/login">Ir para Login</Link>
      </div>
    </>
  );
}
