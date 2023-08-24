import { useContext } from "react";
import { useLocation } from "react-router-dom";
import clienteIconePreto from "../../../assets/home/cliente-icone-preto.svg";
import clienteIconeRosa from "../../../assets/home/cliente-icone-rosa.svg";
import cobrancaIconeRosa from "../../../assets/home/cobranca-icone-rosa.svg";
import cobrancaIconePreto from "../../../assets/home/cobrancas-icone-preto.svg";
import homeIconePreto from "../../../assets/home/home-icone-preto.svg";
import homeIconeRosa from "../../../assets/home/home-icone-rosa.svg";
import ContextoDeNavegacaoDaHome from "../../../contexto/contextoDaNavegacao";
import "./style.css";

export default function BarraDoMenuLateral() {
  const { redirecionar, setBuscarListaDeCliente } =
    useContext(ContextoDeNavegacaoDaHome);

  const localizacao = useLocation().pathname;

  return (
    <div className="navegacao">
      <div className="caixa-do-botao-de-navegacao">
        <button
          onClick={() => {
            redirecionar("/home");
          }}
          className="botao-navegacao"
        >
          <img
            className="icone-navegacao"
            src={localizacao === "/home" ? homeIconeRosa : homeIconePreto}
            alt="ícone da Home"
          />
          <p className={localizacao === "/home" ? "selecionado-texto" : ""}>
            Home
          </p>
        </button>
        <div
          className={
            localizacao === "/home" ? "selecionado" : "nao-selecionado"
          }
        ></div>
      </div>

      <div className="caixa-do-botao-de-navegacao">
        <button
          onClick={() => {
            redirecionar("/home/clientes");
            setBuscarListaDeCliente(true);
          }}
          className="botao-navegacao"
        >
          <img
            className="icone-navegacao"
            src={
              localizacao.startsWith("/home/clientes")
                ? clienteIconeRosa
                : clienteIconePreto
            }
            alt="ícone da área dos clientes"
          />
          <p
            className={
              localizacao.startsWith("/home/clientes")
                ? "selecionado-texto"
                : ""
            }
          >
            Clientes
          </p>
        </button>
        <div
          className={
            localizacao.startsWith("/home/clientes")
              ? "selecionado"
              : "nao-selecionado"
          }
        ></div>
      </div>

      <div className="caixa-do-botao-de-navegacao">
        <button
          onClick={() => {
            redirecionar("/home/cobrancas");
          }}
          className="botao-navegacao"
        >
          <img
            className="icone-navegacao"
            src={
              localizacao === "/home/cobrancas"
                ? cobrancaIconeRosa
                : cobrancaIconePreto
            }
            alt="ícone da área de cobranças"
          />
          <p
            className={
              localizacao === "/home/cobrancas" ? "selecionado-texto" : ""
            }
          >
            Cobranças
          </p>
        </button>
        <div
          className={
            localizacao === "/home/cobrancas"
              ? "selecionado"
              : "nao-selecionado"
          }
        ></div>
      </div>
    </div>
  );
}
