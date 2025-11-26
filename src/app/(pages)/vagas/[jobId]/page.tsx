"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Header } from "@/components/core/header";
import { useAuth } from "../../../../contexts/AuthContext";
import { mockJobs, Job } from "../../../../data/mock-jobs"; // Importa o mock e a interface
import {
  Calendar,
  Briefcase,
  Activity,
  Car,
  MapPin,
  Building,
  Loader2,
  AlertTriangle,
} from "lucide-react"; // Usando lucide-react para ícones

// Componente para renderizar o ícone de benefício correspondente
const BenefitIcon = ({
  icon,
}: {
  icon: "calendar" | "luggage" | "activity" | "car";
}) => {
  const iconProps = {
    size: 24,
    className: "text-[#F55F58] flex-shrink-0",
  };

  switch (icon) {
    case "calendar":
      return <Calendar {...iconProps} />;
    case "luggage":
      return <Briefcase {...iconProps} />;
    case "activity":
      return <Activity {...iconProps} />;
    case "car":
      return <Car {...iconProps} />;
    default:
      return null;
  }
};

const JobDetailPage = () => {
  const { logout } = useAuth(); // Já que o Header precisa, vamos manter
  const params = useParams();
  const { jobId } = params;

  const [job, setJob] = useState<Job | null | undefined>(undefined); // undefined para estado inicial, null para não encontrado
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // --- PONTO DE REQUISIÇÃO (INÍCIO) ---
    // No futuro, você substituirá esta lógica por uma chamada de API
    // ex: const fetchJob = async () => {
    //   try {
    //     const response = await api.get(`/jobs/${jobId}`);
    //     setJob(response.data);
    //   } catch (error) {
    //     console.error("Erro ao buscar vaga:", error);
    //     setJob(null); // Define como null se der erro (ex: 404)
    //   } finally {
    //     setIsLoading(false);
    //   }
    // }
    // fetchJob();

    // Simulação de mock
    setIsLoading(true);
    const foundJob = mockJobs.find((j) => j.id === jobId);
    // Simula um pequeno delay de rede
    setTimeout(() => {
      setJob(foundJob || null); // Define como null se não for encontrado
      setIsLoading(false);
    }, 500);
    // --- PONTO DE REQUISIÇÃO (FIM) ---
  }, [jobId]);

  const handleLogout = () => {
    logout();
  };

  if (isLoading || job === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-custom-bg">
        <div className="text-center">
          <Loader2 className="animate-spin h-12 w-12 text-[#F55F58] mx-auto mb-4" />
          <p className="text-gray-600">Carregando vaga...</p>
        </div>
      </div>
    );
  }

  if (job === null) {
    return (
      <div className="min-h-screen bg-custom-bg flex flex-col">
        <Header onLogout={handleLogout} />
        <main className="flex-grow max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex flex-col items-center justify-center bg-white p-10 rounded-lg shadow-md">
            <AlertTriangle className="h-16 w-16 text-red-500 mb-4" />
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              Vaga não encontrada
            </h2>
            <p className="text-gray-600">
              A vaga que você está procurando não existe ou foi removida.
            </p>
          </div>
        </main>
      </div>
    );
  }

  // Transforma a descrição em markdown (simples) para HTML
  const descriptionHtml = job.description
    .replace(/\n/g, "<br />")
    .replace(
      /\*\*(.*?)\*\*/g,
      '<strong class="font-semibold text-gray-800">$1</strong>'
    )
    .replace(/- (.*?)(<br \/>)/g, '<li class="list-disc list-inside">$1</li>');

  return (
    // Aplicando o fundo bg-custom-bg (assumindo que seja o rosa claro)
    <div className="min-h-screen bg-custom-bg flex flex-col">
      <Header onLogout={handleLogout} />
      {/* Container principal com padding e largura máxima */}
      <main className="flex-grow max-w-3xl mx-auto py-6 px-4 sm:px-6 lg:px-8 w-full">
        {/* Card branco da vaga */}
        <div className="bg-white shadow-lg rounded-xl overflow-hidden">
          <div className="p-6 md:p-8">
            {/* Cabeçalho da Vaga */}
            <div className="mb-4">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                {job.title}
              </h1>
              <div className="flex items-center text-sm text-gray-600 mt-2 flex-wrap">
                <span className="flex items-center mr-4">
                  <MapPin size={16} className="mr-1" />
                  {job.location}
                </span>
                <span className="flex items-center">
                  <Calendar size={16} className="mr-1" />
                  Anunciada há {job.postedDays} dias
                </span>
              </div>
            </div>

            {/* Empresa */}
            <div className="flex items-center gap-3 my-5 py-4 border-t border-b border-gray-200">
              <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full">
                <Building size={24} className="text-gray-500" />
              </div>
              <div>
                <span className="text-lg font-semibold text-gray-800">
                  {job.company}
                </span>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              {job.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-[#FFF1EA] text-[#F55F58] text-xs font-medium px-3 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Descrição */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                Descrição da vaga
              </h2>
              <div
                className="prose prose-sm max-w-none text-gray-700 space-y-3"
                dangerouslySetInnerHTML={{ __html: descriptionHtml }}
              />
            </div>

            {/* Benefícios */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Benefícios
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                {job.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <BenefitIcon icon={benefit.icon} />
                    <span className="text-gray-700 text-sm">
                      {benefit.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Botões de Ação Fixos no Mobile (ou no final) */}
        <div className="sticky bottom-0 mt-6 bg-white p-4 border-t border-gray-200 flex gap-4 md:static md:bg-transparent md:p-0 md:border-t-0 md:mt-8">
          <button className="flex-1 h-11 px-6 text-white font-semibold rounded-lg bg-[#F55F58] hover:bg-[#E05550] transition-colors focus:outline-none focus:ring-2 focus:ring-[#F55F58] focus:ring-offset-2">
            Candidatar-se
          </button>
          <button className="flex-1 h-11 px-6 font-semibold rounded-lg border-2 border-[#F55F58] text-[#F55F58] hover:bg-[#FFF1EA] transition-colors focus:outline-none focus:ring-2 focus:ring-[#F55F58] focus:ring-offset-2">
            Salvar vaga
          </button>
        </div>
      </main>
    </div>
  );
};

export default JobDetailPage;