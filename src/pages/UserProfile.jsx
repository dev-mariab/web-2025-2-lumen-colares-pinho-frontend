// src/pages/UserProfile.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getUserById } from "../api/feedService";

export default function UserProfile() {
  const { id } = useParams();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadUser() {
      try {
        const data = await getUserById(Number(id));
        setUser(data);
      } catch (err) {
        setError("Erro ao carregar perfil.");
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, [id]);

  if (loading) {
    return <p className="muted">Carregando perfil...</p>;
  }

  if (error) {
    return <p className="error">{error}</p>;
  }

  if (!user) {
    return <p className="muted">Usuário não encontrado.</p>;
  }

  return (
    <div className="profile">
      <img src={user.avatar} alt={user.nome} />
      <h2>{user.nome}</h2>
      <p>
        {user.idade} anos • {user.cidade}
      </p>
      <p>{user.bio}</p>

      <div className="profile-meta">
        <p>
          <strong>Empresa:</strong> {user.empresa}
        </p>
        <p>
          <strong>Seguidores:</strong> {user.seguidores}
        </p>
        <p>
          <strong>Seguindo:</strong> {user.seguindo}
        </p>
      </div>
    </div>
  );
}
