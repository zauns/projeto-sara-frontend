"use client";

import React, { useState, useEffect } from "react";
import { Header } from "@/components/core/header";
import { ProfilePhotoCard } from "@/components/core/profile-photo-card";
import { StandardUserDetailsCard } from "@/components/core/user-details-card";
import { CurriculumDisplay } from "@/components/core/curriculum-display"; 
import { CurriculumForm } from "@/components/core/curriculum-form";
// 1. Alteramos a importação do contexto direto para o seu hook de proteção
import { useRequireAuth } from "@/hooks/useProtectedRoute"; // Ajuste o caminho se necessário
import { userService, UserProfile } from "@/services/userServices";
import { curriculumService } from "@/services/curriculumServices";

export default function ProfilePage() {
  // 2. Usamos o hook de proteção. 
  // Ele já traz o 'user' e trata o redirect se não houver user.
  const { user, isLoading: isAuthLoading } = useRequireAuth();
  
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);

  const [hasCurriculum, setHasCurriculum] = useState(false);
  const [isLoadingCurriculumStatus, setIsLoadingCurriculumStatus] = useState(true);
  
  const [isEditingCurriculum, setIsEditingCurriculum] = useState(false);
  const [profilePhotoUrl, setProfilePhotoUrl] = useState<string | undefined>(undefined);

  useEffect(() => {
    const fetchAllData = async () => {
      // Adicionamos a verificação !isAuthLoading para garantir que o auth já resolveu
      if (user?.id && !isAuthLoading) {
        setIsLoadingProfile(true);
        setIsLoadingCurriculumStatus(true);

        try {
          const [profileData, exists] = await Promise.all([
            userService.getProfileUser(user.id),
            curriculumService.checkCurriculumExists()
          ]);

          setUserProfile(profileData);
          setHasCurriculum(exists);

        } catch (error) {
          console.error("Erro ao carregar dados:", error);
        } finally {
          setIsLoadingProfile(false);
          setIsLoadingCurriculumStatus(false);
        }
      }
    };

    fetchAllData();
  }, [user, isAuthLoading]);

  const handleCurriculumSubmit = () => {
    setHasCurriculum(true);
    setIsEditingCurriculum(false);
  };

  // 3. Bloqueio de renderização:
  // Se o Auth ainda está carregando ou o usuário ainda é nulo (antes do redirect acontecer),
  // retornamos um loading simples ou null para evitar "piscar" a tela protegida.
  if (isAuthLoading || !user) {
    return (
      <div className="min-h-screen bg-[#FFF1EA] flex items-center justify-center">
        {/* Spinner simples usando classes Tailwind padrão */}
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF1EA]">
      <Header onLogout={() => {}} /> 
      <main className="container mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Esquerda: Perfil */}
          <div className="lg:col-span-1 space-y-8">
            <ProfilePhotoCard
              profileImageUrl={profilePhotoUrl}
              onPhotoChange={setProfilePhotoUrl}
            />
            
            {isLoadingProfile ? (
              <div className="p-4 bg-white rounded shadow animate-pulse h-40"></div>
            ) : (
              <StandardUserDetailsCard user={userProfile} />
            )}
          </div>

          {/* Direita: Currículo */}
          <div className="lg:col-span-2">
            
            {isLoadingCurriculumStatus ? (
               <div className="p-8 bg-white rounded shadow animate-pulse space-y-4 border border-gray-100">
                 <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
                 <div className="h-32 bg-gray-100 rounded w-full"></div>
               </div>
            ) : isEditingCurriculum ? (
              <CurriculumForm
                fullName={userProfile?.name}
                email={userProfile?.email}
                phoneNumber={userProfile?.telefone}
                city={userProfile?.endereco}
                onSave={handleCurriculumSubmit}
                onCancel={() => setIsEditingCurriculum(false)}
              />
            ) : (
              <CurriculumDisplay
                hasCurriculum={hasCurriculum}
                candidateName={userProfile?.name}
                onOpenForm={() => setIsEditingCurriculum(true)}
              />
            )}
          </div>

        </div>
      </main>
    </div>
  );
}