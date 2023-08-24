import "./style.css";

export default function BarraDeEtapasDoCadastro({ confirmacaoDasEtapas }) {
  return (
    <>
      <div
        className={confirmacaoDasEtapas === 1 ? "entrou-na-etapa" : "saiu-da-etapa"}
      ></div>
      <div
        className={confirmacaoDasEtapas === 2 ? "entrou-na-etapa" : "saiu-da-etapa"}
      ></div>
      <div
        className={confirmacaoDasEtapas === 3 ? "entrou-na-etapa" : "saiu-da-etapa"}
      ></div>
    </>
  );
}
