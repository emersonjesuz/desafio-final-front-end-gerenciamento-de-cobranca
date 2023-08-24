import "./style.css";
import { useNavigate } from "react-router-dom";

export default function ErroDeRotas() {
  const navigate = useNavigate();
  setTimeout(() => {
    navigate("/login");
  }, "6000");

  return (
    <div className="container">
      <div className="caixa-da-rota-de-erro">
        <h1>404</h1>
        <p>Página não encontrada</p>
        <small>
          Você será redirecionado à página principal em alguns instantes...
        </small>
      </div>
    </div>
  );
}
