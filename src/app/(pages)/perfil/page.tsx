"use client";

import React, { useState, useEffect } from "react";
import { Header } from "@/components/core/header";
import { ProfilePhotoCard } from "@/components/core/profile-photo-card";
import { StandardUserDetailsCard } from "@/components/core/user-details-card";
import { CurriculumDisplay } from "@/components/core/curriculum-display";
import { CurriculumForm } from "@/components/core/curriculum-form";
import { CurriculumData } from "@/types/curriculum";
import { useAuth } from "@/contexts/AuthContext"; // Importando contexto de auth
import { userService, UserProfile } from "@/services/userServices"; // Importando serviço e tipo

export default function ProfilePage() {
  // Obtém o usuário do contexto para pegar o ID
  // Nota: Assumimos que o objeto 'user' do contexto possui pelo menos o 'id'
  const { user } = useAuth(); 
  
  // Estado para armazenar os dados reais do perfil vindos do Backend
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);

  // Estado para dados do currículo (MANTIDO MOCKADO CONFORME SOLICITADO)
  const [curriculum, setCurriculum] = useState<CurriculumData>({
    fullName: "Maria Eduarda de Souza",
    phoneNumber: "(81) 98888-7777",
    email: "maria.souza.profissional@email.com",
    objective:
      "Busco uma oportunidade desafiadora onde eu possa aplicar meus conhecimentos em desenvolvimento front-end e contribuir para o crescimento da empresa.",
    experience:
      "Desenvolvedora Front-end Júnior\nEmpresa Exemplo LTDA (2023 - Presente)\n- Desenvolvimento e manutenção de interfaces web com React e Next.js.\n- Colaboração em equipe para implementar novas funcionalidades.\n\nEstagiária de Desenvolvimento Web\nEmpresa Teste LTDA (2022 - 2023)\n- Auxílio no desenvolvimento de componentes reutilizáveis.\n- Correção de bugs e melhorias em interfaces existentes.",
    education:
      "Análise e Desenvolvimento de Sistemas - Universidade Exemplo (Concluído em 2023)",
    city: "recife",
    skills:
      "React, Next.js, TypeScript, JavaScript, HTML, CSS, TailwindCSS, Git, Figma.",
  });

  const [isEditingCurriculum, setIsEditingCurriculum] = useState(false);
  const [profilePhotoUrl, setProfilePhotoUrl] = useState<string | undefined>(undefined);

  // Efeito para buscar os dados reais do usuário ao carregar a página
  useEffect(() => {
    const fetchUserData = async () => {
      if (user?.id) {
        setIsLoadingProfile(true);
        try {
          // Busca os dados usando o serviço. 
          // Se o seu sistema tiver múltiplos tipos de usuários acessando essa mesma página,
          // você pode usar a lógica de roles aqui ou usar getProfileGeneric(user.id, user.role)
          const data = await userService.getProfileUser(user.id);
          setUserProfile(data);
        } catch (error) {
          console.error("Erro ao carregar perfil:", error);
        } finally {
          setIsLoadingProfile(false);
        }
      }
    };

    fetchUserData();
  }, [user]); // Recarrega se o usuário do contexto mudar

  // Handlers do Currículo (MANTIDOS)
  const handleCurriculumSubmit = (formData: CurriculumData) => {
    setCurriculum(formData);
    setIsEditingCurriculum(false);
  };

  const handleProfilePhotoChange = (newPhotoUrl: string) => {
    setProfilePhotoUrl(newPhotoUrl);
  };

  const handleLogout = () => {
    // Adicionar lógica real de logout aqui se necessário, 
    // mas geralmente o Header já lida com isso ou chama uma função do AuthContext
  };

  return (
    <div className="min-h-screen bg-[#FFF1EA]">
      <Header onLogout={handleLogout} />
      <main className="container mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Coluna Esquerda: Foto e Detalhes do Usuário */}
          <div className="lg:col-span-1 space-y-8">
            <ProfilePhotoCard
              profileImageUrl={profilePhotoUrl}
              onPhotoChange={handleProfilePhotoChange}
            />
            
            {/* Passamos o perfil carregado do backend ou null enquanto carrega */}
            {isLoadingProfile ? (
              <div className="p-4 text-center bg-white rounded shadow">Carregando dados...</div>
            ) : (
              <StandardUserDetailsCard
                user={userProfile}
              />
            )}
          </div>

          {/* Coluna Direita: Currículo */}
          <div className="lg:col-span-2">
            {isEditingCurriculum ? (
              <CurriculumForm
                {...curriculum}
                onSave={handleCurriculumSubmit}
                onCancel={() => setIsEditingCurriculum(false)}
              />
            ) : (
              <CurriculumDisplay
                {...curriculum}
                onEdit={() => setIsEditingCurriculum(true)}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}