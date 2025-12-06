// src/pages/Feed.jsx
import { useEffect, useState } from "react";
import { getUsers } from "../api/feedService";

export default function Feed() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadFeed() {
      try {
        const data = await getUsers();
        setUsers(data);
      } catch (err) {
        setError("Erro ao carregar o feed.");
      } finally {
        setLoading(false);
      }
    }

    loadFeed();
  }, []);

  if (loading) {
    return <p className="muted">Carregando feed...</p>;
  }

  if (error) {
    return <p className="error">{error}</p>;
  }

  return (
    <div className="feed-wrapper">
      {users.length === 0 ? (
        <div className="feed-empty">
          Nenhum usuário encontrado.
        </div>
      ) : (
        users.map((user) => (
          <div key={user.id} className="feed-card">
            
            {/* Header */}
            <div className="feed-header">
              <img
                src={user.avatar}
                alt={user.nome}
                className="feed-avatar"
              />

              <div className="feed-user">
                <strong>{user.nome}</strong>
                <span>{user.idade} anos • {user.cidade}</span>
              </div>
            </div>

            {/* Conteúdo */}
            <div className="feed-content">
              {user.bio}
            </div>

            {/* Divider */}
            <div className="feed-divider"></div>

            {/* Ações (mock por enquanto) */}
            <div className="feed-actions">
              <button className="feed-action">Curtir</button>
              <button className="feed-action">Comentar</button>
            </div>

          </div>
        ))
      )}
    </div>
  );
}
