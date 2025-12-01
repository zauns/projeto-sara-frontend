"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRequireAuth } from "../../../hooks/useProtectedRoute";
import { useAuth } from "../../../contexts/AuthContext";
import { SearchBar } from "@/components/core/search-bar";
import { JobCard } from "@/components/core/job-card";
import { Header } from "@/components/core/header";
import VagasCategorySelector from "@/components/core/job-categories";
import { Loader2 } from "lucide-react";
import { jobService, VagaResponse } from "../../../services/jobServices";

// Interface esperada pelo componente JobCard (conforme sua especificação anterior)
interface JobCardProps {
  titulo: string;
  empresaNome: string;
  area: string;
  tipo: string;
  modalidade: string;
  localizacao: string;
  companyLogoUrl?: string; // Opcional, caso a empresa tenha logo
}

const Vagas = () => {
  const { isLoading: isAuthLoading, canAccess } = useRequireAuth();
  const { logout } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState("Vagas");
  
  // Estados para gerenciar as vagas vindas da API
  const [jobs, setJobs] = useState<VagaResponse[]>([]);
  const [isJobsLoading, setIsJobsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
  };

  const handleLogout = () => {
    logout();
  };

  // Busca as vagas ao carregar a página
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setIsJobsLoading(true);
        const data = await jobService.getAllJobs();
        setJobs(data);
      } catch (err) {
        console.error("Erro ao buscar vagas:", err);
        setError("Não foi possível carregar as vagas no momento.");
      } finally {
        setIsJobsLoading(false);
      }
    };

    if (canAccess) {
      fetchJobs();
    }
  }, [canAccess]);

  // Função de transformação: VagaResponse (API) -> JobCardProps (Componente)
  const adaptJobToCard = (vaga: VagaResponse): JobCardProps => {
    // Garante que tags existam para evitar erro de undefined
    const safeTags = vaga.tags || [];

    return {
      titulo: vaga.titulo,
      // Assume que UserProfileGeneric tem uma propriedade 'nome' ou 'name'. 
      // Ajuste 'nome' conforme a estrutura real do seu UserProfileGeneric.
      empresaNome: (vaga.empresa)?.nome || "Empresa Parceira", 
      area: safeTags[0] || "Geral",          // tags[0] é a área
      tipo: safeTags[1] || "N/A",            // tags[1] é o tipo
      modalidade: safeTags[2] || "N/A",      // tags[2] é a modalidade
      localizacao: safeTags[3] || "Remoto",  // tags[3] é a localização
      // Se houver URL da logo no objeto empresa, adicione aqui:
      companyLogoUrl: "" 
    };
  };

  // Carregamento inicial de Auth
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

        {/* --- Vagas Principais (Vindas da API) --- */}
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
                Nenhuma vaga encontrada.
              </div>
            ) : (
              // Aplica o limite de 10 vagas (slice)
              jobs.slice(0, 10).map((job) => {
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

        {/* --- Outras Categorias (Placeholder) --- */}
        {selectedCategory === "Candidaturas" && (
          <div className="space-y-2">
             <div className="text-center py-10 text-gray-500">
                Funcionalidade de candidaturas em desenvolvimento.
              </div>
          </div>
        )}
        {selectedCategory === "Vagas Salvas" && (
          <div className="space-y-2">
             <div className="text-center py-10 text-gray-500">
                Nenhuma vaga salva.
              </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Vagas;