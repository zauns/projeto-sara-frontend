"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { SuccessDialog } from "@/components/core/success-dialogue";
// IMPORTANTE: Ajuste o caminho do seu contexto de autenticação
import { useAuth } from "@/contexts/AuthContext"; 
import { jobService } from "@/services/jobServices";

export function PublishJobForm() {
    const { createJob } = jobService;
    const { user } = useAuth(); // Recupera o usuário do contexto (onde está o empresaId)
    const router = useRouter();
    const [showSuccessDialog, setShowSuccessDialog] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Estado para controlar os inputs do formulário
    const [formData, setFormData] = useState({
        titulo: '',
        area: '',
        tipo: '',
        descricao: '',
        requisitos: '',
        localizacao: '',
        modalidade: '',
        salario: ''
    });

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        
        if (!user?.id) {
            alert("Erro: ID da empresa não encontrado. Verifique se você está logado.");
            return;
        }

        setIsLoading(true);

        try {
            // 1. Prepara as TAGS (Area, Tipo, Modalidade, Localização)
            // Filtra valores vazios para não enviar tags em branco
            const tagsGeradas = [
                formData.area,
                formData.tipo !== 'pj' && formData.tipo !== 'clt' ? formData.tipo : formData.tipo.toUpperCase(), // Ex: CLT, PJ
                formData.modalidade,
                formData.localizacao
            ].filter(tag => tag && tag.trim() !== "");

            // 2. Concatena informações ricas na DESCRIÇÃO
            // Como o DTO só tem "descricao", juntamos requisitos e salário lá.
            const descricaoCompleta = `
${formData.descricao}

### Requisitos:
${formData.requisitos}

### Detalhes:
- Localização: ${formData.localizacao}
- Salário: ${formData.salario || "A combinar"}
            `.trim();

            // 3. Monta o Payload conforme VagaRequestDTO
            const payload = {
                titulo: formData.titulo,
                descricao: descricaoCompleta,
                empresaId: user.id, // ID vindo do AuthContext conforme solicitado
                tags: tagsGeradas,
                isAtiva: false
            };
            await createJob(payload);
            
            setShowSuccessDialog(true);

        } catch (error) {
            console.error(error);
            alert("Ocorreu um erro ao publicar a vaga.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSuccessAction = () => {
        setShowSuccessDialog(false);
        router.push("/company/jobs");
    };

    return (
        <div className="w-full max-w-3xl mx-auto p-4 md:p-8 bg-white rounded-lg shadow-sm border border-gray-100">
            <form className="space-y-8" onSubmit={handleSubmit}>

                <div className="space-y-2 border-b pb-4">
                    <h2 className="text-2xl font-bold text-gray-900">Publicar Vaga</h2>
                    <p className="text-sm text-gray-500">Preencha os detalhes abaixo para anunciar uma nova oportunidade.</p>
                </div>

                <div className="space-y-6">
                    {/* Título */}
                    <div className="space-y-2">
                        <Label htmlFor="title">Título da Vaga</Label>
                        <Input 
                            id="title" 
                            placeholder="Ex: Desenvolvedor Front-end Júnior" 
                            required 
                            value={formData.titulo}
                            onChange={(e) => handleInputChange('titulo', e.target.value)}
                        />
                    </div>

                    {/* Grid: Tipo e Área */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="type">Tipo de Vaga</Label>
                            <Select required onValueChange={(val) => handleInputChange('tipo', val)}>
                                <SelectTrigger id="type">
                                    <SelectValue placeholder="Selecione o tipo" />
                                </SelectTrigger>
                                <SelectContent className="bg-white">
                                    <SelectItem value="clt">Tempo Integral (CLT)</SelectItem>
                                    <SelectItem value="pj">Pessoa Jurídica (PJ)</SelectItem>
                                    <SelectItem value="estagio">Estágio</SelectItem>
                                    <SelectItem value="temporario">Temporário</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="area">Área de Atuação</Label>
                            <Input
                                id="area"
                                placeholder="Ex: Tecnologia, Vendas..."
                                required
                                value={formData.area}
                                onChange={(e) => handleInputChange('area', e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Descrição */}
                    <div className="space-y-2">
                        <Label htmlFor="description">Descrição da Vaga</Label>
                        <Textarea
                            id="description"
                            placeholder="Descreva as responsabilidades e o dia a dia da função..."
                            className="min-h-[120px]"
                            required
                            value={formData.descricao}
                            onChange={(e) => handleInputChange('descricao', e.target.value)}
                        />
                    </div>

                    {/* Requisitos */}
                    <div className="space-y-2">
                        <Label htmlFor="requirements">Requisitos</Label>
                        <Textarea
                            id="requirements"
                            placeholder="Liste as competências..."
                            className="min-h-[120px]"
                            required
                            value={formData.requisitos}
                            onChange={(e) => handleInputChange('requisitos', e.target.value)}
                        />
                    </div>

                    {/* Grid: Localização e Modalidade */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="location">Localização</Label>
                            <Input 
                                id="location" 
                                placeholder="Cidade, Estado (ou Remoto)" 
                                required 
                                value={formData.localizacao}
                                onChange={(e) => handleInputChange('localizacao', e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="modality">Modalidade</Label>
                            <Select required onValueChange={(val) => handleInputChange('modalidade', val)}>
                                <SelectTrigger id="modality">
                                    <SelectValue placeholder="Selecione a modalidade" />
                                </SelectTrigger>
                                <SelectContent className="bg-white">
                                    <SelectItem value="Presencial">Presencial</SelectItem>
                                    <SelectItem value="Híbrido">Híbrido</SelectItem>
                                    <SelectItem value="Remoto">Remoto</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Salário */}
                    <div className="space-y-2">
                        <Label htmlFor="salary">Salário (Opcional)</Label>
                        <Input 
                            id="salary" 
                            placeholder="Ex: R$ 3.000,00 ou A combinar" 
                            value={formData.salario}
                            onChange={(e) => handleInputChange('salario', e.target.value)}
                        />
                    </div>

                </div>

                <div className="flex flex-col-reverse md:flex-row justify-end gap-3 pt-4">
                    <Button
                        type="button"
                        variant="outline"
                        className="w-full md:w-auto border-gray-400 text-gray-700 hover:bg-gray-100"
                        onClick={() => router.back()}
                        disabled={isLoading}
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        variant="destructive"
                        className="w-full md:w-auto bg-red-500 hover:bg-red-600"
                        disabled={isLoading}
                    >
                        {isLoading ? "Publicando..." : "Publicar Vaga"}
                    </Button>
                </div>
            </form>

            <SuccessDialog
                isOpen={showSuccessDialog}
                onClose={() => setShowSuccessDialog(false)}
                title="Vaga Publicada!"
                description="Sua vaga foi cadastrada com sucesso."
                buttonText="Ver minhas vagas"
                onAction={handleSuccessAction}
            />
        </div>
    );
}