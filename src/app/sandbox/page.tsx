"use client"; // <--- 1. OBRIGATÓRIO: Transforma esta página em Client Component

import { Header } from '@/components/core/header';
import { SearchBar } from '@/components/core/search-bar';
import { JobCard } from '@/components/core/job-card';
import { GuideCard } from '@/components/core/guide-card';
import { ProfilePhotoCard } from '@/components/core/profile-photo-card';
import { UserDetailsCard } from '@/components/core/user-details-card';
import { CurriculumForm } from '@/components/core/curriculum-form';
import { CurriculumDisplay } from '@/components/core/curriculum-display';
import { CompanyRegistrationForm } from '@/components/core/company-registration-form';
import { CompanyDetailsCard } from '@/components/core/company-details-card';
import { SecretariaRegistrationForm } from '@/components/core/secretaria-registration-form';
import { CompanyLoginForm } from '@/components/core/company-login-form';
import { SecretariaLoginForm } from '@/components/core/secretaria-login-form';
import { UserRegistrationForm } from '@/components/core/usuaria-registration-form';
import { useAuth } from "@/contexts/AuthContext";
import { PublishJobForm } from '@/components/core/publish-job-form';

export default function SandboxPage() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div>
      <Header onLogout={() => handleLogout()} />
      
      {/* <SearchBar />
      <JobCard
        jobType="Tipo de vaga"
        title="Título da Vaga"
        location="Localização"
        modality="Modalidade"
        companyName="Empresa"
        postTime="atrás"
      />
      <JobCard
        jobType="Engenharia de Software"
        title="Desenvolvedor(a) Frontend Pleno"
        location="São Paulo, SP"
        modality="Híbrido"
        companyName="Tech Solutions"
        postTime="Há 2 dias"
        companyLogoUrl="https://github.com/shadcn.png"
      />

      <GuideCard 
        imageUrl="/icons/4040_placeholder.png"
        category="CARREIRA"
        title="Como montar o currículo perfeito"
        excerpt="Dicas de especialistas para se destacar no processo seletivo e conseguir a vaga dos seus sonhos."
        authorName="Jane Doe"
        authorTitle="Especialista em RH"
        authorImageUrl="https://github.com/shadcn.png"
      />
      */}

      {/*<ProfilePhotoCard />*/}
      {/*<CompanyDetailsCard />*/}

      {/*<UserDetailsCard />*/}

      {/*<CurriculumForm />*/}

      {/*<CurriculumDisplay />*/}

      {/*<CompanyRegistrationForm />*/}

      {/* <SecretariaRegistrationForm /> */}

      <CompanyLoginForm />  
      <SecretariaLoginForm />

      <UserRegistrationForm />


      <PublishJobForm />

    </div>
  );
}