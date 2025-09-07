"use client";
import { SearchIcon } from "lucide-react"
import { useRef } from "react";

interface SearchProps {
  Text: string;
}

const SearchComponent = ({Text}: SearchProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleInputChange = () => {
    if (inputRef.current) {
      console.log("Input value:", inputRef.current.value);
      // You can use this value wherever you need it
    }
  };

  return (
    <div className="border flex px-2 py-2 rounded-md text-[#67778e] bg-[#f0f2f5] gap-2 cursor-pointer select-none">
        <SearchIcon />
        <input 
          type="text" 
          ref={inputRef}
          placeholder={Text}
          onChange={(e) => e.target.value}
          className="outline-none bg-transparent"
        />
    </div>
  )
}

export default SearchComponent;