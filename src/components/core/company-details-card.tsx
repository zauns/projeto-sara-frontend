"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Globe, Phone, Mail, Link, MapPin, Briefcase } from "lucide-react";


// Props que o componente aceitará para exibir os dados
type CompanyDetailsCardProps = {
    companyName?: string;
    cnpj?: string;
    industry?: string;
    address?: string;
    companyEmail?: string;
    companyPhone?: string;
    socialLinks?: string[];
    biographyContent?: string; 
};

// Componente auxiliar para exibir pares de informação (Chave: Valor)
const DisplayItem = ({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) => (
    <div className="flex items-center gap-2 text-gray-700">
        {icon}
        <span className="font-medium w-28 flex-shrink-0 text-black">{label}:</span>
        <span className="break-words">{value}</span>
    </div>
);

export function CompanyDetailsCard(props: CompanyDetailsCardProps) {

    // placeholders
    const {
        companyName = "Nome Fantasia (Não Informado)",
        cnpj = "00.000.000/0001-XX",
        industry = "Ramo de Atuação (N/A)",
        address = "Endereço não cadastrado",
        companyEmail = "contato@empresa.com.br",
        companyPhone = "(00) 0000-0000",
        socialLinks = [],
        biographyContent = "Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos."

    } = props;


    return (
        <div className="p-4">
            <Card className="w-full bg-white shadow-md border-gray-200">
                <CardHeader className="flex flex-row items-center justify-between p-4 border-b">
                    <CardTitle className="text-xl font-bold text-gray-900">
                        Detalhes da Empresa
                    </CardTitle>
                    <Button
                        variant="outline"
                        className="border-indigo-600 text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700"
                    >
                        Editar Dados
                    </Button>
                </CardHeader>

                <CardContent className="p-6 space-y-6">

                    {/* Informação da empresa */}
                    <div className="space-y-3">
                        <h3 className="text-lg font-semibold text-gray-800">Informações Básicas</h3>
                        <DisplayItem label="Nome Fantasia" value={companyName} icon={<Globe className="h-4 w-4" />} />
                        <DisplayItem label="CNPJ" value={cnpj} icon={<span className="h-4 w-4 flex items-center justify-center font-bold text-xs">C</span>} />
                        <DisplayItem label="Ramo de Atuação" value={industry} icon={<Briefcase className="h-4 w-4" />} />
                        <DisplayItem label="Endereço" value={address} icon={<MapPin className="h-4 w-4" />} />
                    </div>

                    {/* Divisor */}
                    <hr className="my-4 border-t border-gray-200" />
                    
                    {/* Bio */}
                    <div className="space-y-3">
                        <h3 className="text-lg font-semibold text-gray-900">Nossa Biografia e Compromisso</h3>
                        <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                            {biographyContent}
                        </p>
                    </div>

                    {/* Divisor 2 */}
                    <hr className="my-4 border-t border-gray-200" />

                    {/* Contatos e Links */}
                    <div className="space-y-3">
                        <h3 className="text-lg font-semibold text-gray-800">Contatos Corporativos</h3>
                        <DisplayItem label="Email" value={companyEmail} icon={<Mail className="h-4 w-4" />} />
                        <DisplayItem label="Telefone" value={companyPhone} icon={<Phone className="h-4 w-4" />} />

                        {socialLinks.length > 0 && (
                            <div className="pt-2">
                                <h4 className="text-sm font-medium text-gray-600 mb-1">Links Externos:</h4>
                                <div className="flex flex-wrap gap-x-4 gap-y-1">
                                    {socialLinks.map((link, index) => (
                                        <a key={index} href={link} target="_blank" className="text-indigo-600 hover:text-indigo-800 text-sm flex items-center gap-1 transition-colors">
                                            <Link className="h-4 w-4" />
                                            {link.replace(/https?:\/\//, '').split('/')[0]}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}