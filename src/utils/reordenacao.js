export default function reordenarLista(
    parametroDeOrdenacao,
    ordem,
    setOrdem,
    setLista,
    listaOriginal,
    listaFiltrada) {
    switch (parametroDeOrdenacao) {
        case "id":
            if (ordem === "crescente" && listaFiltrada) {
                setOrdem("decrescente");
                setLista(
                    [...listaFiltrada].sort((a, b) => {
                        if (a.id < b.id) return -1;
                        if (a.id > b.id) return 1;
                        return 0;
                    })
                );
            } else if (ordem === "decrescente" && listaFiltrada) {
                setOrdem("crescente");
                setLista(
                    [...listaFiltrada].sort((a, b) => {
                        if (a.id > b.id) return -1;
                        if (a.id < b.id) return 1;
                        return 0;
                    })
                );
            } else if (ordem === "crescente") {
                setOrdem("decrescente");
                setLista(
                    [...listaOriginal].sort((a, b) => {
                        if (a.id < b.id) return -1;
                        if (a.id > b.id) return 1;
                        return 0;
                    })
                );
            } else {
                setOrdem("crescente");
                setLista(
                    [...listaOriginal].sort((a, b) => {
                        if (a.id > b.id) return -1;
                        if (a.id < b.id) return 1;
                        return 0;
                    })
                );
            }
            break;
        case "cliente":
            if (ordem === "crescente" && listaFiltrada) {
                setOrdem("decrescente");
                setLista(
                    [...listaFiltrada].sort((a, b) => {
                        if (a.cliente.toLowerCase() < b.cliente.toLowerCase()) return -1;
                        if (a.cliente.toLowerCase() > b.cliente.toLowerCase()) return 1;
                        return 0;
                    })
                );
            } else if (ordem === "decrescente" && listaFiltrada) {
                setOrdem("crescente");
                setLista(
                    [...listaFiltrada].sort((a, b) => {
                        if (a.cliente.toLowerCase() > b.cliente.toLowerCase()) return -1;
                        if (a.cliente.toLowerCase() < b.cliente.toLowerCase()) return 1;
                        return 0;
                    })
                );
            } else if (ordem === "crescente") {
                setOrdem("decrescente");
                setLista(
                    [...listaOriginal].sort((a, b) => {
                        if (a.cliente.toLowerCase() < b.cliente.toLowerCase()) return -1;
                        if (a.cliente.toLowerCase() > b.cliente.toLowerCase()) return 1;
                        return 0;
                    })
                );
            } else {
                setOrdem("crescente");
                setLista(
                    [...listaOriginal].sort((a, b) => {
                        if (a.cliente.toLowerCase() > b.cliente.toLowerCase()) return -1;
                        if (a.cliente.toLowerCase() < b.cliente.toLowerCase()) return 1;
                        return 0;
                    })
                );
            }
            break;
        case "nome":
            if (ordem === "crescente" && listaFiltrada) {
                setOrdem("decrescente");
                setLista([...listaFiltrada].sort((a, b) => {
                    if (a.nome.toLowerCase() < b.nome.toLowerCase()) return -1;
                    if (a.nome.toLowerCase() > b.nome.toLowerCase()) return 1;
                    return 0;
                })
                );
            } else if (ordem === "decrescente" && listaFiltrada) {
                setOrdem("crescente");
                setLista([...listaFiltrada].sort((a, b) => {
                    if (a.nome.toLowerCase() > b.nome.toLowerCase()) return -1;
                    if (a.nome.toLowerCase() < b.nome.toLowerCase()) return 1;
                    return 0;
                })
                );
            } else if (ordem === "crescente") {
                setOrdem("decrescente");
                setLista([...listaOriginal].sort((a, b) => {
                    if (a.nome.toLowerCase() < b.nome.toLowerCase()) return -1;
                    if (a.nome.toLowerCase() > b.nome.toLowerCase()) return 1;
                    return 0;
                })
                );
            } else {
                setOrdem("crescente");
                setLista([...listaOriginal].sort((a, b) => {
                    if (a.nome.toLowerCase() > b.nome.toLowerCase()) return -1;
                    if (a.nome.toLowerCase() < b.nome.toLowerCase()) return 1;
                    return 0;
                })
                );
            }
            break;
        case "data":
            if (ordem === "crescente" && listaFiltrada) {
                setOrdem("decrescente");
                setLista(
                    [...listaFiltrada].sort((a, b) => {
                        if (a.vencimento < b.vencimento) return -1;
                        if (a.vencimento > b.vencimento) return 1;
                        return 0;
                    })
                );
            } else if (ordem === "decrescente" && listaFiltrada) {
                setOrdem("crescente");
                setLista(
                    [...listaFiltrada].sort((a, b) => {
                        if (a.vencimento > b.vencimento) return -1;
                        if (a.vencimento < b.vencimento) return 1;
                        return 0;
                    })
                );
            } else if (ordem === "crescente") {
                setOrdem("decrescente");
                setLista(
                    [...listaOriginal].sort((a, b) => {
                        if (a.vencimento < b.vencimento) return -1;
                        if (a.vencimento > b.vencimento) return 1;
                        return 0;
                    })
                );
            } else {
                setOrdem("crescente");
                setLista(
                    [...listaOriginal].sort((a, b) => {
                        if (a.vencimento > b.vencimento) return -1;
                        if (a.vencimento < b.vencimento) return 1;
                        return 0;
                    })
                );
            }
            break;
        default:
            break;
    }
}