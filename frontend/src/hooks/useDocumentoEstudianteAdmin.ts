import { useState, useEffect, useMemo } from 'react'
import type { DocumentoEstudianteOut } from '../types/docEstudiante'
import {
    fetchDocumentosEstudiantesApi,
    aprobarDocumentoApi,
    rechazarDocumentoApi,
} from '../api/docEstudiante'

export function useDocumentoEstudianteAll() {
    const [documentosEntregados, setDocumentosEntregados] = useState<DocumentoEstudianteOut[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const loadDocsEstudiantes = async () => {
        setLoading(true)
        try {
            const data = await fetchDocumentosEstudiantesApi()
            setDocumentosEntregados(data)
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Error desconocido')
        } finally {
            setLoading(false)
        }
    }

    // 2. Calcula un objeto con todos los filtros usando useMemo
    const documentosFiltrados = useMemo(() => {
        // Definición de la lógica de filtrado
        const porConfirmar = documentosEntregados.filter(
            (doc) => doc.observaciones === 'Enviado por Confirmar'
        );

        const aprobados = documentosEntregados.filter(
            (doc) => doc.observaciones === 'Recepcionado y Verificado'
        );

        const porVencer = documentosEntregados.filter(
            (doc) =>
                doc.estadoVencimiento === 'Próximo a vencer' ||
                doc.estadoVencimiento === 'Vencido'
        );

        // Retorna un objeto con todos los arrays
        return {
            documentosPorConfirmar: porConfirmar,
            documentosAprobados: aprobados,
            documentosPorVencer: porVencer,
        };
    }, [documentosEntregados]); // ⬅️ SOLO se recalcula si este array cambia

    // ✅ Aprobar documento
    const aprobarDocumento = async (id: number, fechaVencimiento?: string) => {
        try {
            const updated = await aprobarDocumentoApi(id, fechaVencimiento)
            setDocumentosEntregados((prev) =>
                prev.map((doc) => (doc.id === id ? updated : doc))
            )
            return updated
        } catch (error) {
            setError(
                error instanceof Error ? error.message : 'Error al aprobar documento'
            )
            throw error
        }
    }

    // ❌ Rechazar documento
    const rechazarDocumento = async (id: number, observacion: string) => {
        try {
            const updated = await rechazarDocumentoApi(id, observacion)
            setDocumentosEntregados((prev) =>
                prev.map((doc) => (doc.id === id ? updated : doc))
            )
            return updated
        } catch (error) {
            setError(
                error instanceof Error ? error.message : 'Error al rechazar documento'
            )
            throw error
        }
    }

    // Notificar Rechazar documento
    const notificarDocumentoVencido = async (id: number, observacion: string) => {
        try {
            const doumento = await rechazarDocumentoApi(id, observacion)
            setDocumentosEntregados((prev) =>
                prev.map((doc) => (doc.id === id ? doumento : doc))
            )
            return doumento
        } catch (error) {
            setError(
                error instanceof Error ? error.message : 'Error al rechazar documento'
            )
            throw error
        }
    }

    useEffect(() => {
        loadDocsEstudiantes()
    }, [])

    return {
        documentosEntregados,
        documentosFiltrados,
        aprobarDocumento,
        rechazarDocumento,
        notificarDocumentoVencido,
        reload: loadDocsEstudiantes,
        loading,
        error,
    }
}
