"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { SecretariaProfile } from "@/services/userServices";

export function SecretariaDetailsCard({ user }: { user?: SecretariaProfile | null }) {
  const { updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    endereco: "",
    municipio: "",
    senha: ""
  });

  useEffect(() => {
    if (user) {
      setFormData({
        nome: user.nome || "",
        email: user.email || "",
        telefone: user.telefone || "",
        endereco: user.endereco || "",
        municipio: user.municipio || "",
        senha: user.senha || "a"
      });
    }
  }, [user]);

  const handleSave = async () => {
    await updateUser(formData);
    setIsEditing(false);
  };

  return (
    <Card className="w-full bg-white shadow-md border-l-4 border-l-blue-600">
      <CardHeader>
        <CardTitle>Dados da Secretaria</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Nome do Representante / Secretaria</Label>
          <Input 
            value={formData.nome} 
            onChange={(e) => setFormData({...formData, nome: e.target.value})} 
            disabled={!isEditing} 
          />
        </div>

        <div className="space-y-2">
            <Label>Município de Atuação</Label>
            {/* O Município pode ser editável ou fixo dependendo da regra de negócio. Deixei editável aqui. */}
            <Input 
                value={formData.municipio} 
                onChange={(e) => setFormData({...formData, municipio: e.target.value})} 
                disabled={!isEditing} 
                placeholder="Ex: São Paulo"
            />
        </div>

        <div className="space-y-2">
            <Label>Email Oficial</Label>
            <Input value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} disabled={!isEditing} />
        </div>
        
        <div className="space-y-2">
            <Label>Telefone</Label>
            <Input value={formData.telefone} onChange={(e) => setFormData({...formData, telefone: e.target.value})} disabled={!isEditing} />
        </div>
        
        <div className="space-y-2">
            <Label>Endereço da Sede</Label>
            <Input value={formData.endereco} onChange={(e) => setFormData({...formData, endereco: e.target.value})} disabled={!isEditing} />
        </div>

        <div className="pt-4 flex justify-end gap-3">
          {isEditing ? (
             <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">Confirmar</Button> 
          ) : (
             <Button onClick={() => setIsEditing(true)}>Alterar Dados</Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}