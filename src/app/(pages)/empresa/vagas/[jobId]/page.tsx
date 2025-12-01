"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { JobDetailsCard } from "@/components/core/job-details-card";
import { CandidateCard } from "@/components/core/candidate-card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Filter, Loader2, AlertTriangle } from "lucide-react";
import { jobService, VagaResponse } from "@/services/jobServices";

// Importações do Header e Auth
import { Header } from "@/components/core/header";
import { useAuth } from "@/contexts/AuthContext";
// Importação do Hook de Proteção (Ajuste o caminho conforme sua estrutura de pastas)
import { useRequireAuth } from "@/hooks/useProtectedRoute"; 

// Interface auxiliar para os dados processados
interface ParsedJobDetails {
  description: string;
  requirements: string[];
  location: string;
  salary: string | null;
}

export default function CompanyJobManagePage() {
  const router = useRouter();
  const params = useParams();
  
  // 1. Lógica de Proteção de Rota
  // Isso garante que se o usuário deslogar ou não estiver autenticado, 
  // ele será redirecionado para /login automaticamente.
  const { isLoading: authLoading } = useRequireAuth();
  
  // 2. Acesso à função de logout
  const { logout } = useAuth();

  // Garante que o ID é uma string
  const jobId = Array.isArray(params.jobId) ? params.jobId[0] : params.jobId;

  // Estados da página
  const [job, setJob] = useState<VagaResponse | null>(null);
  const [parsedDetails, setParsedDetails] = useState<ParsedJobDetails | null>(null);
  const [isJobLoading, setIsJobLoading] = useState(true); // Renomeado para evitar conflito
  const [error, setError] = useState<string | null>(null);

  // --- LÓGICA DE PARSE ---
  const parseJobDescription = (fullDescription: string, tags: string[]): ParsedJobDetails => {
    const details: ParsedJobDetails = {
      description: "",
      requirements: [],
      location: tags[3] || "Remoto",
      salary: null,
    };

    if (!fullDescription) return details;

    const sections = fullDescription.split(/###\s+/);
    details.description = sections[0].trim();

    for (let i = 1; i < sections.length; i++) {
      const sectionContent = sections[i];
      const [title, ...lines] = sectionContent.split("\n");
      const cleanLines = lines.map((l) => l.trim()).filter((l) => l.length > 0);
      const sectionTitle = title.toLowerCase().replace(":", "").trim();

      if (sectionTitle.includes("requisitos")) {
        details.requirements = cleanLines.map((req) => req.replace(/^[-*]\s*/, ""));
      } else if (sectionTitle.includes("detalhes")) {
        cleanLines.forEach((line) => {
          const lowerLine = line.toLowerCase();
          if (lowerLine.includes("localização:") || lowerLine.includes("localizacao:")) {
            details.location = line.split(":")[1].trim();
          } else if (lowerLine.includes("salário:") || lowerLine.includes("salario:")) {
            details.salary = line.split(":")[1].trim();
          }
        });
      }
    }
    return details;
  };

  // --- BUSCAR DADOS DA API ---
  useEffect(() => {
    const fetchJob = async () => {
      // Se a autenticação ainda estiver carregando, não busca a vaga ainda
      if (!jobId || authLoading) return;

      try {
        setIsJobLoading(true);
        const data = await jobService.getJobById(jobId);

        if (data) {
          setJob(data);
          setParsedDetails(parseJobDescription(data.descricao, data.tags));
        } else {
          setError("Vaga não encontrada.");
        }
      } catch (err) {
        console.error("Erro ao buscar detalhes da vaga:", err);
        setError("Erro ao carregar os detalhes da vaga.");
      } finally {
        setIsJobLoading(false);
      }
    };

    fetchJob();
  }, [jobId, authLoading]); // Adicionado authLoading às dependências

  // --- HANDLERS ---
  const handleLogout = () => {
    logout();
    // O hook useRequireAuth detectará a mudança de estado e fará o redirect automaticamente
  };

  const handleEditJob = () => {
    console.log("Abrir modal ou página de edição da vaga ID:", jobId);
  };

  const handleViewProfile = (name: string) => {
    console.log(`Ver perfil de ${name}`);
  };

  const handleApprove = (name: string) => {
    console.log(`Candidata ${name} aprovada para entrevista!`);
  };

  const handleReject = (name: string) => {
    console.log(`Candidata ${name} dispensada.`);
  };

  // --- DADOS MOCKADOS (Candidatos) ---
  const candidates = [
    {
      id: "1",
      name: "Ana Clara",
      role: "Dev Front-end",
      location: "São Paulo, SP",
      match: 95,
    },
    {
      id: "2",
      name: "Beatriz Silva",
      role: "Fullstack Jr",
      location: "Belo Horizonte, MG",
      match: 70,
    },
    {
      id: "3",
      name: "Carla Dias",
      role: "UX Designer / Front-end",
      location: "Rio de Janeiro, RJ",
      match: 45,
    },
  ];

  // --- RENDERIZAÇÃO CONDICIONAL ---

  // Verifica tanto o loading da autenticação quanto o da vaga
  if (authLoading || isJobLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-custom-bg">
        <div className="text-center">
          <Loader2 className="animate-spin h-10 w-10 text-primary mx-auto mb-4" />
          <p className="text-gray-600">
            {authLoading ? "Verificando permissões..." : "Carregando detalhes da vaga..."}
          </p>
        </div>
      </div>
    );
  }

  if (error || !job || !parsedDetails) {
    return (
      <div className="min-h-screen bg-custom-bg flex flex-col">
        <Header onLogout={handleLogout} />
        <main className="flex-grow flex flex-col items-center justify-center p-8">
          <AlertTriangle className="h-16 w-16 text-red-500 mb-4" />
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Erro</h2>
          <p className="text-gray-600 mb-6">{error || "Vaga não encontrada."}</p>
          <Button onClick={() => router.back()} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
        </main>
      </div>
    );
  }

  // Prepara os dados para o Card existente
  const jobDataForCard = {
    title: job.titulo,
    companyName: job.empresa.nome,
    companyLogoUrl: "https://github.com/shadcn.png", // Placeholder
    location: parsedDetails.location,
    postedAt: "Recente", 
    jobType: job.tags[0] || "Integral",
    modality: job.tags.find(t => t.includes("híbrido") || t.includes("remoto")) || "Presencial",
    level: job.tags[1] || "Pleno",
    description: parsedDetails.description,
    responsibilities: [], 
    requirements: parsedDetails.requirements,
  };

  return (
    <div className="min-h-screen bg-custom-bg flex flex-col">
      <Header onLogout={handleLogout} />

      <main className="flex-grow p-4 md:p-8">
        {/* 1. Botão de Voltar e Título */}
        <div className="max-w-7xl mx-auto mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="w-fit text-gray-600 hover:text-black pl-0"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para Minhas Vagas
          </Button>

          {/* Status da Vaga */}
          <span className="text-sm font-medium text-green-600 bg-green-100 px-3 py-1 rounded-full w-fit">
            Vaga Ativa • {candidates.length} candidaturas (Simulação)
          </span>
        </div>

        {/* 2. Grid Layout Principal */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Coluna esquerda com detalhes da vaga */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-6">
            <JobDetailsCard
              {...jobDataForCard}
              isCompanyView={true}
              onEdit={handleEditJob}
            />
          </div>

          {/* Coluna direita com candidatas */}
          <div className="lg:col-span-5 xl:col-span-4 space-y-6">
            {/* Header da Lista */}
            <div className="flex items-center justify-between bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900">Candidaturas</h2>
              <Button variant="outline" size="sm" className="h-8">
                <Filter className="h-3 w-3 mr-2" />
                Filtrar
              </Button>
            </div>

            {/* Lista Scrollável de Candidatas */}
            <div className="space-y-4">
              {candidates.map((candidate) => (
                <CandidateCard
                  key={candidate.id}
                  id={candidate.id}
                  name={candidate.name}
                  role={candidate.role}
                  location={candidate.location}
                  matchPercentage={candidate.match}
                  onViewProfile={() => handleViewProfile(candidate.name)}
                  onApprove={() => handleApprove(candidate.name)}
                  onReject={() => handleReject(candidate.name)}
                />
              ))}

              {candidates.length === 0 && (
                <div className="text-center py-10 text-gray-500">
                  Nenhuma candidatura recebida ainda.
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}