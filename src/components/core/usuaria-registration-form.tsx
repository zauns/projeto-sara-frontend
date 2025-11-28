"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SuccessDialog } from '@/components/core/success-dialogue';

export function UserRegistrationForm() {

    const [showSuccessDialog, setShowSuccessDialog] = useState(false);
    const router = useRouter();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log("Usuária cadastrada pela secretaria!");
        setShowSuccessDialog(true);
    };

    const handleClose = () => {
        setShowSuccessDialog(false);
    };

    return (
        <div className="w-full max-w-2xl mx-auto p-4 md:p-8">

            <form className="space-y-8" onSubmit={handleSubmit}>

                {/* Cabeçalho */}
                <div className="space-y-2 border-b pb-4">
                    <h2 className="text-2xl font-bold text-gray-900">Cadastro de Nova Usuária</h2>
                    <p className="text-sm text-gray-500">
                        Preencha os dados abaixo para cadastrar uma nova mulher no sistema.
                    </p>
                </div>

                {/* Seção: Dados Pessoais */}
                <div className="space-y-6">

                    {/* Grid: Nome e Sobrenome */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="firstName">Nome</Label>
                            <Input id="firstName" placeholder="Ex: Maria" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="lastName">Sobrenome</Label>
                            <Input id="lastName" placeholder="Ex: Silva" required />
                        </div>
                    </div>

                    {/* Grid: CPF e Telefone */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="cpf">CPF</Label>
                            <Input id="cpf" placeholder="000.000.000-00" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone">Telefone / WhatsApp</Label>
                            <Input id="phone" type="tel" placeholder="(00) 00000-0000" required />
                        </div>
                    </div>

                    {/* Email (Largura Total) */}
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" placeholder="maria@email.com" required />
                    </div>

                    {/* Grid: Senha e Confirmação */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="password">Senha Provisória</Label>
                            <Input id="password" type="password" placeholder="••••••••" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                            <Input id="confirmPassword" type="password" placeholder="••••••••" required />
                        </div>
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
                        className="w-full md:w-auto bg-red-400 hover:bg-red-500"
                    >
                        Cadastrar Usuária
                    </Button>
                </div>

            </form>

            {/* diálogo de sucesso */}
            <SuccessDialog
                isOpen={showSuccessDialog}
                onClose={() => setShowSuccessDialog(false)}
                title="Usuária Cadastrada!"
                description="O cadastro foi realizado com sucesso. A usuária já pode acessar o sistema com a senha provisória."
                buttonText="Voltar para o Painel"
                onAction={() => handleClose()}
            />
        </div>
    );
}