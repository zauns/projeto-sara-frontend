"use client";

import React, { useState, useEffect, Suspense } from "react"; // 1. Importe Suspense
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

interface JobCardProps {
  titulo: string;
  empresaNome: string;
  area: string;
  tipo: string;
  modalidade: string;
  localizacao: string;
  companyLogoUrl?: string;
}

// 2. Renomeie o componente principal antigo para "VagasContent"
const VagasContent = () => {
  const { isLoading: isAuthLoading, canAccess } = useRequireAuth();
  const { logout } = useAuth();
  
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

  useEffect(() => {
    const fetchAndFilterJobs = async () => {
      if (!canAccess) return;

      try {
        setIsJobsLoading(true);
        setError(null);

        const queryTerm = searchParams.get("q");
        const queryTags = searchParams.get("tags");

        let data: VagaResponse[] = [];

        if (queryTerm) {
          data = await jobService.getJobsBySearch(queryTerm);
        } else {
          data = await jobService.getAllJobs();
        }

        if (queryTags) {
          const tagsList = queryTags.split(',');
          
          data = data.filter((vaga) => {
            const vagaTags = vaga.tags || [];
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
  }, [canAccess, searchParams]);

  const adaptJobToCard = (vaga: VagaResponse): JobCardProps => {
    const safeTags = vaga.tags || [];
    return {
      titulo: vaga.titulo,
      empresaNome: (vaga.empresa)?.nome || "Empresa Parceira",
      area: safeTags[0] || "Geral",
      tipo: safeTags[1] || "N/A",
      modalidade: safeTags[2] || "N/A",
      localizacao: safeTags[3] || "Remoto",
      companyLogoUrl: ""
    };
  };

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
        <div className="w-full flex justify-center mb-1">
          <div className="w-full max-w-2xl">
            <SearchBar />
          </div>
        </div>

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

// 3. Crie o novo Default Export com o Suspense Boundary
const VagasPage = () => {
  return (
    // O fallback é o que aparece enquanto o next processa os parâmetros da URL
    <Suspense 
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-custom-bg">
          <Loader2 className="animate-spin h-12 w-12 text-[#F55F58]" />
        </div>
      }
    >
      <VagasContent />
    </Suspense>
  );
};

export default VagasPage;