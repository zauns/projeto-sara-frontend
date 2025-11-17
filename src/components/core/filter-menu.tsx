"use client";

import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

type FilterCategory = {
  title: string;
  options: string[];
};

const filterData: FilterCategory[] = [
  {
    title: "Modalidade",
    options: ["Presencial", "Híbrido", "Remoto"],
  },
  {
    title: "Tipo",
    options: ["PJ", "CLT", "Estágio", "Aprendiz"],
  },
  {
    title: "Localização",
    options: ["Sirinhaém"],
  },
  {
    title: "Área de Atuação",
    options: ["Serviços", "Tecnologia", "Direito", "Medicina"],
  },
];

type FilterMenuProps = {
  selectedFilters: string[];
  onFilterChange: (filter: string, isSelected: boolean) => void;
};

export function FilterMenu({
  selectedFilters,
  onFilterChange,
}: FilterMenuProps) {
  return (
    <div className="absolute top-full left-0 right-0 mt-2 bg-gray-100 text-gray-800 rounded-lg shadow-lg p-6 z-10">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {filterData.map((category) => (
          <div key={category.title}>
            <h3 className="font-bold text-lg mb-3 border-b border-gray-300 pb-2">
              {category.title}
            </h3>
            <div className="space-y-2">
              {category.options.map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <Checkbox
                    id={option}
                    checked={selectedFilters.includes(option)}
                    onCheckedChange={(checked) =>
                      onFilterChange(option, !!checked)
                    }
                    className="border-gray-400"
                  />
                  <Label htmlFor={option} className="text-sm font-medium">
                    {option}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
