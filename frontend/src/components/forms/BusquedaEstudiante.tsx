import { useState } from "react";

interface Props {
  onSearch: (query: string) => void;
}

export function BusquedaEstudiante({ onSearch }: Props) {
  const [query, setQuery] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <input
      type="text"
      placeholder="Buscar estudiante..."
      className="px-3 py-2 border rounded-lg w-full mb-4"
      value={query}
      onChange={handleChange}
    />
  );
}
