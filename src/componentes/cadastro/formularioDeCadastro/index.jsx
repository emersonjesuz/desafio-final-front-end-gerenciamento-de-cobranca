import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import olhoQueMostraSenhaImg from "../../../assets/formularios/olho-que-exibe-a-senha.png";
import olhoQueEscondeSenhaImg from "../../../assets/formularios/olho-que-priva-a-senha.svg";
import apiBack from "../../../conexao/apiBackEnd";
import "../../../index.css";
import "./style.css";

export default function FormularioDoCadastro({
  setConfirmacaoDasEtapas,
  confirmacaoDasEtapas,
  avancarEtapaDoCadastro,
}) {
  const [mostraASenhaPrimeiroInput, setMostraASenhaPrimeiroInput] =
    useState(false);
  const [mostraASenhaSegundoInput, setMostraASenhaSegundoInput] =
    useState(false);
  const [erroNoPrimeiroInput, setErroNoPrimeiroInput] = useState({
    erro: false,
    texto: "",
  });
  const [erroNoSegundoInput, setErroNoSegundoInput] = useState({
    erro: false,
    texto: "",
  });
  const [dadosDoFormulario, setDadosDoFormulario] = useState({
    nome: "",
    email: "",
    primeiraSenha: "",
    segundaSenha: "",
  });
  const configuracoesDoFormulario = {
    titulo:
      confirmacaoDasEtapas > 1 ? "Escolha uma senha" : "Adicione seus dados",
    labelDoPrimeiroInput: confirmacaoDasEtapas > 1 ? "Senha*" : "Nome",
    labelDoSegundoInput: confirmacaoDasEtapas > 1 ? "Repita a senha*" : "Email",
    placeholderDoPrimeiroInput:
      confirmacaoDasEtapas > 1 ? "" : "Digite seu nome",
    placeholderDoSegundoInput:
      confirmacaoDasEtapas > 1 ? "" : "Digite seu e-mail",
    textoDoBotaoDeAvanco:
      confirmacaoDasEtapas > 1 ? "Finalizar cadastro" : "Continuar",
  };

  function resetarErrosDosInput() {
    setErroNoPrimeiroInput({
      erro: false,
      texto: "",
    });
    setErroNoSegundoInput({
      erro: false,
      texto: "",
    });
  }

  function preencherFormulario(e) {
    e.preventDefault();
    setDadosDoFormulario({
      ...dadosDoFormulario,
      [e.target.name]: e.target.value,
    });
  }

  function validarCamposDosInputs() {
    const { nome, email, primeiraSenha, segundaSenha } = dadosDoFormulario;

    if (!nome) {
      toast.warning("Nome obrigatório!");

      setErroNoPrimeiroInput({
        erro: true,
        texto: "Este campo deve ser preenchido",
      });
      return false;
    }
    if (!email) {
      toast.warning("E-mail obrigatório!");
      setErroNoPrimeiroInput({
        erro: false,
        texto: "",
      });
      setErroNoSegundoInput({
        erro: true,
        texto: "Este campo deve ser preenchido",
      });
      return false;
    }
    const emailEValido = verificarSeOEmailVemComArroba(email);
    if (!emailEValido) {
      toast.warning("Preecha o campo E-mail corretamente");
      setErroNoSegundoInput({
        erro: true,
        texto: "Formato do E-mail inavlido",
      });
      return;
    }
    resetarErrosDosInput();

    const confirmandoSeNomeEmailEstaoPreenchido =
      confirmacaoDasEtapas === 1 && nome && email;
    if (confirmandoSeNomeEmailEstaoPreenchido) {
      toast("Escolha sua senha!");
      avancarEtapaDoCadastro();
      return false;
    }

    const aPrimeiraSenhaEstaPreenchida = primeiraSenha;
    if (!aPrimeiraSenhaEstaPreenchida) {
      toast.warning("Senha obrigatória!");
      setErroNoPrimeiroInput({
        erro: true,
        texto: "Este campo deve ser preenchido",
      });
      return false;
    }
    const aSegundaSenhaEstaPreenchida = segundaSenha;
    if (!aSegundaSenhaEstaPreenchida) {
      toast.warning("Senha obrigatoria!");
      setErroNoSegundoInput({
        erro: true,
        texto: "Este campo deve ser preenchido",
      });
      return false;
    }
    const verificandoSeAsSenhasSaoIguais = primeiraSenha === segundaSenha;
    if (!verificandoSeAsSenhasSaoIguais) {
      toast.warning("Informe as senhas corretamente!");
      setErroNoPrimeiroInput({
        erro: true,
        texto: "Ambos os campo deve ser iguais!",
      });
      setErroNoSegundoInput({
        erro: true,
        texto: "Ambos os campo deve ser iguais!",
      });
      return false;
    }

    const senhasComLimiteDe5Caracteres =
      primeiraSenha.length < 5 || segundaSenha.length < 5;
    if (senhasComLimiteDe5Caracteres) {
      toast.warning("Informe as senhas corretamente!");
      setErroNoPrimeiroInput({
        erro: true,
        texto: "",
      });
      setErroNoSegundoInput({
        erro: true,
        texto: "A senha precisa ter no minimo 5 caracteres!",
      });
      return false;
    }
    return true;
  }

  function verificarSeOEmailVemComArroba(email) {
    const temEmail = email.indexOf("@");
    if (temEmail === -1) return false;
    return true;
  }

  function checarEtapa(e) {
    e.preventDefault();

    const verificandoOsCampos = validarCamposDosInputs();
    if (!verificandoOsCampos) return;

    if (confirmacaoDasEtapas === 1) {
      avancarEtapaDoCadastro();
    }
  }

  async function enviarCadastro(e) {
    e.preventDefault();
    e.stopPropagation();

    if (!validarCamposDosInputs()) return;

    try {
      await apiBack.post("/usuario/cadastro", {
        nome: dadosDoFormulario.nome,
        email: dadosDoFormulario.email,
        senha: dadosDoFormulario.primeiraSenha,
      });

      avancarEtapaDoCadastro();
    } catch (error) {
      const erro = await JSON.parse(error.request.response);

      if (erro.mensagem) {
        toast.error(erro.mensagem);
      } else if (erro.message) {
        toast.error(erro.message);
      }

      setDadosDoFormulario({
        nome: "",
        email: "",
        primeiraSenha: "",
        segundaSenha: "",
      });
      setConfirmacaoDasEtapas(1);
    }
  }

  return (
    <form
      onSubmit={() => enviarCadastro(event)}
      className="caixa-do-formulario"
    >
      <div>
      </div>
      <div className="titulo-do-formulario-do-cadastro">
        <h1>{configuracoesDoFormulario.titulo}</h1>
      </div>
      <div className="inputs-do-formulario-do-cadastro">
        <div>
          <label htmlFor="">
            {configuracoesDoFormulario.labelDoPrimeiroInput}
          </label>
          <div className="caixa-do-input-cadastro">
            <input
              style={{ borderColor: erroNoPrimeiroInput.erro && "red" }}
              placeholder={configuracoesDoFormulario.placeholderDoPrimeiroInput}
              name={confirmacaoDasEtapas === 1 ? "nome" : "primeiraSenha"}
              onChange={preencherFormulario}
              value={
                confirmacaoDasEtapas === 1
                  ? dadosDoFormulario.nome
                  : dadosDoFormulario.primeiraSenha
              }
              type={
                confirmacaoDasEtapas === 1 || mostraASenhaPrimeiroInput
                  ? "text"
                  : "password"
              }
            />

            {confirmacaoDasEtapas === 2 && (
              <img
                onClick={() =>
                  setMostraASenhaPrimeiroInput(!mostraASenhaPrimeiroInput)
                }
                src={
                  !mostraASenhaPrimeiroInput
                    ? olhoQueEscondeSenhaImg
                    : olhoQueMostraSenhaImg
                }
                alt="olho da senha"
              />
            )}
          </div>
          <span className="mensagem-de-erro-do-input">
            {erroNoPrimeiroInput.texto}
          </span>
        </div>
        <div>
          <label htmlFor="">
            {configuracoesDoFormulario.labelDoSegundoInput}
          </label>
          <div className="caixa-do-input-cadastro">
            <input
              style={{ borderColor: erroNoSegundoInput.erro && "red" }}
              placeholder={configuracoesDoFormulario.placeholderDoSegundoInput}
              name={confirmacaoDasEtapas === 1 ? "email" : "segundaSenha"}
              onChange={preencherFormulario}
              value={
                confirmacaoDasEtapas === 1
                  ? dadosDoFormulario.email
                  : dadosDoFormulario.segundaSenha
              }
              type={
                confirmacaoDasEtapas === 1
                  ? "email"
                  : mostraASenhaSegundoInput
                    ? "text"
                    : "password"
              }
            />

            {confirmacaoDasEtapas === 2 && (
              <img
                onClick={() =>
                  setMostraASenhaSegundoInput(!mostraASenhaSegundoInput)
                }
                src={
                  !mostraASenhaSegundoInput
                    ? olhoQueEscondeSenhaImg
                    : olhoQueMostraSenhaImg
                }
                alt=""
              />
            )}
          </div>
          <span className="mensagem-de-erro-do-input">
            {erroNoSegundoInput.texto}
          </span>
        </div>
      </div>
      <div className="botoes-do-formulario-do-cadastro">
        {confirmacaoDasEtapas === 1 && (
          <button onClick={checarEtapa} type="button">
            {configuracoesDoFormulario.textoDoBotaoDeAvanco}
          </button>
        )}
        {confirmacaoDasEtapas === 2 && (
          <button type="submit">
            {configuracoesDoFormulario.textoDoBotaoDeAvanco}
          </button>
        )}
        <p>
          Já possui uma conta? Faça seu
          <Link to="/login"> Login</Link>
        </p>
      </div>
    </form>
  );
}
