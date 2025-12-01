"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRequireAuth } from "../../../../hooks/useProtectedRoute";
import { useAuth } from "../../../../contexts/AuthContext";
import SessionInfo from "../../../../components/SessionInfo";
import { SearchBar } from "@/components/core/search-bar";
import { JobCard } from "@/components/core/job-card";
import { GuideCard } from "@/components/core/guide-card";
import { Header } from "@/components/core/header";
import { jobService, VagaResponse } from "../../../../services/jobServices";
import { Loader2 } from "lucide-react";

// Interface esperada pelo componente JobCard
interface JobCardProps {
  titulo: string;
  empresaNome: string;
  area: string;
  tipo: string;
  modalidade: string;
  localizacao: string;
  companyLogoUrl?: string;
}

const Home = () => {
  const { isLoading: isAuthLoading, canAccess } = useRequireAuth();
  const { user, logout } = useAuth();
  
  const [recommendedJobs, setRecommendedJobs] = useState<VagaResponse[]>([]);
  const [isJobsLoading, setIsJobsLoading] = useState(true);

  // Função para adaptar os dados da API para o Card
  const adaptJobToCard = (vaga: VagaResponse): JobCardProps => {
    const safeTags = vaga.tags || [];
    return {
      titulo: vaga.titulo,
      empresaNome: (vaga.empresa)?.nome || "Empresa Parceira",
      area: safeTags[0] || "Geral",
      tipo: safeTags[1] || "N/A",
      modalidade: safeTags[2] || "N/A",
      localizacao: safeTags[3] || "Remoto",
      companyLogoUrl: (vaga.empresa as any)?.avatarUrl
    };
  };

  // Busca e seleciona 3 vagas aleatórias
  useEffect(() => {
    const fetchRandomJobs = async () => {
      try {
        setIsJobsLoading(true);
        const allJobs = await jobService.getAllJobs();
        
        // Embaralha o array de vagas e pega as 3 primeiras
        const shuffled = [...allJobs].sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, 3);
        
        setRecommendedJobs(selected);
      } catch (error) {
        console.error("Erro ao carregar vagas recomendadas:", error);
      } finally {
        setIsJobsLoading(false);
      }
    };

    if (canAccess) {
      fetchRandomJobs();
    }
  }, [canAccess]);

  const handleLogout = () => {
    logout();
  };

  // Loading de Autenticação
  if (isAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-custom-bg">
        <div className="text-center">
          <Loader2 className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!canAccess) {
    return null;
  }

  return (
    <div className="min-h-screen bg-custom-bg flex flex-col">
      {/* Cabeçalho */}
      <Header onLogout={() => handleLogout()} />

      {/* Conteúdo Principal */}
      <main className="flex-grow max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 w-full">
        {/* Barra de Pesquisa */}
        <div className="w-full flex justify-center mb-6">
          <div className="w-full max-w-2xl">
            <SearchBar />
          </div>
        </div>

        {/* Seção Central com Vagas e Guia */}
        <div className="flex flex-col md:flex-row flex-1 gap-6">
          {/* Coluna de Vagas (Esquerda) */}
          <div className="w-full md:w-3/5 space-y-4">
            <h2 className="text-xl font-bold text-[#F55F58] mb-2 pl-1 border-l-4 border-[#F55F58]">
              Vagas Recomendadas para você
            </h2>
            
            {isJobsLoading ? (
               <div className="flex justify-center py-8">
                 <Loader2 className="animate-spin h-8 w-8 text-gray-400" />
               </div>
            ) : recommendedJobs.length > 0 ? (
              <div className="flex flex-col gap-3">
                {recommendedJobs.map((job) => {
                  const cardProps = adaptJobToCard(job);
                  return (
                    <Link href={`/vagas/${job.id}`} key={job.id} className="block hover:no-underline">
                      <div className="transition-transform transform hover:scale-[1.01]">
                        <JobCard
                          titulo={cardProps.titulo}
                          empresaNome={cardProps.empresaNome}
                          area={cardProps.area}
                          tipo={cardProps.tipo}
                          modalidade={cardProps.modalidade}
                          localizacao={cardProps.localizacao}
                          companyLogoUrl={cardProps.companyLogoUrl}
                        />
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="text-gray-500 text-center py-8 bg-white rounded-lg shadow-sm">
                Nenhuma recomendação disponível no momento.
              </div>
            )}
            
            <div className="text-right mt-2">
               <Link href="/vagas" className="text-sm font-semibold text-blue-600 hover:text-blue-800">
                 Ver todas as vagas &rarr;
               </Link>
            </div>
          </div>

          {/* Coluna do Guia (Direita) */}
          <div className="w-full md:w-2/5">
            <h2 className="text-xl font-bold text-[#F55F58] mb-4 pl-1 border-l-4 border-[#F55F58]">
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
      <footer className="w-full bg-white shadow-inner border-t border-gray-200 py-6 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Cartão de Informações do Usuário */}
            <div className="bg-gray-50 rounded-lg shadow-sm p-6 border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Suas Informações
              </h3>
              <div className="space-y-3">
                <div>
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Nome
                  </span>
                  <p className="text-sm font-medium text-gray-900">{user?.nome || "Usuário"}</p>
                </div>
                <div>
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Email
                  </span>
                  <p className="text-sm font-medium text-gray-900">
                    {user?.email || "N/A"}
                  </p>
                </div>
              </div>
            </div>

            {/* Ações Rápidas */}
            <div className="bg-gray-50 rounded-lg shadow-sm p-6 border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Ações Rápidas
              </h3>
              <div className="space-y-3">
                <Link href="/vagas" className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors shadow-sm">
                  Buscar Vagas
                </Link>
                <Link href="/perfil" className="block w-full text-center bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors shadow-sm">
                  Meu Perfil
                </Link>
              </div>
            </div>

            {/* Informações da Sessão */}
            <div className="bg-gray-50 rounded-lg shadow-sm p-6 border border-gray-100">
              <SessionInfo />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;