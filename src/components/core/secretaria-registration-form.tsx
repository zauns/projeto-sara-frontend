"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
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
import {
  registrationService,
  DepartmentRegistrationData,
} from "@/services/registrationServices";

export function SecretariaRegistrationForm() {
  const [formData, setFormData] = useState<
    Omit<DepartmentRegistrationData, "municipio">
  >({
    nome: "",
    endereco: "",
    telefone: "",
    email: "",
    senha: "",
  });
  const [municipio, setMunicipio] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const router = useRouter();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (value: string) => {
    setMunicipio(value);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    if (formData.senha !== confirmPassword) {
      setError("As senhas não coincidem.");
      setIsLoading(false);
      return;
    }

    try {
      await registrationService.registerDepartment({ ...formData, municipio });
      setShowSuccessDialog(true);
    } catch (err) {
      setError("Ocorreu um erro ao solicitar o cadastro. Tente novamente.");
      console.error("Registration error:", err);
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
      <form className="space-y-6" onSubmit={handleSubmit}>
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
            value={formData.nome}
            onChange={handleChange}
            placeholder="Nome da secretaria"
            required
          />
        </div>

        {/* Endereço */}
        <div className="space-y-2">
          <Label htmlFor="endereco">Endereço</Label>
          <Input
            id="endereco"
            value={formData.endereco}
            onChange={handleChange}
            placeholder="Endereço completo"
            required
          />
        </div>

        {/* Grid telefone e estado */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="telefone">Telefone</Label>
            <Input
              id="telefone"
              type="tel"
              value={formData.telefone}
              onChange={handleChange}
              placeholder="(00) 00000-0000"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="municipio">Município</Label>
            <Select
              required
              onValueChange={handleSelectChange}
              value={municipio}
            >
              <SelectTrigger id="municipio">
                <SelectValue placeholder="Selecione" />
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
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="contato@secretaria.gov"
            required
          />
        </div>

        {/* Grid senha e Confirmar Senha */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="senha">Senha</Label>
            <Input
              id="senha"
              type="password"
              value={formData.senha}
              onChange={handleChange}
              placeholder="Crie uma senha"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar Senha</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirme a senha"
              required
            />
          </div>
        </div>

        {/* Botões */}
        {error && (
          <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
            {error}
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
