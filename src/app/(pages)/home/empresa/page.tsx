"use client";

import { useRequireAuth } from "@/hooks/useProtectedRoute"; 
import { useAuth } from "@/contexts/AuthContext"; 
import { Header } from "@/components/core/header"; 
import { EmpresaDetailsCard } from "@/components/core/company-details-card"; 
import { PublishJobForm } from "@/components/core/publish-job-form"; 
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { EmpresaProfile } from "@/services/userServices";

const CompanyHome = () => {
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

  // Se não tiver acesso, não renderiza nada
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
          
          {/* Coluna 1: Detalhes da Empresa */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-[#F55F58] mb-3 pl-2">
              Dados da Empresa
            </h2>
            {/* Componente de detalhes da empresa (Esquerda) */}
            <EmpresaDetailsCard user={userDetails as EmpresaProfile} />
          </div>

          {/* Coluna 2: Publicar Nova Vaga */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-[#F55F58] mb-3 pl-2">
              Publicar Nova Vaga
            </h2>
            
            {/* Nota: O PublishJobForm original já possui estilos de card (bg-white, shadow, border).
                Se quiser remover o estilo de card do componente filho para controlar aqui, 
                você pode envolver em uma div simples, mas neste caso, o componente já é visualmente um card.
            */}
            <div className="h-full">
                <PublishJobForm />
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default CompanyHome;