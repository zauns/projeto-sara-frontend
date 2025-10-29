'use client';

import { Input } from "@/components/ui/input"; 
import { Search, Filter } from "lucide-react";
import { useState } from "react";


export function SearchBar() {

    const [searchTerm, setSearchTerm] = useState("");

    return (
        <div className="flex items-center gap-2 p-4">
            <div className="relative flex-grow">
                <Search className="
                    absolute
                    left-3
                    top-1/2
                    -translate-y-1/2
                    h-5 w-5
                    text-gray-400
                " />
                <Input 
                    placeholder="Pesquisar por..." 
                    className="pl-10 pr-10" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                
                />
            
                <Filter className="
                    absolute
                    right-7
                    top-1/2
                    -translate-y-1/2
                    h-5 w-5
                    text-gray-400"
                />
            </div>
        </div>
    );

}