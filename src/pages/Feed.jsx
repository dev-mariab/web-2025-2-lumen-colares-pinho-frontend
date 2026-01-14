import React, { useState, useEffect } from "react";
import { getPosts, createPost } from "../api/feedService";
import { curtirPost } from "../api/comentarioService";
import { getUsers } from "../api/userService";

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [novoPost, setNovoPost] = useState({ title: "", body: "" });
  const [imagens, setImagens] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    carregarFeed();
  }, []);

  const carregarFeed = async () => {
    try {
      setCarregando(true);
      const [postsData, usuariosData] = await Promise.all([
        getPosts(),
        getUsers(),
      ]);
      setPosts(postsData);
      setUsuarios(usuariosData);
    } catch (error) {
      console.error("Erro ao carregar feed:", error);
    } finally {
      setCarregando(false);
    }
  };

  const handleCurtir = async (postId) => {
    try {
      await curtirPost(postId);
      setPosts(
        posts.map((post) =>
          post.id === postId ? { ...post, likes: (post.likes || 0) + 1 } : post
        )
      );
    } catch (error) {
      console.error("Erro ao curtir:", error);
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      alert("Máximo 5 imagens permitidas");
      return;
    }

    const tiposPermitidos = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
    ];
    const arquivosInvalidos = files.filter(
      (file) => !tiposPermitidos.includes(file.type)
    );

    if (arquivosInvalidos.length > 0) {
      alert("Apenas imagens JPEG, PNG, WebP ou GIF são permitidas");
      return;
    }

    const tamanhoMaximo = 5 * 1024 * 1024;
    const arquivosGrandes = files.filter((file) => file.size > tamanhoMaximo);

    if (arquivosGrandes.length > 0) {
      alert("Cada imagem deve ter no máximo 5MB");
      return;
    }

    setImagens(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!novoPost.title.trim() || !novoPost.body.trim()) {
      alert("Título e conteúdo são obrigatórios");
      return;
    }

    try {
      const usuario = JSON.parse(localStorage.getItem("user") || "{}");
      const postData = {
        ...novoPost,
        user: usuario.nome || "Usuário",
        price: 0,
      };

      await createPost(postData, imagens);

      setNovoPost({ title: "", body: "" });
      setImagens([]);

      await carregarFeed();
      alert("Post criado com sucesso!");
    } catch (error) {
      alert(`Erro ao criar post: ${error.message}`);
    }
  };

  if (carregando) {
    return <div style={styles.loading}>Carregando feed...</div>;
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.titulo}>📝 Feed da Comunidade</h1>

      {/* Formulário para novo post */}
      <div style={styles.card}>
        <h3>Criar novo post</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Título do post"
            value={novoPost.title}
            onChange={(e) =>
              setNovoPost({ ...novoPost, title: e.target.value })
            }
            style={styles.input}
            required
          />
          <textarea
            placeholder="Conteúdo do post"
            value={novoPost.body}
            onChange={(e) => setNovoPost({ ...novoPost, body: e.target.value })}
            style={styles.textarea}
            rows="4"
            required
          />

          {/* Upload de imagens */}
          <div style={styles.uploadContainer}>
            <label style={styles.uploadLabel}>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
              📷 Escolher imagens (máx. 5)
            </label>
            {imagens.length > 0 && (
              <p style={styles.uploadInfo}>
                {imagens.length} imagem(ns) selecionada(s)
              </p>
            )}
          </div>

          <button type="submit" style={styles.botaoPostar}>
            Publicar Post
          </button>
        </form>
      </div>

      {/* Lista de posts */}
      <div style={styles.postsContainer}>
        <h3>Últimos Posts ({posts.length})</h3>
        {posts.length === 0 ? (
          <p style={styles.semPosts}>Nenhum post ainda. Seja o primeiro!</p>
        ) : (
          posts.map((post) => (
            <div key={post.id} style={styles.postCard}>
              <div style={styles.postHeader}>
                <img
                  src={
                    post.userAvatar || `https://i.pravatar.cc/40?img=${post.id}`
                  }
                  alt={post.user}
                  style={styles.avatar}
                />
                <div>
                  <strong>{post.user}</strong>
                  <p style={styles.data}>
                    {new Date(post.createdAt).toLocaleDateString("pt-BR")}
                  </p>
                </div>
              </div>

              <h4 style={styles.postTitulo}>{post.title}</h4>
              <p style={styles.postConteudo}>{post.body}</p>

              {/* Imagens do post */}
              {post.images && post.images.length > 0 && (
                <div style={styles.imagensContainer}>
                  {post.images.map((img, index) => (
                    <img
                      key={index}
                      src={img.url || img}
                      alt={`Imagem ${index + 1}`}
                      style={styles.imagemPost}
                    />
                  ))}
                </div>
              )}

              {/* Ações do post */}
              <div style={styles.postActions}>
                <button
                  onClick={() => handleCurtir(post.id)}
                  style={styles.botaoCurtir}
                >
                  ❤️ Curtir ({post.likes || 0})
                </button>
                <button style={styles.botaoComentar}>
                  💬 Comentar ({post.comments || 0})
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Usuários online */}
      <div style={styles.card}>
        <h3>👥 Membros da Comunidade</h3>
        <div style={styles.usuariosLista}>
          {usuarios.slice(0, 5).map((usuario) => (
            <div key={usuario.id} style={styles.usuarioItem}>
              <img
                src={usuario.avatar}
                alt={usuario.nome}
                style={styles.avatarPequeno}
              />
              <div>
                <strong>{usuario.nome}</strong>
                <p style={styles.usuarioInfo}>{usuario.cidade}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "800px",
    margin: "0 auto",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
  },
  titulo: {
    color: "#2c3e50",
    marginBottom: "30px",
    textAlign: "center",
  },
  card: {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "10px",
    marginBottom: "20px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  },
  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "10px",
    border: "1px solid #ddd",
    borderRadius: "5px",
    fontSize: "16px",
  },
  textarea: {
    width: "100%",
    padding: "10px",
    marginBottom: "10px",
    border: "1px solid #ddd",
    borderRadius: "5px",
    fontSize: "16px",
    resize: "vertical",
  },
  uploadContainer: {
    marginBottom: "15px",
  },
  uploadLabel: {
    display: "inline-block",
    backgroundColor: "#f8f9fa",
    padding: "8px 15px",
    borderRadius: "5px",
    cursor: "pointer",
    border: "1px dashed #ddd",
    marginBottom: "5px",
  },
  uploadInfo: {
    fontSize: "14px",
    color: "#666",
    marginTop: "5px",
  },
  botaoPostar: {
    backgroundColor: "#3498db",
    color: "white",
    padding: "10px 20px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
    width: "100%",
  },
  postsContainer: {
    marginTop: "30px",
  },
  semPosts: {
    textAlign: "center",
    color: "#7f8c8d",
    padding: "40px",
    backgroundColor: "#f8f9fa",
    borderRadius: "10px",
  },
  postCard: {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "10px",
    marginBottom: "20px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  },
  postHeader: {
    display: "flex",
    alignItems: "center",
    marginBottom: "15px",
  },
  avatar: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    marginRight: "10px",
  },
  data: {
    fontSize: "12px",
    color: "#95a5a6",
    margin: 0,
  },
  postTitulo: {
    margin: "10px 0",
    color: "#2c3e50",
  },
  postConteudo: {
    color: "#34495e",
    lineHeight: "1.6",
    marginBottom: "15px",
  },
  imagensContainer: {
    display: "flex",
    gap: "10px",
    marginBottom: "15px",
    flexWrap: "wrap",
  },
  imagemPost: {
    maxWidth: "200px",
    maxHeight: "200px",
    borderRadius: "5px",
    objectFit: "cover",
  },
  postActions: {
    display: "flex",
    gap: "10px",
    borderTop: "1px solid #eee",
    paddingTop: "15px",
  },
  botaoCurtir: {
    backgroundColor: "transparent",
    border: "1px solid #e74c3c",
    color: "#e74c3c",
    padding: "8px 15px",
    borderRadius: "5px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "5px",
  },
  botaoComentar: {
    backgroundColor: "transparent",
    border: "1px solid #3498db",
    color: "#3498db",
    padding: "8px 15px",
    borderRadius: "5px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "5px",
  },
  usuariosLista: {
    marginTop: "15px",
  },
  usuarioItem: {
    display: "flex",
    alignItems: "center",
    padding: "10px",
    borderBottom: "1px solid #eee",
  },
  avatarPequeno: {
    width: "35px",
    height: "35px",
    borderRadius: "50%",
    marginRight: "10px",
  },
  usuarioInfo: {
    fontSize: "12px",
    color: "#7f8c8d",
    margin: 0,
  },
  loading: {
    textAlign: "center",
    padding: "50px",
    fontSize: "18px",
    color: "#7f8c8d",
  },
};

export default Feed;
