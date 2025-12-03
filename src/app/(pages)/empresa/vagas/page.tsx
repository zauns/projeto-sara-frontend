"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRequireAuth } from "@/hooks/useProtectedRoute"; // Ajuste o caminho conforme sua estrutura de pastas
import { useAuth } from "@/contexts/AuthContext"; // Ajuste o caminho
import { SearchBar } from "@/components/core/search-bar";
import { JobCard } from "@/components/core/job-card";
import { Header } from "@/components/core/header";
import { Loader2, PlusCircle } from "lucide-react";
import { jobService, VagaResponse } from "@/services/jobServices";
import { VagaCardProps } from "@/components/core/job-card";

// Interface para o JobCard (mantida a consistência)


const MinhasVagas = () => {
  // Obtemos o usuário logado para pegar o ID da empresa
  const { user, logout } = useAuth();
  const { isLoading: isAuthLoading, canAccess } = useRequireAuth();
  
  const [jobs, setJobs] = useState<VagaResponse[]>([]);
  const [isJobsLoading, setIsJobsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleLogout = () => {
    logout();
  };

  useEffect(() => {
    const fetchCompanyJobs = async () => {
      // Verifica se temos acesso e se o usuário está carregado com ID
      if (!user?.id) return;

      try {
        setIsJobsLoading(true);
        // [MUDANÇA CRÍTICA]: Busca apenas as vagas desta empresa específica
        const data = await jobService.getJobsByEmpresaId(user.id);
        setJobs(data);
      } catch (err) {
        console.error("Erro ao buscar minhas vagas:", err);
        setError("Não foi possível carregar suas vagas no momento.");
      } finally {
        setIsJobsLoading(false);
      }
    };

    if (canAccess && user) {
      fetchCompanyJobs();
    }
  }, [canAccess, user]);


  const adaptJobToCard = (vaga: VagaResponse): VagaCardProps => {
    const safeTags = vaga.tags || [];

    return {
      titulo: vaga.titulo,
      // Se user.nome estiver disponível no contexto, pode usar user.nome, 
      // ou pegar do objeto vaga.empresa.nome
      empresaNome: vaga.empresa?.nome || user?.nome || "Minha Empresa", 
      area: safeTags[0] || "Geral",
      tipo: safeTags[1] || "N/A",
      modalidade: safeTags[2] || "N/A",
      localizacao: safeTags[3] || "Remoto",
      ativa: vaga.ativa,
      companyLogoUrl: "" // Adicionar lógica de logo se necessário
    };
  };

  // Loader de Autenticação
  if (isAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-custom-bg">
        <div className="text-center">
          <Loader2 className="animate-spin h-12 w-12 text-[#F55F58] mx-auto mb-4" />
          <p className="text-gray-600">Verificando permissões...</p>
        </div>
      </div>
    );
  }

  if (!canAccess) {
    return null;
  }

  return (
    <div className="min-h-screen bg-custom-bg flex flex-col">
      <Header onLogout={handleLogout} />
      
      <main className="flex-grow max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 w-full">
        {/* Título da Página (substituindo as categorias) */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Minhas Vagas Publicadas</h1>
          
          {/* Botão opcional para criar nova vaga, já que estamos na área da empresa */}
          <Link 
            href="/home/empresa" 
            className="flex items-center gap-2 bg-[#F55F58] text-white px-4 py-2 rounded-md hover:bg-[#d94a44] transition-colors text-sm font-medium"
          >
            <PlusCircle size={18} />
            Nova Vaga
          </Link>
        </div>

        <div className="w-full flex justify-center mb-6">
          <div className="w-full max-w-2xl">
            {/* Mantive a SearchBar visualmente, mas ela precisa ser implementada 
                para filtrar o estado 'jobs' localmente se desejar */}
            <SearchBar /> 
          </div>
        </div>

        {/* --- Lista de Vagas da Empresa --- */}
        <div className="space-y-3">
          {isJobsLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="animate-spin h-8 w-8 text-[#F55F58]" />
            </div>
          ) : error ? (
            <div className="text-center py-10 text-red-500 bg-red-50 rounded-lg border border-red-100">
              {error}
            </div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-lg border border-gray-200 shadow-sm">
              <p className="text-gray-500 text-lg mb-2">Você ainda não publicou nenhuma vaga.</p>
              <p className="text-gray-400 text-sm">Crie sua primeira vaga para começar a receber candidaturas.</p>
            </div>
          ) : (
            jobs.map((job) => {
              const cardProps = adaptJobToCard(job);
              return (
                <Link
                  // [MUDANÇA CRÍTICA]: URL apontando para a rota de detalhes da empresa
                  href={`/empresa/vagas/${job.id}`}
                  key={job.id}
                  className="block transition-transform transform hover:scale-[1.01] focus:outline-none focus:ring-2 focus:ring-[#F55F58] focus:ring-offset-2 rounded-lg"
                >
                  <JobCard
                    titulo={cardProps.titulo}
                    empresaNome={cardProps.empresaNome}
                    area={cardProps.area}
                    tipo={cardProps.tipo}
                    modalidade={cardProps.modalidade}
                    localizacao={cardProps.localizacao}
                    companyLogoUrl={cardProps.companyLogoUrl}
                    ativa={cardProps.ativa}
                  />
                </Link>
              );
            })
          )}
        </div>
      </main>
    </div>
  );
};

export default MinhasVagas;