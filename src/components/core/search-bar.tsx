"use client";

import { Input } from "@/components/ui/input";
import { Search, Filter } from "lucide-react";
import { useState } from "react";
import { FilterMenu } from "./filter-menu";
import { FilterTag } from "./filter-tag";

export function SearchBar() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  const handleFilterToggle = () => {
    setIsFilterMenuOpen((prev) => !prev);
  };

  const handleFilterChange = (filter: string, isSelected: boolean) => {
    setSelectedFilters((prev) => {
      if (isSelected) {
        return [...prev, filter];
      } else {
        return prev.filter((f) => f !== filter);
      }
    });
  };

  const removeFilter = (filter: string) => {
    setSelectedFilters((prev) => prev.filter((f) => f !== filter));
  };

  return (
    <div className="w-full p-4">
      {/* Container for Filter Tags */}
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
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            placeholder="Pesquisar por..."
            className="pl-10 pr-12" // Increased padding for the filter icon
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            onClick={handleFilterToggle}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-100"
            aria-label="Toggle filters"
          >
            <Filter className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        {/* Filter Menu */}
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
