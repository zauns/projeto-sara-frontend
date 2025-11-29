"use client";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Briefcase, Check, X, FileText, User } from "lucide-react";

// Props para o cartão de candidata
type CandidateCardProps = {
    id: string;
    name: string;
    role: string;
    location: string;
    matchPercentage?: number; // Eu n sei se isso vai existir, mas deixei aqui como opcional
    imageUrl?: string;
    status?: "pending" | "interview" | "approved" | "rejected";
    onViewProfile: () => void;
    onApprove?: () => void;
    onReject?: () => void;
};

export function CandidateCard({
    name,
    role,
    location,
    matchPercentage,
    imageUrl,
    onViewProfile,
    onApprove,
    onReject,
}: CandidateCardProps) {

    // Define a cor do badge de compatibilidade
    const getMatchColor = (percentage: number) => {
        if (percentage >= 90) return "bg-green-100 text-green-700 border-green-200";
        if (percentage >= 70) return "bg-yellow-100 text-yellow-700 border-yellow-200";
        return "bg-gray-100 text-gray-700 border-gray-200";
    };

    return (
        <Card className="w-full bg-white shadow-sm border-gray-200 hover:shadow-md transition-all">
            <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row items-start gap-4">

                    {/* Avatar */}
                    <Avatar className="h-16 w-16 border border-gray-100">
                        <AvatarImage src={imageUrl} alt={name} />
                        <AvatarFallback className="bg-indigo-50 text-indigo-600">
                            <User className="h-8 w-8" />
                        </AvatarFallback>
                    </Avatar>

                    {/* Informações Principais */}
                    <div className="flex-1 space-y-1">
                        <div className="flex justify-between items-start">
                            <h3 className="font-bold text-lg text-gray-900">{name}</h3>

                            {/* Badge de Match (Se houver porcentagem) */}
                            {matchPercentage !== undefined && (
                                <Badge variant="outline" className={`${getMatchColor(matchPercentage)} border font-medium`}>
                                    {matchPercentage}% Match
                                </Badge>
                            )}
                        </div>

                        <p className="text-sm font-medium text-gray-700">{role}</p>

                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                            <div className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                <span>{location}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>

            {/* Ações do card */}
            <CardFooter className="p-4 pt-0 flex gap-2 justify-end border-t border-gray-50 mt-2 bg-gray-50/50">
                <Button
                    variant="outline"
                    size="sm"
                    className="text-gray-600 border-gray-300 hover:bg-white flex-1 sm:flex-none"
                    onClick={onViewProfile}
                >
                    <FileText className="h-4 w-4 mr-2" />
                    Ver Perfil
                </Button>

                {/* Botões de Decisão (Aparecem só se as funções forem passadas) */}
                {onReject && (
                    <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 border-red-200 hover:bg-red-50 flex-1 sm:flex-none"
                        onClick={onReject}
                        title="Rejeitar Candidatura"
                    >
                        <X className="h-4 w-4 mr-1 sm:mr-2" />
                        <span className="hidden sm:inline">Rejeitar</span>
                    </Button>
                )}

                {onApprove && (
                    <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white flex-1 sm:flex-none"
                        onClick={onApprove}
                        title="Aprovar para Entrevista"
                    >
                        <Check className="h-4 w-4 mr-1 sm:mr-2" />
                        <span className="hidden sm:inline">Aprovar</span>
                    </Button>
                )}
            </CardFooter>
        </Card>
    );
}