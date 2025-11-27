"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// Supondo que você tenha ou criará um diálogo similar para usuário
import { UserRegistrationSuccessDialog } from "./user-registration-dialogue"; 
// Supondo uma interface e serviço ajustados
import { registrationService } from "@/services/registrationServices";

// Interface local para o estado do formulário
interface UserRegistrationData {
  name: string;
  email: string;
  password: string;
}

export function UserRegistrationForm() {
  const [formData, setFormData] = useState<UserRegistrationData>({
    name: "",
    email: "",
    password: "",
  });
  
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const router = useRouter();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    if (formData.password !== confirmPassword) {
      setError("As senhas não coincidem.");
      setIsLoading(false);
      return;
    }

    try {
      // Ajuste para o método correto do seu serviço de back-end
      await registrationService.registerUser(formData); 
      setShowSuccessDialog(true);
    } catch (err) {
      setError(
        "Ocorreu um erro ao criar a conta. Tente novamente mais tarde.",
      );
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
    <div className="w-full max-w-xl mx-auto p-4 md:p-8">
      <form className="space-y-8" onSubmit={handleSubmit}>
        <fieldset className="space-y-6">
          <legend className="text-2xl font-semibold text-gray-900 border-b pb-2">
            Cadastro de Usuária
          </legend>

          <div className="space-y-2">
            <Label htmlFor="name">Nome Completo</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Digite seu nome completo"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="seu.email@exemplo.com"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Crie uma senha segura"
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
                placeholder="Confirme sua senha"
                required
              />
            </div>
          </div>
        </fieldset>

        {error && (
          <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
            {error}
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
            variant="destructive"
            className="w-full md:w-auto bg-red-400 hover:bg-red-500"
            disabled={isLoading}
          >
            {isLoading ? "Criando conta..." : "Criar Conta"}
          </Button>
        </div>
      </form>

      {/* Lembre-se de criar ou ajustar este componente de diálogo */}
      <UserRegistrationSuccessDialog
        isOpen={showSuccessDialog}
        onClose={() => setShowSuccessDialog(false)}
        onGoToLogin={handleGoToLogin}
      />
    </div>
  );
}