import { motion } from "framer-motion";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import bolhaVerdeDeConfirma from "../../../assets/cadastro/bolha-verde-confirmacao.svg";
import xSairIcone from "../../../assets/formularios/x-sair-icone.svg";
import cobrancasIconePequenoPreto from "../../../assets/home/cobrancas-icone-pequeno-preto.svg";
import apiBack from "../../../conexao/apiBackEnd";
import ContextoDeNavegacaoDaHome from "../../../contexto/contextoDaNavegacao";
import ContextoDadosDoUsuario from "../../../contexto/contextoDosDadosDoUsuario";
import useRastrearPresenca from "../../../hooks/useRastrearPresenca";
import { formatarDataComparacao } from "../../../utils/formatacao";
import "./style.css";
export default function ModalDeCobranca() {
  const [alternaStatus, setAlternaStatus] = useState(false);
  const [formulario, setFormulario] = useState({
    id: 0,
    cliente: "",
    descricao: "",
    vencimento: "",
    valor: 0,
    status: "pendente",
  });
  const { setAbrirModalDeCobranca, escolherQualTipoDoModalDeCobranca } =
    useContext(ContextoDeNavegacaoDaHome);
  const {
    dadosDoDetalheDoCliente,
    setDadosDoDetalheDoCliente,
    cobrancas,
    setCobrancas,
    setListaCobrancasTratada,
    listaTratada,
    setListaTratada,
    listaDeClientes,
    setListaDeClientes,
  } = useContext(ContextoDadosDoUsuario);

  const cliente = {
    nome: Object.keys(dadosDoDetalheDoCliente).length
      ? dadosDoDetalheDoCliente.cliente.nome
      : "",
    id: !Object.keys(dadosDoDetalheDoCliente).length
      ? dadosDoDetalheDoCliente.id
      : dadosDoDetalheDoCliente.cliente.id,
  };

  function preencherFormulario(e) {
    setFormulario({ ...formulario, [e.target.name]: e.target.value });
  }

  function preencherComOsDadosQueVaoSerEditados() {
    const inputDescricao = document.querySelector("#descricao");
    const inputVencimento = document.querySelector("#vencimento");
    const inputValor = document.querySelector("#valor");
    const inputNome = document.querySelector("#nome");

    if (!escolherQualTipoDoModalDeCobranca.tipoDoModal) {
      let dadosDaCobrancaPraSerEditada = [];
      if (cobrancas.length) {
        dadosDaCobrancaPraSerEditada = cobrancas.filter(
          (cobranca) =>
            cobranca.id === escolherQualTipoDoModalDeCobranca.idCobranca
        );
      }

      if (dadosDaCobrancaPraSerEditada.length) {
        setFormulario({
          cliente: dadosDaCobrancaPraSerEditada[0].cliente,
          descricao: dadosDaCobrancaPraSerEditada[0].descricao,
          valor: dadosDaCobrancaPraSerEditada[0].valor,
          vencimento: dadosDaCobrancaPraSerEditada[0].vencimento,
          status:
            dadosDaCobrancaPraSerEditada[0].status !== "pago"
              ? "pendente"
              : "pago",
        });
        setAlternaStatus(
          dadosDaCobrancaPraSerEditada[0].status === "pago" ? true : false
        );

        inputNome.value = dadosDaCobrancaPraSerEditada.length
          ? dadosDaCobrancaPraSerEditada[0].cliente
          : "";
        inputDescricao.value = dadosDaCobrancaPraSerEditada.length
          ? dadosDaCobrancaPraSerEditada[0].descricao
          : "";
        inputValor.value = dadosDaCobrancaPraSerEditada.length
          ? dadosDaCobrancaPraSerEditada[0].valor
          : 0;
        inputVencimento.value = dadosDaCobrancaPraSerEditada.length
          ? formatarDataComparacao(dadosDaCobrancaPraSerEditada[0].vencimento)
          : "";
      }
    }
  }

  useEffect(() => {
    if (!escolherQualTipoDoModalDeCobranca.tipoDoModal) {
      preencherComOsDadosQueVaoSerEditados();
    }
  }, []);

  function validacoesDosCampos() {
    const { descricao, status, valor, vencimento } = formulario;

    const errorDescricao = document.querySelector(".descricao-error");
    const errorVencimento = document.querySelector(".vencimento-error");
    const errorValor = document.querySelector(".valor-error");
    const inputDescricao = document.querySelector("#descricao");
    const inputVencimento = document.querySelector("#vencimento");
    const inputValor = document.querySelector("#valor");

    if (!descricao) {
      toast.warning("Descrição precisa ser preenchida");
      errorDescricao.textContent = "Este  campo deve ser preenchido";
      inputDescricao.style.border = "1px solid red";
      return false;
    }
    const statusEValido = status === "pago" || status === "pendente";
    if (!statusEValido) {
      toast.warning("Status precisa ser selecionado");
      return false;
    }

    if (!vencimento) {
      toast.warning("Vencimento precisar ser preenchido");
      errorVencimento.textContent = "Este campo deve ser preenchido";
      inputVencimento.style.border = "1px solid red";
      inputDescricao.style.border = "0.1rem solid #d0d5dd ";
      errorDescricao.textContent = "";
      return false;
    }

    if (!valor) {
      toast.warning("Valor precisar ser definido");
      inputValor.style.border = "1px solid red";
      inputVencimento.style.border = "0.1rem solid #d0d5dd ";
      inputDescricao.style.border = "0.1rem solid #d0d5dd ";
      errorVencimento.textContent = "Este campo deve ser preenchido";
      errorValor.textContent = "Este campo deve ser preenchido";
      errorDescricao.textContent = "";
      errorVencimento.textContent = "";
      return false;
    }
    inputValor.style.border = "0.1rem solid #d0d5dd ";
    inputVencimento.style.border = "0.1rem solid #d0d5dd ";
    inputDescricao.style.border = "0.1rem solid #d0d5dd ";
    errorDescricao.textContent = "";
    errorValor.textContent = "";
    errorVencimento.textContent = "";
    return true;
  }

  async function fazerAcaoDaCobranca(e) {
    e.preventDefault();

    const verificandoValidacoes = validacoesDosCampos();

    if (!verificandoValidacoes) return;

    const id = escolherQualTipoDoModalDeCobranca.tipoDoModal
      ? cliente.id
      : escolherQualTipoDoModalDeCobranca.idCobranca;

    escolherQualTipoDoModalDeCobranca.tipoDoModal
      ? await fazerCadastro(id)
      : await fazerEdicao(id);

    setAbrirModalDeCobranca(false);

    setTimeout(() => {
      toast.dismiss();
    }, 3000);
  }

  async function fazerEdicao(id) {
    const toastCarregando = toast.loading("Verificando dados...");

    const dadosAtualiadoDaCobranca = {
      ...formulario,
    };
    try {
      await apiBack.put(`/cobrancas/editar/${id}`, dadosAtualiadoDaCobranca);

      const dadosDaCobranca = {
        ...formulario,
        id,
      };

      const verificandoStatusDeVencimento =
        new Date(dadosDaCobranca.vencimento) < new Date()
          ? "vencida"
          : "pendente";

      if (dadosDaCobranca.status === "pendente") {
        dadosDaCobranca.status = verificandoStatusDeVencimento;
      }

      const pegarTodasCobrancasQueSaoDiferentes = cobrancas.filter(
        (cobranca) => cobranca.id !== id
      );
      if (Object.keys(dadosDoDetalheDoCliente).length) {
        const pegarTodasCobrancasDoDetalharQueSaoDiferentes =
          dadosDoDetalheDoCliente.cobrancas.filter(
            (cobranca) => cobranca.id !== id
          );

        setDadosDoDetalheDoCliente({
          cliente: dadosDoDetalheDoCliente.cliente,
          cobrancas: [
            dadosDaCobranca,
            ...pegarTodasCobrancasDoDetalharQueSaoDiferentes,
          ],
        });
      }

      setCobrancas([dadosDaCobranca, ...pegarTodasCobrancasQueSaoDiferentes]);
      setListaCobrancasTratada([
        dadosDaCobranca,
        ...pegarTodasCobrancasQueSaoDiferentes,
      ]);

      toast.update(toastCarregando, {
        render: "Cobrança editada com sucesso!",
        isLoading: false,
        type: "success",
      });
    } catch (error) {
      if (error.response.data.mensagem) {
        toast.update(toastCarregando, {
          render: error.response.data.mensagem,
          isLoading: false,
          type: "error",
        });
        return;
      }
      toast.update(toastCarregando, {
        render: "Edição não concluida!",
        isLoading: false,
        type: "error",
      });
    }
  }

  async function fazerCadastro(id) {
    const toastCarregando = toast.loading("Verificando dados...");

    try {
      let maiorId = -1;
      cobrancas.forEach((cobranca) => {
        if (cobranca.id > maiorId) {
          maiorId = cobranca.id;
        }
      });
      maiorId++;

      const dadosDaCobranca = {
        id: maiorId,
        cliente: cliente.nome,
        descricao: formulario.descricao,
        status: formulario.status,
        valor: +formulario.valor,
        vencimento: formulario.vencimento,
      };
      await apiBack.post(`/cobrancas/cadastro/${id}`, dadosDaCobranca);

      const verificandoStatusDeVencimento =
        new Date(dadosDaCobranca.vencimento) < new Date()
          ? "vencida"
          : "pendente";

      if (dadosDaCobranca.status === "pendente") {
        dadosDaCobranca.status = verificandoStatusDeVencimento;
      }

      setDadosDoDetalheDoCliente({
        cliente: dadosDoDetalheDoCliente.cliente,
        cobrancas: [dadosDaCobranca, ...dadosDoDetalheDoCliente.cobrancas],
      });
      setCobrancas([dadosDaCobranca, ...cobrancas]);
      setListaCobrancasTratada([dadosDaCobranca, ...cobrancas]);

      toast.update(toastCarregando, {
        render: "Cobrança cadastrada com sucesso",
        isLoading: false,
        type: "success",
      });

      const todosClientes = listaDeClientes.filter(
        (cliente) => cliente.id !== id
      );
      const clienteAtual = listaDeClientes.find((cliente) => cliente.id === id);

      if (
        verificandoStatusDeVencimento === "vencida" &&
        dadosDaCobranca.status === "vencida"
      ) {
        clienteAtual.status = "Inadimplente";
      }

      setListaTratada([clienteAtual, ...todosClientes]);
      setListaDeClientes([clienteAtual, ...todosClientes]);
    } catch (error) {
      toast.update(toastCarregando, {
        render: error.response.data.mensagem,
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
      className="container-do-modal-cadastro-cobranca"
      key="modal-cadastro-cobranca"
    >
      <form
        onSubmit={fazerAcaoDaCobranca}
        className="caixa-do-modal-cadastro-cobranca"
      >
        <div className="cabelho-modal-cadastro-cobranca">
          <img src={cobrancasIconePequenoPreto} alt="icone de cobranca" />
          <h2>
            {escolherQualTipoDoModalDeCobranca.tipoDoModal
              ? "Cadastro de Cobrança"
              : "Edição de Cobrança"}
          </h2>
          <img
            onClick={() => setAbrirModalDeCobranca(false)}
            className="x-de-sair-do-modal"
            src={xSairIcone}
            alt="icone de sair"
          />
        </div>
        <div className="coluna-modal-cadastro-cobranca">
          <div className="caixa-do-nome-modal-cadastro-cobranca">
            <label htmlFor="nome">Nome*</label>
            <input
              disabled={true}
              id="nome"
              name="cliente"
              type="text"
              value={escolherQualTipoDoModalDeCobranca.nomeCliente}
              onChange={preencherFormulario}
            />
          </div>
          <div className="caixa-da-descricao-modal-cadastro-cobranca">
            <label htmlFor="descricao">Descrição*</label>
            <textarea
              rows={5}
              id="descricao"
              name="descricao"
              placeholder="Digite a descrição"
              type="text"
              onChange={preencherFormulario}
            ></textarea>
            <span className="erro-no-input descricao-error"></span>
          </div>
          <div className="caixa-do-vencimento-e-valor-modal-cadastro-cobranca">
            <div>
              <label htmlFor="vencimento">Vencimento:*</label>
              <input
                name="vencimento"
                id="vencimento"
                placeholder="Digite o Vencimento"
                type="date"
                onChange={preencherFormulario}
              />
              <span className="erro-no-input vencimento-error"></span>
            </div>
            <div>
              <label htmlFor="valor">Valor:*</label>
              <input
                name="valor"
                id="valor"
                placeholder="Digite o valor"
                type="number"
                onChange={preencherFormulario}
              />
              <span className="erro-no-input valor-error"></span>
            </div>
          </div>
          <div className="caixa-do-status-modal-cadastro-cobranca">
            <label htmlFor="">Status*</label>
            <div>
              <span
                onClick={() => {
                  setFormulario({ ...formulario, status: "pago" });
                  setAlternaStatus(true);
                }}
              >
                {alternaStatus && (
                  <img src={bolhaVerdeDeConfirma} alt="bolha verde" />
                )}
              </span>
              <label>Cobrança Paga</label>
            </div>

            <div>
              <span
                onClick={() => {
                  setFormulario({ ...formulario, status: "pendente" });
                  setAlternaStatus(false);
                }}
              >
                {!alternaStatus && (
                  <img src={bolhaVerdeDeConfirma} alt="bolha verde" />
                )}
              </span>
              <label>Cobrança Pendente</label>
            </div>
          </div>
        </div>
        <div className="caixa-dos-botoes-cadastro-cobranca">
          <button
            type="button"
            onClick={() => setAbrirModalDeCobranca(false)}
            id="botaoCancelar"
          >
            Cancelar
          </button>
          <button id="botaoAplicar">Aplicar</button>
        </div>
      </form>
    </motion.div>
  );
}
