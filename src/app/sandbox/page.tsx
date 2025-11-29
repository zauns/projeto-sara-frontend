"use client";

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
import { CandidateCard } from '@/components/core/candidate-card';
import { JobDetailsCard } from '@/components/core/job-details-card';

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

      <div className="p-8 space-y-4 max-w-2xl mx-auto">

        <CandidateCard
          // propriedades orbigatórias
          id="cand-001"
          name="Clara Menezes"
          role="Desenvolvedora Front-end Pleno"
          location="São Paulo, SP"
          onViewProfile={() => console.log("Usuário clicou em Ver Perfil")}

          // propriedas opocionais (dependendo da view do fluxo)
          matchPercentage={85}
          imageUrl="https://github.com/shadcn.png"
          status="interview"
          onApprove={() => console.log("Candidato APROVADO!")}
          onReject={() => console.log("Candidato REJEITADO!")}
        />

        <CandidateCard
          id="cand-002"
          name="Luana Guimarães"
          role="Analista de RH"
          location="Rio de Janeiro, RJ"
          matchPercentage={62}
          onViewProfile={() => console.log("Usuário clicou em Ver Perfil")}
        // Exemplo sem os botões de aprovar/rejeitar e sem foto
        />
        <div className="p-4 md:p-8 bg-gray-100 flex justify-center min-h-screen">
          <JobDetailsCard
            // Cabeçalho
            title="Assistente Administrativa e Financeira"
            companyName="Instituto Mulheres de Valor"
            companyLogoUrl="https://github.com/shadcn.png" // Placeholder
            location="Recife, PE"
            postedAt="Publicado hoje"

            // Tags
            jobType="Tempo Integral (CLT)"
            modality="Presencial"
            level="Júnior"

            // Descrição
            description={`Estamos em busca de uma profissional organizada e dedicada para integrar nosso time administrativo. 
    
    O Instituto Mulheres de Valor atua há 10 anos capacitando mulheres em situação de vulnerabilidade através da educação e do trabalho. Se você busca um ambiente acolhedor, com propósito social e oportunidade de aprendizado prático, essa vaga é para você.`}

            // Listas
            responsibilities={[
              "Realizar o atendimento telefônico e recepção de parceiros e alunas.",
              "Auxiliar no controle de fluxo de caixa diário e organização de notas fiscais.",
              "Gerenciar a agenda da diretoria e marcar reuniões de equipe.",
              "Apoiar na organização de eventos beneficentes e workshops do instituto.",
              "Manter o arquivo de documentos físicos e digitais organizado."
            ]}

            requirements={[
              "Ensino Médio Completo (Ensino Superior em andamento será um diferencial).",
              "Conhecimento básico no Pacote Office (Word, Excel) e Google Drive.",
              "Boa comunicação verbal e escrita.",
              "Proatividade e vontade de aprender.",
              "Identificação com causas sociais e apoio à comunidade."
            ]}


            isApplied={false} 

          />
        </div>
      </div>
    </div>
  );
}