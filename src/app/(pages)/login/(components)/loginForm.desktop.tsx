import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useAuth } from "../../../../contexts/AuthContext";

const LoginFormDesktop: React.FC = () => {
  const [cpf, setCpf] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { login } = useAuth();

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      // Simula o processo de login (substitua com sua chamada de API real posteriormente)
      console.log("Formulário enviado:", { cpf, password, rememberMe });

      // Dados de usuário e token simulados (substitua com a resposta real da API)
      const mockUserData = {
        id: "123",
        name: "João Silva",
        email: cpf.includes("@") ? cpf : "user@example.com",
        cpf: cpf.includes("@") ? "" : cpf,
        role: "user",
      };

      const mockToken = "mock-jwt-token-" + Date.now();

      // Usa a função de login do AuthContext
      login(mockUserData, mockToken, rememberMe);
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col justify-center px-8 py-12 bg-[#FFF1EA]">
      {/* Container do Formulário */}
      <div className="flex flex-col gap-8 w-full max-w-lg mx-auto">
        {/* Título */}
        <div className="flex flex-col gap-2">
          <h1 className="text-[40px] font-bold text-[#21272A] leading-tight">
            Log In
          </h1>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Campo CPF */}
          <div className="flex flex-col gap-1">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="cpf"
                className="text-sm text-[#21272A] leading-[1.4]"
              >
                CPF
              </label>
              <input
                id="cpf"
                type="text"
                placeholder="Digite seu CPF"
                value={cpf}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setCpf(e.target.value)
                }
                className="w-full px-4 py-3 text-base text-[#697077] bg-white border-b border-[#C1C7CD] focus:outline-none focus:border-[#F55F58] placeholder:text-[#697077]"
              />
            </div>
          </div>

          {/* Campo Senha */}
          <div className="flex flex-col gap-1">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="password"
                className="text-sm text-[#21272A] leading-[1.4]"
              >
                Senha
              </label>
              <div className="relative w-full">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Digite sua senha"
                  value={password}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setPassword(e.target.value)
                  }
                  className="w-full px-4 py-3 pr-12 text-base text-[#697077] bg-white border-b border-[#C1C7CD] focus:outline-none focus:border-[#F55F58] placeholder:text-[#697077]"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#697077] hover:text-[#21272A] transition-colors"
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                >
                  {showPassword ? (
                    <FaEyeSlash size={24} />
                  ) : (
                    <FaEye size={24} />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Lembrar de mim & Esqueceu a senha */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="remember"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-5 h-5 rounded border-[#C1C7CD] text-[#F55F58] focus:ring-[#F55F58]"
                />
                <label
                  htmlFor="remember"
                  className="text-sm text-[#21272A] leading-[1.4]"
                >
                  Lembrar de mim
                </label>
              </div>
              <button
                type="button"
                className="text-sm text-[#001D6C] leading-[1.4] hover:underline"
              >
                Esqueceu sua senha?
              </button>
            </div>

            {/* Explicação do Lembrar de mim */}
            {rememberMe && (
              <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                <div className="flex items-start gap-2">
                  <div className="w-4 h-4 text-blue-500 mt-0.5">
                    <svg fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="text-xs text-blue-700">
                    <p className="font-medium mb-1">Sessão Estendida</p>
                    <p className="text-blue-600">
                      Você permanecerá logado por 30 dias, mesmo após fechar o
                      navegador. Desmarque esta opção se estiver usando um
                      computador compartilhado.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Botão de Login */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-3 py-4 bg-[#F55F58] border-2 border-[#F55F58] text-[#FFF1EA] text-base font-medium leading-none hover:bg-[#E04E47] hover:border-[#E04E47] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        {/* Separador */}
        <div className="w-full h-px bg-[#C1C7CD]"></div>

        {/* Botão de Cadastro */}
        <div className="flex flex-col gap-4">
          <button
            type="button"
            className="w-full px-3 py-4 bg-transparent border-2 border-[#F55F58] text-[#F55F58] text-base font-medium leading-none hover:bg-[#F55F58] hover:text-[#FFF1EA] transition-colors"
          >
            Cadastre-se como Empresa
          </button>
        </div>

        {/* Texto de Cadastro */}
        <span className="text-sm text-[#001D6C] leading-[1.4] text-left">
          Não possui uma conta? Siga as etapas e cadastre-se
        </span>
      </div>
    </div>
  );
};

export default LoginFormDesktop;
