'use client';

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
import { CurriculumData } from "@/types/curriculum"; 
import jsPDF from "jspdf"; // Biblioteca de geração de PDF
import { curriculumService } from "@/services/curriculumServices"; // Importação do novo serviço

interface CurriculumFormProps {
  fullName?: string;
  phoneNumber?: string;
  email?: string;
  objective?: string;
  experience?: string;
  education?: string;
  city?: string;
  skills?: string;
  onSave?: (data: CurriculumData) => void;
  onCancel: () => void;
}

export function CurriculumForm(props: CurriculumFormProps) {
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

  // Estado para controlar o loading do botão
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: keyof CurriculumData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Função auxiliar para gerar o PDF (Client-Side)
  const generatePDFBlob = (data: CurriculumData): Blob => {
    const doc = new jsPDF();
    const margin = 20;
    let cursorY = 20;

    // Cabeçalho
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text(data.fullName, margin, cursorY);
    
    cursorY += 10;
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`${data.email} | ${data.phoneNumber} | ${data.city}`, margin, cursorY);

    cursorY += 10;
    doc.setLineWidth(0.5);
    doc.line(margin, cursorY, 190, cursorY);
    cursorY += 10;

    // Função auxiliar para adicionar seções
    const addSection = (title: string, content: string) => {
      if (!content) return;
      
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text(title, margin, cursorY);
      cursorY += 7;

      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      
      // Quebra o texto automaticamente para não estourar a margem
      const splitText = doc.splitTextToSize(content, 170);
      doc.text(splitText, margin, cursorY);
      
      // Atualiza a posição do cursor baseado no tamanho do texto inserido
      cursorY += (splitText.length * 6) + 10; 
    };

    addSection("Objetivo Profissional", data.objective);
    addSection("Experiência Profissional", data.experience);
    addSection("Formação Acadêmica", data.education);
    addSection("Habilidades", data.skills);

    return doc.output('blob');
  };

  // Handler de envio atualizado
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação básica
    if (!formData.fullName || !formData.email) {
      alert("Por favor, preencha pelo menos Nome e Email.");
      return;
    }

    setIsLoading(true);

    try {
      // 1. Gerar o arquivo PDF em memória
      const pdfBlob = generatePDFBlob(formData);

      // 2. Usar o serviço para enviar ao Backend
      await curriculumService.uploadCurriculum(pdfBlob, formData.fullName);

      alert("Currículo gerado e enviado com sucesso!");

      // 3. Executar callback do pai (se houver) para atualizar UI ou redirecionar
      if (props.onSave) {
        props.onSave(formData);
      }

    } catch (error) {
      console.error(error);
      alert("Erro ao enviar o currículo. Verifique sua conexão.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4">
      <Card className="bg-white shadow-md border-gray-200">
        <form onSubmit={handleSubmit} className="w-full md:p-6 space-y-6">
          
          <div className="space-y-2">
            <Label htmlFor="fullName">Nome completo</Label>
            <Input 
              id="fullName" 
              placeholder="Digite seu nome completo"
              value={formData.fullName}
              onChange={(e) => handleInputChange('fullName', e.target.value)}
            />
          </div>

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
                <SelectItem value="Recife">Recife</SelectItem>
                <SelectItem value="Olinda">Olinda</SelectItem>
                <SelectItem value="Jaboatao">Jaboatão dos Guararapes</SelectItem>
                <SelectItem value="Caruaru">Caruaru</SelectItem>
                <SelectItem value="Outra">Outra</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="pt-4 space-y-3">
            <Button 
              type="submit"
              variant="destructive" 
              className="w-full bg-red-400 hover:bg-red-500"
              disabled={isLoading}
            >
              {isLoading ? "Enviando..." : "Salvar Currículo"}
            </Button>
            <Button 
              type="button"
              variant="outline" 
              className="w-full border-gray-400 text-gray-700 hover:bg-gray-50"
              onClick={props.onCancel}
              disabled={isLoading}
            >
              Cancelar
            </Button>
          </div>

        </form>
      </Card>
    </div>
  );
}