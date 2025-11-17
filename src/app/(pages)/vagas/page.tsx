"use client";

import React, { useState } from "react";
import { useRequireAuth } from "../../../hooks/useProtectedRoute";
import { useAuth } from "../../../contexts/AuthContext";
import { SearchBar } from "@/components/core/search-bar";
import { JobCard } from "@/components/core/job-card";
import { Header } from "@/components/core/header";
import VagasCategorySelector from "@/components/core/VagasCategorySelector";

const Vagas = () => {
  const { isLoading, canAccess } = useRequireAuth();
  const { user, logout } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState("Vagas");

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
  };

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

  if (!canAccess) {
    return null;
  }

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-custom-bg flex flex-col">
      <Header onLogout={handleLogout} />
      <VagasCategorySelector
        onCategorySelect={handleCategorySelect}
        initialSelectedCategory="Vagas"
      />
      <main className="flex-grow max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 w-full">
        <div className="w-full flex justify-center mb-2">
          <div className="w-full max-w-2xl">
            <SearchBar />
          </div>
        </div>
        {selectedCategory === "Vagas" && (
          <div className="space-y-4">
            <JobCard
              jobType="CLT"
              title="Desenvolvedor Front-End"
              location="São Paulo, SP"
              modality="Remoto"
              companyName="Tech Innovators"
              postTime="1 dia"
            />
            <JobCard
              jobType="PJ"
              title="UX/UI Designer"
              location="Rio de Janeiro, RJ"
              modality="Híbrido"
              companyName="Design Studio"
              postTime="3 dias"
            />
            <JobCard
              jobType="Estágio"
              title="Analista de Dados"
              location="Belo Horizonte, MG"
              modality="Presencial"
              companyName="Data Insights"
              postTime="5 dias"
            />
          </div>
        )}
        {selectedCategory === "Candidaturas" && <p>Conteúdo de Candidaturas</p>}
        {selectedCategory === "Vagas Salvas" && <p>Conteúdo de Vagas Salvas</p>}
      </main>
    </div>
  );
};

export default Vagas;
