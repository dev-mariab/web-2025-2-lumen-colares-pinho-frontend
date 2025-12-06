import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import SideMenu from "./SideMenu";

export default function NavBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  function handleLogout() {
    navigate("/");
  }

  return (
    <>
      <nav className="nav">
        {/* ESQUERDA */}
        <div className="nav-left" style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          
          {/* BOTÃO MENU */}
          <button
            className="nav-menu"
            onClick={() => setMenuOpen(true)}
            aria-label="Abrir menu"
          >
            ☰
          </button>

          {/* LOGO */}
          <Link to="/feed" className="nav-logo">
            LUMEN
          </Link>


        </div>

        {/* DIREITA */}
        <div className="nav-right">
          <Link
            className={`nav-item ${location.pathname === "/feed" ? "active" : ""}`}
            to="/feed"
          >
            Feed
          </Link>

          <Link
            className={`nav-item ${location.pathname === "/dashboard" ? "active" : ""}`}
            to="/dashboard"
          >
            Dashboard
          </Link>

          <Link
            className={`nav-item ${location.pathname.includes("/user") ? "active" : ""}`}
            to="/user/1"
          >
            Perfil
          </Link>

          <button className="nav-logout" onClick={handleLogout}>
            Sair
          </button>
        </div>
      </nav>

      {/* MENU LATERAL */}
      <SideMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
