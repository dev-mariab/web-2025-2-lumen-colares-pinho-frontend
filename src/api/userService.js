const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

// Função para gerar números aleatórios
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Obter todos os usuários
export async function getUsers() {
  try {
    console.log("👥 Buscando usuários da API...");
    
    const res = await fetch(`${API_URL}/api/users`);
    
    if (res.ok) {
      const data = await res.json();
      console.log(`✅ ${data.dados?.length || data.length || 0} usuários encontrados`);
      return data.dados || data || [];
    }
    
    console.warn(`⚠️ API retornou ${res.status}, usando dados mockados`);
    
    // Dados mockados como fallback
    return [
      {
        id: "1",
        nome: "Carla Evelyn",
        name: "Carla Evelyn",
        email: "carlaevelyn@alu.ufc.br",
        idade: randomInt(18, 35),
        cidade: "Quixadá",
        bio: "Estudante de Engenharia de Software",
        avatar: "https://i.pravatar.cc/150?img=1",
        avatar_url: "https://i.pravatar.cc/150?img=1",
        empresa: "Lumen Colares",
        curso: "Engenharia de Software",
        seguidores: randomInt(50, 1200),
        seguindo: randomInt(30, 600),
      },
      {
        id: "2",
        nome: "Maria Barros",
        name: "Maria Barros",
        email: "maria.barros@alu.ufc.br",
        idade: randomInt(18, 35),
        cidade: "Quixadá",
        bio: "Estudante de Engenharia de Software",
        avatar: "https://i.pravatar.cc/150?img=2",
        avatar_url: "https://i.pravatar.cc/150?img=2",
        empresa: "UFC",
        curso: "Engenharia de Software",
        seguidores: randomInt(50, 1200),
        seguindo: randomInt(30, 600),
      },
      {
        id: "3",
        nome: "João Silva",
        name: "João Silva",
        email: "joao.silva@alu.ufc.br",
        idade: randomInt(18, 35),
        cidade: "Quixadá",
        bio: "Desenvolvedor Full Stack",
        avatar: "https://i.pravatar.cc/150?img=3",
        avatar_url: "https://i.pravatar.cc/150?img=3",
        empresa: "Tech Solutions",
        curso: "Engenharia de Software",
        seguidores: randomInt(50, 1200),
        seguindo: randomInt(30, 600),
      }
    ];
  } catch (error) {
    console.error("❌ Erro em getUsers:", error);
    return [];
  }
}

// Obter usuário por ID
export async function getUserById(id) {
  try {
    console.log(`👤 Buscando usuário ${id}...`);
    
    const res = await fetch(`${API_URL}/api/users/${id}`);
    
    if (res.ok) {
      const data = await res.json();
      return data.dados || data;
    }
    
    console.warn(`⚠️ API retornou ${res.status}, usando dados mockados`);
    
    // Se a API falhar, buscar dos dados mockados
    const users = await getUsers();
    const user = users.find(user => user.id === id.toString());
    
    if (user) {
      return user;
    }
    
    // Se não encontrar, criar um usuário mockado
    return {
      id: id,
      nome: `Usuário ${id}`,
      name: `Usuário ${id}`,
      email: `usuario${id}@alu.ufc.br`,
      idade: randomInt(18, 35),
      cidade: "Quixadá",
      bio: "Estudante da UFC Quixadá",
      avatar: `https://i.pravatar.cc/150?u=${id}`,
      avatar_url: `https://i.pravatar.cc/150?u=${id}`,
      empresa: "UFC",
      curso: "Engenharia de Software",
      seguidores: randomInt(50, 1200),
      seguindo: randomInt(30, 600),
    };
    
  } catch (error) {
    console.error("❌ Erro em getUserById:", error);
    return null;
  }
}