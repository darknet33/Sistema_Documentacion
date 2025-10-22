// src/hooks/useDashboardData.ts
import { useMemo } from "react"; // 💡 Solo necesitamos useMemo
import { useCurse } from "./useCurse";
import { useDocumentoEstudianteAll } from "./useDocumentoEstudianteAdmin";

// Define la estructura de tu valor derivado
interface CursoCompletoResumen {
  id: number;
  nombre: string;
  nivel: string;
  activo: boolean;
  totalEstudiantes: number;
  totalDocsRequeridos: number; // Documentos que DEBERÍAN haber sido entregados
  totalDocsEntregados: number; // Documentos REALMENTE entregados por estudiantes de este curso
}

// 📌 Notas: Los estados 'loading' y 'error' deben venir de los hooks que hacen el fetch (useCurse y useDocumentoEstudianteAll)

export function useDashboardData() {
  // 1. Obtener la fuente de datos (valores principales de otros hooks)
  const { cursosCompleto, loading: loadingCursos, error: errorCursos } = useCurse();
  const { documentosEntregados, documentosFiltrados, loading: loadingDocs, error: errorDocs } = useDocumentoEstudianteAll();

  // El estado general de carga depende de ambos
  const loading = loadingCursos || loadingDocs;

  // El estado general de error es el primero que ocurra
  const error = errorCursos || errorDocs;

  // 2. Usar useMemo para hacer TODOS los cálculos
  const dashboardData = useMemo(() => {
    // Si hay error o aún está cargando, devuelve valores por defecto
    if (loading || error) {
      return {
        totalEstudiantes: 0,
        totalDocsRequeridos: 0,
        totalDocsEntregados: 0,
        cursos: [] as CursoCompletoResumen[],
      };
    }

    let estudiantesCount = 0;
    let docsRequeridosCount = 0;

    // 🚀 Paso 1: Mapear y calcular los datos por curso
    const cursosResumen = cursosCompleto.map(curso => {
      const totalEstudiantesCurso = curso.estudiantes?.length || 0;

      // Requeridos: (Docs por curso) * (Total de estudiantes)
      const docsPorEstudiante = curso.documentos_requeridos?.length || 0;
      const totalDocsCurso = docsPorEstudiante * totalEstudiantesCurso;

      // Entregados: Contar cuántos documentos de la lista total pertenecen a este curso
      // ¡Corrección Crítica! Tu lógica original de .map() no contaba bien.
      const totalEntregadosCurso = documentosEntregados.filter(
        doc => doc.estudiante?.curso_id === curso.id
      ).length;


      // Acumular totales generales
      estudiantesCount += totalEstudiantesCurso;
      docsRequeridosCount += totalDocsCurso;

      return {
        id: curso.id,
        nombre: curso.nombre,
        nivel: curso.nivel,
        activo: curso.activo,
        totalEstudiantes: totalEstudiantesCurso,
        totalDocsRequeridos: totalDocsCurso,
        totalDocsEntregados: totalEntregadosCurso,
      };
    });

    // Sumar el total de documentos entregados de todos los cursos
    const totalDocsEntregados = cursosResumen.reduce((sum, curso) => sum + curso.totalDocsEntregados, 0);

    return {
      totalEstudiantes: estudiantesCount,
      totalDocsRequeridos: docsRequeridosCount,
      totalDocsEntregados,
      cursos: cursosResumen,
    };
  }, [cursosCompleto, documentosEntregados, loading, error]); // Dependencias: solo las fuentes

  // 3. Devolver los resultados
  return {
    loading,
    error,
    // Devolvemos el objeto desestructurado
    ...dashboardData,
    ...documentosFiltrados
  };
}