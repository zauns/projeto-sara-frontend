import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "../ui/card";
import { useState } from "react";
import { CurriculumData } from "@/types/curriculum"; // Import do tipo compartilhado

interface CurriculumFormProps {
  // Props opcionais para inicialização
  fullName?: string;
  phoneNumber?: string;
  email?: string;
  objective?: string;
  experience?: string;
  education?: string;
  city?: string;
  skills?: string;
  onSave: (data: CurriculumData) => void;
  onCancel: () => void;
}

export function CurriculumForm(props: CurriculumFormProps) {
  // Garantir que o estado inicial tenha valores padrão (nunca undefined)
  const [formData, setFormData] = useState<CurriculumData>({
    fullName: props.fullName || "",
    phoneNumber: props.phoneNumber || "",
    email: props.email || "",
    objective: props.objective || "",
    experience: props.experience || "",
    education: props.education || "",
    city: props.city || "",
    skills: props.skills || "",
  });

  // Handler genérico para inputs
  const handleInputChange = (field: keyof CurriculumData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Handler para submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    props.onSave(formData); // Passa apenas os dados
  };

  return (
    <div className="p-4">
      <Card className="bg-white shadow-md border-gray-200">
        <form onSubmit={handleSubmit} className="w-full md:p-6 space-y-6">
          
          {/* Campo Nome completo */}
          <div className="space-y-2">
            <Label htmlFor="fullName">Nome completo</Label>
            <Input 
              id="fullName" 
              placeholder="Digite seu nome completo"
              value={formData.fullName}
              onChange={(e) => handleInputChange('fullName', e.target.value)}
            />
          </div>

          {/* Grid para Número e Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Número</Label>
              <Input 
                id="phoneNumber" 
                placeholder="(00) 00000-0000"
                value={formData.phoneNumber}
                onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="seu.email@exemplo.com"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
              />
            </div>
          </div>

          {/* Campo Objetivo Profissional */}
          <div className="space-y-2">
            <Label htmlFor="objective">Objetivo Profissional</Label>
            <Textarea 
              id="objective" 
              placeholder="Descreva seu objetivo profissional"
              value={formData.objective}
              onChange={(e) => handleInputChange('objective', e.target.value)}
              className="min-h-[100px]"
            />
          </div>

          {/* Campo Experiência Profissional */}
          <div className="space-y-2">
            <Label htmlFor="experience">Experiência Profissional</Label>
            <Textarea 
              id="experience" 
              placeholder="Descreva sua experiência profissional"
              value={formData.experience}
              onChange={(e) => handleInputChange('experience', e.target.value)}
              className="min-h-[150px]"
            />
          </div>

          {/* Campo Formação Acadêmica */}
          <div className="space-y-2">
            <Label htmlFor="education">Formação Acadêmica</Label>
            <Textarea 
              id="education" 
              placeholder="Descreva sua formação acadêmica"
              value={formData.education}
              onChange={(e) => handleInputChange('education', e.target.value)}
              className="min-h-[100px]"
            />
          </div>

          {/* Campo Habilidades */}
          <div className="space-y-2">
            <Label htmlFor="skills">Habilidades e Competências</Label>
            <Textarea 
                id="skills" 
                placeholder="Liste suas habilidades"
                value={formData.skills}
                onChange={(e) => handleInputChange('skills', e.target.value)}
                className="min-h-[150px]"
            />
          </div>

          {/* Campo Cidade */}
          <div className="space-y-2">
            <Label htmlFor="city">Cidade</Label>
            <Select 
              value={formData.city} 
              onValueChange={(value) => handleInputChange('city', value)}
            >
              <SelectTrigger id="city">
                <SelectValue placeholder="Selecione sua cidade" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="recife">Recife</SelectItem>
                <SelectItem value="olinda">Olinda</SelectItem>
                <SelectItem value="jaboatao">Jaboatão dos Guararapes</SelectItem>
                <SelectItem value="caruaru">Caruaru</SelectItem>
                <SelectItem value="outra">Outra</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Botões de Ação */}
          <div className="pt-4 space-y-3">
            <Button 
              type="submit"
              variant="destructive" 
              className="w-full bg-red-400 hover:bg-red-500"
            >
              Salvar alterações
            </Button>
            <Button 
              type="button"
              variant="outline" 
              className="w-full border-gray-400 text-gray-700 hover:bg-gray-50"
              onClick={props.onCancel}
            >
              Cancelar
            </Button>
          </div>

        </form>
      </Card>
    </div>
  );
}