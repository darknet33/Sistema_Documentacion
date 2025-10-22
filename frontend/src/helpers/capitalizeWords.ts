// Función para convertir a formato nombre propio
  export const capitalizeWords = (str: string) =>
    str
      .toLowerCase()
      .split(" ")
      .filter(Boolean)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");