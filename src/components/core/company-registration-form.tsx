"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "../ui/textarea";
import { SuccessDialog } from './success-dialogue';


//Formulário principal para o cadastro de novas empresas,
export function CompanyRegistrationForm() {

    const [showSuccessDialog, setShowSuccessDialog] = useState(false);
    const router = useRouter();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        console.log("Formulário enviado!");

        // Simula o sucesso da API (mostrar pop-up)
        setShowSuccessDialog(true);
    };

    const handleGoToLogin = (path: string) => {
        setShowSuccessDialog(false);
        router.push(path);
    };

    return (
        <div className="w-full max-w-2xl mx-auto p-4 md:p-8">

            <form className="space-y-8" onSubmit={handleSubmit}>

                {/*Informações da Empresa*/}
                <fieldset className="space-y-6">
                    <legend className="text-2xl font-semibold text-gray-900 border-b pb-2">
                        Informações da Empresa
                    </legend>

                    <div className="space-y-2">
                        <Label htmlFor="nomeFantasia">Nome</Label>
                        <Input id="nomeFantasia" placeholder="Placeholder" />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="cnpj">CNPJ</Label>
                        <Input id="cnpj" placeholder="Placeholder" />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="businessPlan">Plano de Negócio</Label>
                        <Textarea
                            id="businessPlan"
                            placeholder="Descreva brevemente o plano de negócio da empresa..."
                            className="min-h-[120px]"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="state">Estado</Label>
                        <Select>
                            <SelectTrigger id="state">
                                <SelectValue placeholder="Selecione o estado" />
                            </SelectTrigger>
                            <SelectContent className="bg-white max-h-[300px]">
                                <SelectItem value="ES">Espírito Santo</SelectItem>
                                <SelectItem value="MG">Minas Gerais</SelectItem>
                                <SelectItem value="RJ">Rio de Janeiro</SelectItem>
                                <SelectItem value="SP">São Paulo</SelectItem>
                                <SelectItem value="PR">Paraná</SelectItem>
                                <SelectItem value="RS">Rio Grande do Sul</SelectItem>
                                <SelectItem value="SC">Santa Catarina</SelectItem>
                                <SelectItem value="DF">Distrito Federal</SelectItem>
                                <SelectItem value="GO">Goiás</SelectItem>
                                <SelectItem value="MT">Mato Grosso</SelectItem>
                                <SelectItem value="MS">Mato Grosso do Sul</SelectItem>
                                <SelectItem value="AL">Alagoas</SelectItem>
                                <SelectItem value="BA">Bahia</SelectItem>
                                <SelectItem value="CE">Ceará</SelectItem>
                                <SelectItem value="MA">Maranhão</SelectItem>
                                <SelectItem value="PB">Paraíba</SelectItem>
                                <SelectItem value="PE">Pernambuco</SelectItem>
                                <SelectItem value="PI">Piauí</SelectItem>
                                <SelectItem value="RN">Rio Grande do Norte</SelectItem>
                                <SelectItem value="SE">Sergipe</SelectItem>
                                <SelectItem value="AC">Acre</SelectItem>
                                <SelectItem value="AP">Amapá</SelectItem>
                                <SelectItem value="AM">Amazonas</SelectItem>
                                <SelectItem value="PA">Pará</SelectItem>
                                <SelectItem value="RO">Rondônia</SelectItem>
                                <SelectItem value="RR">Roraima</SelectItem>
                                <SelectItem value="TO">Tocantins</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="endereco">Endereço</Label>
                        <Input id="endereco" placeholder="Placeholder" />
                    </div>

                    {/* Grid do email e telefone da empresa */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="companyEmail">Email</Label>
                            <Input id="companyEmail" type="email" placeholder="Placeholder" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="companyPhone">Telefone</Label>
                            <Input id="companyPhone" type="tel" placeholder="Placeholder" />
                        </div>
                    </div>

                    {/* Grid da senha e confirmar senha */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="password">Senha</Label>
                            <Input id="password" type="password" placeholder="Placeholder" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                            <Input id="confirmPassword" type="password" placeholder="Placeholder" />
                        </div>
                    </div>
                </fieldset>

                {/*Informações do Responsável*/}
                <fieldset className="space-y-6">
                    <legend className="text-2xl font-semibold text-gray-900 border-b pb-2">
                        Informações do Responsável
                    </legend>

                    {/* grid para nome completo e cargo */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="respName">Nome completo</Label>
                            <Input id="respName" placeholder="Placeholder" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="respCargo">Cargo</Label>
                            <Input id="respCargo" placeholder="Placeholder" />
                        </div>
                    </div>

                    {/* grid para email e telefone do responsável */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="respEmail">Email</Label>
                            <Input id="respEmail" type="email" placeholder="Placeholder" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="respPhone">Telefone</Label>
                            <Input id="respPhone" type="tel" placeholder="Placeholder" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="respCpf">CPF</Label>
                        <Input id="respCpf" placeholder="Placeholder" />
                    </div>
                </fieldset>

                {/* Botões */}
                <div className="flex flex-col-reverse md:flex-row justify-end gap-3 pt-4">
                    <Button
                        type="button"
                        variant="outline"
                        className="w-full md:w-auto border-gray-400 text-gray-700 hover:bg-gray-100"
                        onClick={() => router.back()}
                    >
                        Voltar
                    </Button>
                    <Button
                        type="submit"
                        variant="destructive"
                        className="w-full md:w-auto bg-red-400 hover:bg-red-500"
                    >
                        Solicitar Cadastro
                    </Button>
                </div>

            </form>

            {/* Diálogo de sucesso */}
            <SuccessDialog
                isOpen={showSuccessDialog}
                onClose={() => setShowSuccessDialog(false)}
                title="Cadastro Solicitado!"
                description="Sua solicitação foi recebida. Entraremos em contato em breve para informar os próximos passos."
                buttonText="Voltar para Login"
                onAction={() => handleGoToLogin("/login")}
            />
        </div>
    );
}