import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const NavBar = () => {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUsuario(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUsuario(null);
    navigate("/");
  };

  return (
    <nav style={styles.navbar}>
      <div style={styles.navContainer}>
        <div style={styles.logoContainer}>
          <Link to="/feed" style={styles.logo}>
            Lumen Colares
          </Link>
          <span style={styles.tagline}>Artesanato & Conexões</span>
        </div>

        <div style={styles.navLinks}>
          <Link to="/feed" style={styles.navLink}>
            📝 Feed
          </Link>
          <Link to="/noticias" style={styles.navLink}>
            📰 Notícias
          </Link>
          <Link to="/bus" style={styles.navLink}>
            🚌 Ônibus
          </Link>
          <Link to="/solicitacoes" style={styles.navLink}>
            🔄 Solicitações
          </Link>
        </div>

        <div style={styles.userSection}>
          {usuario ? (
            <>
              <Link to={`/user/${usuario.id}`} style={styles.userInfo}>
                <img
                  src={
                    usuario.avatar ||
                    `https://i.pravatar.cc/40?u=${usuario.email}`
                  }
                  alt={usuario.nome}
                  style={styles.userAvatar}
                />
                <span style={styles.userName}>
                  {usuario.nome?.split(" ")[0]}
                </span>
              </Link>
              <button onClick={handleLogout} style={styles.logoutBtn}>
                Sair
              </button>
            </>
          ) : (
            <Link to="/" style={styles.loginBtn}>
              🔐 Entrar
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

const styles = {
  navbar: {
    backgroundColor: "#2c3e50",
    color: "white",
    padding: "0 20px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    position: "sticky",
    top: 0,
    zIndex: 1000,
  },
  navContainer: {
    maxWidth: "1200px",
    margin: "0 auto",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    height: "70px",
  },
  logoContainer: {
    display: "flex",
    flexDirection: "column",
  },
  logo: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    color: "#3498db",
    textDecoration: "none",
    ":hover": {
      color: "#2980b9",
    },
  },
  tagline: {
    fontSize: "12px",
    color: "#bdc3c7",
    marginTop: "2px",
  },
  navLinks: {
    display: "flex",
    gap: "25px",
    alignItems: "center",
  },
  navLink: {
    color: "white",
    textDecoration: "none",
    fontSize: "16px",
    padding: "8px 12px",
    borderRadius: "5px",
    transition: "all 0.3s",
    ":hover": {
      backgroundColor: "rgba(255,255,255,0.1)",
    },
  },
  navLinkTeste: {
    color: "#f1c40f",
    textDecoration: "none",
    fontSize: "14px",
    padding: "6px 12px",
    borderRadius: "5px",
    backgroundColor: "rgba(241, 196, 15, 0.1)",
    border: "1px solid #f1c40f",
    ":hover": {
      backgroundColor: "rgba(241, 196, 15, 0.2)",
    },
  },
  userSection: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
  },
  userInfo: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    textDecoration: "none",
    color: "white",
    ":hover": {
      opacity: 0.9,
    },
  },
  userAvatar: {
    width: "35px",
    height: "35px",
    borderRadius: "50%",
    border: "2px solid #3498db",
  },
  userName: {
    fontSize: "14px",
    fontWeight: "bold",
  },
  logoutBtn: {
    backgroundColor: "#e74c3c",
    color: "white",
    border: "none",
    padding: "8px 15px",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "14px",
    ":hover": {
      backgroundColor: "#c0392b",
    },
  },
  loginBtn: {
    backgroundColor: "#3498db",
    color: "white",
    textDecoration: "none",
    padding: "8px 20px",
    borderRadius: "5px",
    fontSize: "14px",
    ":hover": {
      backgroundColor: "#2980b9",
    },
  },
};

export default NavBar;
