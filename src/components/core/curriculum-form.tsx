import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea"; // Novo componente
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; // Novo componente
import { Card, CardContent } from "../ui/card";

// props/dados do formulário
type CurriculumFormProps = {
  fullName?: string;
  phoneNumber?: string;
  email?: string;
  objective?: string;
  experience?: string;
  education?: string;
  city?: string;
  skills?: string;
};

// Formulario do curriculo
export function CurriculumForm(props: CurriculumFormProps) {
  return (
    <div className="p-4">
    <Card className="bg-white shadow-md border-gray-200">
    <form className="w-full md:p-6 space-y-6">
      
        {/* Campo Nome completo */}
        <div className="space-y-2">
            <Label htmlFor="fullName">Nome completo</Label>
            <Input id="fullName" placeholder="Placeholder" defaultValue={props.fullName} />
        </div>

        {/* Grid para Número e Email lado a lado em telas maiores */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label htmlFor="phoneNumber">Número</Label>
                <Input id="phoneNumber" placeholder="Placeholder" defaultValue={props.phoneNumber} />
            </div>
            <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="Placeholder" defaultValue={props.email} />
            </div>
        </div>

        {/* Campo Objetivo Profissional (Textarea) */}
        <div className="space-y-2">
            <Label htmlFor="objective">Objetivo Profissional</Label>
            <Textarea 
                id="objective" 
                placeholder="Placeholder" 
                defaultValue={props.objective} 
                className="min-h-[100px]" // Define uma altura mínima
            />
        </div>

        {/* Campo Experiência Profissional (Textarea) */}
        <div className="space-y-2">
            <Label htmlFor="experience">Experiência Profissional</Label>
            <Textarea 
                id="experience" 
                placeholder="Placeholder" 
                defaultValue={props.experience}
                className="min-h-[150px]"
            />
        </div>

        {/* Campo Formação Acadêmica (Textarea) */}
        <div className="space-y-2">
            <Label htmlFor="education">Formação Acadêmica</Label>
            <Textarea 
            id="education" 
            placeholder="Placeholder" 
            defaultValue={props.education}
            className="min-h-[100px]"
            />
        </div>

        {/* Campo Habilidades */}
        <div className="space-y-2">
            <Label htmlFor="education">Habilidades e Competências</Label>
            <Textarea 
                id="skills" 
                placeholder="Placeholder" 
                defaultValue={props.skills}
                className="min-h-[150px]"
            />
        </div>

        {/* Campo Cidade (Select) */}
        <div className="space-y-2">
          <Label htmlFor="city">Cidade</Label>
          <Select defaultValue={props.city}>
            <SelectTrigger id="city">
              <SelectValue placeholder="Selecione sua cidade" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              {/* Você pode preencher isso com dados reais mais tarde */}
              <SelectItem value="recife">Recife</SelectItem>
              <SelectItem value="olinda">Olinda</SelectItem>
              <SelectItem value="jaboatao">Jaboatão dos Guararapes</SelectItem>
              <SelectItem value="caruaru">Caruaru</SelectItem>
              <SelectItem value="outra">Outra</SelectItem>
            </SelectContent>
          </Select>
        </div>


        
      
        {/* Botão de Salvar */}
        <div className="pt-4">
            <Button 
                type="submit" // Define o tipo como "submit" para o formulário
                variant="destructive" // Usa a cor vermelha do tema
                className="w-full bg-red-400 hover:bg-red-500"
            >
                Salvar alterações
            </Button>
            </div>

    </form>
    </Card>
    </div>

  );
}