"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

// Ícones atualizados com Power e Ban
import { MapPin, Clock, Bookmark, Send, Building2, Edit, Save, X, Trash2, Power, Ban } from "lucide-react";
import { SuccessDialog } from "@/components/core/success-dialogue";

// 1. Schema de Validação
const jobSchema = z.object({
  title: z.string().min(3, "O título deve ter pelo menos 3 caracteres"),
  location: z.string().min(2, "Localização obrigatória"),
  jobType: z.string().min(1, "Tipo de vaga obrigatório"), 
  modality: z.string().min(1, "Modalidade obrigatória"), 
  level: z.string().optional(), 
  description: z.string().min(50, "A descrição deve ser detalhada (mín. 50 caracteres)"),
  responsibilities: z.string().optional(),
  requirements: z.string().optional(),
});

type JobFormValues = z.infer<typeof jobSchema>;

type JobDetailsCardProps = {
    jobId?: string;
    
    // Status da vaga (Ativa/Inativa)
    isActive?: boolean;
    
    title: string;
    companyName: string;
    companyLogoUrl?: string;
    location: string;
    postedAt: string;
    
    jobType: string;
    modality: string;
    level?: string;
    
    description: string;
    responsibilities?: string[];
    requirements?: string[];
    
    // Ações Usuária
    onApplyAction?: () => void;
    onSaveAction?: () => void;
    isApplied?: boolean;

    // Ações Empresa
    isCompanyView?: boolean;
    onUpdateJobAction?: (data: JobFormValues & { responsibilitiesArray: string[], requirementsArray: string[] }) => Promise<void>;
    onDeleteAction?: (id: string) => Promise<void>;
    // Nova ação para alternar status
    onToggleStatusAction?: (newStatus: boolean) => Promise<void>;
};

export function JobDetailsCard(props: JobDetailsCardProps) {
    const [isSaved, setIsSaved] = useState(false);
    const [showSuccessDialog, setShowSuccessDialog] = useState(false);
    const [isApplied, setIsApplied] = useState(props.isApplied || false);
    
    // Estados de controle e edição
    const [isEditing, setIsEditing] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    
    // Estado local de status (Ativa/Inativa)
    const [isActive, setIsActive] = useState(props.isActive);
    const [isStatusLoading, setIsStatusLoading] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<JobFormValues>({
        resolver: zodResolver(jobSchema),
        mode: "onBlur",
    });

    // Sincroniza o form e o status quando as props mudam
    useEffect(() => {
        if (props.isActive !== undefined) {
            setIsActive(props.isActive);
        }

        reset({
            title: props.title,
            location: props.location,
            jobType: props.jobType,
            modality: props.modality,
            level: props.level || "",
            description: props.description,
            responsibilities: props.responsibilities?.join("\n") || "",
            requirements: props.requirements?.join("\n") || "",
        });
    }, [props, reset]);

    const handleSaveToggle = () => setIsSaved(!isSaved);

    const handleApplyClick = () => {
        setIsApplied(true);
        setShowSuccessDialog(true);
        if (props.onApplyAction) props.onApplyAction();
    };

    const handleDeleteClick = async () => {
        if (!props.jobId || !props.onDeleteAction) return;

        const confirm = window.confirm("Tem certeza que deseja excluir esta vaga permanentemente? Esta ação não pode ser desfeita.");
        
        if (confirm) {
            try {
                setIsDeleting(true);
                await props.onDeleteAction(props.jobId);
            } catch (error) {
                console.error("Erro ao deletar", error);
                // Deixa o pai (page) lidar com o erro
            } finally {
                setIsDeleting(false);
            }
        }
    };

    // Handler para alternar status (Ativa <-> Inativa)
    const handleStatusToggle = async () => {
        if (!props.onToggleStatusAction) return;

        try {
            setIsStatusLoading(true);
            const newStatus = !isActive;
            
            // Chama o serviço
            await props.onToggleStatusAction(newStatus);
            
            // Atualiza visualmente
            setIsActive(newStatus);
        } catch (error) {
            // Removemos o 'alert' daqui para não ter UI duplicada com o toast do pai.
            console.error("Erro no toggle (capturado no card)", error);
        } finally {
            setIsStatusLoading(false);
        }
    };

    const onSubmit = async (data: JobFormValues) => {
        if (props.onUpdateJobAction) {
            const responsibilitiesArray = data.responsibilities
                ? data.responsibilities.split("\n").filter((item) => item.trim() !== "")
                : [];
            
            const requirementsArray = data.requirements
                ? data.requirements.split("\n").filter((item) => item.trim() !== "")
                : [];

            await props.onUpdateJobAction({
                ...data,
                responsibilitiesArray,
                requirementsArray
            });
            
            setIsEditing(false);
        }
    };

    return (
        <>
            <Card className="w-full max-w-4xl mx-auto bg-white shadow-lg border-gray-200 overflow-hidden">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <CardHeader className="p-6 md:p-8 bg-gray-50/50 border-b border-gray-100">
                        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                            
                            <Avatar className="h-20 w-20 rounded-xl border border-gray-200 bg-white">
                                <AvatarImage src={props.companyLogoUrl} alt={props.companyName} />
                                <AvatarFallback className="rounded-xl bg-indigo-50 text-indigo-600">
                                    <Building2 className="h-10 w-10" />
                                </AvatarFallback>
                            </Avatar>

                            <div className="flex-1 space-y-2 w-full">
                                {isEditing ? (
                                    <div className="space-y-4">
                                        <div className="space-y-1">
                                            <Label htmlFor="title">Título da Vaga</Label>
                                            <Input 
                                                id="title" 
                                                {...register("title")} 
                                                className={errors.title ? "border-red-500" : "bg-white"}
                                            />
                                            {errors.title && <p className="text-xs text-red-500">{errors.title.message}</p>}
                                        </div>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                            <div>
                                                <Label className="text-xs">Localização</Label>
                                                <Input {...register("location")} className="bg-white h-9" placeholder="Ex: São Paulo, SP" />
                                            </div>
                                            <div>
                                                <Label className="text-xs">Contrato</Label>
                                                <Input {...register("jobType")} className="bg-white h-9" placeholder="Ex: CLT, PJ" />
                                            </div>
                                            <div>
                                                <Label className="text-xs">Modalidade</Label>
                                                <Input {...register("modality")} className="bg-white h-9" placeholder="Ex: Remoto" />
                                            </div>
                                        </div>
                                        <div>
                                            <Label className="text-xs">Nível (Opcional)</Label>
                                            <Input {...register("level")} className="bg-white h-9 w-1/3" placeholder="Ex: Sênior" />
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                                                {props.title}
                                            </h1>
                                            
                                            {/* Badge de Status Visual */}
                                            <Badge 
                                                variant={isActive ? "default" : "destructive"}
                                                className={`sm:self-start w-fit ${isActive ? 'bg-green-100 text-green-700 hover:bg-green-200 border-green-200' : 'bg-gray-200 text-gray-600 hover:bg-gray-300 border-gray-300'}`}
                                            >
                                                {isActive ? "Recebendo Candidaturas" : "Processo Encerrado"}
                                            </Badge>
                                        </div>
                                        
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
                                    </>
                                )}
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="p-6 md:p-8 space-y-8">
                        <div className="space-y-3">
                            <h3 className="text-lg font-bold text-gray-900">Sobre a vaga</h3>
                            {isEditing ? (
                                <>
                                    <Textarea 
                                        {...register("description")} 
                                        className={`min-h-[150px] ${errors.description ? "border-red-500" : ""}`}
                                    />
                                    {errors.description && <p className="text-xs text-red-500">{errors.description.message}</p>}
                                </>
                            ) : (
                                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                                    {props.description}
                                </p>
                            )}
                        </div>

                        <Separator />

                        <div className="space-y-3">
                            <h3 className="text-lg font-bold text-gray-900 flex justify-between">
                                Responsabilidades
                                {isEditing && <span className="text-xs font-normal text-muted-foreground">(Um item por linha)</span>}
                            </h3>
                            {isEditing ? (
                                <Textarea 
                                    {...register("responsibilities")} 
                                    className="min-h-[120px]" 
                                    placeholder="- Liderar equipe..."
                                />
                            ) : (
                                props.responsibilities && props.responsibilities.length > 0 && (
                                    <ul className="list-disc list-inside space-y-2 text-gray-700 marker:text-indigo-500">
                                        {props.responsibilities.map((item, index) => (
                                            <li key={index}>{item}</li>
                                        ))}
                                    </ul>
                                )
                            )}
                        </div>

                        <div className="space-y-3">
                            <h3 className="text-lg font-bold text-gray-900 flex justify-between">
                                Requisitos
                                {isEditing && <span className="text-xs font-normal text-muted-foreground">(Um item por linha)</span>}
                            </h3>
                            {isEditing ? (
                                <Textarea 
                                    {...register("requirements")} 
                                    className="min-h-[120px]"
                                    placeholder="- React Avançado..."
                                />
                            ) : (
                                props.requirements && props.requirements.length > 0 && (
                                    <ul className="list-disc list-inside space-y-2 text-gray-700 marker:text-indigo-500">
                                        {props.requirements.map((item, index) => (
                                            <li key={index}>{item}</li>
                                        ))}
                                    </ul>
                                )
                            )}
                        </div>
                    </CardContent>

                    <CardFooter className="p-6 md:p-8 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row gap-4 justify-end">
                        
                        {props.isCompanyView ? (
                            // --- MODO EMPRESA ---
                            isEditing ? (
                                <>
                                    {/* Botão de Excluir (Só aparece na edição) */}
                                    <div className="flex-1 mr-auto">
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                            onClick={handleDeleteClick}
                                            disabled={isDeleting || isSubmitting}
                                        >
                                            {isDeleting ? "Excluindo..." : (
                                                <>
                                                    <Trash2 className="h-4 w-4 mr-2" />
                                                    Excluir Vaga
                                                </>
                                            )}
                                        </Button>
                                    </div>

                                    <Button 
                                        type="button"
                                        variant="outline" 
                                        onClick={() => {
                                            setIsEditing(false);
                                            reset(); 
                                        }}
                                        disabled={isSubmitting || isDeleting}
                                    >
                                        <X className="h-4 w-4 mr-2" />
                                        Cancelar
                                    </Button>
                                    <Button 
                                        type="submit" 
                                        className="bg-green-600 hover:bg-green-700 text-white"
                                        disabled={isSubmitting || isDeleting}
                                    >
                                        {isSubmitting ? "Salvando..." : (
                                            <>
                                                <Save className="h-4 w-4 mr-2" />
                                                Salvar Alterações
                                            </>
                                        )}
                                    </Button>
                                </>
                            ) : (
                                <>
                                    {/* Botão de Alternar Status (Só aparece quando NÃO está editando) */}
                                    <div className="flex-1 mr-auto">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            className={`${isActive ? 'text-amber-600 border-amber-200 hover:bg-amber-50' : 'text-green-600 border-green-200 hover:bg-green-50'}`}
                                            onClick={handleStatusToggle}
                                            disabled={isStatusLoading}
                                        >
                                            {isStatusLoading ? (
                                                <span className="animate-pulse">Atualizando...</span>
                                            ) : (
                                                <>
                                                    <Power className="h-4 w-4 mr-2" />
                                                    {isActive ? "Encerrar Vaga" : "Reativar Vaga"}
                                                </>
                                            )}
                                        </Button>
                                    </div>

                                    <Button 
                                        type="button"
                                        size="lg" 
                                        className="w-full sm:w-auto bg-[#F55F58] hover:bg-[#d94a44] text-white"
                                        onClick={() => setIsEditing(true)}
                                    >
                                        <Edit className="h-5 w-5 mr-2 text-white" />
                                        Editar Detalhes
                                    </Button>
                                </>
                            )
                        ) : (
                            // --- MODO USUÁRIA (Candidata) ---
                            <>
                                <Button 
                                    type="button"
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
                                    type="button"
                                    size="lg" 
                                    className={`w-full sm:w-auto ${
                                        !isActive 
                                            ? 'bg-gray-300 cursor-not-allowed text-gray-500 hover:bg-gray-300' // Estilo Inativo
                                            : isApplied 
                                                ? 'bg-green-600 hover:bg-green-700' 
                                                : 'bg-red-500 hover:bg-red-600'
                                    }`}
                                    onClick={isActive ? handleApplyClick : undefined}
                                    disabled={isApplied || !isActive}
                                >
                                    {!isActive ? (
                                        <>
                                            <Ban className="h-5 w-5 mr-2" />
                                            Vaga Encerrada
                                        </>
                                    ) : isApplied ? (
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
                </form>
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