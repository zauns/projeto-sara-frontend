"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea"; // Importante ter este componente
import { useAuth } from "@/contexts/AuthContext";

export interface EmpresaProfile {
  nome: string;
  email: string;
  telefone: string;
  endereco: string;
  cnpj: string;
  biografia: string;
  links: string;
}

export function EmpresaDetailsCard({ user }: { user?: EmpresaProfile | null }) {
  const { updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    endereco: "",
    biografia: "",
    links: ""
  });

  useEffect(() => {
    if (user) {
      setFormData({
        nome: user.nome || "",
        email: user.email || "",
        telefone: user.telefone || "",
        endereco: user.endereco || "",
        biografia: user.biografia || "",
        links: user.links || ""
      });
    }
  }, [user]);

  const handleSave = async () => {
    await updateUser(formData);
    setIsEditing(false);
  };

  return (
    <Card className="w-full bg-white shadow-md">
      <CardHeader>
        <CardTitle>Dados da Empresa</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
            <Label>CNPJ</Label>
            <Input value={user?.cnpj || ""} disabled className="bg-gray-100 cursor-not-allowed"/>
            <p className="text-xs text-muted-foreground">O CNPJ não pode ser alterado.</p>
        </div>

        <div className="space-y-2">
          <Label>Razão Social / Nome Fantasia</Label>
          <Input 
            value={formData.nome} 
            onChange={(e) => setFormData({...formData, nome: e.target.value})} 
            disabled={!isEditing} 
          />
        </div>

        <div className="space-y-2">
          <Label>Biografia / Sobre a Empresa</Label>
          <Textarea 
            className="min-h-[100px]"
            value={formData.biografia} 
            onChange={(e) => setFormData({...formData, biografia: e.target.value})} 
            disabled={!isEditing} 
          />
        </div>

        <div className="space-y-2">
          <Label>Links (Site, Redes Sociais)</Label>
          <Input 
            value={formData.links} 
            onChange={(e) => setFormData({...formData, links: e.target.value})} 
            disabled={!isEditing} 
            placeholder="https://..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="space-y-2">
                <Label>Email Comercial</Label>
                <Input value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} disabled={!isEditing} />
            </div>
            <div className="space-y-2">
                <Label>Telefone</Label>
                <Input value={formData.telefone} onChange={(e) => setFormData({...formData, telefone: e.target.value})} disabled={!isEditing} />
            </div>
        </div>
        <div className="space-y-2">
            <Label>Endereço</Label>
            <Input value={formData.endereco} onChange={(e) => setFormData({...formData, endereco: e.target.value})} disabled={!isEditing} />
        </div>

        <div className="pt-4">
          {isEditing ? (
             <Button className="w-full" onClick={handleSave}>Salvar Alterações</Button> 
          ) : (
             <Button variant="outline" className="w-full" onClick={() => setIsEditing(true)}>Editar Dados da Empresa</Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}