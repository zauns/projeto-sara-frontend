"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { tokenUtils, userDataUtils } from "../utils/cookies";

interface SessionInfoProps {
  className?: string;
  showDetails?: boolean;
}

const SessionInfo: React.FC<SessionInfoProps> = ({
  className = "",
  showDetails = true,
}) => {
  const { isAuthenticated, user } = useAuth();
  const [sessionType, setSessionType] = useState<
    "session" | "persistent" | null
  >(null);
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [timeRemaining, setTimeRemaining] = useState<string>("");

  useEffect(() => {
    if (!isAuthenticated) return;

    // Obtém informações da sessão
    const storageType = userDataUtils.getStorageType();
    const rememberMePreference = tokenUtils.getRememberMePreference();

    setSessionType(storageType);
    setRememberMe(rememberMePreference);

    // Calcula o tempo restante para sessões persistentes
    if (rememberMePreference && storageType === "persistent") {
      const updateTimeRemaining = () => {
        // Este é um cálculo simplificado - em uma aplicação real, você obteria isso do token JWT
        const now = new Date().getTime();
        const loginTime = localStorage.getItem("login_time");

        if (loginTime) {
          const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000;
          const expiryTime = parseInt(loginTime) + thirtyDaysInMs;
          const remaining = expiryTime - now;

          if (remaining > 0) {
            const days = Math.floor(remaining / (24 * 60 * 60 * 1000));
            const hours = Math.floor(
              (remaining % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000),
            );

            if (days > 0) {
              setTimeRemaining(`${days} dias, ${hours} horas`);
            } else if (hours > 0) {
              setTimeRemaining(`${hours} horas`);
            } else {
              const minutes = Math.floor(
                (remaining % (60 * 60 * 1000)) / (60 * 1000),
              );
              setTimeRemaining(`${minutes} minutos`);
            }
          } else {
            setTimeRemaining("Expirado");
          }
        }
      };

      // Armazena o horário de login se não existir
      if (!localStorage.getItem("login_time")) {
        localStorage.setItem("login_time", new Date().getTime().toString());
      }

      updateTimeRemaining();
      const interval = setInterval(updateTimeRemaining, 60000); // Atualiza a cada minuto

      return () => clearInterval(interval);
    } else {
      setTimeRemaining("Até fechar o navegador");
    }
  }, [isAuthenticated, rememberMe, sessionType]);

  if (!isAuthenticated || !showDetails) {
    return null;
  }

  const getSessionIcon = () => {
    if (rememberMe && sessionType === "persistent") {
      return (
        <div
          className="w-3 h-3 bg-green-500 rounded-full"
          title="Sessão persistente"
        />
      );
    } else {
      return (
        <div
          className="w-3 h-3 bg-yellow-500 rounded-full"
          title="Sessão temporária"
        />
      );
    }
  };

  const getSessionText = () => {
    if (rememberMe && sessionType === "persistent") {
      return "Sessão Lembrada";
    } else {
      return "Sessão Temporária";
    }
  };

  const getSessionDescription = () => {
    if (rememberMe && sessionType === "persistent") {
      return "Você permanecerá logado mesmo após fechar o navegador";
    } else {
      return "Sua sessão expirará quando você fechar o navegador";
    }
  };

  return (
    <div
      className={`bg-white rounded-lg border border-gray-200 p-4 ${className}`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {getSessionIcon()}
          <span className="text-sm font-medium text-gray-700">
            {getSessionText()}
          </span>
        </div>
        <div className="text-xs text-gray-500">
          {timeRemaining && (
            <span title="Tempo restante da sessão">{timeRemaining}</span>
          )}
        </div>
      </div>

      <div className="text-xs text-gray-600 mb-3">
        {getSessionDescription()}
      </div>

      {showDetails && (
        <div className="border-t border-gray-100 pt-3 space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-gray-500">Usuário:</span>
            <span className="text-gray-700 font-medium">
              {user?.name || user?.email || "N/A"}
            </span>
          </div>

          <div className="flex justify-between text-xs">
            <span className="text-gray-500">Tipo de Armazenamento:</span>
            <span className="text-gray-700">
              {sessionType === "persistent" ? "Persistente" : "Sessão"}
            </span>
          </div>

          <div className="flex justify-between text-xs">
            <span className="text-gray-500">Lembrar de mim:</span>
            <span
              className={`font-medium ${rememberMe ? "text-green-600" : "text-gray-600"}`}
            >
              {rememberMe ? "Ativado" : "Desativado"}
            </span>
          </div>

          {rememberMe && (
            <div className="mt-2 p-2 bg-blue-50 rounded-md">
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
                  <p className="font-medium">Sessão Estendida Ativa</p>
                  <p className="text-blue-600">
                    Sua sessão permanecerá ativa por 30 dias ou até você fazer
                    logout.
                  </p>
                </div>
              </div>
            </div>
          )}

          {!rememberMe && (
            <div className="mt-2 p-2 bg-yellow-50 rounded-md">
              <div className="flex items-start gap-2">
                <div className="w-4 h-4 text-yellow-500 mt-0.5">
                  <svg fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="text-xs text-yellow-700">
                  <p className="font-medium">Sessão Temporária</p>
                  <p className="text-yellow-600">
                    Você será deslogado quando fechar o navegador.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SessionInfo;
