"use client";

import React, { useEffect } from "react";
import { useRequireAuth } from "@/hooks/useProtectedRoute"; // Ajuste o caminho conforme sua estrutura
import { useAuth } from "@/contexts/AuthContext"; // Ajuste o caminho conforme sua estrutura
import { Header } from "@/components/core/header"; // Ajuste o caminho conforme sua estrutura
import { SecretariaDetailsCard } from "@/components/core/secretaria-details-card"; // Ajuste o caminho
import { UserRegistrationForm } from "@/components/core/user-registration-form"; // Ajuste o caminho
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { SecretariaProfile } from "@/services/userServices";

const SecretaryHome = () => {
  // Hook de proteção de rota e estado de carregamento
  const { isLoading, canAccess } = useRequireAuth();
  
  // Obtendo o usuário logado e função de logout do contexto
  const { logout, userDetails } = useAuth();  
  


  // Exibe loading enquanto verifica autenticação
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-custom-bg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  // Se não tiver acesso, não renderiza nada (o hook useRequireAuth geralmente redireciona)
  if (!canAccess) {
    return null;
  }

  return (
    <div className="min-h-screen bg-custom-bg flex flex-col">
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
      />
      
      <Header onLogout={logout} />

      <main className="flex-grow max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Coluna 1: Detalhes da Usuária (Secretária Logada) */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-[#F55F58] mb-3 pl-2">
              Seus Dados
            </h2>
            {/* O componente SecretariaDetailsCard já possui padding e Card interno */}
            <SecretariaDetailsCard user={userDetails as SecretariaProfile} />
          </div>

          {/* Coluna 2: Formulário de Cadastro */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-[#F55F58] mb-3 pl-2">
              Cadastrar Nova Usuária
            </h2>
            
            {/* Wrapper para manter o estilo de card branco similar ao da outra coluna */}
            <div className="bg-white rounded-lg shadow-md border-gray border overflow-hidden">
              {/* Ajuste de padding/margem pode ser necessário dependendo do CSS global, 
                  mas aqui garantimos que o form fique contido */}
              <div className="p-2">
                <UserRegistrationForm />
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default SecretaryHome;