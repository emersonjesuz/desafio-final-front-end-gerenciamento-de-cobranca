import BolhasDoCadastro from "../bolhasDoCadastro";
import "./style.css";
export default function CaixaDasAcoesDoCadastro({ confirmacaoDasEtapas }) {
  return (
    <>
      <BolhasDoCadastro confirmacaoDasEtapas={confirmacaoDasEtapas} />
      <div className="texto-da-lista-de-acoes">
        <div>
          <p className="texto-de-cima-de-cada-acao">Cadastre-se</p>
          <p>Por favor, escreva seu nome e e-mail</p>
        </div>
        <div>
          <p className="texto-de-cima-de-cada-acao">Escolha uma senha</p>
          <p>Escolha uma senha segura</p>
        </div>
        <div>
          <p className="texto-de-cima-de-cada-acao">
            Cadastro realizado com sucesso
          </p>
          <p>E-mail e senha cadastrados com sucesso</p>
        </div>
      </div>
    </>
  );
}
