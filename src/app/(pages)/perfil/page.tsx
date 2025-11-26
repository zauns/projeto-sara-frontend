"use client";

import React, { useState } from "react";
import { Header } from "@/components/core/header";
import { ProfilePhotoCard } from "@/components/core/profile-photo-card";
import { UserDetailsCard } from "@/components/core/user-details-card";
import { CurriculumDisplay } from "@/components/core/curriculum-display";
import { CurriculumForm } from "@/components/core/curriculum-form";
import { CurriculumData } from "@/types/curriculum";

export default function ProfilePage() {
  // Estado para dados do usuário (dados fictícios)
  const [userDetails, setUserDetails] = useState({
    firstName: "Maria",
    lastName: "Souza",
    phone: "(81) 98888-7777",
    email: "maria.souza@email.com",
    address: "Rua das Flores, 123, Recife",
  });

  // Estado para dados do currículo (dados fictícios iniciais)
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

  // Estado para controle de edição do currículo
  const [isEditingCurriculum, setIsEditingCurriculum] = useState(false);

  // Estado para URL da foto de perfil (inicialmente vazio, usará fallback)
  const [profilePhotoUrl, setProfilePhotoUrl] = useState<string | undefined>(
    undefined,
  );

  // Handler para salvar currículo (dados locais)
  const handleCurriculumSubmit = (formData: CurriculumData) => {
    setCurriculum(formData);
    setIsEditingCurriculum(false);
    console.log("Currículo atualizado localmente:", formData);
  };

  // Handler para alterar foto de perfil (localmente)
  const handleProfilePhotoChange = (newPhotoUrl: string) => {
    setProfilePhotoUrl(newPhotoUrl);
    console.log("Foto de perfil atualizada localmente");
  };

  // Handler para logout
  const handleLogout = () => {
    console.log("Fazendo logout...");
    // Adicionar lógica real de logout aqui
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
            <UserDetailsCard
              firstName={userDetails.firstName}
              lastName={userDetails.lastName}
              phone={userDetails.phone}
              email={userDetails.email}
              address={userDetails.address}
            />
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
