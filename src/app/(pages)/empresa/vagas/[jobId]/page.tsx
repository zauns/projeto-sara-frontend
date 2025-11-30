"use client";

import { useRouter } from "next/navigation";
import { JobDetailsCard } from "@/components/core/job-details-card";
import { CandidateCard } from "@/components/core/candidate-card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Filter } from "lucide-react";

export default function CompanyJobManagePage() {
    const router = useRouter();

    // dados mockados

    const jobData = {
        title: "Desenvolvedora Front-end Pleno",
        companyName: "Minha Empresa S.A.",
        companyLogoUrl: "https://github.com/shadcn.png",
        location: "São Paulo, SP",
        postedAt: "Publicado há 2 dias",
        jobType: "Tempo Integral",
        modality: "Híbrido",
        level: "Pleno",
        description: "Estamos buscando uma profissional apaixonada por React e ecossistema Vercel para liderar nosso time de produtos digitais. Você trabalhará diretamente com designers e PMs para entregar interfaces de alta fidelidade.",
        responsibilities: [
            "Desenvolver interfaces responsivas usando Next.js e TailwindCSS.",
            "Manter a biblioteca de componentes (Design System).",
            "Mentorar desenvolvedoras júnior e participar de Code Reviews."
        ],
        requirements: [
            "Experiência sólida com React, TypeScript e Hooks.",
            "Conhecimento em acessibilidade (WCAG) e SEO.",
            "Vivência com metodologias ágeis (Scrum/Kanban)."
        ],
    };

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

    // HANDLERS

    const handleEditJob = () => {
        console.log("Abrir modal ou página de edição da vaga");
        // alguma coisa aqui pra fazer a edição
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

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">

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

                {/* Status da Vaga (Opcional) */}
                <span className="text-sm font-medium text-green-600 bg-green-100 px-3 py-1 rounded-full w-fit">
                    Vaga Ativa • {candidates.length} candidaturas
                </span>
            </div>

            {/* 2. Grid Layout Principal */}
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Coluna esquerda com detalhes da vaga */}
                <div className="lg:col-span-7 xl:col-span-8 space-y-6">
                    

                    <JobDetailsCard
                        {...jobData}
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

                        {/* Estado vazio (se não houver ninguém) */}
                        {candidates.length === 0 && (
                            <div className="text-center py-10 text-gray-500">
                                Nenhuma candidatura recebida ainda.
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}