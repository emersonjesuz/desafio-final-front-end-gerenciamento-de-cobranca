import "./style.css";

export default function CartaoDeCobrancas({
  tipoCobranca,
  valorCobranca,
  nomeDaCobranca,
  iconeDaCobranca,
}) {
  return (
    <div className={`total-cobrancas  ${tipoCobranca}`}>
      <img src={iconeDaCobranca} alt={`icone de ${nomeDaCobranca}`} />
      <div className="total-cobrancas-texto">
        <div className="total-cobrancas-titulo">{nomeDaCobranca}</div>
        <div className="total-cobrancas-valor">{valorCobranca}</div>
      </div>
    </div>
  );
}
