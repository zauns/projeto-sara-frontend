"use client";

import React, { useState } from "react";

interface CategorySelectorProps {
  onCategorySelect: (category: string) => void;
  initialSelectedCategory?: string;
}

const VagasCategorySelector: React.FC<CategorySelectorProps> = ({
  onCategorySelect,
  initialSelectedCategory = "Vagas",
}) => {
  const [selectedCategory, setSelectedCategory] = useState(
    initialSelectedCategory,
  );

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    onCategorySelect(category);
  };

  const categories = ["Vagas", "Candidaturas", "Vagas Salvas"];

  return (
    // MUDANÇA 1: Trocado 'items-center' por 'items-stretch'
    // Isso garante que todos os filhos (botões e separadores)
    // se estiquem para preencher a altura total do container.
    <div className="bg-white flex items-stretch border-b border-gray-300">
      {categories.map((category) => (
        <React.Fragment key={category}>
          <button
            onClick={() => handleCategoryClick(category)}
            // MUDANÇA 2: Classes de responsividade adicionadas
            // - Padrão (mobile): 'flex-1' faz os botões ocuparem
            //   espaço igual, e 'text-center' centraliza o texto.
            // - 'md:' (desktop): 'md:flex-none' remove o 'flex-1'
            //   para que se agrupem, e 'md:text-left' alinha o texto.
            className={`py-3 px-4 text-gray-700 font-medium flex-1 text-center md:flex-none md:text-left ${
              selectedCategory === category ? "border-b-2 border-[#F55F58]" : ""
            }`}
          >
            {category}
          </button>
        </React.Fragment>
      ))}
    </div>
  );
};

export default VagasCategorySelector;
