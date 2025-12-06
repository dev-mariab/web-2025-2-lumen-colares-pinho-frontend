// src/api/feedService.js

const API_URL = "https://jsonplaceholder.typicode.com";

// util simples pra gerar números mock
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export async function getUsers() {
  const res = await fetch(`${API_URL}/users`);
  const users = await res.json();

  return users.map((user) => ({
    id: user.id,
    nome: user.name,
    idade: randomInt(18, 35),
    cidade: `${user.address.city}`,
    bio: "Explorando conexões reais ✨",
    avatar: `https://i.pravatar.cc/300?img=${user.id + 10}`,
    empresa: user.company.name,
    seguidores: randomInt(50, 1200),
    seguindo: randomInt(30, 600),
  }));
}

export async function getUserById(id) {
  const res = await fetch(`${API_URL}/users/${id}`);

  if (!res.ok) {
    throw new Error("Usuário não encontrado");
  }

  const user = await res.json();

  return {
    id: user.id,
    nome: user.name,
    idade: randomInt(18, 35),
    cidade: `${user.address.city}`,
    bio:
      "Gosto de tecnologia, boas conversas e conhecer pessoas interessantes.",
    avatar: `https://i.pravatar.cc/300?img=${user.id + 10}`,
    empresa: user.company.name,
    seguidores: randomInt(100, 2000),
    seguindo: randomInt(80, 900),
  };
}
