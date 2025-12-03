"use client";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Check, X, Download, User, Clock, AlertCircle } from "lucide-react";
import { StatusCandidatura } from "@/services/applicationServices";

// Props atualizadas para receber o Enum e funções sem argumentos (já bound no pai)
type CandidateCardProps = {
    id: string;
    name: string;
    role: string;
    location: string;
    matchPercentage?: number;
    imageUrl?: string;
    status: StatusCandidatura; // Usando o Enum real
    
    onDownloadCurriculum: () => void; 
    onApprove: () => void;
    onReject: () => void;
    
    isDownloadLoading?: boolean;
};

export function CandidateCard({
    name,
    role,
    location,
    matchPercentage,
    imageUrl,
    status,
    onDownloadCurriculum,
    onApprove,
    onReject,
    isDownloadLoading = false
}: CandidateCardProps) {

    // Configuração visual baseada no Status
    const getStatusConfig = (currentStatus: StatusCandidatura) => {
        switch (currentStatus) {
            case StatusCandidatura.APROVADA:
                return { label: "Aprovada", color: "bg-green-100 text-green-700 border-green-200", icon: Check };
            case StatusCandidatura.REJEITADA:
                return { label: "Rejeitada", color: "bg-red-50 text-red-600 border-red-100", icon: X };
            case StatusCandidatura.EM_ANALISE:
                return { label: "Em Análise", color: "bg-amber-100 text-amber-700 border-amber-200", icon: Clock };
            case StatusCandidatura.PENDENTE:
            default:
                return { label: "Pendente", color: "bg-blue-50 text-blue-700 border-blue-200", icon: AlertCircle };
        }
    };

    const statusConfig = getStatusConfig(status);
    const StatusIcon = statusConfig.icon;

    // Lógica para coloração do Match
    const getMatchColor = (percentage: number) => {
        if (percentage >= 90) return "bg-green-100 text-green-700 border-green-200";
        if (percentage >= 70) return "bg-yellow-100 text-yellow-700 border-yellow-200";
        return "bg-gray-100 text-gray-700 border-gray-200";
    };

    return (
        <Card className={`w-full bg-white shadow-sm border-gray-200 hover:shadow-md transition-all ${status === StatusCandidatura.REJEITADA ? 'opacity-70' : ''}`}>
            <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row items-start gap-4">
                    <Avatar className="h-16 w-16 border border-gray-100">
                        <AvatarImage src={imageUrl} alt={name} />
                        <AvatarFallback className="bg-indigo-50 text-indigo-600">
                            <User className="h-8 w-8" />
                        </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 space-y-1 w-full">
                        <div className="flex justify-between items-start flex-wrap gap-2">
                            <div className="flex flex-col">
                                <h3 className="font-bold text-lg text-gray-900 leading-tight">{name}</h3>
                                <p className="text-sm font-medium text-gray-700">{role}</p>
                            </div>

                            {/* Badges de Status e Match */}
                            <div className="flex flex-col items-end gap-1">
                                <Badge variant="outline" className={`${statusConfig.color} flex items-center gap-1`}>
                                    <StatusIcon className="h-3 w-3" />
                                    {statusConfig.label}
                                </Badge>
                                
                                {matchPercentage !== undefined && (
                                    <Badge variant="outline" className={`${getMatchColor(matchPercentage)} border font-medium`}>
                                        {matchPercentage}% Match
                                    </Badge>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-2">
                            <div className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                <span>{location}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>

            {/* Footer com layout corrigido para evitar overflow */}
            <CardFooter className="p-4 pt-0 mt-2 bg-gray-50/50 border-t border-gray-100">
                <div className="w-full flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-end py-3">
                    
                    <Button
                        variant="outline"
                        size="sm"
                        className="w-full sm:w-auto text-gray-700 border-gray-300 hover:bg-white bg-white"
                        onClick={onDownloadCurriculum}
                        disabled={isDownloadLoading}
                    >
                        <Download className={`h-4 w-4 mr-2 ${isDownloadLoading ? 'animate-bounce' : ''}`} />
                        {isDownloadLoading ? "Baixando..." : "Currículo"}
                    </Button>

                    <div className="flex gap-2 w-full sm:w-auto">
                        <Button
                            variant="outline"
                            size="sm"
                            className={`flex-1 sm:flex-none w-full sm:w-auto ${status === StatusCandidatura.REJEITADA ? 'bg-red-50 border-red-200 text-red-700' : 'text-red-600 border-red-200 hover:bg-red-50'}`}
                            onClick={onReject}
                            disabled={status === StatusCandidatura.REJEITADA} // Desabilita se já rejeitado
                        >
                            <X className="h-4 w-4 mr-1 sm:mr-2" />
                            Rejeitar
                        </Button>

                        <Button
                            size="sm"
                            className={`flex-1 sm:flex-none w-full sm:w-auto ${status === StatusCandidatura.APROVADA ? 'bg-green-700 hover:bg-green-800' : 'bg-green-600 hover:bg-green-700'} text-white`}
                            onClick={onApprove}
                            disabled={status === StatusCandidatura.APROVADA} // Desabilita se já aprovado
                        >
                            <Check className="h-4 w-4 mr-1 sm:mr-2" />
                            {status === StatusCandidatura.APROVADA ? "Aprovada" : "Aprovar"}
                        </Button>
                    </div>
                </div>
            </CardFooter>
        </Card>
    );
}