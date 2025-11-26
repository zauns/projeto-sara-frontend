"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // Componente de Input do Shadcn
import { Label } from "@/components/ui/label"; // Componente de Label do Shadcn
import { ConfirmationDialog } from "./confirmation-dialogue";

// Props para preencher os dados do usuário
type UserDetailsCardProps = {
    firstName?: string;
    lastName?: string;
    phone?: string;
    email?: string;
    address?: string;
}

export function UserDetailsCard(props: UserDetailsCardProps) {
    return (
        <div className="p-4">
        <Card className="w-full bg-white shadow-md border-gray">
            <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-800">
                    Detalhes da Usuária
                </CardTitle>
            </CardHeader>

            <CardContent className="p-6 space-y-6">
                
                {/* Formulário com os campos de Input */}
                <form className="space-y-4">
                    
                    {/* Grid para Nome e Sobrenome ficarem lado a lado em telas maiores */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="firstName">Nome</Label>
                            <Input id="firstName" placeholder="Placeholder" defaultValue={props.firstName} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="lastName">Sobrenome</Label>
                            <Input id="lastName" placeholder="Placeholder" defaultValue={props.lastName} />
                        </div>
                    </div>

                    {/* Campos de largura total */}
                    <div className="space-y-2">
                        <Label htmlFor="phone">Número para contato</Label>
                        <Input id="phone" placeholder="Placeholder" defaultValue={props.phone} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" placeholder="Placeholder" defaultValue={props.email} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="address">Endereço</Label>
                        <Input id="address" placeholder="Placeholder" defaultValue={props.address} />
                    </div>
                </form>

                {/* Seção de Botões*/}
                <div className="space-y-3 pt-4 border-t border-gray-200">
                    <div className="flex flex-col md:flex-row gap-3">

                        <Button 
                            variant="outline"
                            className="w-full border-red-400 text-red-500 hover:bg-red-50 hover:text-red-600"
                        >
                            Editar Perfil
                        </Button>
                    </div>
                    
                    {/* Botões de Perigo (Log Out, Apagar) */}
                    <Button 
                        variant="destructive" 
                        className="w-full bg-red-500 hover:bg-red-600"
                    >
                        Log Out
                    </Button>
                    <ConfirmationDialog title="Apagar Conta" description="Tem certeza que deseja apagar sua conta? Essa ação é irreversível!" onConfirm={() => {
                            console.log("Conta apagada!");
                            // lógica real de apagar a conta vem aqui
                        }}
                        trigger={
                            <Button variant="destructive" className="w-full bg-red-500 hover:bg-red-600">
                                Apagar Conta
                            </Button>
                        }
                    />
                </div>
                
            </CardContent>
        </Card>
        </div>
    );
}