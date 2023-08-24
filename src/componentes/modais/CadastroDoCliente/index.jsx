import { motion } from "framer-motion";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Clientes from "../../../assets/formularios/Clientes.png";
import apiBack from "../../../conexao/apiBackEnd";
import viaCep from "../../../conexao/viaCep";
import ContextoDeNavegacaoDaHome from "../../../contexto/contextoDaNavegacao";
import ContextoDadosDoUsuario from "../../../contexto/contextoDosDadosDoUsuario";
import useRastrearPresenca from "../../../hooks/useRastrearPresenca";
import "./style.css";

export default function CadastroDoClienteModal() {
  const [erroNoNome, setErroNoNome] = useState(false);
  const [erroNoEmail, setErroNoEmail] = useState(false);
  const [erroNoCpf, setErroNoCpf] = useState(false);
  const [erroNoTelefone, setErroNoTelefone] = useState(false);
  const { listaDeClientes, setListaDeClientes, listaTratada, setListaTratada } =
    useContext(ContextoDadosDoUsuario);
  const { setAbrirModalCadastrarCliente } = useContext(
    ContextoDeNavegacaoDaHome
  );
  const [dadosDoFormulario, setDadosDoFormulario] = useState({
    nome: "",
    email: "",
    cpf: "",
    telefone: "",
    logradouro: "",
    cep: "",
    bairro: "",
    cidade: "",
    uf: "",
    status: "Em dia",
  });

  useRastrearPresenca();

  useEffect(() => {
    const endereço = document.querySelector("input[name='endereço']");
    const cidade = document.querySelector("input[name='cidade']");
    const bairro = document.querySelector("input[name='bairro']");
    const uf = document.querySelector("input[name='uf']");

    endereço.value = dadosDoFormulario.logradouro;
    cidade.value = dadosDoFormulario.cidade;
    bairro.value = dadosDoFormulario.bairro;
    uf.value = dadosDoFormulario.uf;
  }, [dadosDoFormulario]);

  function preencherFormulario() {
    if (event.target.name === "endereço") {
      setDadosDoFormulario({
        ...dadosDoFormulario,
        logradouro: event.target.value,
      });
    } else {
      setDadosDoFormulario({
        ...dadosDoFormulario,
        [event.target.name]: event.target.value,
      });
    }
  }

  async function pesquisarCep(event) {
    const cep = Number(
      event.target.value
        .split("")
        .filter((caractere) => !isNaN(Number(caractere)))
        .join("")
    );

    try {
      const { data } = await viaCep.get(`${cep}/json/`);

      if (Object.keys(data).length === 1) {
        return toast.error("CEP não retornou um endereço válido.");
      }

      if (event.target.value !== dadosDoFormulario.cep) {
        setDadosDoFormulario({
          ...dadosDoFormulario,
          cep: event.target.value,
          logradouro: data.logradouro,
          cidade: data.localidade,
          bairro: data.bairro,
          uf: data.uf,
        });
      } else {
        setDadosDoFormulario({
          ...dadosDoFormulario,
          logradouro: data.logradouro,
          cidade: data.localidade,
          bairro: data.bairro,
          uf: data.uf,
        });
      }
    } catch {
      return toast.error("CEP não retornou um endereço válido.");
    }
  }

  function cancelarFormulario() {
    const inputs = document.querySelectorAll(".formulario-input");

    for (const input of inputs) {
      input.value = "";
    }

    setErroNoNome(false);
    setErroNoEmail(false);
    setErroNoCpf(false);
    setErroNoTelefone(false);
    setDadosDoFormulario({
      nome: "",
      email: "",
      cpf: "",
      telefone: "",
      logradouro: "",
      complemento: "",
      cep: "",
      bairro: "",
      cidade: "",
      uf: "",
    });

    setAbrirModalCadastrarCliente(false);

    setTimeout(() => {
      toast.dismiss();
    }, 3000);
  }

  function validarDados() {
    if (!dadosDoFormulario.nome) {
      setErroNoNome(true);
      toast.warning("Nome obrigatório!");
    }
    if (!dadosDoFormulario.email) {
      setErroNoEmail(true);
      toast.warning("E-mail obrigatório!");
    }
    if (!dadosDoFormulario.telefone) {
      setErroNoTelefone(true);
      toast.warning("Telefone obrigatório!");
    } else if (dadosDoFormulario.telefone.length < 10) {
      setErroNoTelefone(true);
      toast.warning("Telefone deve incluir DDD!");
    } else if (dadosDoFormulario.telefone.length > 11) {
      setErroNoTelefone(true);
      toast.warning("Telefone deve possuir um numero válido de digitos!");
    }
    if (!dadosDoFormulario.cpf) {
      setErroNoCpf(true);
      toast.warning("CPF obrigatório!");
    }
    if (dadosDoFormulario.cep !== "" && dadosDoFormulario.cep.length < 8) {
      toast.warning("CEP precisa ter 8 dígitos!");
    }
    if (
      !dadosDoFormulario.nome ||
      !dadosDoFormulario.email ||
      !dadosDoFormulario.telefone ||
      dadosDoFormulario.telefone.length < 10 ||
      dadosDoFormulario.telefone.length > 11 ||
      !dadosDoFormulario.cpf ||
      (dadosDoFormulario.cep !== "" && dadosDoFormulario.cep.length < 8)
    ) {
      return false;
    }

    return true;
  }

  async function cadastrarCliente(event) {
    event.preventDefault();
    event.stopPropagation();

    if (!validarDados()) {
      return;
    }

    const toastCarregando = toast.loading("Verificando dados...");
    try {
      await apiBack.post("/cliente/cadastro", dadosDoFormulario);

      toast.update(toastCarregando, {
        render: "Cadastro efetuado!",
        type: "success",
        isLoading: false,
      });

      const dadosDoCliente = {
        ...dadosDoFormulario,
        id: listaDeClientes.length + 1,
      };
      setListaDeClientes([dadosDoCliente, ...listaDeClientes]);
      setListaTratada([dadosDoCliente, ...listaTratada]);

      return cancelarFormulario();
    } catch (error) {
      const erro = await JSON.parse(error.request.response);

      if (erro.mensagem) {
        toast.update(toastCarregando, {
          render: erro.mensagem,
          type: "error",
          isLoading: false,
        });
      } else if (erro.message) {
        toast.update(toastCarregando, {
          render: erro.message,
          type: "error",
          isLoading: false,
        });
      }

      setTimeout(() => {
        toast.dismiss();
      }, 3000);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15, velocity: 1 }}
      className="modal-backdrop-cadastro-cliente"
    >
      <div className="modal-cadastro-cliente">
        <div className="conteudo-modal-cadastro-cliente">
          <div className="linha-modal-cadastro-cliente">
            <div className="icone-titulo">
              <img
                src={Clientes}
                alt="Ícone representando clientes, com duas pessoas juntas"
              />
              <h1>Cadastro do Cliente</h1>
            </div>

            <span className="fechar-modal" onClick={cancelarFormulario}>
              &times;
            </span>
          </div>

          <form
            method="post"
            className="formulario-cadastro-cliente"
            onSubmit={() => cadastrarCliente(event)}
          >
            <div className="linha-modal-cadastro-cliente">
              <div className="caixa-input">
                <label htmlFor="nome">Nome *</label>
                <input
                  type="text"
                  className="formulario-input"
                  placeholder="Digite o nome"
                  name="nome"
                  style={{
                    borderColor: erroNoNome && "var(--cor-feedback-erro)",
                  }}
                  onChange={() => {
                    if (erroNoNome) {
                      setErroNoNome(false);
                    }
                    preencherFormulario();
                  }}
                />
                {erroNoNome && (
                  <p className="mensagem-erro">
                    Este campo deve ser preenchido
                  </p>
                )}
              </div>
            </div>
            <div className="linha-modal-cadastro-cliente">
              <div className="caixa-input">
                <label htmlFor="email">E-mail *</label>
                <input
                  type="email"
                  className="formulario-input"
                  placeholder="Digite o e-mail"
                  name="email"
                  style={{
                    borderColor: erroNoEmail && "var(--cor-feedback-erro)",
                  }}
                  onChange={() => {
                    if (erroNoEmail) {
                      setErroNoEmail(false);
                    }
                    preencherFormulario();
                  }}
                />
                {erroNoEmail && (
                  <p className="mensagem-erro">
                    Este campo deve ser preenchido
                  </p>
                )}
              </div>
            </div>
            <div className="linha-modal-cadastro-cliente">
              <div className="caixa-input">
                <label htmlFor="cpf">CPF *</label>
                <input
                  type="number"
                  className="formulario-input"
                  placeholder="Digite o CPF"
                  name="cpf"
                  style={{
                    borderColor: erroNoCpf && "var(--cor-feedback-erro)",
                  }}
                  onChange={() => {
                    if (erroNoCpf) {
                      return setErroNoCpf(false);
                    } else if (event.target.value.length > 11) {
                      event.target.value = event.target.value.slice(0, 11);
                    }
                    preencherFormulario();
                  }}
                />
                {erroNoCpf && (
                  <p className="mensagem-erro">
                    Este campo deve ser preenchido
                  </p>
                )}
              </div>
              <div className="caixa-input">
                <label htmlFor="telefone">Telefone *</label>
                <input
                  type="tel"
                  className="formulario-input"
                  placeholder="Digite o telefone"
                  name="telefone"
                  style={{
                    borderColor: erroNoTelefone && "var(--cor-feedback-erro)",
                  }}
                  onChange={() => {
                    if (erroNoTelefone) {
                      setErroNoTelefone(false);
                    } else if (event.target.value.length > 11) {
                      event.target.value = event.target.value.slice(0, 11);
                    }
                    preencherFormulario();
                  }}
                />
                {erroNoTelefone && (
                  <p className="mensagem-erro">
                    Este campo deve ser preenchido
                  </p>
                )}
              </div>
            </div>
            <div className="caixa-input">
              <label htmlFor="endereço">Endereço</label>
              <input
                type="text"
                className="formulario-input"
                placeholder="Digite o endereço"
                name="endereço"
                onChange={preencherFormulario}
              />
            </div>
            <div className="linha-modal-cadastro-cliente">
              <div className="caixa-input">
                <label htmlFor="complemento">Complemento</label>
                <input
                  type="text"
                  className="formulario-input"
                  placeholder="Digite o complemento"
                  name="complemento"
                  onChange={preencherFormulario}
                />
              </div>
            </div>
            <div className="linha-modal-cadastro-cliente">
              <div className="caixa-input">
                <label htmlFor="cep">CEP</label>
                <input
                  type="number"
                  className="formulario-input"
                  placeholder="Digite o CEP"
                  name="cep"
                  onChange={async () => {
                    preencherFormulario();
                    if (event.target.value.length < 8) return;

                    if (event.target.value.length === 8) {
                      await pesquisarCep(event);
                    } else if (event.target.value.length > 8) {
                      return (event.target.value = event.target.value.slice(
                        0,
                        8
                      ));
                    }
                  }}
                />
              </div>
              <div className="caixa-input">
                <label htmlFor="bairro">Bairro</label>
                <input
                  type="text"
                  className="formulario-input"
                  placeholder="Digite o bairro"
                  name="bairro"
                  onChange={preencherFormulario}
                />
              </div>
            </div>
            <div className="linha-modal-cadastro-cliente">
              <div className="caixa-input">
                <label htmlFor="email">Cidade</label>
                <input
                  type="text"
                  className="formulario-input"
                  placeholder="Digite a cidade"
                  name="cidade"
                  onChange={preencherFormulario}
                />
              </div>
              <div className="caixa-input input-uf">
                <label htmlFor="uf">UF</label>
                <input
                  type="text"
                  className="formulario-input"
                  placeholder="Digite a UF"
                  name="uf"
                  maxLength={2}
                  onChange={preencherFormulario}
                />
              </div>
            </div>
            <div className="linha-modal-cadastro-cliente linha-botoes">
              <button
                type="reset"
                className="formulario-botao botao-cancelar"
                name="cancelar"
                onClick={cancelarFormulario}
              >
                Cancelar
              </button>

              <button
                type="submit"
                className="formulario-botao botao-cadastrar"
                placeholder="Digite seu e-mail"
                name="cadastrar"
              >
                Aplicar
              </button>
            </div>
          </form>
        </div>
      </div>
    </motion.div>
  );
}
