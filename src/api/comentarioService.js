const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export async function getComentarios(postId) {
  try {
    const res = await fetch(`${API_URL}/api/posts/${postId}/comentarios`);
    if (!res.ok) {
      console.warn(`Erro ${res.status} ao buscar comentários`);
      return [];
    }

    const data = await res.json();
    return data.dados || [];
  } catch (error) {
    console.error("Erro em getComentarios:", error);
    return [];
  }
}

export async function addComentario(postId, conteudo) {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API_URL}/api/posts/${postId}/comentarios`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token ? `Bearer ${token}` : "",
      },
      body: JSON.stringify({ conteudo }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.mensagem || `Erro ${res.status} ao adicionar comentário`);
    }

    return await res.json();
  } catch (error) {
    console.error("Erro em addComentario:", error);
    throw error;
  }
}

export async function curtirPost(postId) {
  try {
    const token = localStorage.getItem("token");
    
    const res = await fetch(`${API_URL}/api/posts/${postId}/curtir`, {
      method: "POST",
      headers: {
        "Authorization": token ? `Bearer ${token}` : "",
      },
    });
    
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.mensagem || `Erro ${res.status} ao curtir post`);
    }
    
    return await res.json();
  } catch (error) {
    console.error("Erro em curtirPost:", error);
    throw error;
  }
}