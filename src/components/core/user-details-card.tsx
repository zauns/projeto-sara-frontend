"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ConfirmationDialog } from "./confirmation-dialogue";
import { UserProfile } from "@/services/userServices";
import { useAuth } from "@/contexts/AuthContext"; // Ajuste o caminho conforme sua estrutura

type UserDetailsCardProps = {
  user?: UserProfile | null;
};

export function UserDetailsCard({ user }: UserDetailsCardProps) {
  // Obtém a função updateUser do contexto
  const { updateUser } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    telefone: "",
    email: "",
    endereco: "",
  });

  // Sincroniza o formulário com a prop user
  useEffect(() => {
    if (user) {
      const nameParts = user.nome?.split(" ") || [];
      setFormData({
        firstName: nameParts[0] || "",
        lastName: nameParts.slice(1).join(" ") || "",
        telefone: user.telefone || "",
        email: user.email || "",
        endereco: user.endereco || "",
      });
    }
  }, [user]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    // Validação básica
    if (!formData.firstName.trim() || !formData.email.trim()) {
      alert("Nome e Email são obrigatórios.");
      return;
    }

    try {
      setIsLoading(true);

      // Prepara o objeto com os dados alterados
      const payload: Partial<UserProfile> = {
        nome: `${formData.firstName} ${formData.lastName}`.trim(),
        telefone: formData.telefone,
        email: formData.email,
        endereco: formData.endereco,
      };

      // CHAMA O CONTEXTO:
      // O updateUser do AuthContext detectará a role (Empresa/Secretaria)
      // e chamará o endpoint correto da API.
      await updateUser(payload);

      alert("Perfil atualizado com sucesso!");
      setIsEditing(false);
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      alert("Ocorreu um erro ao salvar as alterações.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      const nameParts = user.nome?.split(" ") || [];
      setFormData({
        firstName: nameParts[0] || "",
        lastName: nameParts.slice(1).join(" ") || "",
        telefone: user.telefone || "",
        email: user.email || "",
        endereco: user.endereco || "",
      });
    }
    setIsEditing(false);
  };

  return (
    <div className="p-4">
      <Card className="w-full bg-white shadow-md border-gray">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-800">
            Detalhes da Usuária
          </CardTitle>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">Nome</Label>
                <Input
                  id="firstName"
                  placeholder="Nome"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange("firstName", e.target.value)}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Sobrenome</Label>
                <Input
                  id="lastName"
                  placeholder="Sobrenome"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange("lastName", e.target.value)}
                  disabled={!isEditing}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Número para contato</Label>
              <Input
                id="phone"
                placeholder="Número para contato"
                value={formData.telefone}
                onChange={(e) => handleInputChange("telefone", e.target.value)}
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Endereço</Label>
              <Input
                id="address"
                placeholder="Endereço"
                value={formData.endereco}
                onChange={(e) => handleInputChange("endereco", e.target.value)}
                disabled={!isEditing}
              />
            </div>
          </form>

          <div className="space-y-3 pt-4 border-t border-gray-200">
            {isEditing ? (
              <div className="flex flex-col md:flex-row gap-3">
                <Button
                  onClick={handleSave}
                  disabled={isLoading}
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                >
                  {isLoading ? "Salvando..." : "Salvar Alterações"}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isLoading}
                  className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </Button>
              </div>
            ) : (
              <div className="flex flex-col md:flex-row gap-3">
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(true)}
                  className="w-full border-blue-400 text-blue-500 hover:bg-blue-50 hover:text-blue-600"
                >
                  Editar Perfil
                </Button>
              </div>
            )}

            {!isEditing && (
              <>
                <Button
                  variant="destructive"
                  className="w-full bg-red-500 hover:bg-red-600"
                >
                  Log Out
                </Button>
                <ConfirmationDialog
                  title="Apagar Conta"
                  description="Tem certeza que deseja apagar sua conta? Essa ação é irreversível!"
                  onConfirm={() => {
                    console.log("Lógica de apagar conta aqui");
                  }}
                  trigger={
                    <Button
                      variant="destructive"
                      className="w-full bg-red-500 hover:bg-red-600"
                    >
                      Apagar Conta
                    </Button>
                  }
                />
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}