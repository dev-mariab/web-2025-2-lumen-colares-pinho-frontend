/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const PedidosAjuda = () => {
  const navigate = useNavigate();
  const [pedidos, setPedidos] = useState([]);
  const [meusPedidos, setMeusPedidos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [criandoPedido, setCriandoPedido] = useState(false);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [usuarioLogado, setUsuarioLogado] = useState(null);

  // Formulário
  const [novoPedido, setNovoPedido] = useState({
    titulo: "",
    descricao: "",
    materia: "",
  });

  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  // CHAVE PARA LOCALSTORAGE
  const PEDIDOS_STORAGE_KEY = "lumen_pedidos_ajuda";
  const MEUS_PEDIDOS_STORAGE_KEY = "lumen_meus_pedidos";

  // Carregar dados iniciais
  const carregarDadosIniciais = () => {
    try {
      // Pedidos de exemplo para demonstração
      const pedidosExemplo = [
        {
          id: "pedido_1",
          titulo: "Preciso de ajuda com Cálculo 1",
          descricao:
            "Estou com dificuldades para entender limites e derivadas. Alguém pode me explicar?",
          materia: "Cálculo 1",
          autor: {
            id: "user_1",
            nome: "Maria Silva",
            avatar: "https://i.pravatar.cc/150?img=2",
            curso: "Engenharia de Software",
          },
          status: "pendente",
          dataCriacao: new Date(Date.now() - 86400000).toISOString(), // 1 dia atrás
          aceitoPor: null,
          dataAceito: null,
          dataConclusao: null,
          comentarios: [
            {
              id: "coment_1",
              conteudo: "Posso te ajudar! Mande uma mensagem.",
              autor: {
                id: "user_2",
                nome: "João Santos",
                avatar: "https://i.pravatar.cc/150?img=1",
              },
              data: new Date(Date.now() - 43200000).toISOString(),
            },
          ],
        },
        {
          id: "pedido_2",
          titulo: "Projeto de Banco de Dados - Precisa de Grupo",
          descricao:
            "Precisamos de mais 2 pessoas para o projeto de BD. Já temos o tema definido.",
          materia: "Banco de Dados",
          autor: {
            id: "user_2",
            nome: "João Santos",
            avatar: "https://i.pravatar.cc/150?img=1",
            curso: "Ciência da Computação",
          },
          status: "aceito",
          dataCriacao: new Date(Date.now() - 172800000).toISOString(), // 2 dias atrás
          aceitoPor: {
            id: "user_3",
            nome: "Ana Costa",
            avatar: "https://i.pravatar.cc/150?img=3",
          },
          dataAceito: new Date(Date.now() - 86400000).toISOString(), // 1 dia atrás
          dataConclusao: null,
          comentarios: [],
        },
        {
          id: "pedido_3",
          titulo: "Dúvida sobre useState no React",
          descricao:
            "Não estou conseguindo fazer o estado atualizar corretamente no meu componente.",
          materia: "Programação Web",
          autor: {
            id: "user_3",
            nome: "Ana Costa",
            avatar: "https://i.pravatar.cc/150?img=3",
            curso: "Sistemas de Informação",
          },
          status: "concluído",
          dataCriacao: new Date(Date.now() - 259200000).toISOString(), // 3 dias atrás
          aceitoPor: {
            id: "user_1",
            nome: "Maria Silva",
            avatar: "https://i.pravatar.cc/150?img=2",
          },
          dataAceito: new Date(Date.now() - 172800000).toISOString(), // 2 dias atrás
          dataConclusao: new Date(Date.now() - 86400000).toISOString(), // 1 dia atrás
          comentarios: [
            {
              id: "coment_2",
              conteudo: "Mostrei como resolver usando useEffect!",
              autor: {
                id: "user_1",
                nome: "Maria Silva",
                avatar: "https://i.pravatar.cc/150?img=2",
              },
              data: new Date(Date.now() - 172800000).toISOString(),
            },
          ],
        },
      ];

      // Tenta carregar do localStorage
      const pedidosSalvos = localStorage.getItem(PEDIDOS_STORAGE_KEY);
      if (pedidosSalvos) {
        const parsed = JSON.parse(pedidosSalvos);
        return parsed.length > 0 ? parsed : pedidosExemplo;
      }

      // Se não tem nada salvo, usa os exemplos e salva
      localStorage.setItem(PEDIDOS_STORAGE_KEY, JSON.stringify(pedidosExemplo));
      return pedidosExemplo;
    } catch (error) {
      console.error("Erro ao carregar dados iniciais:", error);
      return [];
    }
  };

  // Carregar pedidos
  const carregarPedidos = async () => {
    try {
      setCarregando(true);
      setErro("");

      // PRIMEIRO: Tenta da API (com fallback)
      let pedidosDaAPI = [];
      try {
        const res = await fetch(`${API_URL}/api/pedidos`);
        if (res.ok) {
          const data = await res.json();
          pedidosDaAPI = data.dados || [];
          console.log("📥 Pedidos da API:", pedidosDaAPI.length);
        }
      } catch (apiError) {
        console.log("🌐 API offline, usando dados locais");
      }

      // SEGUNDO: Carrega do localStorage
      const pedidosDoLocal = carregarDadosIniciais();

      // TERCEIRO: Combina os dois (remove duplicados por ID)
      const todosPedidos = [...pedidosDaAPI];
      const idsExistentes = new Set(pedidosDaAPI.map((p) => p.id));

      pedidosDoLocal.forEach((pedidoLocal) => {
        if (!idsExistentes.has(pedidoLocal.id)) {
          todosPedidos.push(pedidoLocal);
        }
      });

      // Aplica filtro se necessário
      let pedidosFiltrados = todosPedidos;
      if (filtroStatus !== "todos") {
        pedidosFiltrados = todosPedidos.filter(
          (p) => p.status === filtroStatus
        );
      }

      // Ordena por data (mais recentes primeiro)
      pedidosFiltrados.sort(
        (a, b) => new Date(b.dataCriacao) - new Date(a.dataCriacao)
      );

      setPedidos(pedidosFiltrados);
      console.log("📊 Total de pedidos carregados:", pedidosFiltrados.length);

      // Carregar meus pedidos
      if (usuarioLogado) {
        const meus = todosPedidos.filter(
          (p) =>
            p.autor.id === usuarioLogado.id ||
            p.aceitoPor?.id === usuarioLogado.id
        );
        setMeusPedidos(meus);
      }
    } catch (error) {
      console.error("❌ Erro ao carregar pedidos:", error);
      setErro("Erro ao carregar pedidos. Usando dados locais.");

      // Fallback extremo
      const dadosLocais = carregarDadosIniciais();
      setPedidos(dadosLocais);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    // Carregar usuário logado
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const userData = JSON.parse(userStr);
        console.log("👤 Usuário carregado:", userData);
        setUsuarioLogado(userData);
      } catch (error) {
        console.error("Erro ao carregar usuário:", error);
      }
    }

    carregarPedidos();
  }, [filtroStatus]);

  // FUNÇÃO CORRIGIDA PARA CRIAR PEDIDO
  const handleCriarPedido = async (e) => {
    e.preventDefault();
    setCriandoPedido(true);
    setErro("");
    setSucesso("");

    console.log("📝 Tentando criar pedido...");

    // Validação
    if (
      !novoPedido.titulo.trim() ||
      !novoPedido.descricao.trim() ||
      !novoPedido.materia.trim()
    ) {
      setErro("Preencha todos os campos obrigatórios");
      setCriandoPedido(false);
      return;
    }

    // Verifica usuário
    const userStr = localStorage.getItem("user");
    if (!userStr) {
      setErro("Você precisa estar logado para criar um pedido");
      setCriandoPedido(false);
      return;
    }

    try {
      const user = JSON.parse(userStr);
      console.log("👤 Usando usuário:", user);

      // Cria o pedido localmente
      const novoPedidoObj = {
        id: `pedido_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        titulo: novoPedido.titulo.trim(),
        descricao: novoPedido.descricao.trim(),
        materia: novoPedido.materia.trim(),
        autor: {
          id: user.id || "user_anon",
          nome: user.name || user.nome || "Usuário Anônimo",
          avatar:
            user.avatar_url ||
            user.avatar ||
            `https://i.pravatar.cc/150?u=${user.id || "anon"}`,
          curso: user.curso || "Engenharia de Software",
        },
        status: "pendente",
        dataCriacao: new Date().toISOString(),
        aceitoPor: null,
        dataAceito: null,
        dataConclusao: null,
        comentarios: [],
      };

      console.log("🆕 Novo pedido criado:", novoPedidoObj);

      // PRIMEIRO: Tenta salvar na API
      try {
        const token = localStorage.getItem("token");
        const headers = {
          "Content-Type": "application/json",
        };

        if (token) {
          headers.Authorization = `Bearer ${token}`;
        }

        const res = await fetch(`${API_URL}/api/pedidos`, {
          method: "POST",
          headers: headers,
          body: JSON.stringify({
            titulo: novoPedidoObj.titulo,
            descricao: novoPedidoObj.descricao,
            materia: novoPedidoObj.materia,
            userId: user.id,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          console.log("✅ Pedido salvo na API:", data);
        } else {
          console.log("⚠️ API retornou erro, salvando localmente");
        }
      } catch (apiError) {
        console.log("🌐 API offline, salvando apenas localmente");
      }

      // SALVA LOCALMENTE (sempre)
      const pedidosAtuais = JSON.parse(
        localStorage.getItem(PEDIDOS_STORAGE_KEY) || "[]"
      );
      const novosPedidos = [novoPedidoObj, ...pedidosAtuais];
      localStorage.setItem(PEDIDOS_STORAGE_KEY, JSON.stringify(novosPedidos));

      // Atualiza estado
      setPedidos([novoPedidoObj, ...pedidos]);
      setNovoPedido({ titulo: "", descricao: "", materia: "" });
      setMostrarFormulario(false);
      setSucesso("✅ Pedido criado com sucesso!");

      // Recarrega após 1 segundo
      setTimeout(() => {
        carregarPedidos();
      }, 1000);
    } catch (error) {
      console.error("❌ Erro ao criar pedido:", error);
      setErro(`Erro: ${error.message}`);
    } finally {
      setCriandoPedido(false);
    }
  };

  const handleAceitarPedido = async (pedidoId) => {
    if (!usuarioLogado) {
      setErro("Você precisa estar logado para aceitar pedidos");
      return;
    }

    if (
      !window.confirm("Tem certeza que deseja aceitar este pedido de ajuda?")
    ) {
      return;
    }

    try {
      // Atualiza localmente
      const pedidosAtuais = JSON.parse(
        localStorage.getItem(PEDIDOS_STORAGE_KEY) || "[]"
      );
      const pedidoIndex = pedidosAtuais.findIndex((p) => p.id === pedidoId);

      if (pedidoIndex !== -1) {
        pedidosAtuais[pedidoIndex] = {
          ...pedidosAtuais[pedidoIndex],
          status: "aceito",
          aceitoPor: {
            id: usuarioLogado.id,
            nome: usuarioLogado.name || usuarioLogado.nome || "Você",
            avatar:
              usuarioLogado.avatar_url ||
              usuarioLogado.avatar ||
              `https://i.pravatar.cc/150?u=${usuarioLogado.id}`,
          },
          dataAceito: new Date().toISOString(),
        };

        localStorage.setItem(
          PEDIDOS_STORAGE_KEY,
          JSON.stringify(pedidosAtuais)
        );
        setSucesso("✅ Pedido aceito com sucesso!");
        carregarPedidos();
      }
    } catch (error) {
      console.error("Erro ao aceitar pedido:", error);
      setErro("Erro ao aceitar pedido.");
    }
  };

  const handleConcluirPedido = async (pedidoId) => {
    if (!window.confirm("Marcar este pedido como concluído?")) {
      return;
    }

    try {
      // Atualiza localmente
      const pedidosAtuais = JSON.parse(
        localStorage.getItem(PEDIDOS_STORAGE_KEY) || "[]"
      );
      const pedidoIndex = pedidosAtuais.findIndex((p) => p.id === pedidoId);

      if (pedidoIndex !== -1) {
        pedidosAtuais[pedidoIndex] = {
          ...pedidosAtuais[pedidoIndex],
          status: "concluído",
          dataConclusao: new Date().toISOString(),
        };

        localStorage.setItem(
          PEDIDOS_STORAGE_KEY,
          JSON.stringify(pedidosAtuais)
        );
        setSucesso("✅ Pedido concluído com sucesso!");
        carregarPedidos();
      }
    } catch (error) {
      console.error("Erro ao concluir pedido:", error);
      setErro("Erro ao concluir pedido.");
    }
  };

  const formatarData = (dataString) => {
    try {
      const data = new Date(dataString);
      const agora = new Date();
      const diffMs = agora - data;
      const diffMin = Math.floor(diffMs / (1000 * 60));
      const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDias = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      if (diffMin < 1) return "Agora mesmo";
      if (diffMin < 60) return `${diffMin} min atrás`;
      if (diffHrs < 24) return `${diffHrs} h atrás`;
      if (diffDias === 1) return "Ontem";
      if (diffDias < 7) return `${diffDias} dias atrás`;

      return data.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (e) {
      return "Data desconhecida";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pendente":
        return "#ff9800";
      case "aceito":
        return "#2196f3";
      case "concluído":
        return "#4caf50";
      default:
        return "#8b949e";
    }
  };

  const getStatusTexto = (status) => {
    switch (status) {
      case "pendente":
        return "🟡 Pendente";
      case "aceito":
        return "🔵 Em andamento";
      case "concluído":
        return "✅ Concluído";
      default:
        return status;
    }
  };

  if (carregando) {
    return (
      <div
        style={{
          padding: "40px",
          textAlign: "center",
          minHeight: "60vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: "50px",
            height: "50px",
            border: "3px solid var(--primary)",
            borderTopColor: "transparent",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
            marginBottom: "20px",
          }}
        ></div>
        <p style={{ color: "#8b949e" }}>Carregando pedidos de ajuda...</p>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px", maxWidth: "1000px", margin: "0 auto" }}>
      {/* Cabeçalho */}
      <div style={{ marginBottom: "30px" }}>
        <h1
          style={{
            color: "var(--primary)",
            fontSize: "2rem",
            marginBottom: "10px",
          }}
        >
          👥 Pedidos de Ajuda Acadêmica
        </h1>
        <p style={{ color: "#8b949e", marginBottom: "20px" }}>
          Peça ajuda ou ajude outros estudantes da UFC Quixadá
        </p>

        {/* Filtros */}
        <div
          style={{
            display: "flex",
            gap: "15px",
            marginBottom: "20px",
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <div>
            <select
              value={filtroStatus}
              onChange={(e) => setFiltroStatus(e.target.value)}
              style={{
                background: "#0a1118",
                border: "1px solid #1d2633",
                color: "white",
                padding: "8px 12px",
                borderRadius: "6px",
                fontSize: "14px",
                cursor: "pointer",
              }}
            >
              <option value="todos">📋 Todos os pedidos</option>
              <option value="pendente">🟡 Pendentes</option>
              <option value="aceito">🔵 Em andamento</option>
              <option value="concluído">✅ Concluídos</option>
            </select>
          </div>

          <button
            onClick={() => setMostrarFormulario(!mostrarFormulario)}
            style={{
              background: "var(--primary)",
              border: "none",
              color: "white",
              padding: "8px 16px",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "14px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            {mostrarFormulario ? "✕ Cancelar" : "➕ Novo Pedido"}
          </button>

          {meusPedidos.length > 0 && (
            <button
              onClick={() => {
                // Filtra para mostrar apenas meus pedidos
                setFiltroStatus("meus");
                const meus = pedidos.filter(
                  (p) =>
                    p.autor.id === usuarioLogado?.id ||
                    p.aceitoPor?.id === usuarioLogado?.id
                );
                setPedidos(meus);
              }}
              style={{
                background: "none",
                border: "1px solid var(--primary)",
                color: "var(--primary)",
                padding: "8px 16px",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "14px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              📋 Meus Pedidos ({meusPedidos.length})
            </button>
          )}
        </div>
      </div>

      {/* Mensagens de status */}
      {erro && (
        <div
          style={{
            background: "rgba(255, 87, 87, 0.1)",
            border: "1px solid #ff5757",
            borderRadius: "8px",
            padding: "12px",
            marginBottom: "20px",
            color: "#ff5757",
          }}
        >
          ⚠️ {erro}
        </div>
      )}

      {sucesso && (
        <div
          style={{
            background: "rgba(76, 175, 80, 0.1)",
            border: "1px solid #4caf50",
            borderRadius: "8px",
            padding: "12px",
            marginBottom: "20px",
            color: "#4caf50",
          }}
        >
          ✅ {sucesso}
        </div>
      )}

      {/* Formulário para novo pedido */}
      {mostrarFormulario && (
        <div
          style={{
            background: "rgba(255, 255, 255, 0.03)",
            border: "1px solid #1d2633",
            borderRadius: "12px",
            padding: "20px",
            marginBottom: "30px",
          }}
        >
          <h3 style={{ color: "white", marginBottom: "15px" }}>
            📝 Criar Novo Pedido de Ajuda
          </h3>

          <form onSubmit={handleCriarPedido}>
            <div style={{ marginBottom: "15px" }}>
              <label
                style={{
                  display: "block",
                  color: "#8b949e",
                  marginBottom: "5px",
                  fontSize: "14px",
                }}
              >
                Matéria *
              </label>
              <input
                type="text"
                placeholder="Ex: Cálculo 1, Banco de Dados, React..."
                value={novoPedido.materia}
                onChange={(e) =>
                  setNovoPedido({ ...novoPedido, materia: e.target.value })
                }
                style={{
                  width: "100%",
                  background: "#0a1118",
                  border: "1px solid #1d2633",
                  borderRadius: "8px",
                  color: "white",
                  padding: "10px 12px",
                  fontSize: "14px",
                  boxSizing: "border-box",
                }}
                required
                disabled={criandoPedido}
              />
            </div>

            <div style={{ marginBottom: "15px" }}>
              <label
                style={{
                  display: "block",
                  color: "#8b949e",
                  marginBottom: "5px",
                  fontSize: "14px",
                }}
              >
                Título *
              </label>
              <input
                type="text"
                placeholder="Ex: Preciso de ajuda com derivadas"
                value={novoPedido.titulo}
                onChange={(e) =>
                  setNovoPedido({ ...novoPedido, titulo: e.target.value })
                }
                style={{
                  width: "100%",
                  background: "#0a1118",
                  border: "1px solid #1d2633",
                  borderRadius: "8px",
                  color: "white",
                  padding: "10px 12px",
                  fontSize: "14px",
                  boxSizing: "border-box",
                }}
                required
                disabled={criandoPedido}
              />
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  display: "block",
                  color: "#8b949e",
                  marginBottom: "5px",
                  fontSize: "14px",
                }}
              >
                Descrição *
              </label>
              <textarea
                placeholder="Descreva com detalhes no que precisa de ajuda..."
                value={novoPedido.descricao}
                onChange={(e) =>
                  setNovoPedido({ ...novoPedido, descricao: e.target.value })
                }
                rows="4"
                style={{
                  width: "100%",
                  background: "#0a1118",
                  border: "1px solid #1d2633",
                  borderRadius: "8px",
                  color: "white",
                  padding: "10px 12px",
                  fontSize: "14px",
                  boxSizing: "border-box",
                  resize: "vertical",
                  fontFamily: "inherit",
                }}
                required
                disabled={criandoPedido}
              />
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "10px",
              }}
            >
              <button
                type="button"
                onClick={() => setMostrarFormulario(false)}
                style={{
                  background: "none",
                  border: "1px solid #1d2633",
                  color: "#8b949e",
                  padding: "10px 20px",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "14px",
                }}
                disabled={criandoPedido}
              >
                Cancelar
              </button>
              <button
                type="submit"
                style={{
                  background: "var(--primary)",
                  border: "none",
                  color: "white",
                  padding: "10px 20px",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "14px",
                  opacity: criandoPedido ? 0.7 : 1,
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
                disabled={criandoPedido}
              >
                {criandoPedido ? (
                  <>
                    <div
                      style={{
                        width: "16px",
                        height: "16px",
                        border: "2px solid white",
                        borderTopColor: "transparent",
                        borderRadius: "50%",
                        animation: "spin 1s linear infinite",
                      }}
                    ></div>
                    Criando...
                  </>
                ) : (
                  "Criar Pedido"
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lista de pedidos */}
      <div style={{ marginBottom: "40px" }}>
        <h3
          style={{
            color: "white",
            marginBottom: "15px",
            fontSize: "1.2rem",
          }}
        >
          {pedidos.length === 0
            ? "📭 Nenhum pedido encontrado"
            : `📋 ${pedidos.length} Pedido(s) de Ajuda`}
        </h3>

        {pedidos.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "40px 20px",
              background: "rgba(255,255,255,0.02)",
              borderRadius: "12px",
              border: "1px dashed #1d2633",
            }}
          >
            <div style={{ fontSize: "48px", marginBottom: "15px" }}>📭</div>
            <p
              style={{
                color: "#8b949e",
                marginBottom: "10px",
                fontSize: "16px",
              }}
            >
              Nenhum pedido de ajuda no momento
            </p>
            <p
              style={{
                color: "#6e7681",
                fontSize: "14px",
                marginBottom: "20px",
              }}
            >
              Seja o primeiro a pedir ajuda ou ajudar alguém!
            </p>
            <button
              onClick={() => setMostrarFormulario(true)}
              style={{
                background: "var(--primary)",
                border: "none",
                color: "white",
                padding: "10px 20px",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "14px",
              }}
            >
              Criar primeiro pedido
            </button>
          </div>
        ) : (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "15px" }}
          >
            {pedidos.map((pedido) => (
              <div
                key={pedido.id}
                style={{
                  background: "rgba(255, 255, 255, 0.03)",
                  border: "1px solid #1d2633",
                  borderRadius: "12px",
                  padding: "20px",
                  transition: "transform 0.2s, box-shadow 0.2s",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 12px rgba(0, 0, 0, 0.15)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                {/* Cabeçalho do pedido */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: "15px",
                  }}
                >
                  <div>
                    <div
                      style={{
                        background: getStatusColor(pedido.status),
                        color: "white",
                        padding: "4px 10px",
                        borderRadius: "12px",
                        fontSize: "12px",
                        display: "inline-block",
                        marginBottom: "8px",
                      }}
                    >
                      {getStatusTexto(pedido.status)}
                    </div>
                    <h4
                      style={{
                        color: "white",
                        fontSize: "18px",
                        marginBottom: "5px",
                      }}
                    >
                      {pedido.titulo}
                    </h4>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        flexWrap: "wrap",
                      }}
                    >
                      <span style={{ color: "#8b949e", fontSize: "13px" }}>
                        📚 {pedido.materia}
                      </span>
                      <span style={{ color: "#8b949e", fontSize: "13px" }}>
                        ⏰ {formatarData(pedido.dataCriacao)}
                      </span>
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <img
                      src={pedido.autor.avatar}
                      alt={pedido.autor.nome}
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                        border: "2px solid var(--primary)",
                      }}
                    />
                    <div>
                      <div
                        style={{
                          color: "white",
                          fontSize: "14px",
                          fontWeight: "500",
                        }}
                      >
                        {pedido.autor.nome}
                      </div>
                      <div style={{ color: "#8b949e", fontSize: "12px" }}>
                        {pedido.autor.curso}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Descrição */}
                <div style={{ marginBottom: "15px" }}>
                  <p
                    style={{
                      color: "#e6edf3",
                      lineHeight: "1.6",
                      fontSize: "14px",
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {pedido.descricao}
                  </p>
                </div>

                {/* Quem aceitou */}
                {pedido.aceitoPor && (
                  <div
                    style={{
                      background: "rgba(33, 150, 243, 0.1)",
                      border: "1px solid rgba(33, 150, 243, 0.3)",
                      borderRadius: "8px",
                      padding: "12px",
                      marginBottom: "15px",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <div style={{ color: "#2196f3", fontSize: "20px" }}>👤</div>
                    <div>
                      <div
                        style={{
                          color: "#2196f3",
                          fontSize: "14px",
                          fontWeight: "500",
                        }}
                      >
                        Ajuda aceita por {pedido.aceitoPor.nome}
                      </div>
                      <div style={{ color: "#8b949e", fontSize: "12px" }}>
                        Aceito em {formatarData(pedido.dataAceito)}
                      </div>
                    </div>
                  </div>
                )}

                {/* Comentários */}
                {pedido.comentarios && pedido.comentarios.length > 0 && (
                  <div style={{ marginBottom: "15px" }}>
                    <div
                      style={{
                        color: "#8b949e",
                        fontSize: "13px",
                        marginBottom: "10px",
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                      }}
                    >
                      💬 {pedido.comentarios.length} comentário(s)
                    </div>
                    <div
                      style={{
                        background: "rgba(255, 255, 255, 0.02)",
                        borderRadius: "8px",
                        padding: "12px",
                        maxHeight: "150px",
                        overflowY: "auto",
                      }}
                    >
                      {pedido.comentarios.slice(0, 2).map((comentario) => (
                        <div
                          key={comentario.id}
                          style={{
                            marginBottom: "10px",
                            paddingBottom: "10px",
                            borderBottom: "1px solid rgba(29, 38, 51, 0.3)",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                              }}
                            >
                              <img
                                src={comentario.autor.avatar}
                                alt={comentario.autor.nome}
                                style={{
                                  width: "24px",
                                  height: "24px",
                                  borderRadius: "50%",
                                }}
                              />
                              <span
                                style={{ color: "white", fontSize: "12px" }}
                              >
                                {comentario.autor.nome}
                              </span>
                            </div>
                            <span
                              style={{ color: "#8b949e", fontSize: "11px" }}
                            >
                              {formatarData(comentario.data)}
                            </span>
                          </div>
                          <p
                            style={{
                              color: "#e6edf3",
                              fontSize: "13px",
                              marginTop: "5px",
                              marginLeft: "32px",
                            }}
                          >
                            {comentario.conteudo}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Ações */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: "15px",
                  }}
                >
                  <div style={{ display: "flex", gap: "10px" }}>
                    {pedido.status === "pendente" &&
                      usuarioLogado &&
                      pedido.autor.id !== usuarioLogado.id && (
                        <button
                          onClick={() => handleAceitarPedido(pedido.id)}
                          style={{
                            background: "#2196f3",
                            border: "none",
                            color: "white",
                            padding: "8px 16px",
                            borderRadius: "6px",
                            cursor: "pointer",
                            fontSize: "13px",
                            display: "flex",
                            alignItems: "center",
                            gap: "5px",
                          }}
                        >
                          ✅ Aceitar Pedido
                        </button>
                      )}

                    {pedido.status === "aceito" &&
                      usuarioLogado &&
                      (pedido.autor.id === usuarioLogado.id ||
                        pedido.aceitoPor?.id === usuarioLogado.id) && (
                        <button
                          onClick={() => handleConcluirPedido(pedido.id)}
                          style={{
                            background: "#4caf50",
                            border: "none",
                            color: "white",
                            padding: "8px 16px",
                            borderRadius: "6px",
                            cursor: "pointer",
                            fontSize: "13px",
                            display: "flex",
                            alignItems: "center",
                            gap: "5px",
                          }}
                        >
                          🏁 Concluir
                        </button>
                      )}
                  </div>

                  <div style={{ color: "#8b949e", fontSize: "12px" }}>
                    ID: {pedido.id.substring(0, 8)}...
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Informações sobre o fluxo */}
      <div
        style={{
          background: "rgba(255, 255, 255, 0.03)",
          border: "1px solid #1d2633",
          borderRadius: "12px",
          padding: "20px",
          marginTop: "30px",
        }}
      >
        <h3 style={{ color: "white", marginBottom: "15px" }}>
          📋 Como funciona o fluxo?
        </h3>
        <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
          <div style={{ flex: "1", minWidth: "200px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "10px",
              }}
            >
              <div
                style={{
                  background: "#ff9800",
                  color: "white",
                  width: "30px",
                  height: "30px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "14px",
                }}
              >
                1
              </div>
              <span style={{ color: "white", fontWeight: "500" }}>
                Pendente
              </span>
            </div>
            <p
              style={{ color: "#8b949e", fontSize: "13px", marginLeft: "40px" }}
            >
              Aluno cria um pedido de ajuda. Aguardando alguém se voluntariar.
            </p>
          </div>

          <div style={{ flex: "1", minWidth: "200px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "10px",
              }}
            >
              <div
                style={{
                  background: "#2196f3",
                  color: "white",
                  width: "30px",
                  height: "30px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "14px",
                }}
              >
                2
              </div>
              <span style={{ color: "white", fontWeight: "500" }}>Aceito</span>
            </div>
            <p
              style={{ color: "#8b949e", fontSize: "13px", marginLeft: "40px" }}
            >
              Outro aluno aceita ajudar. Trabalho em andamento.
            </p>
          </div>

          <div style={{ flex: "1", minWidth: "200px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "10px",
              }}
            >
              <div
                style={{
                  background: "#4caf50",
                  color: "white",
                  width: "30px",
                  height: "30px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "14px",
                }}
              >
                3
              </div>
              <span style={{ color: "white", fontWeight: "500" }}>
                Concluído
              </span>
            </div>
            <p
              style={{ color: "#8b949e", fontSize: "13px", marginLeft: "40px" }}
            >
              Ajuda foi prestada com sucesso. Pedido finalizado.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PedidosAjuda;
