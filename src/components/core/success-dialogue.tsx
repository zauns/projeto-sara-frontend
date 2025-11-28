"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Check } from "lucide-react";

type SuccessDialogProps = {
    isOpen: boolean;
    onClose: () => void;
    /* Título do diálogo (ex: "Cadastro Realizado!") */
    title: string;
    /* Descrição ou mensagem de sucesso */
    description: string;
    /* Texto do botão de ação (ex: "Voltar para Login") */
    buttonText?: string;
    /* Ação ao clicar no botão (ex: redirecionar) */
    onAction: () => void;
};

export function SuccessDialog({
    isOpen,
    onClose,
    title,
    description,
    buttonText = "Continuar", // Valor padrão
    onAction,
}: SuccessDialogProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px] bg-white p-6 text-center">
                <DialogHeader>
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                        <Check className="h-10 w-10 text-red-600" aria-hidden="true" />
                    </div>

                    <DialogTitle className="text-2xl font-bold mt-4">
                        {title}
                    </DialogTitle>
                    <DialogDescription className="text-gray-600 mt-2">
                        {description}
                    </DialogDescription>
                </DialogHeader>

                <div className="mt-6">
                    <Button
                        type="button"
                        variant="outline"
                        className="w-full text-red-500 border-red-500 hover:bg-red-50 hover:text-red-600"
                        onClick={onAction}
                    >
                        {buttonText}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}