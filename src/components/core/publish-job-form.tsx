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
// Reutilizando o diálogo de sucesso genérico que criamos
import { SuccessDialog } from "@/components/core/success-dialogue";

export function PublishJobForm() {

    const [showSuccessDialog, setShowSuccessDialog] = useState(false);
    const router = useRouter();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log("Vaga publicada!");
        setShowSuccessDialog(true);
    };

    const handleSuccessAction = () => {
        setShowSuccessDialog(false);
        // Redireciona para a lista de vagas publicadas pela empresa (trocar depois pro path correto)
        router.push("/company/jobs");
    };

    return (
        <div className="w-full max-w-3xl mx-auto p-4 md:p-8 bg-white rounded-lg shadow-sm border border-gray-100">

            <form className="space-y-8" onSubmit={handleSubmit}>

                {/* Cabeçalho */}
                <div className="space-y-2 border-b pb-4">
                    <h2 className="text-2xl font-bold text-gray-900">Publicar Vaga</h2>
                    <p className="text-sm text-gray-500">Preencha os detalhes abaixo para anunciar uma nova oportunidade.</p>
                </div>

                <div className="space-y-6">

                    {/* Título da Vaga */}
                    <div className="space-y-2">
                        <Label htmlFor="title">Título da Vaga</Label>
                        <Input id="title" placeholder="Ex: Desenvolvedor Front-end Júnior" required />
                    </div>

                    {/* Grid: Tipo e Área */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="type">Tipo de Vaga</Label>
                            <Select required>
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
                                placeholder="Ex: Artesanato, Costura, Serviços Gerais, Vendas..."
                                required
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
                        />
                    </div>

                    {/* Requisitos */}
                    <div className="space-y-2">
                        <Label htmlFor="requirements">Requisitos</Label>
                        <Textarea
                            id="requirements"
                            placeholder="Liste as competências, experiências e formações necessárias..."
                            className="min-h-[120px]"
                            required
                        />
                    </div>

                    {/* Grid: Localização e Modalidade */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="location">Localização</Label>
                            <Input id="location" placeholder="Cidade, Estado (ou Remoto)" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="modality">Modalidade</Label>
                            <Select required>
                                <SelectTrigger id="modality">
                                    <SelectValue placeholder="Selecione a modalidade" />
                                </SelectTrigger>
                                <SelectContent className="bg-white">
                                    <SelectItem value="presencial">Presencial</SelectItem>
                                    <SelectItem value="hibrido">Híbrido</SelectItem>
                                    <SelectItem value="remoto">Remoto</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Salário (Opcional) */}
                    <div className="space-y-2">
                        <Label htmlFor="salary">Salário (Opcional)</Label>
                        <Input id="salary" placeholder="Ex: R$ 3.000,00 ou A combinar" />
                    </div>

                </div>

                {/* Botões de Ação */}
                <div className="flex flex-col-reverse md:flex-row justify-end gap-3 pt-4">
                    <Button
                        type="button"
                        variant="outline"
                        className="w-full md:w-auto border-gray-400 text-gray-700 hover:bg-gray-100"
                        onClick={() => router.back()}
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        variant="destructive"
                        className="w-full md:w-auto bg-red-500 hover:bg-red-600"
                    >
                        Publicar Vaga
                    </Button>
                </div>

            </form>

            {/* Diálogo de Sucesso */}
            <SuccessDialog
                isOpen={showSuccessDialog}
                onClose={() => setShowSuccessDialog(false)}
                title="Vaga Publicada!"
                description="Sua vaga foi cadastrada com sucesso e já está visível para as candidatas."
                buttonText="Ver minhas vagas"
                onAction={handleSuccessAction}
            />
        </div>
    );
}