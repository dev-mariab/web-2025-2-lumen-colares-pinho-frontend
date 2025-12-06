// src/components/SideMenu.jsx
import { useNavigate } from "react-router-dom";

export default function SideMenu({ open, onClose }) {
  const navigate = useNavigate();

  if (!open) return null;

  function goTo(path) {
    onClose();         // fecha o menu
    navigate(path);    // navega para a rota
  }

  return (
    <>
      <div className="side-overlay" onClick={onClose} />

      <aside className={`side-menu ${open ? "open" : ""}`}>
        <div className="side-header">
          <h3>LUMEN</h3>
          <button className="side-close" onClick={onClose}>✕</button>
        </div>

        <nav className="side-nav">
          <button className="side-item" onClick={() => goTo("/found")}>
            Achados e Perdidos
          </button>

          <button
            className="side-item"
            onClick={() => goTo("/bus")}
          >
            Horários dos Ônibus
          </button>
        </nav>
      </aside>
    </>
  );
}
