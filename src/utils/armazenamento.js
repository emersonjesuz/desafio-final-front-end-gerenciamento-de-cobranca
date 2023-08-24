export function criarItemNoLocalStorage(key, value) {
  localStorage.setItem(key, value);
}

export function pegandoItemNoLocalStorage(key) {
  return localStorage.getItem(key);
}

export function removerItemNoLocalStorage(key) {
  localStorage.removeItem(key);
}

export function limparArmazenamentoDoLocalStorage() {
  localStorage.clear();
}