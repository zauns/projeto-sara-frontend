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
import { UserProfile } from "@/services/userServices";

// 1. Schema de Validação
const userSchema = z.object({
  name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
  email: z.string().email("Email inválido"),
  telefone: z
    .string()
    .regex(/^\(\d{2}\) \d{5}-\d{4}$/, "Formato inválido: (99) 99999-9999"),
  endereco: z.string().min(5, "Endereço muito curto"),
});

type UserFormValues = z.infer<typeof userSchema>;

export function StandardUserDetailsCard({ user }: { user?: UserProfile | null }) {
  const { updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  // 2. React Hook Form Setup
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    mode: "onBlur",
  });

  // Atualiza o formulário quando os dados do usuário chegam
  useEffect(() => {
    if (user) {
      reset({
        name: user.name || "",
        email: user.email || "",
        telefone: user.telefone || "",
        endereco: user.endereco || "",
      });
    }
  }, [user, reset]);

  // 3. Máscara de Telefone
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let v = e.target.value.replace(/\D/g, "");
    v = v.replace(/^(\d{2})(\d)/g, "($1) $2");
    v = v.replace(/(\d)(\d{4})$/, "$1-$2");
    setValue("telefone", v, { shouldValidate: true });
  };

  const onSubmit = async (data: UserFormValues) => {
    try {
      await updateUser(data);
      setIsEditing(false);
    } catch (error) {
      console.error("Erro ao atualizar perfil", error);
    }
  };

  return (
    <Card className="w-full bg-white shadow-md">
      <CardHeader>
        <CardTitle>Meus Dados</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            {/* Nome */}
            <div className="space-y-2">
              <Label htmlFor="nome">Nome</Label>
              <Input
                id="nome"
                disabled={!isEditing}
                {...register("name")}
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                disabled={!isEditing}
                {...register("email")}
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            {/* Telefone */}
            <div className="space-y-2">
              <Label htmlFor="telefone">Telefone</Label>
              <Input
                id="telefone"
                disabled={!isEditing}
                placeholder="(00) 00000-0000"
                {...register("telefone")}
                onChange={(e) => {
                  handlePhoneChange(e);
                }}
                maxLength={15}
                className={errors.telefone ? "border-red-500" : ""}
              />
              {errors.telefone && (
                <p className="text-sm text-red-500">{errors.telefone.message}</p>
              )}
            </div>

            {/* Endereço */}
            <div className="space-y-2">
              <Label htmlFor="endereco">Endereço</Label>
              <Input
                id="endereco"
                disabled={!isEditing}
                {...register("endereco")}
                className={errors.endereco ? "border-red-500" : ""}
              />
              {errors.endereco && (
                <p className="text-sm text-red-500">{errors.endereco.message}</p>
              )}
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            {isEditing ? (
              <>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false);
                    reset(); // Restaura dados originais ao cancelar
                  }}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Salvando..." : "Salvar"}
                </Button>
              </>
            ) : (
              <Button type="button" onClick={() => setIsEditing(true)}>
                Editar
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}