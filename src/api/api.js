import axios from "axios";

const API_URL = "http://localhost:3001/api";

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

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

  if (data.token) {
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.usuario || data.user));
  }

  return {
    user: data.usuario || data.user,
    token: data.token,
  };
}

export async function register({ email, password, nome, username }) {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password, nome, username }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.mensagem || "Erro ao registrar");
  }

  const data = await res.json();

  if (data.token) {
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.usuario));
  }

  return data;
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