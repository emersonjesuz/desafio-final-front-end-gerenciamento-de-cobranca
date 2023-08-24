export function formatarCpf(cpf) {
  const seprandoCpfPorcaracter = cpf.split("");
  const formatando = [];
  for (let index = 0; index < seprandoCpfPorcaracter.length; index++) {
    if (index === 3) {
      formatando.push(".");
    }

    if (index === 6) {
      formatando.push(".");
    }

    if (index === 9) {
      formatando.push("-");
    }
    formatando.push(seprandoCpfPorcaracter[index]);
  }
  const cpfFormatado = formatando.join("");
  return cpfFormatado;
}

export function formatarValor(valor) {
  const valorDecimal = Number(valor) / 100;
  const valorFormatado = valorDecimal.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
  return valorFormatado;
}

export function formatarData(datetime) {
  const data = new Date(datetime);

  const dia = String(data.getDate() + 1).padStart(2, "0");
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  const ano = data.getFullYear();

  return `${dia}/${mes}/${ano}`;
}

export function formatarCep(cep) {
  if (cep === null) return "";
  const separandoCepPorCaracter = cep.split("");
  const fazendoAFormatacaoDoCep = [];
  for (let index = 0; index < separandoCepPorCaracter.length; index++) {
    if (index === separandoCepPorCaracter.length - 3) {
      fazendoAFormatacaoDoCep.push("-");
    }
    fazendoAFormatacaoDoCep.push(separandoCepPorCaracter[index]);
  }
  const cepFormatado = fazendoAFormatacaoDoCep.join("");
  return cepFormatado;
}

export function formatarTelefone(telefone) {
  const separandoTelefonePorCaracter = telefone.split("");
  const fazendoAFormatacaoDoTelefone = [];
  if (separandoTelefonePorCaracter.length === 11) {
    for (let index = 0; index < separandoTelefonePorCaracter.length; index++) {
      if (!index) {
        fazendoAFormatacaoDoTelefone.push("(");
      }
      if (index === 2) {
        fazendoAFormatacaoDoTelefone.push(") ");
      }
      if (index === 3) {
        fazendoAFormatacaoDoTelefone.push(" ");
      }
      if (index === 7) {
        fazendoAFormatacaoDoTelefone.push("-");
      }
      fazendoAFormatacaoDoTelefone.push(separandoTelefonePorCaracter[index]);
    }
    const telefoneJaFormatado = fazendoAFormatacaoDoTelefone.join("");
    return telefoneJaFormatado;
  } else if (separandoTelefonePorCaracter.length === 10) {
    for (let index = 0; index < separandoTelefonePorCaracter.length; index++) {
      if (!index) {
        fazendoAFormatacaoDoTelefone.push("(");
      }
      if (index === 2) {
        fazendoAFormatacaoDoTelefone.push(") ");
      }
      if (index === 6) {
        fazendoAFormatacaoDoTelefone.push("-");
      }
      fazendoAFormatacaoDoTelefone.push(separandoTelefonePorCaracter[index]);
    }
    const telefoneJaFormatado = fazendoAFormatacaoDoTelefone.join("");
    return telefoneJaFormatado;
  } else {
    return telefone;
  }
}

export function formatarDataComparacao(datetime) {
  const data = new Date(datetime);

  const dia = String(data.getDate() + 1).padStart(2, "0");
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  const ano = data.getFullYear();

  return `${ano}-${mes}-${dia}`;
}