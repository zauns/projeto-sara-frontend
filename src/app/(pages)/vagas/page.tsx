"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useRequireAuth } from "../../../hooks/useProtectedRoute";
import { useAuth } from "../../../contexts/AuthContext";
import { SearchBar } from "@/components/core/search-bar";
import { JobCard, VagaCardProps } from "@/components/core/job-card"; // Importei VagaCardProps
import { ApplicationCard } from "@/components/core/application-card"; // Importe o novo componente
import { Header } from "@/components/core/header";
import VagasCategorySelector from "@/components/core/job-categories";
import { Loader2 } from "lucide-react";
import { jobService, VagaResponse } from "../../../services/jobServices";
import { applicationService, CandidaturaResponse } from "../../../services/applicationServices";

const VagasContent = () => {
  const { isLoading: isAuthLoading, canAccess } = useRequireAuth();
  const { logout } = useAuth();
  
  const searchParams = useSearchParams();

  const [selectedCategory, setSelectedCategory] = useState("Vagas");
  
  // Estados para Vagas
  const [jobs, setJobs] = useState<VagaResponse[]>([]);
  const [isJobsLoading, setIsJobsLoading] = useState(true);
  
  // Estados para Candidaturas
  const [myApplications, setMyApplications] = useState<CandidaturaResponse[]>([]);
  const [isAppLoading, setIsAppLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
  };

  const handleLogout = () => {
    logout();
  };

  // --- EFEITO 1: Busca de VAGAS ---
  useEffect(() => {
    // Só busca vagas se estiver na aba Vagas e tiver permissão
    if (!canAccess || selectedCategory !== "Vagas") return;

    const fetchAndFilterJobs = async () => {
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
  }, [canAccess, searchParams, selectedCategory]);


  // --- EFEITO 2: Busca de CANDIDATURAS ---
  useEffect(() => {
    // Só busca candidaturas se a aba for selecionada
    if (!canAccess || selectedCategory !== "Candidaturas") return;

    const fetchApplications = async () => {
      try {
        setIsAppLoading(true);
        // Chama o serviço fornecido no prompt
        const apps = await applicationService.getMinhasCandidaturas();
        setMyApplications(apps);
      } catch (err) {
        console.error("Erro ao buscar candidaturas:", err);
        setError("Erro ao carregar suas candidaturas.");
      } finally {
        setIsAppLoading(false);
      }
    };

    fetchApplications();
  }, [canAccess, selectedCategory]);


  // Adaptador para JobCard (Vagas)
  const adaptJobToCard = (vaga: VagaResponse): VagaCardProps => {
    const safeTags = vaga.tags || [];
    return {
      titulo: vaga.titulo,
      empresaNome: (vaga.empresa)?.nome || "Empresa Parceira",
      area: safeTags[0] || "Geral",
      tipo: safeTags[1] || "N/A",
      modalidade: safeTags[2] || "N/A",
      localizacao: safeTags[3] || "Remoto",
      companyLogoUrl: "", 
      ativa: vaga.ativa,
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
        
        {/* Renderiza SearchBar apenas se estiver na aba Vagas (opcional, depende do design) */}
        {selectedCategory === "Vagas" && (
          <div className="w-full flex justify-center mb-1">
            <div className="w-full max-w-2xl">
              <SearchBar />
            </div>
          </div>
        )}

        {/* --- CONTEÚDO: VAGAS --- */}
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
                    className="block transition-transform transform hover:scale-[1.01] focus:outline-none rounded-lg"
                  >
                    <JobCard {...cardProps} />
                  </Link>
                );
              })
            )}
          </div>
        )}

        {/* --- CONTEÚDO: CANDIDATURAS (Novo) --- */}
        {selectedCategory === "Candidaturas" && (
           <div className="space-y-2">
             {isAppLoading ? (
               <div className="flex justify-center py-10">
                 <Loader2 className="animate-spin h-8 w-8 text-[#F55F58]" />
               </div>
             ) : myApplications.length === 0 ? (
                <div className="text-center py-10 text-gray-500">
                  Você ainda não se candidatou a nenhuma vaga.
                </div>
             ) : (
               myApplications.map((app) => {
                 // Extração segura das tags da vaga dentro da candidatura
                 const safeTags = app.vaga.tags || [];
                 const modalidade = safeTags[2] || "Remoto"; 
                 const localizacao = safeTags[3] || "Brasil";

                 return (
                   <Link 
                     key={app.id} 
                     href={`/vagas/${app.vaga.id}`} // Redireciona para a página da vaga
                     className="block transition-transform transform hover:scale-[1.01] focus:outline-none rounded-lg"
                   >
                     <ApplicationCard
                       titulo={app.vaga.titulo}
                       empresaNome={app.vaga.empresa?.nome || "Empresa"}
                       localizacao={localizacao}
                       modalidade={modalidade}
                       status={app.status}
                       companyLogoUrl="" // Adicione lógica se houver logo
                     />
                   </Link>
                 );
               })
             )}
           </div>
        )}

        {/* --- CONTEÚDO: VAGAS SALVAS --- */}
        {selectedCategory === "Vagas Salvas" && (
           <div className="text-center py-10 text-gray-500">Nenhuma vaga salva.</div>
        )}
      </main>
    </div>
  );
};

const Vagas = () => {
  return (
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

export default Vagas;