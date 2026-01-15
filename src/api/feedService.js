/* eslint-disable no-unreachable */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

// ========== CONSTANTES DE STORAGE ==========
const STORAGE_KEYS = {
  POSTS: 'lumen_posts',
  USER: 'user',
  TOKEN: 'token'
};

// ========== FUNÇÕES DE STORAGE ==========

// Obter posts do localStorage
export function getLocalPosts() {
  try {
    const postsStr = localStorage.getItem(STORAGE_KEYS.POSTS);
    if (postsStr) {
      return JSON.parse(postsStr);
    }
  } catch (error) {
    console.error('Erro ao ler posts do localStorage:', error);
  }
  return [];
}

// Salvar posts no localStorage
export function saveLocalPosts(posts) {
  try {
    localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts));
  } catch (error) {
    console.error('Erro ao salvar posts no localStorage:', error);
  }
}

// ========== FUNÇÕES PRINCIPAIS ==========

// Testar conexão
export async function testarConexao() {
  try {
    const res = await fetch(`${API_URL}/api/health`);
    if (!res.ok) throw new Error("Backend offline");
    return await res.json();
  } catch (error) {
    throw new Error(`Falha na conexão: ${error.message}`);
  }
}

// Obter todos os posts (combinando API e localStorage)
export async function getPosts() {
  try {
    console.log("🔍 Buscando posts da API...");
    
    let apiPosts = [];
    try {
      const res = await fetch(`${API_URL}/api/posts`);
      if (res.ok) {
        const data = await res.json();
        apiPosts = data.dados || data || [];
        console.log(`✅ ${apiPosts.length} posts da API`);
        
        // Transformar para o formato que o frontend espera
        apiPosts = apiPosts.map(post => ({
          id: post.id,
          conteudo: post.body || post.title || "",
          body: post.body || "",
          author_id: post.userId || post.user || "1",
          author_name: "Usuário",
          author_avatar: "https://i.pravatar.cc/150?img=1",
          curso: "Engenharia de Software",
          data_criacao: post.createdAt || new Date().toISOString(),
          created_at: post.createdAt || new Date().toISOString(),
          likes: post.likes || 0,
          comments: post.comments || 0,
          images: post.imagens || [],
          userId: post.userId || post.user,
          title: post.title || ""
        }));
      } else {
        console.warn(`⚠️ API retornou ${res.status}`);
      }
    } catch (apiError) {
      console.warn("🌐 Erro na API:", apiError.message);
    }
    
    // Obter posts do localStorage
    const localPosts = getLocalPosts();
    console.log(`📱 ${localPosts.length} posts locais`);
    
    // Combinar todos os posts
    const allPosts = [...localPosts, ...apiPosts];
    
    // Remover duplicatas
    const uniquePosts = [];
    const seenIds = new Set();
    
    allPosts.forEach(post => {
      if (post.id && !seenIds.has(post.id)) {
        seenIds.add(post.id);
        uniquePosts.push(post);
      }
    });
    
    // Ordenar por data (mais recentes primeiro)
    uniquePosts.sort((a, b) => {
      const dateA = new Date(a.data_criacao || a.createdAt || 0);
      const dateB = new Date(b.data_criacao || b.createdAt || 0);
      return dateB - dateA;
    });
    
    console.log(`📊 Total: ${uniquePosts.length} posts únicos`);
    
    // Salvar versão combinada no localStorage
    if (uniquePosts.length > 0) {
      saveLocalPosts(uniquePosts);
    }
    
    return uniquePosts;
    
  } catch (error) {
    console.error("❌ Erro em getPosts:", error);
    // Retornar posts do localStorage em caso de erro
    const localPosts = getLocalPosts();
    if (localPosts.length > 0) {
      return localPosts;
    }
    return [];
  }
}

// Obter posts de um usuário específico
export async function getUserPosts(userId) {
  try {
    console.log(`📋 Buscando posts do usuário ${userId}...`);
    
    // Primeiro, obtém todos os posts
    const allPosts = await getPosts();
    
    // Filtra posts do usuário específico
    const userPosts = allPosts.filter(post => {
      // Verifica vários campos possíveis para o ID do autor
      const postAuthorId = post.author_id || post.userId || post.user;
      return postAuthorId && postAuthorId.toString() === userId.toString();
    });
    
    console.log(`✅ ${userPosts.length} posts do usuário ${userId} encontrados`);
    
    return userPosts;
    
  } catch (error) {
    console.error("❌ Erro em getUserPosts:", error);
    
    // Fallback: tenta do localStorage
    const localPosts = getLocalPosts();
    const userLocalPosts = localPosts.filter(post => {
      const postAuthorId = post.author_id || post.userId || post.user;
      return postAuthorId && postAuthorId.toString() === userId.toString();
    });
    
    if (userLocalPosts.length > 0) {
      return userLocalPosts;
    }
    
    // Fallback para dados mockados
    return getMockUserPosts(userId);
  }
}

// Função auxiliar para posts mockados
function getMockUserPosts(userId) {
  const mockUserPosts = {
    1: [
      {
        id: 101,
        conteudo: "Primeiro post de teste no Lumen! 👋",
        author_id: 1,
        data_criacao: "2024-01-15T10:30:00Z",
        likes: 12,
        comments: 3,
        images: [],
      },
      {
        id: 102,
        conteudo: "Estou aprendendo React e estou adorando!",
        author_id: 1,
        data_criacao: "2024-01-10T14:20:00Z",
        likes: 8,
        comments: 2,
        images: [],
      },
    ],
    2: [
      {
        id: 201,
        conteudo: "Alguém interessado em estudar React juntos? 🚀",
        author_id: 2,
        data_criacao: "2024-01-14T15:45:00Z",
        likes: 8,
        comments: 5,
        images: [],
      },
    ],
    3: [
      {
        id: 301,
        conteudo: "Acabei de entregar meu projeto de BD! 🎉",
        author_id: 3,
        data_criacao: "2024-01-13T09:20:00Z",
        likes: 25,
        comments: 7,
        images: [],
      },
      {
        id: 302,
        conteudo: "Precisando de ajuda com consultas SQL complexas...",
        author_id: 3,
        data_criacao: "2024-01-05T11:15:00Z",
        likes: 5,
        comments: 10,
        images: [],
      },
    ],
  };

  return mockUserPosts[userId] || [];
}

// Criar post
export async function createPost(formData) {
  try {
    console.log("📝 Criando post...");
    
    const user = getCurrentUser();
    if (!user) {
      throw new Error("Usuário não autenticado");
    }
    
    const conteudo = formData.get("body") || formData.get("conteudo") || "";
    if (!conteudo.trim()) {
      throw new Error("O conteúdo do post não pode estar vazio");
    }
    
    // Adicionar o campo title que o backend espera
    formData.append("title", conteudo.substring(0, 50)); // Título curto
    formData.append("user", user.id);
    
    // Criar objeto do post localmente PRIMEIRO
    const localPost = {
      id: `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      conteudo: conteudo.trim(),
      body: conteudo.trim(),
      author_id: user.id,
      author_name: user.name || user.nome || "Usuário",
      author_avatar: user.avatar_url || user.avatar || `https://i.pravatar.cc/150?u=${user.id}`,
      curso: user.curso || "Engenharia de Software",
      data_criacao: new Date().toISOString(),
      created_at: new Date().toISOString(),
      likes: 0,
      comments: 0,
      images: [],
      userId: user.id
    };
    
    console.log("✅ Post local criado:", localPost.id);
    
    // Salvar localmente IMEDIATAMENTE
    const posts = getLocalPosts();
    posts.unshift(localPost);
    saveLocalPosts(posts);
    
    // Tentar enviar para a API (em segundo plano)
    try {
      const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
      if (token) {
        console.log("🔄 Enviando para API...");
        const res = await fetch(`${API_URL}/api/posts`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
          body: formData
        });
        
        if (res.ok) {
          const data = await res.json();
          console.log("✅ Post enviado para API:", data);
          
          // Atualizar o post local com ID da API se disponível
          if (data.dados && data.dados.id) {
            localPost.sync_id = data.dados.id;
          }
        } else {
          const errorText = await res.text();
          console.warn(`⚠️ API retornou erro ${res.status}:`, errorText);
        }
      }
    } catch (apiError) {
      console.warn("🌐 Erro ao enviar para API:", apiError.message);
    }
    
    return {
      sucesso: true,
      mensagem: "Post criado com sucesso",
      post: localPost,
      dados: localPost
    };
    
  } catch (error) {
    console.error("❌ Erro em createPost:", error);
    return {
      sucesso: false,
      mensagem: error.message || "Erro ao criar post",
      post: null,
      dados: null
    };
  }
}

// Curtir post (apenas localmente, pois a API não suporta)
// Em feedService.js, atualize a função curtirPost:
export async function curtirPost(postId) {
  try {
    const token = localStorage.getItem("token");
    
    // Verifique se o token existe
    if (!token) {
      throw new Error("Usuário não autenticado");
    }
    
    console.log(`👍 Curtindo post ${postId}...`);
    
    const res = await fetch(`${API_URL}/api/posts/${postId}/curtir`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
    });
    
    if (!res.ok) {
      // Se for erro 404, a rota pode não existir - simular curtida local
      if (res.status === 404) {
        console.log("Rota de curtir não encontrada, usando curtida local");
        return { 
          sucesso: true, 
          curtidas: 1,
          mensagem: "Post curtido (localmente)" 
        };
      }
      
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.mensagem || `Erro ${res.status} ao curtir post`);
    }
    
    return await res.json();
  } catch (error) {
    console.error("Erro em curtirPost:", error);
    
    // Fallback: curtida local
    return { 
      sucesso: true, 
      curtidas: 1,
      mensagem: "Post curtido (em modo offline)" 
    };
  }
}

// Comentários
export async function getComentarios(postId) {
  try {
    console.log(`💬 Buscando comentários do post ${postId}`);
    
    const res = await fetch(`${API_URL}/api/posts/${postId}/comentarios`);
    
    if (res.ok) {
      const data = await res.json();
      return data.dados || [];
    } else {
      console.warn(`⚠️ Erro ${res.status} ao buscar comentários`);
      return [];
    }
    
  } catch (error) {
    console.error("❌ Erro em getComentarios:", error);
    return [];
  }
}

export async function addComentario(postId, conteudo) {
  try {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    
    if (!token) {
      throw new Error("Usuário não autenticado");
    }
    
    console.log(`✍️ Adicionando comentário ao post ${postId}`);
    
    const res = await fetch(`${API_URL}/api/posts/${postId}/comentarios`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({ conteudo }),
    });
    
    if (res.ok) {
      const data = await res.json();
      console.log("✅ Comentário enviado para API");
      return data;
    } else {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.mensagem || `Erro ${res.status} ao adicionar comentário`);
    }
    
  } catch (error) {
    console.error("❌ Erro em addComentario:", error);
    
    // Se a API falhar, retorna sucesso local
    const user = getCurrentUser();
    return {
      sucesso: true,
      mensagem: "Comentário adicionado (local)",
      dados: {
        id: `local_comment_${Date.now()}`,
        conteudo,
        autor: user,
        data: new Date().toISOString(),
        postId: postId
      }
    };
  }
}

// Usuários
export async function getUserById(userId) {
  try {
    console.log(`👤 Buscando usuário ${userId}...`);
    const res = await fetch(`${API_URL}/api/users/${userId}`);
    
    if (res.ok) {
      const data = await res.json();
      return data.dados || data;
    }
    
    console.warn(`⚠️ Erro ${res.status} ao buscar usuário ${userId}`);
    return getMockUserById(userId);
  } catch (error) {
    console.error("❌ Erro em getUserById:", error);
    return getMockUserById(userId);
  }
}

export async function getUsers() {
  try {
    console.log("👥 Buscando usuários...");
    const res = await fetch(`${API_URL}/api/users`); 
    
    if (res.ok) {
      const data = await res.json();
      return data.dados || data || [];
    }
    
    console.warn(`⚠️ Erro ${res.status} ao buscar usuários`);
    return [];
  } catch (error) {
    console.error("❌ Erro em getUsers:", error);
    return [];
  }
}

// ========== FUNÇÕES AUXILIARES ==========

// Obter usuário atual
export function getCurrentUser() {
  try {
    const userStr = localStorage.getItem(STORAGE_KEYS.USER);
    if (!userStr) return null;
    return JSON.parse(userStr);
  } catch (error) {
    console.error("❌ Erro ao parsear usuário:", error);
    return null;
  }
}

// Verificar autenticação
export function isAuthenticated() {
  return !!localStorage.getItem(STORAGE_KEYS.TOKEN);
}

// Login
export async function login({ email, senha }) {
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, senha })
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.mensagem || "Credenciais inválidas");
  }
  
  const data = await res.json();
  
  if (data.token) {
    localStorage.setItem(STORAGE_KEYS.TOKEN, data.token);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(data.usuario));
  }
  
  return {
    user: data.usuario,
    token: data.token
  };
}

// Logout
export function logout() {
  localStorage.removeItem(STORAGE_KEYS.TOKEN);
  localStorage.removeItem(STORAGE_KEYS.USER);
}

// Limpar posts locais
export function clearLocalPosts() {
  localStorage.removeItem(STORAGE_KEYS.POSTS);
  console.log("🗑️ Posts locais limpos");
}

// ========== DADOS MOCKADOS ==========

function getMockUserById(userId) {
  const mockUsers = {
    "1": {
      id: "1",
      name: "Carla Evelyn",
      email: "carlaevelyn@alu.ufc.br",
      curso: "Engenharia de Software",
      avatar: "https://i.pravatar.cc/150?img=1",
      bio: "Estudante",
      papel: "admin"
    },
    "2": {
      id: "2",
      name: "Maria Barros",
      email: "maria.barros@alu.ufc.br",
      curso: "Engenharia de Software",
      avatar: "https://i.pravatar.cc/150?img=2",
      bio: "Estudante",
      papel: "user"
    }
  };
  
  return mockUsers[userId] || {
    id: userId,
    name: `Usuário ${userId}`,
    curso: "Engenharia de Software",
    avatar: `https://i.pravatar.cc/150?u=${userId}`
  };
}

// ========== OUTROS SERVIÇOS ==========

export async function getNoticias() {
  try {
    const res = await fetch(`${API_URL}/api/noticias`);
    if (!res.ok) return [];
    const data = await res.json();
    return data.dados || data || [];
  } catch (error) {
    console.error("❌ Erro em getNoticias:", error);
    return [];
  }
}

export async function getHorariosOnibus() {
  try {
    const res = await fetch(`${API_URL}/api/noticias/onibus/horarios`);
    if (!res.ok) return [];
    const data = await res.json();
    return data.dados || data;
  } catch (error) {
    console.error("❌ Erro em getHorariosOnibus:", error);
    return [];
  }
}

export async function getUploadLimits() {
  try {
    const res = await fetch(`${API_URL}/api/posts/upload-limits`);
    
    if (!res.ok) {
      return {
        sucesso: true,
        limites: {
          max_imagens: 5,
          max_tamanho_mb: 5,
          tipos_permitidos: ['jpg', 'jpeg', 'png', 'gif', 'webp']
        }
      };
    }
    
    return await res.json();
  } catch (error) {
    return {
      sucesso: false,
      limites: {
        max_imagens: 5,
        max_tamanho_mb: 5,
        tipos_permitidos: ['jpg', 'jpeg', 'png', 'gif', 'webp']
      }
    };
  }
}

// Ônibus - Buscar por tipo
export const getOnibusPorTipo = async (tipo) => {
  try {
    console.log(`🚌 Buscando ônibus do tipo ${tipo}...`);
    
    // Tenta da API
    try {
      const res = await fetch(`${API_URL}/onibus/${tipo}`);
      if (res.ok) {
        const data = await res.json();
        return data.dados || data || [];
      }
    } catch (apiError) {
      console.warn(`⚠️ API offline para ônibus do tipo ${tipo}`);
    }
    
    // Dados mockados como fallback
    return getMockOnibusPorTipo(tipo);
    
  } catch (error) {
    console.error("❌ Erro em getOnibusPorTipo:", error);
    return getMockOnibusPorTipo(tipo);
  }
};

// Função auxiliar para dados mockados de ônibus
function getMockOnibusPorTipo(tipo) {
  const mockData = {
    'A': [
      {
        id: 1,
        viagem: 1,
        onibus: 'A',
        saidaRodoviaria: '07h10',
        saidaCampus: '07h25',
        status: 'operando'
      },
      {
        id: 3,
        viagem: 3,
        onibus: 'A',
        saidaRodoviaria: '08h30',
        saidaCampus: '08h45',
        status: 'operando'
      },
      {
        id: 5,
        viagem: 5,
        onibus: 'A',
        saidaRodoviaria: '10h00',
        saidaCampus: '10h15',
        status: 'operando'
      }
    ],
    'B': [
      {
        id: 2,
        viagem: 2,
        onibus: 'B',
        saidaRodoviaria: '07h15',
        saidaCampus: '07h30',
        status: 'operando'
      },
      {
        id: 4,
        viagem: 4,
        onibus: 'B',
        saidaRodoviaria: '09h00',
        saidaCampus: '09h15',
        status: 'operando'
      },
      {
        id: 6,
        viagem: 6,
        onibus: 'B',
        saidaRodoviaria: '11h00',
        saidaCampus: '11h15',
        status: 'operando'
      }
    ]
  };
  
  return mockData[tipo] || [];
}