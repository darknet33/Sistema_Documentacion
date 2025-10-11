// src/components/Notification.tsx
import { useEffect } from 'react';

type NotificationProps = {
  message: string;
  type?: 'success' | 'error';
  onClose: () => void;
  duration?: number; // ms
};

export function Notification ({
  message,
  type = 'success',
  onClose,
  duration = 3000,
}:NotificationProps){
  useEffect(() => {
    const timer = setTimeout(() => onClose(), duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const bgColor = type === 'success' ? 'bg-green-700' : 'bg-red-500';

  return (
    <div
      className={`fixed top-4 right-4 px-4 py-2 text-white rounded shadow-lg ${bgColor} animate-slideIn`}
    >
      {message}
    </div>
  );
};
