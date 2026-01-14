import React, { useState, useEffect } from "react";
import { getComentariosPost, addComentario } from "../api/comentarioService";

const Comentarios = ({ postId }) => {
  const [comentarios, setComentarios] = useState([]);
  const [novoComentario, setNovoComentario] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    carregarComentarios();
  }, [postId]);

  const carregarComentarios = async () => {
    try {
      setCarregando(true);
      const dados = await getComentariosPost(postId);
      setComentarios(dados);
    } catch (error) {
      console.error("Erro ao carregar comentários:", error);
    } finally {
      setCarregando(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!novoComentario.trim()) return;

    try {
      setEnviando(true);
      await addComentario(postId, novoComentario);
      setNovoComentario("");
      await carregarComentarios();
    } catch (error) {
      console.error("Erro ao enviar comentário:", error);
      alert("Faça login para comentar!");
    } finally {
      setEnviando(false);
    }
  };

  if (carregando) {
    return <div style={styles.loading}>Carregando comentários...</div>;
  }

  return (
    <div style={styles.container}>
      <h3 style={styles.titulo}>💬 Comentários ({comentarios.length})</h3>

      <form onSubmit={handleSubmit} style={styles.form}>
        <textarea
          value={novoComentario}
          onChange={(e) => setNovoComentario(e.target.value)}
          placeholder="Escreva um comentário..."
          style={styles.textarea}
          rows="3"
          disabled={enviando}
        />
        <button
          type="submit"
          style={styles.botaoEnviar}
          disabled={enviando || !novoComentario.trim()}
        >
          {enviando ? "Enviando..." : "Comentar"}
        </button>
      </form>

      <div style={styles.lista}>
        {comentarios.length === 0 ? (
          <p style={styles.semComentarios}>Seja o primeiro a comentar!</p>
        ) : (
          comentarios.map((comentario) => (
            <div key={comentario.id} style={styles.comentario}>
              <div style={styles.comentarioHeader}>
                <img
                  src={comentario.autor?.avatar}
                  alt={comentario.autor?.nome}
                  style={styles.avatar}
                />
                <div>
                  <strong style={styles.nome}>{comentario.autor?.nome}</strong>
                  <p style={styles.data}>
                    {new Date(comentario.data).toLocaleDateString("pt-BR")} •{" "}
                    {new Date(comentario.data).toLocaleTimeString("pt-BR")}
                  </p>
                </div>
              </div>
              <p style={styles.conteudo}>{comentario.conteudo}</p>
              <div style={styles.acoes}>
                <button style={styles.botaoAcao}>
                  ❤️ Curtir ({comentario.curtidas || 0})
                </button>
                <button style={styles.botaoAcao}>↩️ Responder</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    marginTop: "30px",
    paddingTop: "20px",
    borderTop: "2px solid #eee",
  },
  titulo: {
    color: "#2c3e50",
    marginBottom: "20px",
  },
  form: {
    marginBottom: "30px",
  },
  textarea: {
    width: "100%",
    padding: "15px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    fontSize: "16px",
    marginBottom: "10px",
    resize: "vertical",
  },
  botaoEnviar: {
    backgroundColor: "#3498db",
    color: "white",
    padding: "10px 25px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px",
    float: "right",
    ":disabled": {
      backgroundColor: "#bdc3c7",
      cursor: "not-allowed",
    },
  },
  lista: {
    marginTop: "20px",
  },
  semComentarios: {
    textAlign: "center",
    color: "#7f8c8d",
    padding: "30px",
    backgroundColor: "#f8f9fa",
    borderRadius: "8px",
  },
  comentario: {
    padding: "20px",
    borderBottom: "1px solid #eee",
    ":last-child": {
      borderBottom: "none",
    },
  },
  comentarioHeader: {
    display: "flex",
    alignItems: "center",
    marginBottom: "15px",
  },
  avatar: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    marginRight: "15px",
  },
  nome: {
    display: "block",
    color: "#2c3e50",
  },
  data: {
    fontSize: "12px",
    color: "#95a5a6",
    margin: 0,
  },
  conteudo: {
    color: "#34495e",
    lineHeight: "1.6",
    marginBottom: "15px",
  },
  acoes: {
    display: "flex",
    gap: "15px",
  },
  botaoAcao: {
    backgroundColor: "transparent",
    border: "none",
    color: "#7f8c8d",
    cursor: "pointer",
    fontSize: "14px",
    padding: "5px 10px",
    ":hover": {
      color: "#3498db",
    },
  },
  loading: {
    textAlign: "center",
    padding: "30px",
    color: "#7f8c8d",
  },
};

export default Comentarios;
