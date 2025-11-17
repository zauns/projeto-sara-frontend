import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { User, Upload } from "lucide-react";
import { useRef, useState } from "react";

interface ProfilePhotoCardProps {
  profileImageUrl?: string;
  onPhotoChange: (url: string) => void; // Callback para quando a foto mudar
}

export function ProfilePhotoCard({ profileImageUrl, onPhotoChange }: ProfilePhotoCardProps) {
  // Ref para o input de arquivo escondido
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handler para clicar no botão "Enviar Foto"
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  // Handler para quando um arquivo é selecionado
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        onPhotoChange(result); // Chama o callback do componente pai
      };
      reader.readAsDataURL(file);
    }
  };

  // Handler para remover a foto
  const handleRemovePhoto = () => {
    onPhotoChange(""); // Envia string vazia para limpar
  };

  return (
    <div className="p-3">
      <Card className="w-full bg-white shadow-md border-gray-200">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-800">
            Foto de Perfil
          </CardTitle>
        </CardHeader>

        <CardContent className="p-6">
          <div className="flex flex-col items-center gap-6 md:flex-row">
            
            {/* Avatar do Usuário */}
            <Avatar className="h-24 w-24 border-2 border-gray-300">
              <AvatarImage src={profileImageUrl} alt="Foto do perfil" />
              <AvatarFallback className="bg-gray-100">
                <User className="h-10 w-10 text-gray-500" />
              </AvatarFallback>
            </Avatar>

            {/* Botões de Ação */}
            <div className="flex flex-col items-center gap-2 md:items-start">
              <Button 
                variant="outline" 
                className="border-indigo-400 text-indigo-800 hover:bg-indigo-400 hover:text-indigo-100 bg-white"
                onClick={handleUploadClick}
              >
                <Upload className="w-4 h-4 mr-2" />
                Enviar Foto
              </Button>
              
              {profileImageUrl && (
                <Button 
                  variant="link" 
                  className="text-sm text-gray-500 hover:text-red-600"
                  onClick={handleRemovePhoto}
                >
                  Remover
                </Button>
              )}
            </div>

            {/* Input de arquivo escondido */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileSelect}
            />

          </div>
        </CardContent>
      </Card>
    </div>
  );
}