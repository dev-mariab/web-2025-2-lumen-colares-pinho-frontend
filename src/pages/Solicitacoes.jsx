import React, { useState, useEffect } from "react";
import {
  criarSolicitacao,
  getMinhasSolicitacoes,
  atualizarStatusSolicitacao,
} from "../api/solicitacaoService";

const Solicitacoes = () => {
  const [solicitacoes, setSolicitacoes] = useState([]);
  const [novaSolicitacao, setNovaSolicitacao] = useState({
    titulo: "",
    descricao: "",
  });
  const [carregando, setCarregando] = useState(true);
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    carregarSolicitacoes();
  }, []);

  const carregarSolicitacoes = async () => {
    try {
      setCarregando(true);
      const dados = await getMinhasSolicitacoes();
      setSolicitacoes(dados);
    } catch (error) {
      console.error("Erro ao carregar solicitações:", error);
    } finally {
      setCarregando(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!novaSolicitacao.titulo.trim() || !novaSolicitacao.descricao.trim()) {
      alert("Preencha todos os campos");
      return;
    }

    try {
      setEnviando(true);
      await criarSolicitacao(novaSolicitacao);
      setNovaSolicitacao({ titulo: "", descricao: "" });
      await carregarSolicitacoes();
      alert("✅ Solicitação criada com sucesso!");
    } catch (error) {
      console.error("Erro ao criar solicitação:", error);
      alert("Erro ao criar solicitação. Faça login primeiro!");
    } finally {
      setEnviando(false);
    }
  };

  const handleStatusChange = async (id, novoStatus) => {
    try {
      await atualizarStatusSolicitacao(id, novoStatus);
      await carregarSolicitacoes();
      alert("Status atualizado com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      alert("Erro ao atualizar status");
    }
  };

  const getStatusInfo = (status) => {
    const statusConfig = {
      pendente: { cor: "#e74c3c", texto: "⏳ Pendente" },
      em_andamento: { cor: "#f39c12", texto: "🚀 Em Andamento" },
      concluida: { cor: "#2ecc71", texto: "✅ Concluída" },
    };
    return statusConfig[status] || statusConfig.pendente;
  };

  if (carregando) {
    return <div style={styles.loading}>Carregando solicitações...</div>;
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.titulo}>🔄 Fluxo de Solicitações</h1>
        <p style={styles.subtitulo}>Acompanhe o status das suas solicitações</p>
      </header>

      <div style={styles.card}>
        <h2 style={styles.cardTitulo}>Nova Solicitação</h2>
        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Título *</label>
            <input
              type="text"
              value={novaSolicitacao.titulo}
              onChange={(e) =>
                setNovaSolicitacao({
                  ...novaSolicitacao,
                  titulo: e.target.value,
                })
              }
              placeholder="Ex: Personalização de colar"
              style={styles.input}
              required
              disabled={enviando}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Descrição *</label>
            <textarea
              value={novaSolicitacao.descricao}
              onChange={(e) =>
                setNovaSolicitacao({
                  ...novaSolicitacao,
                  descricao: e.target.value,
                })
              }
              placeholder="Descreva sua solicitação com detalhes..."
              style={styles.textarea}
              rows="4"
              required
              disabled={enviando}
            />
          </div>

          <button type="submit" style={styles.botaoEnviar} disabled={enviando}>
            {enviando ? "Enviando..." : "📨 Enviar Solicitação"}
          </button>
        </form>
      </div>

      <div style={styles.listaContainer}>
        <h2 style={styles.listaTitulo}>
          Minhas Solicitações ({solicitacoes.length})
        </h2>

        {solicitacoes.length === 0 ? (
          <div style={styles.semSolicitacoes}>
            <p>📭 Nenhuma solicitação encontrada</p>
            <p>Crie sua primeira solicitação acima!</p>
          </div>
        ) : (
          <div style={styles.solicitacoesGrid}>
            {solicitacoes.map((solic) => {
              const statusInfo = getStatusInfo(solic.status);
              return (
                <div key={solic.id} style={styles.solicitacaoCard}>
                  <div style={styles.solicitacaoHeader}>
                    <h3 style={styles.solicitacaoTitulo}>{solic.titulo}</h3>
                    <span
                      style={{
                        ...styles.statusBadge,
                        backgroundColor: statusInfo.cor,
                      }}
                    >
                      {statusInfo.texto}
                    </span>
                  </div>

                  <p style={styles.solicitacaoDesc}>{solic.descricao}</p>

                  <div style={styles.solicitacaoMeta}>
                    <div>
                      <strong>Criada em:</strong>{" "}
                      {new Date(solic.dataCriacao).toLocaleDateString("pt-BR")}
                    </div>
                    <div>
                      <strong>Última atualização:</strong>{" "}
                      {new Date(solic.dataAtualizacao).toLocaleDateString(
                        "pt-BR"
                      )}
                    </div>
                  </div>

                  {solic.status !== "concluida" && (
                    <div style={styles.controlesStatus}>
                      <p style={styles.controlesTitulo}>Atualizar status:</p>
                      <div style={styles.botoesStatus}>
                        {solic.status === "pendente" && (
                          <button
                            onClick={() =>
                              handleStatusChange(solic.id, "em_andamento")
                            }
                            style={styles.botaoStatus}
                          >
                            ▶️ Iniciar
                          </button>
                        )}
                        {solic.status === "em_andamento" && (
                          <button
                            onClick={() =>
                              handleStatusChange(solic.id, "concluida")
                            }
                            style={styles.botaoStatus}
                          >
                            ✅ Concluir
                          </button>
                        )}
                        <button
                          onClick={() =>
                            handleStatusChange(solic.id, "pendente")
                          }
                          style={{
                            ...styles.botaoStatus,
                            backgroundColor: "#95a5a6",
                          }}
                        >
                          ↩️ Reabrir
                        </button>
                      </div>
                    </div>
                  )}

                  <div style={styles.timeline}>
                    <div style={styles.timelineItem}>
                      <div
                        style={{
                          ...styles.timelineDot,
                          backgroundColor:
                            solic.status !== "pendente" ? "#2ecc71" : "#bdc3c7",
                        }}
                      />
                      <span style={styles.timelineText}>
                        Solicitação Criada
                      </span>
                    </div>
                    <div style={styles.timelineLine} />
                    <div style={styles.timelineItem}>
                      <div
                        style={{
                          ...styles.timelineDot,
                          backgroundColor:
                            solic.status === "em_andamento"
                              ? "#2ecc71"
                              : solic.status === "concluida"
                              ? "#2ecc71"
                              : "#bdc3c7",
                        }}
                      />
                      <span style={styles.timelineText}>Em Andamento</span>
                    </div>
                    <div style={styles.timelineLine} />
                    <div style={styles.timelineItem}>
                      <div
                        style={{
                          ...styles.timelineDot,
                          backgroundColor:
                            solic.status === "concluida"
                              ? "#2ecc71"
                              : "#bdc3c7",
                        }}
                      />
                      <span style={styles.timelineText}>Concluída</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div style={styles.legenda}>
        <h3>📋 Legenda do Fluxo:</h3>
        <div style={styles.legendaItens}>
          <div style={styles.legendaItem}>
            <div style={{ ...styles.legendaDot, backgroundColor: "#e74c3c" }} />
            <span>Pendente - Aguardando início</span>
          </div>
          <div style={styles.legendaItem}>
            <div style={{ ...styles.legendaDot, backgroundColor: "#f39c12" }} />
            <span>Em Andamento - Em processo</span>
          </div>
          <div style={styles.legendaItem}>
            <div style={{ ...styles.legendaDot, backgroundColor: "#2ecc71" }} />
            <span>Concluída - Finalizada</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "1000px",
    margin: "0 auto",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
  },
  header: {
    textAlign: "center",
    marginBottom: "40px",
  },
  titulo: {
    color: "#2c3e50",
    fontSize: "2.2rem",
    marginBottom: "10px",
  },
  subtitulo: {
    color: "#7f8c8d",
    fontSize: "1.1rem",
  },
  card: {
    backgroundColor: "white",
    padding: "30px",
    borderRadius: "12px",
    marginBottom: "40px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
  },
  cardTitulo: {
    color: "#2c3e50",
    marginBottom: "25px",
    fontSize: "1.5rem",
  },
  formGroup: {
    marginBottom: "20px",
  },
  label: {
    display: "block",
    marginBottom: "8px",
    color: "#34495e",
    fontWeight: "bold",
  },
  input: {
    width: "100%",
    padding: "12px 15px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    fontSize: "16px",
  },
  textarea: {
    width: "100%",
    padding: "12px 15px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    fontSize: "16px",
    resize: "vertical",
  },
  botaoEnviar: {
    backgroundColor: "#3498db",
    color: "white",
    padding: "12px 30px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold",
    ":disabled": {
      backgroundColor: "#bdc3c7",
      cursor: "not-allowed",
    },
  },
  listaContainer: {
    marginTop: "50px",
  },
  listaTitulo: {
    color: "#2c3e50",
    marginBottom: "25px",
    fontSize: "1.8rem",
  },
  semSolicitacoes: {
    textAlign: "center",
    padding: "50px",
    backgroundColor: "#f8f9fa",
    borderRadius: "10px",
    color: "#7f8c8d",
  },
  solicitacoesGrid: {
    display: "grid",
    gap: "25px",
  },
  solicitacaoCard: {
    backgroundColor: "white",
    padding: "25px",
    borderRadius: "10px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
    borderLeft: "5px solid #3498db",
  },
  solicitacaoHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "15px",
  },
  solicitacaoTitulo: {
    color: "#2c3e50",
    margin: 0,
    fontSize: "1.3rem",
    flex: 1,
  },
  statusBadge: {
    color: "white",
    padding: "5px 15px",
    borderRadius: "20px",
    fontSize: "14px",
    fontWeight: "bold",
    marginLeft: "15px",
  },
  solicitacaoDesc: {
    color: "#34495e",
    lineHeight: "1.6",
    marginBottom: "20px",
  },
  solicitacaoMeta: {
    display: "flex",
    justifyContent: "space-between",
    color: "#7f8c8d",
    fontSize: "14px",
    marginBottom: "20px",
    paddingBottom: "20px",
    borderBottom: "1px solid #eee",
  },
  controlesStatus: {
    marginBottom: "25px",
  },
  controlesTitulo: {
    color: "#2c3e50",
    marginBottom: "10px",
    fontWeight: "bold",
  },
  botoesStatus: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
  },
  botaoStatus: {
    backgroundColor: "#2ecc71",
    color: "white",
    padding: "8px 15px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "14px",
  },
  timeline: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    position: "relative",
    marginTop: "20px",
  },
  timelineItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    zIndex: 1,
  },
  timelineDot: {
    width: "20px",
    height: "20px",
    borderRadius: "50%",
    marginBottom: "5px",
  },
  timelineText: {
    fontSize: "12px",
    color: "#7f8c8d",
    textAlign: "center",
  },
  timelineLine: {
    flex: 1,
    height: "2px",
    backgroundColor: "#ddd",
    margin: "0 10px",
  },
  legenda: {
    marginTop: "40px",
    padding: "20px",
    backgroundColor: "#f8f9fa",
    borderRadius: "10px",
  },
  legendaItens: {
    display: "flex",
    gap: "30px",
    marginTop: "15px",
    flexWrap: "wrap",
  },
  legendaItem: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  legendaDot: {
    width: "15px",
    height: "15px",
    borderRadius: "50%",
  },
  loading: {
    textAlign: "center",
    padding: "100px",
    fontSize: "20px",
    color: "#7f8c8d",
  },
};

export default Solicitacoes;
