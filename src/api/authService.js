const API_URL = "http://localhost:8000";

export async function login({ email, password }) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    throw new Error("Credenciais inválidas");
  }

  const data = await res.json();

  // adapta a resposta do backend para o formato que o Login.jsx espera
  return {
    user: data.user,
    token: data.access_token,
  };
}

// mantém o register para o Register.jsx funcionar
export async function register({ email, password }) {
  // mock simples por enquanto
  await new Promise(resolve => setTimeout(resolve, 1000));

  if (!email || !password) {
    throw new Error("Erro ao registrar");
  }

  return { message: "Conta criada com sucesso" };
}
