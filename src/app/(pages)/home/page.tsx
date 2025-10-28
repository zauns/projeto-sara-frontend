"use client";

import React from "react";
import { useRequireAuth } from "../../../hooks/useProtectedRoute";
import { useAuth } from "../../../contexts/AuthContext";
import SessionInfo from "../../../components/SessionInfo";

const Home = () => {
  // Protege esta rota - redireciona para login se não estiver autenticado
  const { isLoading, canAccess } = useRequireAuth();
  const { user, logout } = useAuth();

  // Mostra estado de carregamento enquanto verifica autenticação
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  // Não renderiza se o usuário não pode acessar (o hook de proteção irá lidar com o redirecionamento)
  if (!canAccess) {
    return null;
  }

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Cabeçalho */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">SARA Emprega</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-700">
                Olá,{" "}
                <span className="font-medium">{user?.name || "Usuário"}</span>
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Seção de Boas-vindas */}
          <div className="md:col-span-3 bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Bem-vindo(a)!
            </h2>
            <p className="text-gray-600">
              Você está logado no sistema SARA Emprega.
            </p>
          </div>

          {/* Cartão de Informações do Usuário */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Suas Informações
            </h3>
            <div className="space-y-2">
              <div>
                <span className="text-sm font-medium text-gray-500">Nome:</span>
                <p className="text-sm text-gray-900">{user?.name || "N/A"}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">
                  Email:
                </span>
                <p className="text-sm text-gray-900">{user?.email || "N/A"}</p>
              </div>
              {user?.cpf && (
                <div>
                  <span className="text-sm font-medium text-gray-500">
                    CPF:
                  </span>
                  <p className="text-sm text-gray-900">{user.cpf}</p>
                </div>
              )}
              <div>
                <span className="text-sm font-medium text-gray-500">
                  Perfil:
                </span>
                <p className="text-sm text-gray-900">
                  {user?.role || "Usuário"}
                </p>
              </div>
            </div>
          </div>

          {/* Ações Rápidas */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Ações Rápidas
            </h3>
            <div className="space-y-2">
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors">
                Buscar Vagas
              </button>
              <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors">
                Meu Perfil
              </button>
            </div>
          </div>
        </div>

        {/* Informações da Sessão */}
        <div className="mt-8">
          <SessionInfo />
        </div>
      </main>
    </div>
  );
};

export default Home;
