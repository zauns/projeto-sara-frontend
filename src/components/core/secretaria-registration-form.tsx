"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

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
import { CompanyRegistrationSuccessDialog } from "@/components/core/company-registration-dialogue";
import { registrationService } from "@/services/registrationServices";

// 1. Schema (Secretaria)
const secretariaSchema = z
  .object({
    nome: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
    endereco: z.string().min(5, "Endereço muito curto"),
    telefone: z
      .string()
      .regex(/^\(\d{2}\) \d{5}-\d{4}$/, "Formato inválido: (99) 99999-9999"),
    municipio: z.string().min(1, "Selecione um município"),
    email: z.string().email("Email inválido"),
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

type SecretariaFormValues = z.infer<typeof secretariaSchema>;

export function SecretariaRegistrationForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<SecretariaFormValues>({
    resolver: zodResolver(secretariaSchema),
    mode: "onBlur",
  });

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let v = e.target.value.replace(/\D/g, "");
    v = v.replace(/^(\d{2})(\d)/g, "($1) $2");
    v = v.replace(/(\d)(\d{4})$/, "$1-$2");
    setValue("telefone", v, { shouldValidate: true });
  };

  // Integração manual do Select com React Hook Form
  const handleSelectChange = (value: string) => {
    setValue("municipio", value);
    trigger("municipio"); // Força a validação para remover o erro visual se existir
  };

  const onSubmit = async (data: SecretariaFormValues) => {
    setIsLoading(true);
    setApiError(null);

    try {
      const {  ...apiData } = data;
      await registrationService.registerDepartment(apiData);
      setShowSuccessDialog(true);
    } catch (err) {
      setApiError("Erro ao cadastrar secretaria. Tente novamente.");
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
    <div className="w-full max-w-lg mx-auto p-4 md:p-8">
      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-2 text-center md:text-left">
          <h2 className="text-2xl font-bold text-gray-900">
            Cadastro de Secretaria
          </h2>
          <p className="text-sm text-gray-500">
            Preencha os dados abaixo para criar uma conta administrativa.
          </p>
        </div>

        {/* Nome */}
        <div className="space-y-2">
          <Label htmlFor="nome">Nome</Label>
          <Input
            id="nome"
            placeholder="Nome da secretaria"
            {...register("nome")}
            className={errors.nome ? "border-red-500 focus-visible:ring-red-500" : ""}
          />
          {errors.nome && <p className="text-sm text-red-500">{errors.nome.message}</p>}
        </div>

        {/* Endereço */}
        <div className="space-y-2">
          <Label htmlFor="endereco">Endereço</Label>
          <Input
            id="endereco"
            placeholder="Endereço completo"
            {...register("endereco")}
            className={errors.endereco ? "border-red-500 focus-visible:ring-red-500" : ""}
          />
          {errors.endereco && <p className="text-sm text-red-500">{errors.endereco.message}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          
          {/* Município (Select) */}
          <div className="space-y-2">
            <Label htmlFor="municipio">Município</Label>
            <Select onValueChange={handleSelectChange}>
              <SelectTrigger
                id="municipio"
                className={errors.municipio ? "border-red-500 ring-red-500" : ""}
              >
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent className="bg-white max-h-[200px]">
                {/* Lista simplificada para o exemplo */}
                <SelectItem value="Sao Paulo">São Paulo</SelectItem>
                <SelectItem value="Rio de Janeiro">Rio de Janeiro</SelectItem>
                <SelectItem value="Recife">Recife</SelectItem>
                <SelectItem value="Brasilia">Brasília</SelectItem>
                {/* ... outros itens ... */}
              </SelectContent>
            </Select>
            {/* Campo oculto para registrar no RHF se necessário, ou apenas use o setValue acima */}
            <input type="hidden" {...register("municipio")} />
            {errors.municipio && (
              <p className="text-sm text-red-500">{errors.municipio.message}</p>
            )}
          </div>
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="contato@secretaria.gov"
            {...register("email")}
            className={errors.email ? "border-red-500 focus-visible:ring-red-500" : ""}
          />
          {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
        </div>

        {/* Senhas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="senha">Senha</Label>
            <Input
              id="senha"
              type="password"
              placeholder="Crie uma senha"
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
              placeholder="Confirme a senha"
              {...register("confirmPassword")}
              className={errors.confirmPassword ? "border-red-500 focus-visible:ring-red-500" : ""}
            />
            {errors.confirmPassword && (
              <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
            )}
          </div>
        </div>

        {apiError && (
          <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
            {apiError}
          </div>
        )}

        <div className="flex flex-col-reverse md:flex-row justify-end gap-3 pt-6">
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
            variant="destructive"
            className="w-full md:w-auto bg-red-400 hover:bg-red-500"
            disabled={isLoading}
          >
            {isLoading ? "Cadastrando..." : "Cadastrar"}
          </Button>
        </div>
      </form>

      <CompanyRegistrationSuccessDialog
        isOpen={showSuccessDialog}
        onClose={() => setShowSuccessDialog(false)}
        onGoToLogin={handleGoToLogin}
      />
    </div>
  );
}