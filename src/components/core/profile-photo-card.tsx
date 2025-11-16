import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";

type ProfilePhotoCardProps = {
    profileImageUrl?: string;
}

export function ProfilePhotoCard({ profileImageUrl }: ProfilePhotoCardProps) {
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
                        >
                            Enviar Foto
                        </Button>
                        <Button 
                            variant="link" 
                            className="text-sm text-gray-500 hover:text-red-600"
                        >
                            remover
                        </Button>
                    </div>

                </div>
            </CardContent>
        </Card>
        </div>
    );
}