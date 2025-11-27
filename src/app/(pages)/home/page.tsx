"use client";

import React from "react";
import { useRequireAuth } from "../../../hooks/useProtectedRoute";
import { useAuth } from "../../../contexts/AuthContext";
import SessionInfo from "../../../components/SessionInfo";
import { SearchBar } from "@/components/core/search-bar";
import { JobCard } from "@/components/core/job-card";
import { GuideCard } from "@/components/core/guide-card";
import { Header } from "@/components/core/header"; // Import the Header component

const Home = () => {
  // Protege esta rota - redireciona para login se não estiver autenticado
  const { isLoading, canAccess } = useRequireAuth();
  const { user, logout } = useAuth();

  // Mostra estado de carregamento enquanto verifica autenticação
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-custom-bg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  // Não renderiza se o usuário não pode acessar (o hook de proteção irá lidar com o redirecionamento)
  if (!canAccess) {
    return null;
  }

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-custom-bg flex flex-col">
      {/* Cabeçalho */}
      <Header onLogout={() => handleLogout()} />

      {/* Conteúdo Principal */}
      <main className="flex-grow max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 w-full">
        {/* Barra de Pesquisa */}
        <div className="w-full flex justify-center mb-2">
          <div className="w-full max-w-2xl">
            <SearchBar />
          </div>
        </div>

        {/* Seção Central com Vagas e Guia */}
        <div className="flex flex-col md:flex-row flex-1 gap-4">
          {/* Coluna de Vagas (Esquerda) */}
          <div className="w-full md:w-3/5 space-y-2">
            <h2 className="text-xl font-bold text-[#F55F58] mb-2 pl-3">
              Vagas Recomendadas
            </h2>
            <JobCard
              jobType="CLT"
              title="Desenvolvedor Full-Stack"
              location="São Paulo, SP"
              modality="Remoto"
              companyName="Tech Solutions"
              postTime="2 horas"
            />
            <JobCard
              jobType="PJ"
              title="Engenheiro de Dados"
              location="Rio de Janeiro, RJ"
              modality="Híbrido"
              companyName="Data Insights"
              postTime="1 dia"
            />
            <JobCard
              jobType="Estágio"
              title="Analista de Marketing Digital"
              location="Belo Horizonte, MG"
              modality="Presencial"
              companyName="Marketing Pro"
              postTime="3 dias"
            />
          </div>

          {/* Coluna do Guia (Direita) */}
          <div className="w-full md:w-2/5">
            <h2 className="text-xl font-bold text-[#F55F58] mb-2 pl-3">
              Confira nossos guias
            </h2>
            <GuideCard
              imageUrl="/images/imagemLogin.png"
              category="Carreira"
              title="Como se destacar em entrevistas"
              excerpt="Dicas essenciais para você brilhar na sua próxima entrevista e conquistar a vaga dos seus sonhos."
              authorName="Ana Silva"
              authorTitle="Especialista em RH"
            />
          </div>
        </div>
      </main>

      {/* Rodapé com Informações */}
      <footer className="w-full bg-white shadow-inner border-t border-gray-200 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Cartão de Informações do Usuário */}
            <div className="bg-gray-50 rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Suas Informações
              </h3>
              <div className="space-y-2">
                <div>
                  <span className="text-sm font-medium text-gray-500">
                    Nome:
                  </span>
                  <p className="text-sm text-gray-900">{user?.nome || "N/A"}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">
                    Email:
                  </span>
                  <p className="text-sm text-gray-900">
                    {user?.email || "N/A"}
                  </p>
                </div>
              </div>
            </div>

            {/* Ações Rápidas */}
            <div className="bg-gray-50 rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Ações Rápidas
              </h3>
              <div className="space-y-2">
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors">
                  Buscar Vagas
                </button>
                <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors">
                  Meu Perfil
                </button>
              </div>
            </div>

            {/* Informações da Sessão */}
            <div className="bg-gray-50 rounded-lg shadow-sm p-6">
              <SessionInfo />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
