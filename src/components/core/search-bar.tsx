"use client";

import { Input } from "@/components/ui/input";
import { Search, Filter } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FilterMenu } from "./filter-menu";
import { FilterTag } from "./filter-tag";

export function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Estado local
  const [searchTerm, setSearchTerm] = useState("");
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  // 1. Sincroniza o SearchBar com a URL ao carregar a página
  useEffect(() => {
    const queryTerm = searchParams.get("q");
    const queryTags = searchParams.get("tags");

    if (queryTerm) {
      setSearchTerm(queryTerm);
    }
    
    if (queryTags) {
      setSelectedFilters(queryTags.split(","));
    } else {
      setSelectedFilters([]);
    }
  }, [searchParams]);

  // 2. Função Central que atualiza a URL e navega
  const updateURL = (term: string, filters: string[]) => {
    const params = new URLSearchParams();

    // Mantém o termo se existir
    if (term.trim()) {
      params.set("q", term.trim());
    }

    // Atualiza as tags
    if (filters.length > 0) {
      params.set("tags", filters.join(","));
    }

    // Navega imediatamente para /vagas com os novos parâmetros
    router.push(`/vagas?${params.toString()}`, { scroll: false });
  };

  // 3. Dispara a busca ao pressionar Enter ou clicar na Lupa
  const handleSearchTrigger = () => {
    updateURL(searchTerm, selectedFilters);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearchTrigger();
    }
  };

  const handleFilterToggle = () => {
    setIsFilterMenuOpen((prev) => !prev);
  };

  // 4. Alterado para calcular o novo estado e atualizar a URL IMEDIATAMENTE
  const handleFilterChange = (filter: string, isSelected: boolean) => {
    let newFilters: string[] = [];

    if (isSelected) {
      newFilters = [...selectedFilters, filter];
    } else {
      newFilters = selectedFilters.filter((f) => f !== filter);
    }

    // Atualiza visualmente
    setSelectedFilters(newFilters);
    
    // Atualiza a URL instantaneamente
    updateURL(searchTerm, newFilters);
  };

  // 5. Remover filtro também atualiza a URL imediatamente
  const removeFilter = (filter: string) => {
    const newFilters = selectedFilters.filter((f) => f !== filter);
    
    setSelectedFilters(newFilters);
    updateURL(searchTerm, newFilters);
  };

  return (
    <div className="w-full p-4">
      {/* Tags Visuais */}
      {selectedFilters.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 mb-3 min-h-[40px]">
          {selectedFilters.map((filter) => (
            <FilterTag
              key={filter}
              label={filter}
              onRemove={() => removeFilter(filter)}
            />
          ))}
        </div>
      )}

      <div className="relative">
        <div className="relative flex-grow">
          {/* Botão de Lupa clicável */}
          <button 
            onClick={handleSearchTrigger}
            className="absolute left-3 top-1/2 -translate-y-1/2 p-1 cursor-pointer hover:bg-gray-100 rounded-full"
          >
            <Search className="h-5 w-5 text-gray-400" />
          </button>

          <Input
            placeholder="Pesquisar por cargo, empresa..."
            className="pl-10 pr-12"
            value={searchTerm}
            // Apenas atualiza o estado local enquanto digita
            onChange={(e) => setSearchTerm(e.target.value)} 
            onKeyDown={handleKeyDown}
          />

          {/* Botão de Filtro com Destaque Visual Condicional */}
          <button
            onClick={handleFilterToggle}
            className={`absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full transition-colors ${
              isFilterMenuOpen 
                ? "bg-red-50 text-[#F55F58]"         // Destaque quando aberto
                : "hover:bg-gray-100 text-gray-400"  // Padrão quando fechado
            }`}
            aria-label="Toggle filters"
          >
            {/* Ícone sem cor fixa para herdar do pai */}
            <Filter className="h-5 w-5" />
          </button>
        </div>

        {/* Menu de Filtros */}
        {isFilterMenuOpen && (
          <FilterMenu
            selectedFilters={selectedFilters}
            onFilterChange={handleFilterChange}
          />
        )}
      </div>
    </div>
  );
}