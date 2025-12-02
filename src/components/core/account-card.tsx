import React from "react";
import { UserProfileGeneric } from "../../services/userServices"; // Ajuste o import conforme sua estrutura

interface AccountCardProps {
  profile: UserProfileGeneric;
  roleLabel: string;
}

export const AccountCard: React.FC<AccountCardProps> = ({ profile, roleLabel }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-[#F55F58] hover:shadow-lg transition-shadow duration-200">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-bold text-gray-800 text-lg truncate" title={profile.nome}>
          {profile.nome}
        </h3>
        <span className="text-xs font-semibold bg-gray-100 text-gray-600 py-1 px-2 rounded">
          {roleLabel}
        </span>
      </div>
      
      <div className="text-sm text-gray-600 space-y-1">
        <p className="flex items-center gap-2">
          <span className="font-semibold w-16">Email:</span> 
          <span className="truncate" title={profile.email}>{profile.email}</span>
        </p>
        <p className="flex items-center gap-2">
          <span className="font-semibold w-16">Tel:</span> 
          <span>{profile.telefone || "N/A"}</span>
        </p>
        <p className="flex items-center gap-2">
          <span className="font-semibold w-16">Endereço:</span> 
          <span className="truncate" title={profile.endereco}>{profile.endereco || "N/A"}</span>
        </p>
      </div>
    </div>
  );
};