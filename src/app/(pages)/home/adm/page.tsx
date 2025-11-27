"use client";

import React, { useState, useEffect } from "react";
import { useRequireAuth } from "../../../../hooks/useProtectedRoute";
import { useAuth } from "../../../../contexts/AuthContext";
import { Header } from "@/components/core/header";
import { approvalService } from "../../../../services/approvalServices";
import { UserProfile } from "../../../../services/userServices";
import { ApprovalCard } from "../../../../components/core/approval-card";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { tokenUtils } from "@/utils/cookies";

const AdminHome = () => {
  const { isLoading, canAccess } = useRequireAuth();
  const { logout } = useAuth();
  const [pendingCompanies, setPendingCompanies] = useState<UserProfile[]>([]);
  const [pendingSecretaries, setPendingSecretaries] = useState<UserProfile[]>(
    [],
  );
  const [loadingApprovals, setLoadingApprovals] = useState(true);

  useEffect(() => {
    console.log(tokenUtils.getAuthToken())
    const fetchPendingApprovals = async () => {
      try {
        const [companies, secretaries] = await Promise.all([
          approvalService.getPendingCompanies(),
          approvalService.getPendingSecretaries(),
        ]);
        setPendingCompanies(companies);
        setPendingSecretaries(secretaries);
      } catch (error) {
        toast.error(`Erro ao carregar aprovações pendentes: ${error}`);
      } finally {
        setLoadingApprovals(false);
      }
    };

    if (canAccess) {
      fetchPendingApprovals();
    }
  }, [canAccess]);

  const handleApprove = async (id: string, type: "company" | "secretary") => {
    try {
      if (type === "company") {
        await approvalService.approveCompany(id);
        setPendingCompanies((current) => current.filter((c) => c.id !== id));
        toast.success("Empresa aprovada com sucesso!");
      } else {
        await approvalService.approveSecretary(id);
        setPendingSecretaries((current) => current.filter((s) => s.id !== id));
        toast.success("Secretaria aprovada com sucesso!");
      }
    } catch (error) {
      toast.error(`Erro ao aprovar. Tente novamente. :${error}`);
    }
  };

  if (isLoading || (canAccess && loadingApprovals)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-custom-bg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Coluna de Empresas Pendentes */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-[#F55F58] mb-3 pl-2">
              Empresas Pendentes
            </h2>
            {pendingCompanies.length > 0 ? (
              pendingCompanies.map((company) => (
                <ApprovalCard
                  key={company.id}
                  profile={company}
                  onApprove={(id) => handleApprove(id, "company")}
                />
              ))
            ) : (
              <div className="bg-white rounded-lg shadow p-4 text-center text-gray-500">
                <p>Nenhuma empresa pendente.</p>
              </div>
            )}
          </div>

          {/* Coluna de Secretarias Pendentes */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-[#F55F58] mb-3 pl-2">
              Secretarias Pendentes
            </h2>
            {pendingSecretaries.length > 0 ? (
              pendingSecretaries.map((secretary) => (
                <ApprovalCard
                  key={secretary.id}
                  profile={secretary}
                  onApprove={(id) => handleApprove(id, "secretary")}
                />
              ))
            ) : (
              <div className="bg-white rounded-lg shadow p-4 text-center text-gray-500">
                <p>Nenhuma secretaria pendente.</p>
              </div>
            )}
          </div>

          {/* Terceira Coluna (Vazia) */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-[#F55F58] mb-3 pl-2">
              Conteúdo Futuro
            </h2>
            <div className="bg-white rounded-lg shadow p-4 text-center text-gray-500">
              Esta coluna está reservada para funcionalidades futuras.
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminHome;
