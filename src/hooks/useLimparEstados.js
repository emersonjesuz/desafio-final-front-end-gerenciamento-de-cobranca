import { useContext, useEffect } from "react";
import { useLocation } from "react-router-dom";
import ContextoDadosDoUsuario from "../contexto/contextoDosDadosDoUsuario";
import ContextoDeNavegacaoDaHome from "../contexto/contextoDaNavegacao";

export default function useLimparEstados() {
    const {
        listaDeClientes,
        cobrancas,
        setListaTratada,
        setListaCobrancasTratada,
        setStatusFiltroCobrancas,
        setStatusFiltroClientes,
        setFiltroAtivoClientes,
        setFiltroAtivoCobrancas,
        setFiltroDeCobrancasDaHome,
        setFiltroDeClientesDaHome,
        setParametrosDoFiltroCobrancas,
        setParametrosDoFiltroClientes } = useContext(ContextoDadosDoUsuario);
    const { setAbrirModalFiltrarLista } = useContext(ContextoDeNavegacaoDaHome);
    const local = useLocation().pathname;

    useEffect(() => {
        setAbrirModalFiltrarLista(false);

        if (local === "/home/cobrancas") {
            setListaTratada(listaDeClientes);
            setFiltroDeClientesDaHome(false);
            setStatusFiltroClientes(false);
            setFiltroAtivoClientes(false);
            setParametrosDoFiltroClientes(false);
        } else if (local === "/home/clientes") {
            setListaCobrancasTratada(cobrancas);
            setFiltroDeCobrancasDaHome(false);
            setStatusFiltroCobrancas(false);
            setFiltroAtivoCobrancas(false);
            setParametrosDoFiltroCobrancas({
                status: "",
                data: "",
            });
        } else {
            setListaTratada(listaDeClientes);
            setStatusFiltroClientes(false);
            setFiltroAtivoClientes(false);
            setFiltroDeCobrancasDaHome(false);
            setFiltroDeClientesDaHome(false);
            setParametrosDoFiltroClientes(false);
            setListaCobrancasTratada(cobrancas);
            setStatusFiltroCobrancas(false);
            setFiltroAtivoCobrancas(false);
            setParametrosDoFiltroCobrancas({
                status: "",
                data: "",
            });
        }
    }, [])
}