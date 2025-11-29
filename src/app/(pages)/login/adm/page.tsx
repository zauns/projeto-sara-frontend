"use client";

import { LoginCredentials, authService } from "@/services/authServices";
import React, { useState } from "react";
import Image from "next/image";
import { FaEye, FaEyeSlash } from "react-icons/fa";
// Ajuste o caminho de importação conforme a estrutura do seu projeto atual
import { useAuth } from "@/contexts/AuthContext";

export default function AdminLoginPage() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // States para controle de erro
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  // Hook de autenticação
  const { login } = useAuth();

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null); // Limpa erros de tentativas anteriores

    // 1. Validação Local (Campos vazios)
    const errors: { email?: string; password?: string } = {};
    if (!email.trim()) {
      errors.email = "O campo de acesso é obrigatório.";
    }
    if (!password.trim()) {
      errors.password = "O campo de senha é obrigatório.";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    // Se passou na validação local, limpa erros de form
    setFormErrors({});
    setIsLoading(true);

    try {
      const credentials: LoginCredentials = { email, password };
      const data = await authService.login(credentials);
      
      login(data.user, data.token, rememberMe);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Login error:", error);
      setErrorMessage(
        error.message || "Email ou senha inválidos. Tente novamente.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-[#FFF1EA]">
      {/* SEÇÃO DA IMAGEM */}
      <div className="relative w-full h-[221px] md:h-screen md:w-[60%] bg-white flex items-center justify-center">
        <Image
          src="/images/imagemLogin.png"
          alt="Imagem de Login Administrativo"
          fill
          priority
          className="object-contain md:p-8"
          sizes="(max-width: 768px) 100vw, 60vw"
        />
      </div>

      {/* SEÇÃO DO FORMULÁRIO */}
      <div className="w-full flex flex-col justify-start md:justify-center md:h-screen md:w-[40%] md:overflow-y-auto">
        <div className="w-full max-w-md mx-auto px-6 py-8 md:max-w-lg md:px-12 md:py-12 flex flex-col gap-8">
          
          {/* Cabeçalho do Form */}
          <div className="flex flex-col gap-2">
            <h1 className="text-[32px] md:text-[40px] font-bold text-[#21272A] leading-tight">
              Acesso Admin
            </h1>
            <p className="text-sm text-[#697077]">
              Entre com suas credenciais de administrador.
            </p>
          </div>

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {/* Campo CPF / Login */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="email"
                className="text-sm text-[#21272A] leading-[1.4] font-medium"
              >
                E-mail
              </label>
              <input
                id="email"
                type="text"
                placeholder="Digite seu acesso"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  // Limpa o erro específico ao digitar
                  if (formErrors.email) {
                    setFormErrors((prev) => ({ ...prev, email: undefined }));
                  }
                }}
                className={`w-full px-4 py-3 text-base text-[#697077] bg-white border-b ${
                  formErrors.email ? "border-red-500" : "border-[#C1C7CD]"
                } focus:outline-none focus:border-[#F55F58] placeholder:text-[#697077] transition-colors`}
              />
              {/* Mensagem de erro do campo */}
              {formErrors.email && (
                <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
              )}
            </div>

            {/* Campo Senha */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="password"
                className="text-sm text-[#21272A] leading-[1.4] font-medium"
              >
                Senha
              </label>
              <div className="relative w-full">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Digite sua senha"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    // Limpa o erro específico ao digitar
                    if (formErrors.password) {
                      setFormErrors((prev) => ({
                        ...prev,
                        password: undefined,
                      }));
                    }
                  }}
                  className={`w-full px-4 py-3 pr-12 text-base text-[#697077] bg-white border-b ${
                    formErrors.password ? "border-red-500" : "border-[#C1C7CD]"
                  } focus:outline-none focus:border-[#F55F58] placeholder:text-[#697077] transition-colors`}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#697077] hover:text-[#21272A] transition-colors"
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                >
                  {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                </button>
              </div>
              {/* Mensagem de erro do campo */}
              {formErrors.password && (
                <p className="mt-1 text-sm text-red-600">
                  {formErrors.password}
                </p>
              )}
            </div>

            {/* Opções (Lembrar / Esqueci senha) */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="remember"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-5 h-5 rounded border-[#C1C7CD] text-[#F55F58] focus:ring-[#F55F58] cursor-pointer"
                  />
                  <label
                    htmlFor="remember"
                    className="text-sm text-[#21272A] leading-[1.4] cursor-pointer"
                  >
                    Lembrar de mim
                  </label>
                </div>
                <button
                  type="button"
                  className="text-sm text-[#001D6C] leading-[1.4] hover:underline"
                >
                  Esqueceu a senha?
                </button>
              </div>

              {/* Aviso de Sessão Estendida */}
              {rememberMe && (
                <div className="bg-blue-50 border border-blue-200 rounded-md p-3 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="flex items-start gap-2">
                    <div className="text-xs text-blue-700">
                      <p className="font-medium mb-1">Atenção Admin</p>
                      <p className="text-blue-600">
                        Sua sessão administrativa ficará ativa por 30 dias.
                        Garanta que este dispositivo é seguro.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Exibição de Erro Geral (API) */}
            {errorMessage && (
              <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
                {errorMessage}
              </div>
            )}

            {/* Botão de Ação */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-3 py-4 mt-2 bg-[#F55F58] border-2 border-[#F55F58] text-[#FFF1EA] text-base font-bold uppercase tracking-wide leading-none hover:bg-[#E04E47] hover:border-[#E04E47] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
            >
              {isLoading ? "Validando Acesso..." : "Acessar Painel"}
            </button>
          </form>

          {/* Rodapé Simples */}
          <div className="w-full flex justify-center pt-8 border-t border-[#C1C7CD]/50">
            <span className="text-xs text-[#697077] text-center">
              Acesso restrito. © {new Date().getFullYear()} SARA Emprega.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}