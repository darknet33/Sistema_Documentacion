import { useState, useEffect } from 'react'
import type { DocumentoEstudianteOut } from '../types/docEstudiante'
import { fetchDocumentosEstudiantesApi } from '../api/docEstudiante'
import {
    aprobarDocumentoApi,
    rechazarDocumentoApi,
    reenviarDocumentoApi,
} from '../api/docEstudiante'

export function useDocumentoEstudianteAll() {
    const [documentosEntregados, setDocumentosEntregados] = useState<DocumentoEstudianteOut[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        load()
    }, [])

    const load = async () => {
        setLoading(true)
        try {
            const data = await fetchDocumentosEstudiantesApi()

            // 🧠 Calcula estado de vencimiento para cada documento al cargar
            const hoy = new Date()
            const documentosConEstado = data.map((doc) => {
                if (!doc.fecha_vencimiento) {
                    return { ...doc, estadoVencimiento: 'Sin vencimiento' }
                }

                const fechaVencimiento = new Date(doc.fecha_vencimiento)
                const diffDias =
                    (fechaVencimiento.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24)

                let estadoVencimiento = ''
                if (diffDias < 0) {
                    estadoVencimiento = 'Vencido'
                } else if (diffDias <= 7) {
                    estadoVencimiento = 'Próximo a vencer'
                } else {
                    estadoVencimiento = 'Vigente'
                }

                return { ...doc, estadoVencimiento }
            })

            setDocumentosEntregados(documentosConEstado)
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Error desconocido')
        } finally {
            setLoading(false)
        }
    }

    // 📂 Filtrados según estado general o vencimiento
    const documentosPorConfirmar = documentosEntregados.filter(
        (doc) => doc.observaciones === 'Enviado por Confirmar'
    )

    const documentosAprobados = documentosEntregados.filter(
        (doc) => doc.observaciones === 'Recepcionado y Verificado'
    )

    const documentosPorVencer = documentosEntregados.filter(
        (doc) =>
            doc.estadoVencimiento === 'Próximo a vencer' ||
            doc.estadoVencimiento === 'Vencido'
    )

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

    // 🔁 Reenviar documento
    const reenviarDocumento = async (id: number, archivo: File) => {
        try {
            const updated = await reenviarDocumentoApi(id, archivo)
            setDocumentosEntregados((prev) =>
                prev.map((doc) => (doc.id === id ? updated : doc))
            )
            return updated
        } catch (error) {
            setError(
                error instanceof Error ? error.message : 'Error al reenviar documento'
            )
            throw error
        }
    }

    return {
        documentosEntregados,
        documentosPorConfirmar,
        documentosAprobados,
        documentosPorVencer,
        aprobarDocumento,
        rechazarDocumento,
        reenviarDocumento,
        load,
        loading,
        error,
    }
}
