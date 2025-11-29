"use client";

import { useState } from "react";
import { Header } from "@/components/core/header";
import VagasCategorySelector from "@/components/core/job-categories";
import { SearchBar } from "@/components/core/search-bar";
import { JobCard } from "@/components/core/job-card";

export default function JobsFeedPage() {
    const [activeTab, setActiveTab] = useState("Vagas");

    // Dados Mockados
    const jobs = [
        {
            id: 1,
            jobType: "Engenharia de Software",
            title: "Desenvolvedor(a) Frontend Pleno",
            location: "São Paulo, SP",
            modality: "Híbrido",
            companyName: "Tech Solutions",
            postTime: "Há 2 dias",
            companyLogoUrl: "https://github.com/shadcn.png"
        },
        {
            id: 2,
            jobType: "Design",
            title: "UI/UX Designer Junior",
            location: "Remoto",
            modality: "Home Office",
            companyName: "Creative Studio",
            postTime: "Há 4 horas",
            companyLogoUrl: "https://github.com/vercel.png"
        }
    ];


    const handleLogout = () => {

        console.log("Chamada de Logout acionada.");

    };

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* 1. Header */}
            <Header onLogout={() => console.log("Ação de Logout Clicada")} />
            {/* 2. Menu de Abas (Vagas, Candidaturas, Salvas) */}
            <div className="bg-white border-b border-gray-200 w-full md:flex">
                <div className="max-w-3xl mx-auto">
                    <VagasCategorySelector
                        onCategorySelect={(category) => setActiveTab(category)}
                        initialSelectedCategory="Vagas"
                    />
                </div>
            </div>

            <main className="max-w-3xl mx-auto p-4 space-y-6">

                {/* 3. Barra de Pesquisa */}
                {activeTab === "Vagas" && (
                    <div className="mt-2">
                        <SearchBar />
                    </div>
                )}

                {/* 4. Lista de Vagas */}
                <div className="space-y-4">
                    {activeTab === "Vagas" && jobs.map((job) => (

                        <JobCard
                            key={job.id}
                            jobType={job.jobType}
                            title={job.title}
                            location={job.location}
                            modality={job.modality}
                            companyName={job.companyName}
                            postTime={job.postTime}
                            companyLogoUrl={job.companyLogoUrl}
                        />
                    ))}

                    {/* Placeholder para outras abas */}
                    {activeTab === "Candidaturas" && (
                        <div className="text-center text-gray-500 py-10">
                            Você ainda não tem candidaturas ativas.
                        </div>
                    )}

                    {activeTab === "Vagas Salvas" && (
                        <div className="text-center text-gray-500 py-10">
                            Você ainda não tem vagas salvas.
                        </div>
                    )}
                </div>


            </main>
        </div>
    );
}