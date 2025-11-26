"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react"; 

export function CompanyLoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login de Empresa enviado");
    // Redirecionar para o Dashboard da Empresa
    router.push("/company/dashboard"); 
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-8">
      
      {/* Cabeçalho idêntico ao da referência */}
      <div className="space-y-2 text-center md:text-left">
        <h1 className="text-3xl font-bold text-gray-900">Boas vindas</h1>
        <p className="text-gray-500">Entre com sua conta empresarial</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input 
            id="email" 
            type="email" 
            placeholder="empresa@email.com" 
            required 
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Senha</Label>
            <a href="#" className="text-sm font-medium text-red-500 hover:text-red-600">
              Esqueceu a senha?
            </a>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        <Button 
          type="submit" 
          variant="destructive" // Botão vermelho padrão do seu projeto
          className="w-full bg-red-500 hover:bg-red-600 font-semibold h-11"
        >
          Entrar
        </Button>

        <div className="text-center text-sm text-gray-600">
          Ainda não tem uma conta?{" "}
          {/* Link apontando para a rota de cadastro de empresa */}
          <a href="/register/company" className="font-bold text-red-500 hover:text-red-600">
            Cadastre-se
          </a>
        </div>

      </form>
    </div>
  );
}