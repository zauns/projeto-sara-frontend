// src/lib/mock-jobs.ts
export interface Job {
  id: string;
  title: string;
  location: string;
  postedDays: number;
  company: string;
  tags: string[];
  description: string;
  benefits: {
    icon: 'calendar' | 'luggage' | 'activity' | 'car';
    text: string;
  }[];
}

export const mockJobs: Job[] = [
  {
    id: '1',
    title: 'Desenvolvedor Full Stack Pleno',
    location: 'São Paulo/SP',
    postedDays: 3,
    company: 'Tech Solutions',
    tags: ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'AWS', 'Remoto', 'CLT', 'Pleno'],
    description: `Buscamos um desenvolvedor Full Stack para integrar nossa equipe de produto.

**Responsabilidades:**
- Desenvolver novas features para a plataforma
- Manter e evoluir aplicações existentes
- Participar de code reviews e planejamentos

**Requisitos:**
- 3+ anos de experiência com React
- Conhecimento em Node.js
- Inglês intermediário

Se você é apaixonado por tecnologia e quer fazer a diferença, candidate-se!`,
    benefits: [
      { icon: 'calendar', text: 'Flexibilidade de horário com regime híbrido' },
      { icon: 'luggage', text: 'Vale-refeição e vale-alimentação' },
      { icon: 'activity', text: 'Gympass e programa de saúde mental' },
      { icon: 'car', text: 'Auxílio mobilidade e estacionamento' },
    ],
  },
];