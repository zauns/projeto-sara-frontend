"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge"; // Sugestão para destacar o status
import { useAuth } from "@/contexts/AuthContext";
import { AdminProfile } from "@/services/userServices";


interface AdminDetailsCardProps {
  user?: AdminProfile | null;
}

export function AdminDetailsCard({ user }: AdminDetailsCardProps) {
  const { updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    endereco: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        nome: user.nome || "",
        email: user.email || "",
        telefone: user.telefone || "",
        endereco: user.endereco || "",
      });
    }
  }, [user]);

  const handleSave = async () => {
    try {
      setIsLoading(true);
      await updateUser(formData); // Envia o objeto conforme AdminProfile
      alert("Perfil de Admin atualizado!");
      setIsEditing(false);
    } catch (error) {
      console.error(error);
      alert("Erro ao atualizar.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full bg-white shadow-md">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Perfil do Administrador</CardTitle>
        {user?.isSuperAdmin && <Badge variant="destructive">Super Admin</Badge>}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Nome Completo</Label>
          <Input 
            value={formData.nome} 
            onChange={(e) => setFormData({...formData, nome: e.target.value})} 
            disabled={!isEditing} 
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
            <Label>Email</Label>
            <Input 
                value={formData.email} 
                onChange={(e) => setFormData({...formData, email: e.target.value})} 
                disabled={!isEditing} 
            />
            </div>
            <div className="space-y-2">
            <Label>Telefone</Label>
            <Input 
                value={formData.telefone} 
                onChange={(e) => setFormData({...formData, telefone: e.target.value})} 
                disabled={!isEditing} 
            />
            </div>
        </div>
        <div className="space-y-2">
          <Label>Endereço</Label>
          <Input 
            value={formData.endereco} 
            onChange={(e) => setFormData({...formData, endereco: e.target.value})} 
            disabled={!isEditing} 
          />
        </div>

        {/* Botões de Ação (Simplificados para brevidade) */}
        <div className="pt-4 flex gap-3">
          {isEditing ? (
            <>
              <Button onClick={handleSave} disabled={isLoading}>Salvar</Button>
              <Button variant="outline" onClick={() => setIsEditing(false)}>Cancelar</Button>
            </>
          ) : (
            <Button variant="outline" onClick={() => setIsEditing(true)}>Editar</Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}