interface ModalProps {
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export function Modal({ onClose, title, children }: ModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl shadow-lg w-[90%] max-w-5xl h-[90vh] p-6 relative flex flex-col">
        {title && <h2 className="text-2xl font-bold mb-4">{title}</h2>}
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-500 hover:text-gray-800 text-2xl"
        >
          &times;
        </button>
        <div className="overflow-y-auto flex-1">{children}</div>
      </div>
    </div>
  );
}
