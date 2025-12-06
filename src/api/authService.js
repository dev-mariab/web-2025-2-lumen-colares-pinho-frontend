// src/api/authService.js

function delay(ms = 1000) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function login({ email, password }) {
  await delay();

  if (!email || !password) {
    throw new Error("Credenciais inválidas");
  }

  // simula resposta real de backend
  return {
    user: {
      id: 1,
      email,
      nome: "Usuário Mock"
    },
    token: "fake-jwt-token"
  };
}

export async function register({ email, password }) {
  await delay();

  if (!email || !password) {
    throw new Error("Erro ao registrar");
  }

  return { message: "Conta criada com sucesso" };
}
