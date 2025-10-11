// src/hooks/useDashboardData.ts
import { useState, useEffect } from "react";
import { authFetch } from "../api/authFetch";

export interface CursoDashboard {
  id: number;
  nombre: string;
  nivel: string;
  activo: boolean;
  totalEstudiantes: number;
  totalDocsRequeridos: number;
}

export function useDashboardData() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalEstudiantes, setTotalEstudiantes] = useState(0);
  const [totalDocsRequeridos, setTotalDocsRequeridos] = useState(0);
  const [cursos, setCursos] = useState<CursoDashboard[]>([]);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const cursosCompleto: any[] = await authFetch("/cursos/completo");

        let estudiantesCount = 0;
        let docsCount = 0;

        const cursosResumen = cursosCompleto.map(curso => {
          const totalEstudiantesCurso = curso.estudiantes?.length || 0;
          const totalDocsCurso = (curso.documentos_requeridos?.length || 0) * totalEstudiantesCurso;

          estudiantesCount += totalEstudiantesCurso;
          docsCount += totalDocsCurso;

          return {
            id: curso.id,
            nombre: curso.nombre,
            nivel: curso.nivel,
            activo: curso.activo,
            totalEstudiantes: totalEstudiantesCurso,
            totalDocsRequeridos: totalDocsCurso
          };
        });

        setTotalEstudiantes(estudiantesCount);
        setTotalDocsRequeridos(docsCount);
        setCursos(cursosResumen);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Error al cargar datos del dashboard");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return {
    loading,
    error,
    totalEstudiantes,
    totalDocsRequeridos,
    cursos
  };
}
