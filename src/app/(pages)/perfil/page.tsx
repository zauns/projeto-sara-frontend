"use client";

import React, { use, useEffect, useState } from "react";
import { Header } from "@/components/core/header";
import { ProfilePhotoCard } from "@/components/core/profile-photo-card";
import { UserDetailsCard } from "@/components/core/user-details-card";
import { CurriculumDisplay } from "@/components/core/curriculum-display";
import { CurriculumForm } from "@/components/core/curriculum-form";
import { CurriculumData } from "@/types/curriculum";
import { useAuth } from "@/contexts/AuthContext";


const API_URL = "http://localhost:8080";


export default function ProfilePage() {
  const { user, token, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [userDetails, setUserDetails] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    address: "",
  });

  const [curriculum, setCurriculum] = useState<CurriculumData>({
    fullName: "",
    phoneNumber: "",
    email: "",
    objective: "Busco uma oportunidade desafiadora...",
    experience: "Experiência simulada...",
    education: "Educação simulada...",
    city: "Recife",
    skills: "React, Java, Spring Boot",
  });
  // Estado para dados do currículo (dados fictícios iniciais)


  // Estado para controle de edição do currículo
  const [isEditingCurriculum, setIsEditingCurriculum] = useState(false);

  // Estado para URL da foto de perfil (inicialmente vazio, usará fallback)
  const [profilePhotoUrl, setProfilePhotoUrl] = useState<string | undefined>(
    undefined,
  );

  useEffect(() => {
    async function fetchUserData() {
      if (!user || !token) return;

      try {
        let endpoint = "/api/user";
        if (user.role == "ROLE_EMPRESA") endpoint = "/empresa";
        if (user.role == "ROLE_SECRETARIA") endpoint = "/secretaria";
        if (user.role == "ROLE_ADMIN") endpoint = "/administrador";

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const userId = user.userId || user.id;

        const url = `${API_URL}${endpoint}/${user.id}`;

        console.log(`Buscando dados em: ${url}`);

        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();

          const names = (data.nome || "").split(" ");
          const firstName = names[0] || "";
          const lastName = names.slice(1).join(" ") || "";

          setUserDetails({
            firstName: firstName,
            lastName: lastName,
            phone: data.telefone || "",
            email: data.email || "",
            address: data.endereco || "",
          });

          setCurriculum((prev) => ({
            ...prev,
            fullName: data.nome,
            email: data.email,
            phoneNumber: data.telefone
          }));
        } else {
          console.error("Erro ao buscar o perfil:", response.status);
          const errorText = await response.text();
          console.error("Detalhes do erro:", errorText);
        }
      } catch (error) {
        console.error("Erro de conexão:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchUserData();
  }, [user, token]);

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
    if (logout) logout();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFF1EA]">
        <p className="text-[#F55F58] font-bold">Carregando perfil...</p>
      </div>
    );
  }

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
