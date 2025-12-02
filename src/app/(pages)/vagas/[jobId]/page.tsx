"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useRequireAuth } from "@/hooks/useProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import { SearchBar } from "@/components/core/search-bar";
import { JobCard } from "@/components/core/job-card";
import { Header } from "@/components/core/header";
import VagasCategorySelector from "@/components/core/job-categories";
import { Loader2 } from "lucide-react";
import { jobService, VagaResponse } from "@/services/jobServices";

// Interface para o Card
interface JobCardProps {
  titulo: string;
  empresaNome: string;
  area: string;
  tipo: string;
  modalidade: string;
  localizacao: string;
  companyLogoUrl?: string;
}

// Componente interno que usa useSearchParams
const VagasContent = () => {
  const { isLoading: isAuthLoading, canAccess } = useRequireAuth();
  const { logout } = useAuth();
  
  // Hook para ler a URL (termos e tags)
  const searchParams = useSearchParams();

  const [selectedCategory, setSelectedCategory] = useState("Vagas");
  const [jobs, setJobs] = useState<VagaResponse[]>([]);
  const [isJobsLoading, setIsJobsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
  };

  const handleLogout = () => {
    logout();
  };

  // --- EFEITO PRINCIPAL DE BUSCA E FILTRAGEM ---
  useEffect(() => {
    const fetchAndFilterJobs = async () => {
      // Se ainda não tiver permissão, não busca nada
      if (!canAccess) return;

      try {
        setIsJobsLoading(true);
        setError(null);

        // 1. Ler parâmetros da URL
        const queryTerm = searchParams.get("q");
        const queryTags = searchParams.get("tags");

        let data: VagaResponse[] = [];

        // 2. Fazer a requisição à API (Filtro Macro)
        if (queryTerm) {
          // Se tem termo de pesquisa, busca especificamente por ele
          data = await jobService.getJobsBySearch(queryTerm);
        } else {
          // Se não tem termo, busca todas (para depois filtrar por tag se necessário)
          data = await jobService.getAllJobs();
        }

        // 3. Filtragem Local por Tags (Refinamento)
        if (queryTags) {
          const tagsList = queryTags.split(','); // Ex: ['Remoto', 'CLT']
          
          data = data.filter((vaga) => {
            const vagaTags = vaga.tags || [];
            // Verifica se a vaga possui ALGUMA das tags selecionadas (Lógica OR)
            // Se quiser que tenha TODAS (Lógica AND), troque .some() por .every()
            return vagaTags.some(tag => tagsList.includes(tag));
          });
        }

        setJobs(data);

      } catch (err) {
        console.error("Erro ao buscar vagas:", err);
        setError("Não foi possível carregar as vagas no momento.");
      } finally {
        setIsJobsLoading(false);
      }
    };

    fetchAndFilterJobs();
  
  // O useEffect roda sempre que a URL mudar (searchParams) ou a permissão mudar
  }, [canAccess, searchParams]);

  // Função para adaptar dados para o componente visual
  const adaptJobToCard = (vaga: VagaResponse): JobCardProps => {
    const safeTags = vaga.tags || [];
    return {
      titulo: vaga.titulo,
      empresaNome: (vaga.empresa)?.nome || "Empresa Parceira",
      area: safeTags[0] || "Geral",
      tipo: safeTags[1] || "N/A",
      modalidade: safeTags[2] || "N/A",
      localizacao: safeTags[3] || "Remoto",
      companyLogoUrl: "" // Adicionar lógica de avatar se existir no futuro
    };
  };

  // Renderização de Loading da Auth
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

  if (!canAccess) return null;

  return (
    <div className="min-h-screen bg-custom-bg flex flex-col">
      <Header onLogout={handleLogout} />
      
      <VagasCategorySelector
        onCategorySelect={handleCategorySelect}
        initialSelectedCategory="Vagas"
      />

      <main className="flex-grow max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 w-full">
        {/* Barra de Pesquisa */}
        <div className="w-full flex justify-center mb-1">
          <div className="w-full max-w-2xl">
            <SearchBar />
          </div>
        </div>

        {/* Listagem de Vagas */}
        {selectedCategory === "Vagas" && (
          <div className="space-y-2">
            {isJobsLoading ? (
              <div className="flex justify-center py-10">
                <Loader2 className="animate-spin h-8 w-8 text-[#F55F58]" />
              </div>
            ) : error ? (
              <div className="text-center py-10 text-red-500">{error}</div>
            ) : jobs.length === 0 ? (
              <div className="text-center py-10 text-gray-500">
                Nenhuma vaga encontrada com os filtros atuais.
              </div>
            ) : (
              // Mapeia as vagas filtradas
              jobs.map((job) => {
                const cardProps = adaptJobToCard(job);
                return (
                  <Link
                    href={`/vagas/${job.id}`}
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
                    />
                  </Link>
                );
              })
            )}
          </div>
        )}

        {/* Placeholders para outras categorias */}
        {selectedCategory === "Candidaturas" && (
           <div className="text-center py-10 text-gray-500">Funcionalidade em desenvolvimento.</div>
        )}
        {selectedCategory === "Vagas Salvas" && (
           <div className="text-center py-10 text-gray-500">Nenhuma vaga salva.</div>
        )}
      </main>
    </div>
  );
};

// Componente wrapper com Suspense
const Vagas = () => {
  return (
    <Suspense 
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-custom-bg">
          <div className="text-center">
            <Loader2 className="animate-spin h-12 w-12 text-[#F55F58] mx-auto mb-4" />
            <p className="text-gray-600">Carregando...</p>
          </div>
        </div>
      }
    >
      <VagasContent />
    </Suspense>
  );
};

export default Vagas;