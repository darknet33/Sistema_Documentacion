import { useEffect, useState } from 'react';
import { Sidebar, DocumentTable, DocumentForm, LoadingScreen, Notification } from '../components';
import { useDocument } from '../hooks/useDocuments';
import { useAuth } from '../context/AuthContext';
import type { DocumentOut, NewDocument, UpdateDocument } from '../types/document';

const Document = () => {
    const { documents, loading, error, addDocument, updateDocument, toggleStatus, toggleObligatorio, deleteDocument } = useDocument();
    const { token, logout } = useAuth();

    const [showForm, setShowForm] = useState(false);
    const [editDocument, setEditDocument] = useState<DocumentOut | null>(null);
    const [notification, setNotification] = useState<{ message: string; type?: 'success' | 'error' } | null>(null);

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
                setNotification({ message: `Documento "${data.nombre}" actualizado con éxito.`, type: 'success' });
            } else {
                await addDocument(data as NewDocument);
                setNotification({ message: `Documento "${data.nombre}" creado con éxito.`, type: 'success' });
            }
            setShowForm(false);
        } catch (error) {
            console.error(error);
            setNotification({ message: `Error al guardar documento.`, type: 'error' });
        }
    };

    const handleToggleActivo = async (doc: DocumentOut) => {
        try {
            await toggleStatus(doc.id, !doc.activo);
            setNotification({
                message: `Documento "${doc.nombre}" ${!doc.activo ? 'activado' : 'desactivado'}.`,
                type: 'success',
            });
        } catch (error) {
            console.error(error);
            setNotification({
                message: `Error al cambiar el estado activo.`,
                type: 'error',
            });
        }
    };

    const handleToggleObligatorio = async (doc: DocumentOut) => {
        try {
            await toggleObligatorio(doc.id, !doc.es_obligatorio);
            setNotification({
                message: `Documento "${doc.nombre}" marcado como ${!doc.es_obligatorio ? 'obligatorio' : 'opcional'}.`,
                type: 'success',
            });
        } catch (error) {
            console.error(error);
            setNotification({
                message: `Error al cambiar el estado obligatorio.`,
                type: 'error',
            });
        }
    };


    const handleDelete = (doc: DocumentOut) => {
        if (confirm(`¿Eliminar documento "${doc.nombre}"?`)) {
            deleteDocument(doc.id);
        }
    };

    useEffect(() => {
        if (!token) logout();

    }, [token])


    return (
        <div className="min-h-screen flex bg-gray-50">
            <Sidebar />

            <main className="flex-1 p-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">Catálogo de Documentos</h1>

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

                {notification && (
                    <Notification
                        message={notification.message}
                        type={notification.type}
                        onClose={() => setNotification(null)}
                    />
                )}
            </main>
        </div>
    );
};

export default Document;
