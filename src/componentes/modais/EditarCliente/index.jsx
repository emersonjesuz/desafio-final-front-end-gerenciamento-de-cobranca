import { motion } from "framer-motion";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import Clientes from "../../../assets/formularios/Clientes.png";
import apiBack from "../../../conexao/apiBackEnd";
import viaCep from "../../../conexao/viaCep";
import ContextoDeNavegacaoDaHome from "../../../contexto/contextoDaNavegacao";
import ContextoDadosDoUsuario from "../../../contexto/contextoDosDadosDoUsuario";
import "./style.css";
export default function EditarCliente() {
  const { setAbrirEditarCliente } = useContext(ContextoDeNavegacaoDaHome);
  const {
    dadosDoDetalheDoCliente,
    setDadosDoDetalheDoCliente,
    setListaDeClientes,
    listaDeClientes,
    setListaTratada,
    cobrancas,
    setListaCobrancasTratada,
    setCobrancas,
  } = useContext(ContextoDadosDoUsuario);

  const [erroNoNome, setErroNoNome] = useState(false);
  const [erroNoEmail, setErroNoEmail] = useState(false);
  const [erroNoCpf, setErroNoCpf] = useState(false);
  const [erroNoTelefone, setErroNoTelefone] = useState(false);
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
    complemento: "",
  });

  const dadosDoCliente = {
    id: dadosDoDetalheDoCliente.cliente.id
      ? dadosDoDetalheDoCliente.cliente.id
      : 0,
    nome: dadosDoDetalheDoCliente.cliente.nome
      ? dadosDoDetalheDoCliente.cliente.nome
      : "",
    email: dadosDoDetalheDoCliente.cliente.email
      ? dadosDoDetalheDoCliente.cliente.email
      : "",
    cpf: dadosDoDetalheDoCliente.cliente.cpf
      ? dadosDoDetalheDoCliente.cliente.cpf
      : "",
    telefone: dadosDoDetalheDoCliente.cliente.telefone
      ? dadosDoDetalheDoCliente.cliente.telefone
      : "",
    logradouro: dadosDoDetalheDoCliente.cliente.logradouro
      ? dadosDoDetalheDoCliente.cliente.logradouro
      : "",
    cep: dadosDoDetalheDoCliente.cliente.cep
      ? dadosDoDetalheDoCliente.cliente.cep
      : "",
    bairro: dadosDoDetalheDoCliente.cliente.bairro
      ? dadosDoDetalheDoCliente.cliente.bairro
      : "",
    cidade: dadosDoDetalheDoCliente.cliente.cidade
      ? dadosDoDetalheDoCliente.cliente.cidade
      : "",
    estado: dadosDoDetalheDoCliente.cliente.estado
      ? dadosDoDetalheDoCliente.cliente.estado
      : "",
    complemento: dadosDoDetalheDoCliente.cliente.complemento
      ? dadosDoDetalheDoCliente.cliente.complemento
      : "",
  };

  useEffect(() => {
    const nome = document.querySelector("input[name='nome']");
    const email = document.querySelector("input[name='email']");
    const telefone = document.querySelector("input[name='telefone']");
    const cpf = document.querySelector("input[name='cpf']");
    const complemento = document.querySelector("input[name='complemento']");
    const cep = document.querySelector("input[name='cep']");
    const logradouro = document.querySelector("input[name='logradouro']");
    const cidade = document.querySelector("input[name='cidade']");
    const bairro = document.querySelector("input[name='bairro']");
    const uf = document.querySelector("input[name='uf']");

    nome.value = dadosDoCliente.nome;
    email.value = dadosDoCliente.email;
    telefone.value = dadosDoCliente.telefone;
    cpf.value = dadosDoCliente.cpf;
    complemento.value = dadosDoCliente.complemento;
    cep.value = dadosDoCliente.cep;
    logradouro.value = dadosDoCliente.logradouro;
    cidade.value = dadosDoCliente.cidade;
    bairro.value = dadosDoCliente.bairro;
    uf.value = dadosDoCliente.estado;

    setDadosDoFormulario({
      nome: dadosDoCliente.nome,
      email: dadosDoCliente.email,
      cpf: dadosDoCliente.cpf,
      telefone: dadosDoCliente.telefone,
      logradouro: dadosDoCliente.logradouro,
      cep: dadosDoCliente.cep,
      bairro: dadosDoCliente.bairro,
      cidade: dadosDoCliente.cidade,
      uf: dadosDoCliente.estado,
      complemento: dadosDoCliente.complemento,
    });
  }, [dadosDoDetalheDoCliente]);

  useEffect(() => {
    const endereço = document.querySelector("input[name='logradouro']");
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

    setAbrirEditarCliente(false);
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
      !dadosDoFormulario.cpf ||
      (dadosDoFormulario.cep !== "" && dadosDoFormulario.cep.length < 8)
    ) {
      return false;
    }

    return true;
  }

  async function editarCliente(event) {
    event.preventDefault();
    event.stopPropagation();

    if (!validarDados()) {
      return;
    }

    const toastCarregando = toast.loading("Verificando dados...");

    const dadosDoClienteAtualizado = {
      id: dadosDoCliente.id,
      nome: dadosDoFormulario.nome,
      email: dadosDoFormulario.email,
      telefone: dadosDoFormulario.telefone,
      cpf: dadosDoFormulario.cpf,
      cep: dadosDoFormulario.cep,
      logradouro: dadosDoFormulario.logradouro,
      complemento: dadosDoFormulario.complemento,
      bairro: dadosDoFormulario.bairro,
      cidade: dadosDoFormulario.cidade,
      estado: dadosDoFormulario.uf,
    };
    const { id } = dadosDoCliente;
    if (!id) return;

    try {
      await apiBack.put(`/cliente/editar/${id}`, dadosDoClienteAtualizado);

      const cobrancasAtualizadas = cobrancas.map((cobranca) => {
        if (cobranca.id_cliente === id) {
          return { ...cobranca, cliente: dadosDoClienteAtualizado.nome };
        } else return cobranca;
      });
      setCobrancas(cobrancasAtualizadas);
      setListaCobrancasTratada(cobrancasAtualizadas);

      toast.update(toastCarregando, {
        render: "Edição do cliente concluída com sucesso!",
        isLoading: false,
        type: "success",
      });

      const filtrarCobrancaVencida = cobrancas.filter(
        (cobranca) =>
          cobranca.id_cliente === id && cobranca.status === "vencida"
      );

      dadosDoClienteAtualizado.status = filtrarCobrancaVencida.length
        ? "Inadimplente"
        : "Em dia";

      const filtrandoClientesDiferentesDoEditado = listaDeClientes.filter(
        (cliente) => cliente.id !== id
      );

      setDadosDoDetalheDoCliente({
        ...dadosDoDetalheDoCliente,
        cliente: dadosDoClienteAtualizado,
        cobrancas: dadosDoDetalheDoCliente.cobrancas,
      });

      setListaDeClientes([
        dadosDoClienteAtualizado,
        ...filtrandoClientesDiferentesDoEditado,
      ]);
      setListaTratada([
        dadosDoClienteAtualizado,
        ...filtrandoClientesDiferentesDoEditado,
      ]);

      return cancelarFormulario();
    } catch (erro) {
      toast.update(toastCarregando, {
        render: erro.response.data.mensagem,
        isLoading: false,
        type: "error",
      });

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
      className="modal-editar"
      key="modal-editar-cliente"
    >
      <div className="conteudo-modal">
        <div className="caixa-titulo-modal-editar-cliente">
          <div className="icone-titulo-modal-editar-cliente">
            <img
              src={Clientes}
              alt="Ícone representando clientes, com duas pessoas juntas"
            />
            <h1>Editar Cliente</h1>
          </div>
          <span
            className="fechar-modal-editar-cliente"
            onClick={() => {
              setAbrirEditarCliente(false);
            }}
          >
            &times;
          </span>
        </div>

        <form
          method="post"
          className="formulario-modal-editar-cliente"
          onSubmit={editarCliente}
        >
          <div className="linha-modal">
            <div className="caixa-input-modal-editar-cliente">
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
                <p className="mensagem-erro">Este campo deve ser preenchido</p>
              )}
            </div>
          </div>
          <div className="linha-modal">
            <div className="caixa-input-modal-editar-cliente">
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
                <p className="mensagem-erro">Este campo deve ser preenchido</p>
              )}
            </div>
          </div>
          <div className="linha-modal">
            <div className="caixa-input-modal-editar-cliente">
              <label htmlFor="cpf">CPF *</label>
              <input
                type="number"
                className="formulario-input"
                placeholder="Digite o CPF"
                name="cpf"
                style={{ borderColor: erroNoCpf && "var(--cor-feedback-erro)" }}
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
                <p className="mensagem-erro">Este campo deve ser preenchido</p>
              )}
            </div>
            <div className="caixa-input-modal-editar-cliente">
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
                <p className="mensagem-erro">Este campo deve ser preenchido</p>
              )}
            </div>
          </div>
          <div className="linha-modal">
            <div className="caixa-input-modal-editar-cliente">
              <label htmlFor="endereco">Endereço</label>
              <input
                type="text"
                className="formulario-input"
                placeholder="Digite o endereço"
                name="logradouro"
                onChange={preencherFormulario}
              />
            </div>
          </div>
          <div className="linha-modal">
            <div className="caixa-input-modal-editar-cliente">
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
          <div className="linha-modal">
            <div className="caixa-input-modal-editar-cliente">
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
            <div className="caixa-input-modal-editar-cliente">
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
          <div className="linha-modal">
            <div className="caixa-input-modal-editar-cliente">
              <label htmlFor="email">Cidade</label>
              <input
                type="text"
                className="formulario-input"
                placeholder="Digite a cidade"
                name="cidade"
                onChange={preencherFormulario}
              />
            </div>
            <div className="caixa-input-modal-editar-cliente input-uf">
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
          <div className="linha-modal linha-botoes">
            <button
              type="reset"
              className="formulario-botao botao-cancelar"
              name="cancelar"
              onClick={() => {
                setAbrirEditarCliente(false);
              }}
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
    </motion.div>
  );
}
