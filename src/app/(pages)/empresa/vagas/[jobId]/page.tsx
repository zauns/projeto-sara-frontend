"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { JobDetailsCard } from "@/components/core/job-details-card";
import { CandidateCard } from "@/components/core/candidate-card";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, 
  Filter, 
  Loader2, 
  AlertTriangle, 
  RefreshCw,
  Check // Importado para indicar o filtro ativo
} from "lucide-react";

// --- NOVOS IMPORTS PARA O DROPDOWN ---
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { jobService, VagaResponse } from "@/services/jobServices";
import { 
  applicationService, 
  CandidaturaResponse, 
  StatusCandidatura 
} from "@/services/applicationServices";
import { curriculumService } from "@/services/curriculumServices";
import { toast } from "@/hooks/use-toast"; 

import { Header } from "@/components/core/header";
import { useAuth } from "@/contexts/AuthContext";
import { useRequireAuth } from "@/hooks/useProtectedRoute";

// ... (Tipagens JobFormValues e ParsedJobDetails mantidas iguais) ...
type JobFormValues = {
  title: string;
  location: string;
  jobType: string;
  modality: string;
  level?: string;
  description: string;
  responsibilitiesArray: string[];
  requirementsArray: string[];
};

interface ParsedJobDetails {
  description: string;
  requirements: string[];
  responsibilities: string[];
  location: string;
  salary: string | null;
}

export default function CompanyJobManagePage() {
  const router = useRouter();
  const params = useParams();
  
  const { isLoading: authLoading } = useRequireAuth();
  const { logout } = useAuth();

  const jobId = Array.isArray(params.jobId) ? params.jobId[0] : params.jobId;

  const [job, setJob] = useState<VagaResponse | null>(null);
  const [applications, setApplications] = useState<CandidaturaResponse[]>([]);
  const [parsedDetails, setParsedDetails] = useState<ParsedJobDetails | null>(null);
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloadingIds, setDownloadingIds] = useState<Set<string>>(new Set());

  // --- NOVO ESTADO PARA O FILTRO ---
  const [filterStatus, setFilterStatus] = useState<StatusCandidatura | "TODAS">("TODAS");

  // ... (Função parseJobDescription mantida igual) ...
  const parseJobDescription = (fullDescription: string, tags: string[]): ParsedJobDetails => {
    const details: ParsedJobDetails = {
      description: "",
      requirements: [],
      responsibilities: [],
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
      } else if (sectionTitle.includes("responsabilidades")) {
        details.responsibilities = cleanLines.map((resp) => resp.replace(/^[-*]\s*/, ""));
      } else if (sectionTitle.includes("detalhes")) {
        cleanLines.forEach((line) => {
          const lowerLine = line.toLowerCase();
          if (lowerLine.includes("localização:") || lowerLine.includes("localizacao:")) {
            details.location = line.split(":")[1].trim();
          }
        });
      }
    }
    return details;
  };

  // ... (fetchData mantido igual) ...
  const fetchData = async () => {
    if (!jobId || authLoading) return;
    try {
      setIsLoading(true);
      const [jobData, applicationsData] = await Promise.all([
        jobService.getJobById(jobId),
        applicationService.getCandidaturasByVaga(jobId)
      ]);
      if (jobData) {
        setJob(jobData);
        setParsedDetails(parseJobDescription(jobData.descricao, jobData.tags));
      } else {
        setError("Vaga não encontrada.");
      }
      if (applicationsData) {
        setApplications(applicationsData);
      }
    } catch (err) {
      console.error("Erro ao carregar dados:", err);
      setError("Erro ao carregar os detalhes da vaga ou candidaturas.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobId, authLoading]);

  // --- NOVA LÓGICA DE FILTRAGEM ---
  const filteredApplications = applications.filter((app) => {
    if (filterStatus === "TODAS") return true;
    return app.status === filterStatus;
  });

  // Função auxiliar para o texto do botão de filtro
  const getFilterLabel = () => {
    switch (filterStatus) {
      case StatusCandidatura.PENDENTE: return "Pendentes";
      case StatusCandidatura.EM_ANALISE: return "Em Análise";
      case StatusCandidatura.APROVADA: return "Aprovadas";
      case StatusCandidatura.REJEITADA: return "Rejeitadas";
      default: return "Todos os Status";
    }
  };

  // ... (Funções de ação: handleToggleJobStatus, handleUpdateJob, handleDeleteJob mantidas iguais) ...
  const handleToggleJobStatus = async (newStatus: boolean) => {
      if (!job) return;
      try {
        const updatedJob = await jobService.toggleJobStatus(job.id, newStatus);
        setJob(updatedJob);
        toast({
          title: newStatus ? "Vaga Reativada" : "Vaga Encerrada",
          description: `A vaga agora está ${newStatus ? 'visível' : 'oculta'} para novos candidatos.`,
          className: newStatus ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-200"
        });
      } catch (error) {
        console.error("Erro ao alterar status:", error);
        toast({ title: "Erro", description: "Falha ao alterar status da vaga.", variant: "destructive" });
      }
  };

  const handleUpdateJob = async (formData: JobFormValues) => {
      if (!job) return;
      try {
        let formattedDescription = formData.description;
        if (formData.responsibilitiesArray.length > 0) {
            formattedDescription += "\n\n### Responsabilidades\n" + formData.responsibilitiesArray.map(item => `- ${item}`).join("\n");
        }
        if (formData.requirementsArray.length > 0) {
            formattedDescription += "\n\n### Requisitos\n" + formData.requirementsArray.map(item => `- ${item}`).join("\n");
        }
        const updatedTags = [formData.jobType, formData.level || "", formData.modality, formData.location];
        const payload = {
            titulo: formData.title,
            descricao: formattedDescription,
            tags: updatedTags,
            empresaId: job.empresa.id,
            isAtiva: job.ativa,
        };
        const updatedJob = await jobService.updateJob(job.id, payload);
        setJob(updatedJob);
        setParsedDetails(parseJobDescription(updatedJob.descricao, updatedJob.tags));
        toast({ title: "Sucesso", description: "Vaga atualizada com sucesso." });
      } catch (error) {
          console.error(error);
          toast({ title: "Erro", description: "Falha ao atualizar.", variant: "destructive" });
      }
  };

  const handleDeleteJob = async (id: string) => {
      try {
          await jobService.deleteJob(id);
          toast({ title: "Vaga excluída", description: "A vaga foi removida." });
          router.replace('/empresa/vagas');
      } catch (error) {
          console.error(error);
          toast({ title: "Erro", description: "Falha ao excluir.", variant: "destructive" });
      }
  };

  // ... (Funções handleUpdateCandidateStatus, handleDownloadResume, handleApprove, handleReject mantidas iguais) ...
  const handleUpdateCandidateStatus = async (candidaturaId: string, newStatus: StatusCandidatura, candidateName: string, silent = false) => {
     try {
        await applicationService.updateStatusCandidatura(candidaturaId, newStatus);
        setApplications(prev => prev.map(app => app.id === candidaturaId ? { ...app, status: newStatus } : app));
        if (!silent) {
            const actionText = newStatus === StatusCandidatura.APROVADA ? "aprovada" : "rejeitada";
            const variant = newStatus === StatusCandidatura.APROVADA ? "default" : "destructive";
            toast({
                title: `Status Atualizado`,
                description: `Candidatura de ${candidateName} ${actionText}.`,
                variant: variant
            });
        }
     } catch(e) { 
         console.error(e); 
         if(!silent) toast({ title: "Erro", description: "Falha ao atualizar status.", variant: "destructive" }); 
     }
  };

  const handleDownloadResume = async (candidaturaId: string, email: string, candidateName: string, currentStatus: StatusCandidatura) => {
    setDownloadingIds(prev => new Set(prev).add(candidaturaId));
    try {
        const pdfBlob = await curriculumService.downloadCurriculumByEmail(email);
        const fileURL = window.URL.createObjectURL(pdfBlob);
        const alink = document.createElement('a');
        alink.href = fileURL;
        alink.download = `Curriculo_${candidateName.replace(/\s+/g, '_')}.pdf`;
        alink.target = '_blank';
        document.body.appendChild(alink);
        alink.click();
        document.body.removeChild(alink);

        if (currentStatus === StatusCandidatura.PENDENTE) {
            await handleUpdateCandidateStatus(candidaturaId, StatusCandidatura.EM_ANALISE, candidateName, true);
            toast({ title: "Download Iniciado", description: "Status alterado para 'Em Análise'." });
        } else {
            toast({ title: "Download Iniciado", description: `Currículo de ${candidateName}.` });
        }
    } catch (error) {
        console.error("Erro ao baixar currículo", error);
        toast({ title: "Erro no Download", description: "Não foi possível baixar o arquivo.", variant: "destructive" });
    } finally {
        setDownloadingIds(prev => {
            const newSet = new Set(prev);
            newSet.delete(candidaturaId);
            return newSet;
        });
    }
  };

  const handleApprove = (candidaturaId: string, name: string) => {
    handleUpdateCandidateStatus(candidaturaId, StatusCandidatura.APROVADA, name);
  };

  const handleReject = (candidaturaId: string, name: string) => {
    if(confirm(`Deseja realmente rejeitar a candidatura de ${name}?`)) {
      handleUpdateCandidateStatus(candidaturaId, StatusCandidatura.REJEITADA, name);
    }
  };

  const handleLogout = () => logout();

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-custom-bg">
        <div className="text-center">
          <Loader2 className="animate-spin h-10 w-10 text-primary mx-auto mb-4" />
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (error || !job || !parsedDetails) {
    return ( /* ... JSX de erro mantido ... */ 
        <div className="min-h-screen bg-custom-bg flex flex-col">
            <Header onLogout={handleLogout} />
            <main className="flex-grow flex flex-col items-center justify-center p-8">
                <AlertTriangle className="h-16 w-16 text-red-500 mb-4" />
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">Erro</h2>
                <p className="text-gray-600 mb-6">{error || "Vaga não encontrada."}</p>
                <Button onClick={() => router.back()} variant="outline">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
                </Button>
            </main>
        </div>
    );
  }

  const jobDataForCard = {
    title: job.titulo,
    companyName: job.empresa.nome,
    companyLogoUrl: "", 
    isActive: job.ativa,
    location: parsedDetails.location,
    description: parsedDetails.description,
    responsibilities: parsedDetails.responsibilities,
    requirements: parsedDetails.requirements,
    jobType: job.tags[0] || "Integral",
    level: job.tags[1] || "Pleno",
    modality: job.tags[2] || "Híbrido",
    postedAt: "Publicada recentemente", 
  };

  return (
    <div className="min-h-screen bg-custom-bg flex flex-col">
      <Header onLogout={handleLogout} />

      <main className="flex-grow p-4 md:p-8">
        <div className="max-w-7xl mx-auto mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <Button variant="ghost" onClick={() => router.back()} className="w-fit text-gray-600 hover:text-black pl-0">
            <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para Minhas Vagas
          </Button>
          <div className="flex items-center gap-2">
            <span className={`text-sm font-medium px-3 py-1 rounded-full border ${job.ativa ? 'bg-green-100 text-green-700 border-green-200' : 'bg-red-50 text-red-600 border-red-100'}`}>
              {job.ativa ? "Vaga Ativa" : "Vaga Encerrada"}
            </span>
            <span className="text-sm text-gray-500 font-medium">• {applications.length} total</span>
          </div>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 xl:col-span-8 space-y-6">
            <JobDetailsCard
              {...jobDataForCard}
              jobId={job.id}
              onDeleteAction={handleDeleteJob}
              onUpdateJobAction={handleUpdateJob}
              onToggleStatusAction={handleToggleJobStatus} 
              isCompanyView={true}
            />
          </div>

          <div className="lg:col-span-5 xl:col-span-4 space-y-6">
            <div className="flex items-center justify-between bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900">
                Candidaturas <span className="text-sm font-normal text-gray-500">({filteredApplications.length})</span>
              </h2>
              
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" onClick={fetchData} title="Atualizar lista">
                  <RefreshCw className="h-4 w-4 text-gray-500" />
                </Button>
                
                {/* --- COMPONENTE DE FILTRO IMPLEMENTADO --- */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="h-8 gap-2">
                      <Filter className="h-3 w-3" /> 
                      {getFilterLabel()}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem onClick={() => setFilterStatus("TODAS")} className="cursor-pointer justify-between">
                      Todas {filterStatus === "TODAS" && <Check className="h-4 w-4" />}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterStatus(StatusCandidatura.PENDENTE)} className="cursor-pointer justify-between">
                      Pendentes {filterStatus === StatusCandidatura.PENDENTE && <Check className="h-4 w-4" />}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterStatus(StatusCandidatura.EM_ANALISE)} className="cursor-pointer justify-between">
                      Em Análise {filterStatus === StatusCandidatura.EM_ANALISE && <Check className="h-4 w-4" />}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterStatus(StatusCandidatura.APROVADA)} className="cursor-pointer justify-between">
                      Aprovadas {filterStatus === StatusCandidatura.APROVADA && <Check className="h-4 w-4" />}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterStatus(StatusCandidatura.REJEITADA)} className="cursor-pointer justify-between">
                      Rejeitadas {filterStatus === StatusCandidatura.REJEITADA && <Check className="h-4 w-4" />}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <div className="space-y-4 max-h-[800px] overflow-y-auto pr-1">
              {filteredApplications.length > 0 ? (
                // --- MAP USANDO A LISTA FILTRADA ---
                filteredApplications.map((app) => {
                  const userName = app.user?.nome || "Usuário Desconhecido";
                  const userEmail = app.user?.email || "";
                  const userRole =  "Candidata"; 
                  const userLocation = app.user?.endereco || "Localização não informada";

                  return (
                    <CandidateCard
                      key={app.id}
                      id={app.id}
                      name={userName}
                      role={userRole}
                      location={userLocation}
                      matchPercentage={undefined} 
                      imageUrl={undefined} 
                      status={app.status}
                      isDownloadLoading={downloadingIds.has(app.id)}
                      onDownloadCurriculum={() => {
                          if (userEmail) {
                              handleDownloadResume(app.id, userEmail, userName, app.status);
                          } else {
                              toast({ title: "Erro", description: "E-mail não disponível.", variant: "destructive" });
                          }
                      }}
                      onApprove={() => handleApprove(app.id, userName)}
                      onReject={() => handleReject(app.id, userName)}
                    />
                  );
                })
              ) : (
                <div className="text-center py-10 px-4 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                  <p className="text-gray-500 font-medium">
                    {filterStatus === "TODAS" 
                      ? "Nenhuma candidatura recebida ainda." 
                      : `Nenhuma candidatura encontrada com o status "${getFilterLabel()}".`}
                  </p>
                  {filterStatus !== "TODAS" && (
                    <Button variant="link" onClick={() => setFilterStatus("TODAS")} className="mt-2 text-primary">
                      Limpar filtros
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}