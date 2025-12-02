"use client";

import React, { useState, useEffect } from "react";
import { useRequireAuth } from "../../../../hooks/useProtectedRoute";
import { useAuth } from "../../../../contexts/AuthContext";
import { Header } from "@/components/core/header";
import { userService, UserProfileGeneric } from "../../../../services/userServices";
import { AccountCard } from "../../../../components/core/account-card"; // Importe o card criado acima
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminDashboard = () => {
  const { isLoading, canAccess } = useRequireAuth();
  const { logout } = useAuth();

  // Estados para cada tipo de conta
  const [admins, setAdmins] = useState<UserProfileGeneric[]>([]);
  const [secretaries, setSecretaries] = useState<UserProfileGeneric[]>([]);
  const [companies, setCompanies] = useState<UserProfileGeneric[]>([]);
  const [users, setUsers] = useState<UserProfileGeneric[]>([]);
  
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    const fetchAllAccounts = async () => {
      try {
        // Busca todas as roles em paralelo para performance
        const [adminData, secData, compData, userData] = await Promise.all([
          userService.getAllAccountsRole("ROLE_ADMIN"),
          userService.getAllAccountsRole("ROLE_SECRETARIA"),
          userService.getAllAccountsRole("ROLE_EMPRESA"),
          userService.getAllAccountsRole("ROLE_USER"),
        ]);

        setAdmins(adminData);
        setSecretaries(secData);
        setCompanies(compData);
        setUsers(userData);

      } catch (error) {
        console.error(error);
        toast.error("Erro ao carregar listagem de contas.");
      } finally {
        setLoadingData(false);
      }
    };

    if (canAccess) {
      fetchAllAccounts();
    }
  }, [canAccess]);

  // Loading State (Visualmente idêntico ao AdminHome)
  if (isLoading || (canAccess && loadingData)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-custom-bg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando contas...</p>
        </div>
      </div>
    );
  }

  if (!canAccess) {
    return null;
  }

  // Função auxiliar para renderizar colunas
  const renderColumn = (title: string, data: UserProfileGeneric[], roleLabel: string) => (
    <div className="space-y-4 min-w-[300px]">
      <div className="flex items-center justify-between mb-3 pl-2 pr-2">
        <h2 className="text-xl font-bold text-[#F55F58]">{title}</h2>
        <span className="bg-red-100 text-[#F55F58] text-xs font-bold px-2 py-1 rounded-full">
          {data.length}
        </span>
      </div>
      
      <div className="space-y-3">
        {data.length > 0 ? (
          data.map((profile) => (
            <AccountCard 
              key={profile.id} 
              profile={profile} 
              roleLabel={roleLabel} 
            />
          ))
        ) : (
          <div className="bg-white rounded-lg shadow p-4 text-center text-gray-500 italic">
            Nenhum registro encontrado.
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-custom-bg flex flex-col">
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
      />
      <Header onLogout={logout} />

      <main className="flex-grow w-full max-w-[1600px] mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Visão Geral do Sistema</h1>
          <p className="text-gray-600">Listagem de todas as contas ativas por categoria.</p>
        </div>

        {/* Grid Responsivo: 1 col (mobile), 2 col (tablet), 4 col (telas largas) */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 items-start">
          
          {/* Coluna 1: Administradores */}
          {renderColumn("Administradores", admins, "Admin")}

          {/* Coluna 2: Secretarias */}
          {renderColumn("Secretarias", secretaries, "Secretaria")}

          {/* Coluna 3: Empresas */}
          {renderColumn("Empresas", companies, "Empresa")}

          {/* Coluna 4: Usuários */}
          {renderColumn("Usuários", users, "Cidadão")}
          
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;