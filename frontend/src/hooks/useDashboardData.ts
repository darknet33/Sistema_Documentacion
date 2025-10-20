// src/hooks/useDashboardData.ts
import { useState, useEffect } from "react";
import { useCurse } from "./useCurse";
import { useDocumentoEstudianteAll } from "./useDocumentoEstudianteAll";

interface CursoCompleto {
  id: number,
  nombre: string,
  nivel: string,
  activo: boolean,
  totalEstudiantes: number,
  totalDocsRequeridos: number,
  totalDocsEntregados:number
}

export function useDashboardData() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalEstudiantes, setTotalEstudiantes] = useState(0);
  const [totalDocsRequeridos, setTotalDocsRequeridos] = useState(0);
  const [totalDocsEntregados, setTotalDocsEntregados] = useState(0);
  const [cursos, setCursos] = useState<CursoCompleto[]>([]);

  const { cursosCompleto } = useCurse();
  const { documentosAprobados } = useDocumentoEstudianteAll()

  useEffect(() => {

    async function fetchData() {
      setLoading(true);
      try {
        let estudiantesCount = 0;
        let docsCount = 0;
        let entregadosCount=0;


        const cursosResumen = cursosCompleto.map(curso => {
          const totalEstudiantesCurso = curso.estudiantes?.length || 0;
          const totalDocsCurso = (curso.documentos_requeridos?.length || 0) * totalEstudiantesCurso;
          const totalEntregadosCurso = documentosAprobados.map(da=> da.estudiante?.curso_id===curso.id)

          entregadosCount+= totalEntregadosCurso.length;
          estudiantesCount += totalEstudiantesCurso;
          docsCount += totalDocsCurso;

          return {
            id: curso.id,
            nombre: curso.nombre,
            nivel: curso.nivel,
            activo: curso.activo,
            totalEstudiantes: totalEstudiantesCurso,
            totalDocsRequeridos: totalDocsCurso,
            totalDocsEntregados: totalEntregadosCurso.length,
          };
        });

        setTotalEstudiantes(estudiantesCount);
        setTotalDocsRequeridos(docsCount);
        setTotalDocsEntregados(entregadosCount);
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
    totalDocsEntregados,
    cursos
  };
}
