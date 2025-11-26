"use client";

import React from "react";
import { X } from "lucide-react";

type FilterTagProps = {
  label: string;
  onRemove: () => void;
};

export function FilterTag({ label, onRemove }: FilterTagProps) {
  return (
    <div className="flex items-center bg-white border-2 border-red-500 rounded-full px-3 py-1 text-sm font-medium text-gray-800">
      <span>{label}</span>
      <button
        onClick={onRemove}
        className="ml-2 -mr-1 p-0.5 rounded-full hover:bg-red-100"
        aria-label={`Remove ${label} filter`}
      >
        <X className="h-4 w-4 text-red-500" />
      </button>
    </div>
  );
}
