/* eslint-disable no-undef */
const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export async function login({ email, senha }) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, senha })
  });

  if (!res.ok) throw new Error("Credenciais inválidas");
  
  const data = await res.json();
  
  if (data.token) {
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.usuario));
  }
  
  return {
    user: data.usuario,
    token: data.token
  };
}

export async function testarConexao() {
  try {
    const res = await fetch(`${API_URL}/health`);
    if (!res.ok) throw new Error("Backend offline");
    return await res.json();
  } catch (error) {
    throw new Error(`Falha na conexão: ${error.message}`);
  }
}