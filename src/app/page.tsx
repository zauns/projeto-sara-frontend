"use client";

import Link from "next/link";
import { useState } from "react";

interface Route {
  path: string;
  description: string;
  status: "active" | "planned" | "service";
  method?: string;
}

export default function DebugRoutesPage() {
  const [showDetails, setShowDetails] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // Rotas atuais e planejadas baseadas na estrutura do projeto
  const routes: Route[] = [
    // Rotas do App Router
    {
      path: "/",
      description: "Página inicial (esta página)",
      status: "active",
    },

    // Rotas de página implementadas
    {
      path: "/home/user",
      description:
        "Página inicial do usuário autenticado com dashboard e informações de sessão",
      status: "active",
    },
    {
      path: "/home/adm",
      description: "Página de administração da home",
      status: "active",
    },
    {
      path: "/login",
      description:
        "Página de login com suporte a desktop e mobile, autenticação e remember me",
      status: "active",
    },
    {
      path: "/login/adm",
      description: "Página de login de administrador",
      status: "active",
    },
    {
      path: "/cadastro/empresa",
      description: "Página de cadastro de empresa",
      status: "active",
    },
    {
      path: "/cadastro/secretaria",
      description: "Página de cadastro de secretaria",
      status: "active",
    },
    {
      path: "/perfil",
      description: "Página de perfil do usuário",
      status: "active",
    },
    {
      path: "/vagas",
      description: "Página de listagem de vagas",
      status: "active",
    },
    {
      path: "/vagas/1",
      description: "Página de detalhes de uma vaga",
      status: "active",
    },

    // Rotas comuns que você pode querer adicionar
    {
      path: "/perfil/curriculo",
      description: "Página de criação e edição de currículo do usuário",
      status: "planned",
    },

    // Serviços da API
    {
      path: "/api/auth",
      description: "Serviço de autenticação (login, logout, registro)",
      status: "service",
      method: "POST",
    },
    {
      path: "/api/curriculo",
      description: "Serviço de gerenciamento de currículo",
      status: "service",
      method: "GET/POST/PUT/DELETE",
    },
    {
      path: "/api/vagas",
      description: "Serviço de listagem e busca de vagas",
      status: "service",
      method: "GET",
    },
    {
      path: "/api/candidaturas",
      description: "Serviço de candidatura a vagas",
      status: "service",
      method: "POST/GET",
    },
  ];

  const activeRoutes = routes.filter((r) => r.status === "active");
  const plannedRoutes = routes.filter((r) => r.status === "planned");
  const serviceRoutes = routes.filter((r) => r.status === "service");

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const handleCopyUrl = (path: string) => {
    const fullUrl = window.location.origin + path;
    navigator.clipboard
      .writeText(fullUrl)
      .then(() => {
        showToast(`URL copiada: ${fullUrl}`);
      })
      .catch(() => {
        showToast("Falha ao copiar URL");
      });
  };

  const RouteCard = ({ route }: { route: Route }) => (
    <div
      className={`route-card ${route.status}`}
      style={{
        padding: "16px",
        marginBottom: "12px",
        border: "2px solid",
        borderRadius: "8px",
        borderColor:
          route.status === "active"
            ? "#22c55e"
            : route.status === "planned"
              ? "#eab308"
              : "#8b5cf6",
        backgroundColor:
          route.status === "active"
            ? "#065f46"
            : route.status === "planned"
              ? "#92400e"
              : "#4c1d95",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "8px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <code
            style={{
              backgroundColor: "#374151",
              color: "#f9fafb",
              padding: "4px 8px",
              borderRadius: "4px",
              fontSize: "14px",
              fontFamily: "monospace",
            }}
          >
            {route.method && `${route.method} `}
            {route.path}
          </code>
          <span
            style={{
              padding: "4px 8px",
              borderRadius: "4px",
              fontSize: "12px",
              fontWeight: "bold",
              backgroundColor:
                route.status === "active"
                  ? "#10b981"
                  : route.status === "planned"
                    ? "#f59e0b"
                    : "#8b5cf6",
              color: "#ffffff",
            }}
          >
            {route.status === "active"
              ? "ativa"
              : route.status === "planned"
                ? "planejada"
                : "serviço"}
          </span>
        </div>
        {route.path !== "/" && (
          <>
            {route.status === "active" ? (
              <Link
                href={route.path}
                style={{
                  padding: "6px 12px",
                  backgroundColor: "#10b981",
                  color: "white",
                  borderRadius: "4px",
                  fontSize: "14px",
                  textDecoration: "none",
                  transition: "background-color 0.2s",
                  marginRight: "8px",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#059669")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "#10b981")
                }
              >
                Visitar
              </Link>
            ) : (
              <button
                onClick={() => window.open(route.path, "_blank")}
                style={{
                  padding: "6px 12px",
                  backgroundColor:
                    route.status === "planned" ? "#f59e0b" : "#8b5cf6",
                  color: "white",
                  borderRadius: "4px",
                  fontSize: "14px",
                  border: "none",
                  cursor: "pointer",
                  transition: "background-color 0.2s",
                  marginRight: "8px",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor =
                    route.status === "planned" ? "#d97706" : "#7c3aed")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor =
                    route.status === "planned" ? "#f59e0b" : "#8b5cf6")
                }
              >
                {route.status === "planned" ? "Visualizar" : "Testar"}
              </button>
            )}
            <button
              onClick={() => handleCopyUrl(route.path)}
              style={{
                padding: "6px 12px",
                backgroundColor: "#6b7280",
                color: "white",
                borderRadius: "4px",
                fontSize: "14px",
                border: "none",
                cursor: "pointer",
                transition: "background-color 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#4b5563")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "#6b7280")
              }
              title="Copiar URL para área de transferência"
            >
              📋
            </button>
          </>
        )}
      </div>
      <p style={{ color: "#d1d5db", fontSize: "14px" }}>{route.description}</p>
    </div>
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#0a0a0a",
        padding: "32px 16px",
        color: "#f9fafb",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Notificação Toast */}
        {toast && (
          <div
            style={{
              position: "fixed",
              top: "20px",
              right: "20px",
              backgroundColor: "#10b981",
              color: "white",
              padding: "12px 20px",
              borderRadius: "8px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
              zIndex: 1000,
              fontSize: "14px",
              maxWidth: "350px",
              wordBreak: "break-all",
            }}
          >
            {toast}
          </div>
        )}

        <div
          style={{
            backgroundColor: "#111827",
            borderRadius: "8px",
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.3)",
            padding: "32px",
            border: "1px solid #374151",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: "32px",
              flexWrap: "wrap",
              gap: "16px",
            }}
          >
            <div>
              <h1
                style={{
                  fontSize: "32px",
                  fontWeight: "bold",
                  marginBottom: "8px",
                  color: "#f9fafb",
                }}
              >
                🚀 Painel de Debug de Rotas do Projeto
              </h1>
              <p style={{ color: "#d1d5db" }}>
                Acesso rápido a todas as rotas da sua aplicação Next.js
              </p>
            </div>
            <button
              onClick={() => setShowDetails(!showDetails)}
              style={{
                padding: "8px 16px",
                backgroundColor: "#4b5563",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                transition: "background-color 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#374151")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "#4b5563")
              }
            >
              {showDetails ? "Ocultar" : "Mostrar"} Detalhes
            </button>
          </div>

          {/* Estatísticas Resumidas */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "16px",
              marginBottom: "32px",
            }}
          >
            <div
              style={{
                backgroundColor: "#065f46",
                padding: "16px",
                borderRadius: "8px",
                textAlign: "center",
                border: "1px solid #10b981",
              }}
            >
              <div
                style={{
                  fontSize: "32px",
                  fontWeight: "bold",
                  color: "#34d399",
                }}
              >
                {activeRoutes.length}
              </div>
              <div style={{ color: "#10b981" }}>Rotas Ativas</div>
            </div>
            <div
              style={{
                backgroundColor: "#92400e",
                padding: "16px",
                borderRadius: "8px",
                textAlign: "center",
                border: "1px solid #f59e0b",
              }}
            >
              <div
                style={{
                  fontSize: "32px",
                  fontWeight: "bold",
                  color: "#fbbf24",
                }}
              >
                {plannedRoutes.length}
              </div>
              <div style={{ color: "#f59e0b" }}>Rotas Planejadas</div>
            </div>
            <div
              style={{
                backgroundColor: "#4c1d95",
                padding: "16px",
                borderRadius: "8px",
                textAlign: "center",
                border: "1px solid #8b5cf6",
              }}
            >
              <div
                style={{
                  fontSize: "32px",
                  fontWeight: "bold",
                  color: "#a78bfa",
                }}
              >
                {serviceRoutes.length}
              </div>
              <div style={{ color: "#8b5cf6" }}>Serviços</div>
            </div>
          </div>

          {/* Rotas Ativas */}
          <section style={{ marginBottom: "32px" }}>
            <h2
              style={{
                fontSize: "20px",
                fontWeight: "600",
                color: "var(--foreground)",
                marginBottom: "16px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <span
                style={{
                  width: "12px",
                  height: "12px",
                  backgroundColor: "#22c55e",
                  borderRadius: "50%",
                  marginRight: "12px",
                }}
              ></span>
              Rotas Ativas
            </h2>
            <div>
              {activeRoutes.map((route, index) => (
                <RouteCard key={index} route={route} />
              ))}
            </div>
          </section>

          {/* Rotas Planejadas */}
          <section style={{ marginBottom: "32px" }}>
            <h2
              style={{
                fontSize: "20px",
                fontWeight: "600",
                color: "#f9fafb",
                marginBottom: "16px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <span
                style={{
                  width: "12px",
                  height: "12px",
                  backgroundColor: "#eab308",
                  borderRadius: "50%",
                  marginRight: "12px",
                }}
              ></span>
              Rotas Planejadas
            </h2>
            <div>
              {plannedRoutes.map((route, index) => (
                <RouteCard key={index} route={route} />
              ))}
            </div>
          </section>

          {/* Serviços */}
          <section style={{ marginBottom: "32px" }}>
            <h2
              style={{
                fontSize: "20px",
                fontWeight: "600",
                color: "#f9fafb",
                marginBottom: "16px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <span
                style={{
                  width: "12px",
                  height: "12px",
                  backgroundColor: "#8b5cf6",
                  borderRadius: "50%",
                  marginRight: "12px",
                }}
              ></span>
              Serviços
            </h2>
            <div>
              {serviceRoutes.map((route, index) => (
                <RouteCard key={index} route={route} />
              ))}
            </div>
          </section>

          {/* Development Info */}
          {showDetails && (
            <section
              style={{
                backgroundColor: "#1f2937",
                padding: "24px",
                borderRadius: "8px",
                border: "1px solid #4b5563",
              }}
            >
              <h3
                style={{
                  fontSize: "18px",
                  fontWeight: "600",
                  marginBottom: "16px",
                  color: "#f9fafb",
                }}
              >
                Informações de Desenvolvimento
              </h3>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                  gap: "16px",
                  fontSize: "14px",
                }}
              >
                <div>
                  <h4
                    style={{
                      fontWeight: "600",
                      marginBottom: "8px",
                      color: "#f9fafb",
                    }}
                  >
                    Estrutura do Projeto:
                  </h4>
                  <ul
                    style={{
                      paddingLeft: "20px",
                      lineHeight: "1.6",
                      color: "#d1d5db",
                    }}
                  >
                    <li>Next.js 15 com App Router</li>
                    <li>TypeScript habilitado</li>
                    <li>Variáveis CSS customizadas para temas</li>
                    <li>
                      Páginas na pasta <code>/src/pages</code>
                    </li>
                    <li>
                      Componentes em <code>/src/components</code>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4
                    style={{
                      fontWeight: "600",
                      marginBottom: "8px",
                      color: "#f9fafb",
                    }}
                  >
                    Comandos Rápidos:
                  </h4>
                  <ul
                    style={{
                      paddingLeft: "20px",
                      lineHeight: "1.6",
                      color: "#d1d5db",
                    }}
                  >
                    <li>
                      <code>npm run dev</code> - Iniciar servidor de
                      desenvolvimento
                    </li>
                    <li>
                      <code>npm run build</code> - Compilar para produção
                    </li>
                    <li>
                      <code>npm run lint</code> - Executar ESLint
                    </li>
                    <li>
                      <code>npm run clean-dev</code> - Limpar e reiniciar dev
                    </li>
                  </ul>
                </div>
              </div>

              <div
                style={{
                  marginTop: "16px",
                  padding: "16px",
                  backgroundColor: "#451a03",
                  borderRadius: "4px",
                  borderLeft: "4px solid #f59e0b",
                }}
              >
                <p style={{ fontSize: "14px", color: "#fbbf24" }}>
                  <strong>Nota:</strong> Para implementar as rotas planejadas,
                  crie arquivos page.tsx correspondentes no diretório{" "}
                  <code>/src/app</code> seguindo as convenções do Next.js App
                  Router.
                </p>
              </div>
            </section>
          )}

          {/* Rodapé */}
          <footer
            style={{
              marginTop: "32px",
              paddingTop: "24px",
              borderTop: "1px solid #e5e7eb",
              textAlign: "center",
              color: "#9ca3af",
              fontSize: "14px",
            }}
          >
            <p>
              Painel de debug para navegação rápida de rotas e desenvolvimento
            </p>
            <p style={{ marginTop: "4px", color: "#9ca3af" }}>
              Construído com Next.js 15 • React 19 • TypeScript • CSS
              Customizado
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}
