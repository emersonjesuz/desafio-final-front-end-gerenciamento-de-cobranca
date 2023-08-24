import { motion } from "framer-motion";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import olhoQueMostraSenha from "../../assets/formularios/olho-que-exibe-a-senha.png";
import olhoQueEscondeSenha from "../../assets/formularios/olho-que-priva-a-senha.svg";
import MacbookFundo from "../../assets/notebook.png";
import apiBack from "../../conexao/apiBackEnd";
import useRastrearPresenca from "../../hooks/useRastrearPresenca";
import { criarItemNoLocalStorage } from "../../utils/armazenamento";
import "./style.css";

export default function Login() {
  const redirecionar = useNavigate();
  const [erroNoPrimeiroInput, setErroNoPrimeiroInput] = useState(false);
  const [erroNoSegundoInput, setErroNoSegundoInput] = useState(false);
  const [exibirASenha, setExibirASenha] = useState(false);
  const [dadosDoFormulario, setDadosDoFormulario] = useState({
    email: "",
    senha: "",
  });

  function preencherFormulario() {
    setDadosDoFormulario({
      ...dadosDoFormulario,
      [event.target.name]: event.target.value,
    });
  }

  async function enviarLogin(event) {
    event.preventDefault();
    event.stopPropagation();

    if (!dadosDoFormulario.email) {
      toast.warning("E-mail obrigatório!");
      setErroNoPrimeiroInput(true);
    }
    if (!dadosDoFormulario.senha) {
      toast.warning("Senha obrigatória!");
      setErroNoSegundoInput(true);
    }
    if (!dadosDoFormulario.email || !dadosDoFormulario.senha) {
      return;
    }

    const toastCarregando = toast.loading("Verificando dados...");

    try {
      const login = await apiBack.post("/usuario/login", dadosDoFormulario);

      criarItemNoLocalStorage("token", login.data.token);
      toast.update(toastCarregando, {
        render: "Login efetuado!",
        isLoading: false,
        type: "success",
      });

      setTimeout(() => {
        return redirecionar("/home");
      }, 2000);
    } catch (error) {
      toast.update(toastCarregando, {
        render: error.response.data.mensagem,
        type: "error",
        isLoading: false,
      });

      setTimeout(() => {
        toast.dismiss();
      }, 3000);
    }
  }
  useRastrearPresenca();
  return (
    <motion.div
      key="login"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15, velocity: 1 }}
      className="container-conteudo"
    >
      <ToastContainer
        hideProgressBar={true}
        closeOnClick={true}
        pauseOnHover={false}
        theme="colored"
        style={{ fontSize: "2rem" }}
      />
      <div className="slogan">
        Gerencie todos os pagamentos da sua empresa em um só lugar.
      </div>
      <img
        className="imagem-lateral"
        src={MacbookFundo}
        alt="Macbook em uma mesa de escritório ao lado de um copo de água com uma folha parcialmente imersa"
      />

      <div className="container-login">
        <form
          method="post"
          className="form-login"
          onSubmit={() => enviarLogin(event)}
        >
          <h1 className="titulo-do-formulario">Faça seu login!</h1>
          <div className="inputs-do-formulario">
            <div className="label-input">
              <label htmlFor="email">E-mail</label>
              <input
                style={{
                  borderColor:
                    erroNoPrimeiroInput && "var(--cor-feedback-erro)",
                }}
                type="email"
                className="caixa-input-login"
                placeholder="Digite seu e-mail"
                name="email"
                onChange={() => {
                  preencherFormulario();
                  setErroNoPrimeiroInput(false);
                }}
              />
              {erroNoPrimeiroInput && (
                <p className="mensagem-erro">Este campo deve ser preenchido</p>
              )}
            </div>

            <div className="label-input">
              <div className="linha-senha">
                <label htmlFor="senha">Senha</label>
                <Link to="" className="link-recuperar-senha">
                  Esqueceu a senha?
                </Link>
              </div>
              <div className="caixa-input-login">
                <input
                  style={{
                    borderColor:
                      erroNoSegundoInput && "var(--cor-feedback-erro)",
                  }}
                  type={exibirASenha ? "text" : "password"}
                  placeholder="Digite sua senha"
                  name="senha"
                  onChange={() => {
                    preencherFormulario();
                    setErroNoSegundoInput(false);
                  }}
                />

                <img
                  onClick={() => setExibirASenha(!exibirASenha)}
                  src={!exibirASenha ? olhoQueEscondeSenha : olhoQueMostraSenha}
                  alt="olho da senha"
                />
              </div>
              {erroNoSegundoInput && (
                <p className="mensagem-erro">Este campo deve ser preenchido</p>
              )}
            </div>

            <button type="submit" className="botao-enviar">
              Entrar
            </button>
          </div>
          <p className="link-cadastro">
            Ainda não possui uma conta? <Link to="/cadastro">Cadastre-se</Link>
          </p>
        </form>
      </div>
    </motion.div>
  );
}
