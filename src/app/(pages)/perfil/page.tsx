"use client";

import React, { useState, useEffect } from "react";
import { Header } from "@/components/core/header";
import { ProfilePhotoCard } from "@/components/core/profile-photo-card";
import { StandardUserDetailsCard } from "@/components/core/user-details-card";
// Importar o novo display simplificado
import { CurriculumDisplay } from "@/components/core/curriculum-display"; 
import { CurriculumForm } from "@/components/core/curriculum-form";
import { useAuth } from "@/contexts/AuthContext";
import { userService, UserProfile } from "@/services/userServices";
import { curriculumService } from "@/services/curriculumServices";

export default function ProfilePage() {
  const { user } = useAuth();
  
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);

  // Agora controlamos apenas a EXISTÊNCIA do arquivo, não os dados
  const [hasCurriculum, setHasCurriculum] = useState(false);
  const [isLoadingCurriculumStatus, setIsLoadingCurriculumStatus] = useState(true);
  
  const [isEditingCurriculum, setIsEditingCurriculum] = useState(false);
  const [profilePhotoUrl, setProfilePhotoUrl] = useState<string | undefined>(undefined);

  useEffect(() => {
    const fetchAllData = async () => {
      if (user?.id) {
        setIsLoadingProfile(true);
        setIsLoadingCurriculumStatus(true);

        try {
          // Busca perfil e verifica existência do currículo em paralelo
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
  }, [user]);

  const handleCurriculumSubmit = () => {
    // Quando salva com sucesso:
    // 1. O formulário envia o POST e recebe 200 OK.
    // 2. Definimos que agora existe um currículo.
    setHasCurriculum(true);
    // 3. Fechamos o formulário.
    setIsEditingCurriculum(false);
  };

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
            
            {/* Estado de Loading Inicial */}
            {isLoadingCurriculumStatus ? (
               <div className="p-8 bg-white rounded shadow animate-pulse space-y-4 border border-gray-100">
                 <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
                 <div className="h-32 bg-gray-100 rounded w-full"></div>
               </div>
            ) : isEditingCurriculum ? (
              /* MODO FORMULÁRIO */
              /* Nota: Como não temos os dados do currículo antigo (/dados),
                 passamos apenas os dados do Perfil (userProfile) para 
                 preencher o cabeçalho. O resto vai em branco.
              */
              <CurriculumForm
                fullName={userProfile?.name}
                email={userProfile?.email}
                phoneNumber={userProfile?.telefone}
                city={userProfile?.endereco}
                
                onSave={handleCurriculumSubmit}
                onCancel={() => setIsEditingCurriculum(false)}
              />
            ) : (
              /* MODO DISPLAY (Card de Download/Status) */
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