"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { SecretariaProfile } from "@/services/userServices";

const secretariaSchema = z.object({
  nome: z.string().min(3, "Nome obrigatório"),
  municipio: z.string().min(2, "Município obrigatório"),
  email: z.string().email("Email inválido"),
  telefone: z
    .string()
    .regex(/^\(\d{2}\) \d{5}-\d{4}$/, "Formato inválido: (99) 99999-9999"),
  endereco: z.string().min(5, "Endereço muito curto"),
});

type SecretariaFormValues = z.infer<typeof secretariaSchema>;

export function SecretariaDetailsCard({ user }: { user?: SecretariaProfile | null }) {
  const { updateUser, deleteAccount } = useAuth(); // Import deleteAccount
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SecretariaFormValues>({
    resolver: zodResolver(secretariaSchema),
    mode: "onBlur",
  });

  useEffect(() => {
    if (user) {
      reset({
        nome: user.nome || "",
        municipio: user.municipio || "",
        email: user.email || "",
        telefone: user.telefone || "",
        endereco: user.endereco || "",
      });
    }
  }, [user, reset]);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let v = e.target.value.replace(/\D/g, "");
    v = v.replace(/^(\d{2})(\d)/g, "($1) $2");
    v = v.replace(/(\d)(\d{4})$/, "$1-$2");
    setValue("telefone", v, { shouldValidate: true });
  };

  const onSubmit = async (data: SecretariaFormValues) => {
    await updateUser(data);
    setIsEditing(false);
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Atenção: Você está prestes a excluir o perfil desta Secretaria. Isso removerá o acesso ao sistema. Deseja continuar?"
    );

    if (confirmed) {
      try {
        setIsDeleting(true);
        await deleteAccount();
      } catch (error) {
        console.error("Erro ao deletar conta", error);
        alert("Erro ao excluir conta. Tente novamente.");
        setIsDeleting(false);
      }
    }
  };

  return (
    <Card className="w-full bg-white shadow-md border-l-4 border-l-blue-600">
      <CardHeader>
        <CardTitle>Dados da Secretaria</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Nome do Representante / Secretaria</Label>
              <Input
                disabled={!isEditing}
                {...register("nome")}
                className={errors.nome ? "border-red-500" : ""}
              />
              {errors.nome && (
                <p className="text-sm text-red-500">{errors.nome.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Município de Atuação</Label>
              <Input
                placeholder="Ex: São Paulo"
                disabled={!isEditing}
                {...register("municipio")}
                className={errors.municipio ? "border-red-500" : ""}
              />
              {errors.municipio && (
                <p className="text-sm text-red-500">
                  {errors.municipio.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Email Oficial</Label>
              <Input
                disabled={!isEditing}
                {...register("email")}
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Telefone</Label>
              <Input
                disabled={!isEditing}
                {...register("telefone")}
                onChange={handlePhoneChange}
                maxLength={15}
                className={errors.telefone ? "border-red-500" : ""}
              />
              {errors.telefone && (
                <p className="text-sm text-red-500">{errors.telefone.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Endereço da Sede</Label>
              <Input
                disabled={!isEditing}
                {...register("endereco")}
                className={errors.endereco ? "border-red-500" : ""}
              />
              {errors.endereco && (
                <p className="text-sm text-red-500">{errors.endereco.message}</p>
              )}
            </div>
          </div>

          <div className="pt-6 flex flex-col md:flex-row gap-3 justify-between items-center">
             {/* Zona de Perigo */}
            {!isEditing && (
                <Button 
                    type="button" 
                    variant="destructive" 
                    onClick={handleDelete}
                    disabled={isDeleting}
                >
                    {isDeleting ? "Removendo..." : "Remover Secretaria"}
                </Button>
            )}

            <div className="flex gap-3 w-full md:w-auto justify-end">
                {isEditing ? (
                <>
                    <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                        setIsEditing(false);
                        reset();
                    }}
                    >
                    Cancelar
                    </Button>
                    <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-blue-600 hover:bg-blue-700"
                    >
                    {isSubmitting ? "Salvando..." : "Confirmar"}
                    </Button>
                </>
                ) : (
                <Button type="button" onClick={() => setIsEditing(true)}>
                    Alterar Dados
                </Button>
                )}
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}