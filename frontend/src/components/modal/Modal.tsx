import { useEffect } from 'react';

interface ModalProps {
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export function Modal({ onClose, title, children }: ModalProps) {
  // Cerrar modal con ESC key
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscKey);
    
    // Prevenir scroll del body cuando el modal está abierto
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  // Cerrar modal al hacer clic fuera del contenido
  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-7xl max-h-[90vh] flex flex-col animate-scale-in">
        {/* Header del modal */}
        {title && (
          <div className="flex-shrink-0 px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <span className="w-2 h-8 bg-blue-500 rounded-full"></span>
                {title}
              </h2>
              <button
                onClick={onClose}
                className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all duration-200 text-2xl font-light"
                aria-label="Cerrar modal"
              >
                &times;
              </button>
            </div>
          </div>
        )}
        
        {/* Contenido del modal */}
        <div className="flex-1 overflow-y-auto p-6">
          {children}
        </div>

        {/* Footer opcional para acciones adicionales */}
        {!title && (
          <div className="flex-shrink-0 px-6 py-3 border-t border-gray-200 bg-gray-50 flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors duration-200"
            >
              Cerrar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}