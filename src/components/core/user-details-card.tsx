"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { UserProfile } from "@/services/userServices";


export function StandardUserDetailsCard({ user }: { user?: UserProfile | null }) {
  const { updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
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
    // Lógica de update simplificada
    await updateUser(formData);
    setIsEditing(false);
  };

  return (
    <Card className="w-full bg-white shadow-md">
      <CardHeader>
        <CardTitle>Meus Dados</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
             <div className="space-y-2">
                <Label>ID (Sistema)</Label>
                <Input value={user?.id || ""} disabled />
            </div>
        </div>

        <div className="space-y-2">
          <Label>Nome</Label>
          <Input 
            value={formData.nome} 
            onChange={(e) => setFormData({...formData, nome: e.target.value})} 
            disabled={!isEditing} 
          />
        </div>
        
        {/* Campos de contato */}
        <div className="space-y-2">
            <Label>Email</Label>
            <Input value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} disabled={!isEditing} />
        </div>
        <div className="space-y-2">
            <Label>Telefone</Label>
            <Input value={formData.telefone} onChange={(e) => setFormData({...formData, telefone: e.target.value})} disabled={!isEditing} />
        </div>
         <div className="space-y-2">
            <Label>Endereço</Label>
            <Input value={formData.endereco} onChange={(e) => setFormData({...formData, endereco: e.target.value})} disabled={!isEditing} />
        </div>

        <div className="pt-4 flex gap-3">
          {isEditing ? (
             <Button onClick={handleSave}>Salvar</Button> 
          ) : (
             <Button onClick={() => setIsEditing(true)}>Editar</Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}