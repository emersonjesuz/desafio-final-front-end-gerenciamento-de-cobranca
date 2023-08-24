import { AnimatePresence, motion } from "framer-motion";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import bolhaDeSucessoIcone from "../../../assets/cadastro/bolha-grande-de-confirmacao.svg";
import olhoMostraSenhaIcone from "../../../assets/formularios/olho-que-exibe-a-senha.png";
import olhoEscondeSenhaIcone from "../../../assets/formularios/olho-que-priva-a-senha.svg";
import xSairIcone from "../../../assets/formularios/x-sair-icone.svg";
import apiBack from "../../../conexao/apiBackEnd";
import ContextoDeNavegacaoDaHome from "../../../contexto/contextoDaNavegacao";
import ContextoDadosDoUsuario from "../../../contexto/contextoDosDadosDoUsuario";
import useRastrearPresenca from "../../../hooks/useRastrearPresenca";

import "./style.css";
export default function AtualizarCadastroDoUsuarioModal() {
  const { setAbrirModalAtualizarCadastro } = useContext(
    ContextoDeNavegacaoDaHome
  );
  const { dadosDoPerfilDoUsuario, setDadosDoPerfilDoUsuario } = useContext(
    ContextoDadosDoUsuario
  );
  const [ativarOlhoDoPrimeiroInput, setOlhoDoPrimeiroInput] = useState(false);
  const [ativarOlhoDoSegundoInput, setOlhoDoSegundoInput] = useState(false);
  const [dadosDoFormulario, setDadosDoFormulario] = useState({
    nome: "",
    email: "",
    cpf: "",
    telefone: "",
    primeiraSenha: "",
    segundaSenha: "",
  });
  const [exibirErros, setExibirErros] = useState({
    nome: false,
    email: false,
    primeiraSenha: false,
    segundaSenha: false,
  });
  const [cadastroEstarAtualizado, setCadastroEstarAtualizado] = useState(false);

  const olhoDaSenhaSegundaInput = ativarOlhoDoSegundoInput
    ? olhoMostraSenhaIcone
    : olhoEscondeSenhaIcone;

  const olhoDaSenhaPrimeiroInput = ativarOlhoDoPrimeiroInput
    ? olhoMostraSenhaIcone
    : olhoEscondeSenhaIcone;

  const erroNoNome = document.querySelector("#erroNoNome");
  const erroNoEmail = document.querySelector("#erroNoEmail");
  const erroPrimeiraSenha = document.querySelector("#erroPrimeiraSenha");
  const erroSegundaSenha = document.querySelector("#erroSegundaSenha");

  function preencherFormularioComDadosDoUsuario() {
    setDadosDoFormulario({
      nome:
        dadosDoPerfilDoUsuario.nome !== null &&
        dadosDoPerfilDoUsuario.nome !== undefined
          ? dadosDoPerfilDoUsuario.nome
          : "",
      email:
        dadosDoPerfilDoUsuario.email !== null &&
        dadosDoPerfilDoUsuario.email !== undefined
          ? dadosDoPerfilDoUsuario.email
          : "",
      cpf:
        dadosDoPerfilDoUsuario.cpf !== null &&
        dadosDoPerfilDoUsuario.cpf !== undefined
          ? dadosDoPerfilDoUsuario.cpf
          : "",
      telefone:
        dadosDoPerfilDoUsuario.telefone !== null &&
        dadosDoPerfilDoUsuario.telefone !== undefined
          ? dadosDoPerfilDoUsuario.telefone
          : "",
    });
  }
  useEffect(() => {
    preencherFormularioComDadosDoUsuario();
  }, [dadosDoPerfilDoUsuario]);

  function preenchendoFormulario(e) {
    e.preventDefault();
    setDadosDoFormulario({
      ...dadosDoFormulario,
      [e.target.name]: e.target.value,
    });
  }

  function validarOsCampos() {
    const { nome, email, primeiraSenha, segundaSenha } = dadosDoFormulario;

    if (!nome) {
      toast.warning("Campo Nome obrigatorio");
      erroNoNome.textContent = "Este campo deve ser preenchido";
      setExibirErros({ ...exibirErros, nome: true });
      return false;
    }

    if (!email) {
      toast.warning("Campo E-mail obrigatorio");
      erroNoNome.textContent = "";
      erroNoEmail.textContent = "Este campo deve ser preenchido";
      setExibirErros({ ...exibirErros, email: true, nome: false });
      return false;
    }
    erroNoNome.textContent = "";
    erroNoEmail.textContent = "";

    if (primeiraSenha && !segundaSenha) {
      erroSegundaSenha.textContent = "Este campo deve ser preenchido";
      erroPrimeiraSenha.textContent = "";
      setExibirErros({
        ...exibirErros,
        segundaSenha: true,
        primeiraSenha: false,
        nome: false,
        email: false,
      });
      toast.error("As senhas não coincidem");
      return false;
    }
    if (!primeiraSenha && segundaSenha) {
      erroSegundaSenha.textContent = "";
      erroPrimeiraSenha.textContent = "Este campo deve ser preenchido";
      setExibirErros({
        ...exibirErros,
        nome: false,
        email: false,
        primeiraSenha: true,
        segundaSenha: false,
      });
      toast.error("As senhas não coincidem");
      return false;
    }
    if (primeiraSenha && segundaSenha && primeiraSenha !== segundaSenha) {
      erroSegundaSenha.textContent = "As senhas não coincidem";
      erroPrimeiraSenha.textContent = "";
      setExibirErros({
        ...exibirErros,
        nome: false,
        email: false,
        primeiraSenha: true,
        segundaSenha: true,
      });
      toast.error("As senhas não coincidem");
      return false;
    }
    if (primeiraSenha && segundaSenha && primeiraSenha.length < 6) {
      erroSegundaSenha.textContent =
        "A senha precisa ter no minimo 6 caracteres ";
      erroPrimeiraSenha.textContent = "";
      setExibirErros({
        ...exibirErros,
        nome: false,
        email: false,
        primeiraSenha: true,
        segundaSenha: true,
      });
      toast.error("Tamanho da senha inválido");
      return false;
    }
    erroNoNome.textContent = "";
    erroNoEmail.textContent = "";
    erroSegundaSenha.textContent = "";
    erroPrimeiraSenha.textContent = "";
    setExibirErros({
      ...exibirErros,
      nome: false,
      email: false,
      primeiraSenha: false,
      segundaSenha: false,
    });
    return true;
  }

  async function fazerAtualizacaoDoDadosDoUsuario(e) {
    e.preventDefault();
    e.stopPropagation();
    const { nome, email, cpf, telefone, primeiraSenha } = dadosDoFormulario;
    const verificaarValidacoesDeToken = validarOsCampos();

    if (!verificaarValidacoesDeToken) return;
    const dadosDoUsuario = {
      nome,
      email,
      cpf,
      telefone,
      senha: primeiraSenha,
    };

    const usuario = await fazerAtualizacaoDoUsuario(dadosDoUsuario);
    if (!usuario) return;
    setDadosDoFormulario({
      ...dadosDoFormulario,
      primeiraSenha: "",
      segundaSenha: "",
    });
    setDadosDoPerfilDoUsuario({ ...dadosDoFormulario });
    setCadastroEstarAtualizado(true);

    setTimeout(() => setAbrirModalAtualizarCadastro(false), 2000);
  }

  async function fazerAtualizacaoDoUsuario(usuario) {
    const toastCarregando = toast.loading("Verificando dados...");
    try {
      await apiBack.patch("/usuario/editar", usuario);
      toast.dismiss();

      setDadosDoPerfilDoUsuario(usuario);
      return true;
    } catch (erro) {
      toast.update(toastCarregando, {
        render: erro.response.data.mensagem,
        isLoading: false,
        type: "error",
      });
    }
  }

  useRastrearPresenca();
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15, velocity: 1 }}
      key="modal-editar-usuario"
      className="container-modal-atualizar-cadastro-usuario"
    >
      {!cadastroEstarAtualizado && (
        <form
          onSubmit={(e) => fazerAtualizacaoDoDadosDoUsuario(e)}
          className="formulario-do-modal-atualizar-cadastro"
        >
          <div className="titulo-do-formulario-atualizar-cadastro">
            <h1>Edite seu cadastro</h1>
            <img
              onClick={() => setAbrirModalAtualizarCadastro(false)}
              className="icone-de-sair"
              src={xSairIcone}
              alt="icone de sair "
            />
          </div>
          <div className="caixa-do-input-atualizar-cadastro">
            <div className="input-atualizar-cadastro">
              <label htmlFor="nome">Nome*</label>
              <input
                id="nome"
                style={{
                  border: exibirErros.nome
                    ? "0.1rem solid #e70000"
                    : "0.1rem solid #d0d5dd",
                }}
                name="nome"
                value={dadosDoFormulario.nome}
                onChange={preenchendoFormulario}
                placeholder="Digite seu nome"
                type="text"
              />
              <span id="erroNoNome" className="mensagem-de-erro"></span>
            </div>
            <div className="input-atualizar-cadastro">
              <label htmlFor="email">E-mail*</label>
              <input
                style={{
                  border: exibirErros.email
                    ? "0.1rem solid #e70000"
                    : "0.1rem solid #d0d5dd ",
                }}
                id="email"
                name="email"
                value={dadosDoFormulario.email}
                onChange={preenchendoFormulario}
                placeholder="Digite seu e-mail"
                type="text"
              />
              <span id="erroNoEmail" className="mensagem-de-erro"></span>
            </div>
            <div className=" caixa-do-input-cpf-e-telefone">
              <div className="">
                <label htmlFor="cpf">CPF</label>
                <input
                  id="cpf"
                  name="cpf"
                  defaultValue={dadosDoFormulario.cpf}
                  onChange={(e) => {
                    if (event.target.value.length > 11) {
                      event.target.value = event.target.value.slice(0, 11);
                    }
                    preenchendoFormulario(e);
                  }}
                  placeholder="Digite seu CPF"
                  type="text"
                />
              </div>
              <div>
                <label htmlFor="telefone">Telefone</label>
                <input
                  id="telefone"
                  name="telefone"
                  defaultValue={dadosDoFormulario.telefone}
                  onChange={(e) => {
                    if (event.target.value.length > 11) {
                      event.target.value = event.target.value.slice(0, 11);
                    }
                    preenchendoFormulario(e);
                  }}
                  placeholder="Digite seu Telefone"
                  type="text"
                />
              </div>
            </div>
            <div className="input-senha-atualizar-cadastro">
              <label htmlFor="primeiraSenha">Nova Senha*</label>
              <div>
                <input
                  style={{
                    border: exibirErros.primeiraSenha
                      ? "0.1rem solid #e70000"
                      : "0.1rem solid #d0d5dd",
                  }}
                  id="primeiraSenha"
                  name="primeiraSenha"
                  onChange={preenchendoFormulario}
                  type={ativarOlhoDoPrimeiroInput ? "text" : "password"}
                />
                <p id="erroPrimeiraSenha" className="mensagem-de-erro"></p>
                <img
                  className="olho-da-senha"
                  onClick={() =>
                    setOlhoDoPrimeiroInput(!ativarOlhoDoPrimeiroInput)
                  }
                  src={olhoDaSenhaPrimeiroInput}
                  alt="olho da senha"
                />
              </div>
            </div>
            <div className="input-senha-atualizar-cadastro">
              <label htmlFor="segundaSenha">Confirmar Senha*</label>
              <div>
                <input
                  style={{
                    border: exibirErros.segundaSenha
                      ? "0.1rem solid #e70000"
                      : "0.1rem solid #d0d5dd",
                  }}
                  id="segundaSenha"
                  name="segundaSenha"
                  onChange={preenchendoFormulario}
                  type={ativarOlhoDoSegundoInput ? "text" : "password"}
                />
                <p id="erroSegundaSenha" className="mensagem-de-erro"></p>
                <img
                  className="olho-da-senha"
                  onClick={() =>
                    setOlhoDoSegundoInput(!ativarOlhoDoSegundoInput)
                  }
                  src={olhoDaSenhaSegundaInput}
                  alt="olho da senha"
                />
              </div>
            </div>
          </div>
          <div className="caixa-do-botao-confirma">
            <button>Aplicar</button>
          </div>
        </form>
      )}
      <AnimatePresence mode="wait">
        {cadastroEstarAtualizado && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15, velocity: 1, ease: "easeIn" }}
            className="container-de-confirmacao"
          >
            <img src={bolhaDeSucessoIcone} alt="icone de cofirmação" />
            <h1>Cadastro Alterado com sucesso!</h1>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
