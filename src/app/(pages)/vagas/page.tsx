"use client";

import React, { useState } from "react";
import Link from "next/link"; // Importar o Link
import { useRequireAuth } from "../../../hooks/useProtectedRoute";
import { useAuth } from "../../../contexts/AuthContext";
import { SearchBar } from "@/components/core/search-bar";
import { JobCard } from "@/components/core/job-card";
import { Header } from "@/components/core/header";
import VagasCategorySelector from "@/components/core/job-categories";
import { mockJobs } from "../../../data/mock-jobs"; // Importar os dados mockados
import { Loader2 } from "lucide-react"; // Importar o loader

const Vagas = () => {
  const { isLoading, canAccess } = useRequireAuth();
  const { logout } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState("Vagas");

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-custom-bg">
        <div className="text-center">
          <Loader2 className="animate-spin h-12 w-12 text-[#F55F58] mx-auto mb-4" />
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!canAccess) {
    return null;
  }

  const handleLogout = () => {
    logout();
  };

  // Função auxiliar para extrair tags relevantes
  const getJobCardProps = (job: typeof mockJobs[0]) => {
    const jobType =
      job.tags.find((tag) => ["CLT", "PJ", "Estágio"].includes(tag)) || "N/A";
    const modality =
      job.tags.find((tag) => ["Remoto", "Híbrido", "Presencial"].includes(tag)) ||
      "N/A";
    const postTime = `${job.postedDays} dia${job.postedDays > 1 ? "s" : ""}`;

    return {
      jobType,
      modality,
      postTime,
      title: job.title,
      location: job.location,
      companyName: job.company,
    };
  };

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

        {/* --- Vagas Principais (Dinâmicas) --- */}
        {selectedCategory === "Vagas" && (
          <div className="space-y-2">
            {mockJobs.map((job) => {
              const cardProps = getJobCardProps(job);
              return (
                <Link
                  href={`/vagas/${job.id}`} // Link dinâmico
                  key={job.id}
                  className="block transition-transform transform hover:scale-[1.01] focus:outline-none focus:ring-2 focus:ring-[#F55F58] focus:ring-offset-2 rounded-lg"
                >
                  <JobCard
                    jobType={cardProps.jobType}
                    title={cardProps.title}
                    location={cardProps.location}
                    modality={cardProps.modality}
                    companyName={cardProps.companyName}
                    postTime={cardProps.postTime}
                  />
                </Link>
              );
            })}
          </div>
        )}

        {/* --- Outras Categorias (Mantidas como estáticas por enquanto) --- */}
        {selectedCategory === "Candidaturas" && (
          <div className="space-y-2">
            {/* TODO: Substituir por dados de candidaturas */}
            <JobCard
              jobType="CLT"
              title="Engenheiro de Software Sênior"
              location="São Paulo, SP"
              modality="Remoto"
              companyName="Global Tech Solutions"
              postTime="2 dias"
            />
          </div>
        )}
        {selectedCategory === "Vagas Salvas" && (
          <div className="space-y-2">
            {/* TODO: Substituir por dados de vagas salvas */}
            <JobCard
              jobType="Estágio"
              title="Marketing Digital Júnior"
              location="São Paulo, SP"
              modality="Híbrido"
              companyName="Digital Boost"
              postTime="6 dias"
            />
          </div>
        )}
      </main>
    </div>
  );
};

export default Vagas;