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
import { SuccessDialog } from '@/components/core/success-dialogue';

export function SecretariaRegistrationForm() {

    const [showSuccessDialog, setShowSuccessDialog] = useState(false);
    const router = useRouter();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log("Formulário de Secretaria enviado!");
        setShowSuccessDialog(true);
    };

    const handleGoToLogin = (path: string) => {
        setShowSuccessDialog(false);
        router.push(path);
    };

    return (
        <div className="w-full max-w-lg mx-auto p-4 md:p-8">

            <form className="space-y-6" onSubmit={handleSubmit}>

                <div className="space-y-2 text-center md:text-left">
                    <h2 className="text-2xl font-bold text-gray-900">Cadastro de Secretaria</h2>
                    <p className="text-sm text-gray-500">Preencha os dados abaixo para criar uma conta administrativa.</p>
                </div>

                {/* Nome */}
                <div className="space-y-2">
                    <Label htmlFor="name">Nome</Label>
                    <Input id="name" placeholder="Placeholder" required />
                </div>

                {/* Endereço */}
                <div className="space-y-2">
                    <Label htmlFor="address">Endereço</Label>
                    <Input id="address" placeholder="Placeholder" required />
                </div>

                {/* Grid telefone e estado */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="phone">Telefone</Label>
                        <Input id="phone" type="tel" placeholder="Placeholder" required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="state">Estado</Label>
                        <Select required>
                            <SelectTrigger id="state">
                                <SelectValue placeholder="UF" />
                            </SelectTrigger>
                            <SelectContent className="bg-white max-h-[200px]">
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
                </div>

                {/* Email */}
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="Placeholder" required />
                </div>

                {/* Grid senha e Confirmar Senha */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="password">Senha</Label>
                        <Input id="password" type="password" placeholder="Placeholder" required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                        <Input id="confirmPassword" type="password" placeholder="Placeholder" required />
                    </div>
                </div>

                {/* Botões */}
                <div className="flex flex-col-reverse md:flex-row justify-end gap-3 pt-6">
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
                        Cadastrar
                    </Button>
                </div>

            </form>

            <SuccessDialog
                isOpen={showSuccessDialog}
                onClose={() => setShowSuccessDialog(false)}
                title="Cadastro Realizado!"
                description="Sua conta de secretaria foi criada com sucesso. Você será redirecionado para o login."
                buttonText="Voltar para Login"
                onAction={() => handleGoToLogin("/login")}
            />
        </div>
    );
}