"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { EmpresaProfile } from "@/services/userServices";

const empresaSchema = z.object({
  nome: z.string().min(3, "Razão social obrigatória"),
  email: z.string().email("Email inválido"),
  telefone: z
    .string()
    .regex(/^\(\d{2}\) \d{5}-\d{4}$/, "Formato inválido: (99) 99999-9999"),
  endereco: z.string().min(5, "Endereço obrigatório"),
  biografia: z.string().min(10, "A biografia deve ter ao menos 10 caracteres"),
  links: z.string().optional(), // Links são opcionais
});

type EmpresaFormValues = z.infer<typeof empresaSchema>;

export function EmpresaDetailsCard({ user }: { user?: EmpresaProfile | null }) {
  const { updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EmpresaFormValues>({
    resolver: zodResolver(empresaSchema),
    mode: "onBlur",
  });

  useEffect(() => {
    if (user) {
      reset({
        nome: user.nome || "",
        email: user.email || "",
        telefone: user.telefone || "",
        endereco: user.endereco || "",
        biografia: user.biografia || "",
        links: user.links || "",
      });
    }
  }, [user, reset]);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let v = e.target.value.replace(/\D/g, "");
    v = v.replace(/^(\d{2})(\d)/g, "($1) $2");
    v = v.replace(/(\d)(\d{4})$/, "$1-$2");
    setValue("telefone", v, { shouldValidate: true });
  };

  const onSubmit = async (data: EmpresaFormValues) => {
    await updateUser(data);
    setIsEditing(false);
  };

  return (
    <Card className="w-full bg-white shadow-md">
      <CardHeader>
        <CardTitle>Dados da Empresa</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            {/* CNPJ (Read Only) */}
            <div className="space-y-2">
              <Label>CNPJ</Label>
              <Input
                value={user?.cnpj || ""}
                disabled
                className="bg-gray-100 cursor-not-allowed"
              />
              <p className="text-xs text-muted-foreground">
                O CNPJ não pode ser alterado.
              </p>
            </div>

            <div className="space-y-2">
              <Label>Razão Social / Nome Fantasia</Label>
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
              <Label>Biografia / Sobre a Empresa</Label>
              <Textarea
                className={`min-h-[100px] ${
                  errors.biografia ? "border-red-500" : ""
                }`}
                disabled={!isEditing}
                {...register("biografia")}
              />
              {errors.biografia && (
                <p className="text-sm text-red-500">
                  {errors.biografia.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Links (Site, Redes Sociais)</Label>
              <Input
                placeholder="https://..."
                disabled={!isEditing}
                {...register("links")}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Email Comercial</Label>
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
                  <p className="text-sm text-red-500">
                    {errors.telefone.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Endereço</Label>
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

          <div className="pt-4 flex gap-3">
            {isEditing ? (
              <>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setIsEditing(false);
                    reset();
                  }}
                >
                  Cancelar
                </Button>
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Salvando..." : "Salvar Alterações"}
                </Button>
              </>
            ) : (
              <Button
                type="button"
                className="w-full"
                onClick={() => setIsEditing(true)}
              >
                Editar Dados da Empresa
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}