"use client";

import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { MapPin, Clock, Bookmark, Send, Building2, Edit } from "lucide-react"; // Importe Edit
import { SuccessDialog } from "@/components/core/success-dialogue";

type JobDetailsCardProps = {
    title: string;
    companyName: string;
    companyLogoUrl?: string;
    location: string;
    postedAt: string; // Ex: "Publicado há 2 dias"
    
    // Tags / Badges
    jobType: string;   // Ex: Tempo Integral
    modality: string;  // Ex: Remoto
    level?: string;    // Ex: Sênior
    
    // Conteúdo
    description: string;
    responsibilities?: string[];
    requirements?: string[];
    
    // Ações da Usuária
    onApply?: () => void;
    onSave?: () => void;
    isApplied?: boolean; // Para mudar o estado do botão se já tiver aplicado

    // --- Novos props (Modo Empresa) ---
    isCompanyView?: boolean; // Se true, mostra modo de edição
    onEdit?: () => void;     // Função chamada ao clicar em Editar
};

export function JobDetailsCard(props: JobDetailsCardProps) {
    // Estados locais da interatividade
    const [isSaved, setIsSaved] = useState(false);
    const [showSuccessDialog, setShowSuccessDialog] = useState(false);
    const [isApplied, setIsApplied] = useState(props.isApplied || false);

    const handleSaveToggle = () => {
        setIsSaved(!isSaved);
    };

    const handleApplyClick = () => {
        setIsApplied(true);
        setShowSuccessDialog(true);
        if (props.onApply) props.onApply();
    };

    return (
        <>
            <Card className="w-full max-w-4xl mx-auto bg-white shadow-lg border-gray-200 overflow-hidden">
                
                {/* --- CABEÇALHO (Igual) --- */}
                <CardHeader className="p-6 md:p-8 bg-gray-50/50 border-b border-gray-100">
                    <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                        
                        <Avatar className="h-20 w-20 rounded-xl border border-gray-200 bg-white">
                            <AvatarImage src={props.companyLogoUrl} alt={props.companyName} />
                            <AvatarFallback className="rounded-xl bg-indigo-50 text-indigo-600">
                                <Building2 className="h-10 w-10" />
                            </AvatarFallback>
                        </Avatar>

                        <div className="flex-1 space-y-2">
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                                {props.title}
                            </h1>
                            
                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                                <span className="font-medium text-indigo-600 flex items-center gap-1">
                                    <Building2 className="h-4 w-4" />
                                    {props.companyName}
                                </span>
                                <span className="flex items-center gap-1">
                                    <MapPin className="h-4 w-4" />
                                    {props.location}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Clock className="h-4 w-4" />
                                    {props.postedAt}
                                </span>
                            </div>

                            <div className="flex flex-wrap gap-2 pt-2">
                                <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100">
                                    {props.jobType}
                                </Badge>
                                <Badge variant="secondary" className="bg-purple-50 text-purple-700 hover:bg-purple-100">
                                    {props.modality}
                                </Badge>
                                {props.level && (
                                    <Badge variant="secondary" className="bg-orange-50 text-orange-700 hover:bg-orange-100">
                                        {props.level}
                                    </Badge>
                                )}
                            </div>
                        </div>
                    </div>
                </CardHeader>

                {/* --- Conteúdo --- */}
                <CardContent className="p-6 md:p-8 space-y-8">
                    
                    <div className="space-y-3">
                        <h3 className="text-lg font-bold text-gray-900">Sobre a vaga</h3>
                        <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                            {props.description}
                        </p>
                    </div>

                    <Separator />

                    {props.responsibilities && props.responsibilities.length > 0 && (
                        <div className="space-y-3">
                            <h3 className="text-lg font-bold text-gray-900">Responsabilidades</h3>
                            <ul className="list-disc list-inside space-y-2 text-gray-700 marker:text-indigo-500">
                                {props.responsibilities.map((item, index) => (
                                    <li key={index}>{item}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {props.requirements && props.requirements.length > 0 && (
                        <div className="space-y-3">
                            <h3 className="text-lg font-bold text-gray-900">Requisitos</h3>
                            <ul className="list-disc list-inside space-y-2 text-gray-700 marker:text-indigo-500">
                                {props.requirements.map((item, index) => (
                                    <li key={index}>{item}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </CardContent>

                {/* Rodapé */}
                <CardFooter className="p-6 md:p-8 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row gap-4 justify-end">
                    
                    {props.isCompanyView ? (
                        // Visão da empresa
                        <Button 
                            size="lg" 
                            className="w-full sm:w-auto bg-[#F55F58] hover:bg-[#d94a44] text-white"
                            onClick={props.onEdit}
                        >
                            <Edit className="h-5 w-5 mr-2 text-white" />
                            Editar Vaga
                        </Button>
                    ) : (
                        //VISÃO DA USUÁRIA
                        <>
                            <Button 
                                variant="outline" 
                                size="lg" 
                                className={`w-full sm:w-auto border-gray-300 ${isSaved ? 'text-indigo-600 border-indigo-200 bg-indigo-50' : 'text-gray-700 hover:bg-white'}`}
                                onClick={handleSaveToggle}
                            >
                                <Bookmark 
                                    className={`h-5 w-5 mr-2 ${isSaved ? 'fill-current' : ''}`} 
                                />
                                {isSaved ? "Vaga Salva" : "Salvar Vaga"}
                            </Button>

                            <Button 
                                size="lg" 
                                className={`w-full sm:w-auto ${isApplied ? 'bg-green-600 hover:bg-green-700' : 'bg-red-500 hover:bg-red-600'}`}
                                onClick={handleApplyClick}
                                disabled={isApplied}
                            >
                                {isApplied ? (
                                    <>
                                        <span className="mr-2">Candidatura Enviada</span>
                                        <span className="text-xl">✓</span>
                                    </>
                                ) : (
                                    <>
                                        <Send className="h-5 w-5 mr-2" />
                                        Candidatar-se agora
                                    </>
                                )}
                            </Button>
                        </>
                    )}

                </CardFooter>
            </Card>

            <SuccessDialog
                isOpen={showSuccessDialog}
                onClose={() => setShowSuccessDialog(false)}
                title="Candidatura Enviada!"
                description={`Sua candidatura para a vaga de ${props.title} foi enviada com sucesso para a empresa ${props.companyName}. Boa sorte!`}
                buttonText="Ver outras vagas"
                onAction={() => setShowSuccessDialog(false)}
            />
        </>
    );
}