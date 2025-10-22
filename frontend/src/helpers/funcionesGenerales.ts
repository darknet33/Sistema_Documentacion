// Función para convertir a formato nombre propio
export const capitalizeWords = (str: string) =>
  str
    .toLowerCase()
    .split(" ")
    .filter(Boolean)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

export const tipoUsuario = (tipo_usuario: string) => {
  const tipos = {
    administrador: { label: "Secretaría", color: "bg-red-100 text-red-800" },
    administrativo: { label: "Plantel Administrativo", color: "bg-blue-100 text-blue-800" },
    padre_familia: { label: "Padre / Tutor", color: "bg-green-100 text-green-800" }
  };

  return tipos[tipo_usuario as keyof typeof tipos] || { label: "", color: "bg-gray-100 text-gray-800" };
}