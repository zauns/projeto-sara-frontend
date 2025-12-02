"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation"; 
import { Header } from "@/components/core/header";
import { useAuth } from "../../../../contexts/AuthContext";
import { jobService, VagaResponse } from "../../../../services/jobServices";
import { applicationService } from "../../../../services/applicationServices"; 
// 1. Importe o hook de proteção (ajuste o caminho conforme sua estrutura de pastas)
import { useRequireAuth } from "../../../../hooks/useProtectedRoute";

import {
  Calendar,
  MapPin,
  Building,
  Loader2,
  AlertTriangle,
  Mail,
  Phone,
  DollarSign,
  CheckCircle2,
} from "lucide-react";

interface ParsedJobDetails {
  description: string;
  requirements: string[];
  location: string;
  salary: string | null;
}

const JobDetailPage = () => {
  // 2. Utilize o hook de proteção. 
  // Ele redirecionará para /login automaticamente se não houver usuário.
  const { user, isLoading: authLoading } = useRequireAuth();
  
  // Mantemos o useAuth apenas para pegar a função logout, já que o hook de proteção não a expõe
  const { logout } = useAuth(); 

  const params = useParams();
  const jobId = Array.isArray(params.jobId) ? params.jobId[0] : params.jobId;

  const [job, setJob] = useState<VagaResponse | null>(null);
  const [parsedDetails, setParsedDetails] = useState<ParsedJobDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isApplying, setIsApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);

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
      const cleanLines = lines.map(l => l.trim()).filter(l => l.length > 0);
      const sectionTitle = title.toLowerCase().replace(":", "").trim();

      if (sectionTitle.includes("requisitos")) {
        details.requirements = cleanLines.map(req => req.replace(/^[-*]\s*/, ""));
      } else if (sectionTitle.includes("detalhes")) {
        cleanLines.forEach(line => {
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

  useEffect(() => {
    const fetchJob = async () => {
      if (!jobId) return;
      try {
        setIsLoading(true);
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
        setIsLoading(false);
      }
    };

    // Só busca a vaga se o usuário já estiver autenticado (opcional, mas economiza requisição)
    if (!authLoading && user) {
        fetchJob();
    }
  }, [jobId, authLoading, user]); // Adicionado dependências

  useEffect(() => {
    const checkApplicationStatus = async () => {
      if (!user || !jobId) return;

      try {
        const minhasCandidaturas = await applicationService.getMinhasCandidaturas();
        const jaCandidatou = minhasCandidaturas.some(
          (app) => app.vaga.id === jobId 
        );
        setHasApplied(jaCandidatou);
      } catch (error) {
        console.error("Erro ao verificar status da candidatura", error);
      }
    };

    if (!authLoading && user) {
        checkApplicationStatus();
    }
  }, [user, jobId, authLoading]);

  const handleApply = async () => {
    if (!user || !jobId) return;
    setIsApplying(true);
    try {
      await applicationService.createCandidatura({
        userId: user.id, 
        vagaId: jobId
      });
      setHasApplied(true);
      alert("Candidatura realizada com sucesso!");
    } catch (error) {
      console.error("Erro ao realizar candidatura:", error);
      alert("Ocorreu um erro ao tentar se candidatar. Tente novamente mais tarde.");
    } finally {
      setIsApplying(false);
    }
  };

  const handleLogout = () => {
    logout();
  };

  // 3. Verifica se está carregando a Autenticação OU os dados da Vaga
  if (authLoading || (isLoading && !error)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-custom-bg">
        <div className="text-center">
          <Loader2 className="animate-spin h-12 w-12 text-[#F55F58] mx-auto mb-4" />
          <p className="text-gray-600">
            {authLoading ? "Verificando permissões..." : "Carregando detalhes da vaga..."}
          </p>
        </div>
      </div>
    );
  }

  // Se o hook de proteção redirecionar, o componente desmonta,
  // mas por segurança garantimos que nada renderiza sem usuário
  if (!user) return null;

  if (error || !job || !parsedDetails) {
    return (
      <div className="min-h-screen bg-custom-bg flex flex-col">
        <Header onLogout={handleLogout} />
        <main className="flex-grow max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex flex-col items-center justify-center bg-white p-10 rounded-lg shadow-md">
            <AlertTriangle className="h-16 w-16 text-red-500 mb-4" />
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              Vaga indisponível
            </h2>
            <p className="text-gray-600">
              {error || "A vaga que você procura não foi encontrada."}
            </p>
          </div>
        </main>
      </div>
    );
  }

  const descriptionHtml = parsedDetails.description.replace(/\n/g, "<br />");

  return (
    <div className="min-h-screen bg-custom-bg flex flex-col">
      <Header onLogout={handleLogout} />
      <main className="flex-grow max-w-3xl mx-auto py-6 px-4 sm:px-6 lg:px-8 w-full">
        <div className="bg-white shadow-lg rounded-xl overflow-hidden">
          <div className="p-6 md:p-8">
            {/* ... Restante do JSX inalterado ... */}
            
            {/* Cabeçalho da Vaga */}
            <div className="mb-6">
              <div className="flex flex-wrap gap-2 mb-3">
                {job.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-blue-50 text-blue-600 text-xs font-semibold px-2.5 py-0.5 rounded border border-blue-100 uppercase tracking-wide"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
                {job.titulo}
              </h1>
              
              <div className="flex items-center text-sm text-gray-600 mt-3 flex-wrap gap-4">
                <span className="flex items-center text-gray-700 bg-gray-50 px-2 py-1 rounded-md">
                  <MapPin size={16} className="mr-1.5 text-[#F55F58]" />
                  {parsedDetails.location}
                </span>
                
                {parsedDetails.salary && (
                  <span className="flex items-center text-gray-700 bg-gray-50 px-2 py-1 rounded-md">
                    <DollarSign size={16} className="mr-1.5 text-green-600" />
                    {parsedDetails.salary}
                  </span>
                )}

                <span className="flex items-center text-gray-500">
                  <Calendar size={16} className="mr-1.5" />
                  Publicada há 2 dias
                </span>
              </div>
            </div>

            <hr className="border-gray-100 my-6" />

            {/* Seção da Empresa */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8 bg-gray-50 p-4 rounded-lg border border-gray-100">
              <div className="flex items-center justify-center w-14 h-14 bg-white rounded-full shadow-sm border border-gray-100 shrink-0">
                <Building size={24} className="text-gray-400" />
              </div>
              <div className="flex-grow">
                <h3 className="text-lg font-bold text-gray-800">
                  {job.empresa.nome}
                </h3>
                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-sm text-gray-600">
                  {job.empresa.email && (
                    <span className="flex items-center hover:text-[#F55F58] transition-colors">
                      <Mail size={14} className="mr-1.5" />
                      {job.empresa.email}
                    </span>
                  )}
                  {job.empresa.telefone && (
                    <span className="flex items-center hover:text-[#F55F58] transition-colors">
                      <Phone size={14} className="mr-1.5" />
                      {job.empresa.telefone}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Descrição Principal */}
            <div className="mb-8">
              <h2 className="text-lg font-bold text-gray-900 mb-3 border-l-4 border-[#F55F58] pl-3">
                Sobre a Vaga
              </h2>
              <div
                className="prose prose-sm max-w-none text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: descriptionHtml }}
              />
            </div>

            {/* Requisitos */}
            {parsedDetails.requirements.length > 0 && (
              <div className="mb-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4 border-l-4 border-[#F55F58] pl-3">
                  Requisitos
                </h2>
                <ul className="grid grid-cols-1 gap-3">
                  {parsedDetails.requirements.map((req, index) => (
                    <li key={index} className="flex items-start bg-gray-50 p-3 rounded-lg">
                      <CheckCircle2 className="h-5 w-5 text-[#F55F58] mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 text-sm font-medium">
                        {req}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="sticky bottom-0 mt-6 bg-white p-4 border-t border-gray-200 flex flex-col sm:flex-row gap-3 shadow-top-md md:shadow-none md:static md:bg-transparent md:p-0 md:border-t-0 md:mt-8 z-10">
          <button 
            onClick={handleApply}
            disabled={isApplying || hasApplied}
            className={`flex-1 h-12 px-6 text-white font-bold rounded-lg shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 
              ${hasApplied 
                ? 'bg-green-600 hover:bg-green-700 cursor-default focus:ring-green-600'
                : 'bg-[#F55F58] hover:bg-[#E05550] hover:shadow-lg focus:ring-[#F55F58]'
              }
              ${(isApplying || hasApplied) ? 'opacity-90' : ''}
            `}
          >
            {isApplying ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="animate-spin h-5 w-5" />
                Enviando...
              </span>
            ) : hasApplied ? (
              <span className="flex items-center justify-center gap-2">
                <CheckCircle2 className="h-5 w-5" />
                Candidatura Enviada
              </span>
            ) : (
              "Candidatar-se agora"
            )}
          </button>
          
          <button className="flex-1 sm:flex-none sm:w-48 h-12 px-6 font-semibold rounded-lg border-2 border-gray-200 text-gray-600 hover:border-[#F55F58] hover:text-[#F55F58] hover:bg-white transition-all focus:outline-none focus:ring-2 focus:ring-[#F55F58] focus:ring-offset-2">
            Salvar vaga
          </button>
        </div>
      </main>
    </div>
  );
};

export default JobDetailPage;