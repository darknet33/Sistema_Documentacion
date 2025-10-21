import { useState } from 'react';
import { DocumentTable, DocumentForm, LoadingScreen } from '../components';
import { useDocument } from '../hooks/useDocuments';
import type { DocumentOut, NewDocument, UpdateDocument } from '../types/document';
import { PageLayout } from '../layout/PageLayout';
import { useNotification } from '../context/NotificationContext';

const Document = () => {
    const {
        documents,
        loading,
        error,
        addDocument,
        updateDocument,
        toggleStatus,
        toggleObligatorio,
        deleteDocument
    } = useDocument();

    const [showForm, setShowForm] = useState(false);
    const [editDocument, setEditDocument] = useState<DocumentOut | null>(null);
    const { setNotification } = useNotification();

    const handleCreate = () => {
        setEditDocument(null);
        setShowForm(true);
    };

    const handleEdit = (doc: DocumentOut) => {
        setEditDocument(doc);
        setShowForm(true);
    };

    const handleSubmit = async (data: NewDocument | UpdateDocument) => {
        try {
            if (editDocument) {
                await updateDocument(editDocument.id, data as UpdateDocument);
                setNotification({
                    message: `Documento "${data.nombre}" actualizado con éxito.`,
                    type: 'success'
                });
            } else {
                await addDocument(data as NewDocument);
                setNotification({
                    message: `Documento "${data.nombre}" creado con éxito.`,
                    type: 'success'
                });
            }
            setShowForm(false);
        } catch (error) {
            console.error(error);
            setNotification({
                message: 'Error al guardar el documento.',
                type: 'error'
            });
        }
    };

    const handleToggleActivo = async (doc: DocumentOut) => {
        try {
            await toggleStatus(doc.id, !doc.activo);
            setNotification({
                message: `Documento "${doc.nombre}" ${!doc.activo ? 'activado' : 'desactivado'}.`,
                type: 'success'
            });
        } catch (error) {
            console.error(error);
            setNotification({
                message: 'Error al cambiar el estado activo del documento.',
                type: 'error'
            });
        }
    };

    const handleToggleObligatorio = async (doc: DocumentOut) => {
        try {
            await toggleObligatorio(doc.id, !doc.es_obligatorio);
            setNotification({
                message: `Documento "${doc.nombre}" marcado como ${!doc.es_obligatorio ? 'obligatorio' : 'opcional'}.`,
                type: 'success'
            });
        } catch (error) {
            console.error(error);
            setNotification({
                message: 'Error al cambiar el estado obligatorio del documento.',
                type: 'error'
            });
        }
    };

    const handleDelete = async (doc: DocumentOut) => {
        if (!confirm(`¿Eliminar documento "${doc.nombre}"?`)) return;

        try {
            await deleteDocument(doc.id);
            setNotification({
                message: `Documento "${doc.nombre}" eliminado correctamente.`,
                type: 'success'
            });
        } catch (error) {
            console.error(error);
            setNotification({
                message: 'Error al eliminar el documento.',
                type: 'error'
            });
        }
    };

    return (
        <PageLayout title='Catálogo de Documentos'>
            {showForm ? (
                <DocumentForm
                    document={editDocument || undefined}
                    loading={false}
                    error={null}
                    onCancel={() => setShowForm(false)}
                    onSubmit={handleSubmit}
                />
            ) : (
                <>
                    <div className="flex justify-end mb-4">
                        <button
                            onClick={handleCreate}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                        >
                            Crear Documento
                        </button>
                    </div>

                    {loading && <LoadingScreen />}
                    {error && <p className="text-red-600">{error}</p>}

                    {!loading && (
                        <DocumentTable
                            documentos={documents}
                            onEdit={handleEdit}
                            onToggleObligatorio={handleToggleObligatorio}
                            onToggleActivo={handleToggleActivo}
                            onDelete={handleDelete}
                        />
                    )}
                </>
            )}
        </PageLayout>
    );
};

export default Document;
