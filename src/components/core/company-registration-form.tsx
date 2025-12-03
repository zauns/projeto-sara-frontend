"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "../ui/textarea"; 
// ATUALIZADO: Importação do diálogo genérico
import { SuccessDialog } from "@/components/core/success-dialogue"; 
import { CompanyRegistrationData, registrationService } from "@/services/registrationServices";

// 1. Schema de Validação (Empresa)
const companySchema = z
  .object({
    nome: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
    cnpj: z
      .string()
      .regex(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/, "CNPJ inválido: 00.000.000/0000-00"),
    endereco: z.string().min(5, "Endereço muito curto"),
    email: z.string().email("Email inválido"),
    telefone: z
      .string()
      .regex(/^\(\d{2}\) \d{5}-\d{4}$/, "Formato inválido: (99) 99999-9999"),
    biografia: z.string().min(10, "A biografia deve ter no mínimo 10 caracteres"),
    links: z.string().optional(),
    senha: z
      .string()
      .min(8, "Mínimo de 8 caracteres")
      .regex(/[A-Z]/, "Pelo menos uma letra maiúscula")
      .regex(/[a-z]/, "Pelo menos uma letra minúscula")
      .regex(/[0-9]/, "Pelo menos um número")
      .regex(/[\W_]/, "Pelo menos um caractere especial"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.senha === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

type CompanyFormValues = z.infer<typeof companySchema>;

export function CompanyRegistrationForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CompanyFormValues>({
    resolver: zodResolver(companySchema),
    mode: "onBlur",
  });

  // Helpers de Máscara
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let v = e.target.value.replace(/\D/g, "");
    v = v.replace(/^(\d{2})(\d)/g, "($1) $2");
    v = v.replace(/(\d)(\d{4})$/, "$1-$2");
    setValue("telefone", v, { shouldValidate: true });
  };

  const handleCNPJChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let v = e.target.value.replace(/\D/g, "");
    v = v.replace(/^(\d{2})(\d)/, "$1.$2");
    v = v.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3");
    v = v.replace(/\.(\d{3})(\d)/, ".$1/$2");
    v = v.replace(/(\d{4})(\d)/, "$1-$2");
    setValue("cnpj", v, { shouldValidate: true });
  };

  const onSubmit = async (data: CompanyFormValues) => {
    setIsLoading(true);
    setApiError(null);

    try {
      const apiData = { 
        ...data,
        cnpj: data.cnpj.replace(/\D/g, ""), 
        telefone: data.telefone.replace(/\D/g, "")
      };
      await registrationService.registerCompany(apiData as CompanyRegistrationData);
      setShowSuccessDialog(true);
    } catch (err) {
      setApiError("Erro ao cadastrar empresa. Verifique os dados.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoToLogin = (path: string) => {
    setShowSuccessDialog(false);
    router.push(path);
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4 md:p-8">
      <form className="space-y-8" onSubmit={handleSubmit(onSubmit)}>
        <fieldset className="space-y-6">
          <legend className="text-2xl font-semibold text-gray-900 border-b pb-2">
            Informações da Empresa
          </legend>

          {/* Nome */}
          <div className="space-y-2">
            <Label htmlFor="nome">Nome</Label>
            <Input
              id="nome"
              placeholder="Nome da empresa"
              {...register("nome")}
              className={errors.nome ? "border-red-500 focus-visible:ring-red-500" : ""}
            />
            {errors.nome && <p className="text-sm text-red-500">{errors.nome.message}</p>}
          </div>

          {/* CNPJ */}
          <div className="space-y-2">
            <Label htmlFor="cnpj">CNPJ</Label>
            <Input
              id="cnpj"
              placeholder="00.000.000/0000-00"
              {...register("cnpj")}
              onChange={handleCNPJChange}
              maxLength={18}
              className={errors.cnpj ? "border-red-500 focus-visible:ring-red-500" : ""}
            />
            {errors.cnpj && <p className="text-sm text-red-500">{errors.cnpj.message}</p>}
          </div>

          {/* Endereço */}
          <div className="space-y-2">
            <Label htmlFor="endereco">Endereço</Label>
            <Input
              id="endereco"
              placeholder="Endereço completo da sede"
              {...register("endereco")}
              className={errors.endereco ? "border-red-500 focus-visible:ring-red-500" : ""}
            />
            {errors.endereco && <p className="text-sm text-red-500">{errors.endereco.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="contato@suaempresa.com"
                {...register("email")}
                className={errors.email ? "border-red-500 focus-visible:ring-red-500" : ""}
              />
              {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
            </div>
            {/* Telefone */}
            <div className="space-y-2">
              <Label htmlFor="telefone">Telefone</Label>
              <Input
                id="telefone"
                placeholder="(00) 00000-0000"
                {...register("telefone")}
                onChange={handlePhoneChange}
                maxLength={15}
                className={errors.telefone ? "border-red-500 focus-visible:ring-red-500" : ""}
              />
              {errors.telefone && <p className="text-sm text-red-500">{errors.telefone.message}</p>}
            </div>
          </div>

          {/* Senhas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="senha">Senha</Label>
              <Input
                id="senha"
                type="password"
                placeholder="Crie uma senha segura"
                {...register("senha")}
                className={errors.senha ? "border-red-500 focus-visible:ring-red-500" : ""}
              />
              {errors.senha && <p className="text-sm text-red-500">{errors.senha.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar Senha</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirme sua senha"
                {...register("confirmPassword")}
                className={errors.confirmPassword ? "border-red-500 focus-visible:ring-red-500" : ""}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
              )}
            </div>
          </div>

          {/* Biografia */}
          <div className="space-y-2">
            <Label htmlFor="biografia">Biografia</Label>
            <Textarea
              id="biografia"
              placeholder="Descreva brevemente o que sua empresa faz..."
              className={`min-h-[120px] ${errors.biografia ? "border-red-500 focus-visible:ring-red-500" : ""}`}
              {...register("biografia")}
            />
            {errors.biografia && <p className="text-sm text-red-500">{errors.biografia.message}</p>}
          </div>

          {/* Links */}
          <div className="space-y-2">
            <Label htmlFor="links">Links</Label>
            <Textarea
              id="links"
              placeholder="Site oficial, redes sociais, etc."
              className="min-h-[80px]"
              {...register("links")}
            />
          </div>
        </fieldset>

        {apiError && (
          <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
            {apiError}
          </div>
        )}

        <div className="flex flex-col-reverse md:flex-row justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            className="w-full md:w-auto border-gray-400 text-gray-700 hover:bg-gray-100"
            onClick={() => router.back()}
            disabled={isLoading}
          >
            Voltar
          </Button>
          <Button
            type="submit"
            className="w-full md:w-auto bg-red-400 hover:bg-red-500"
            disabled={isLoading}
          >
            {isLoading ? "Enviando..." : "Solicitar Cadastro"}
          </Button>
        </div>
      </form>

      {/* ATUALIZADO: Implementação do SuccessDialog */}
      <SuccessDialog
        isOpen={showSuccessDialog}
        onClose={() => setShowSuccessDialog(false)}
        title="Solicitação Enviada!"
        description="O cadastro da sua empresa foi realizado com sucesso."
        buttonText="Ir para Login"
        onAction={() => handleGoToLogin("/login")}
      />
    </div>
  );
}