// src/components/Notification.tsx
import { useEffect } from "react";
import { useNotification } from "../../context/NotificationContext";

export function Notification() {
  const { notification, setNotification } = useNotification();

  // Ocultar después del tiempo configurado
  useEffect(() => {
    if (!notification) return;

    const timer = setTimeout(() => {
      setNotification(null);
    }, notification.duration ?? 5000);

    return () => clearTimeout(timer);
  }, [notification, setNotification]);

  if (!notification) return null;

  const bgColor =
    notification.type === "success" ? "bg-green-600" : "bg-red-600";

  return (
    <div
      className={`fixed top-20 left-100% mx-auto px-4 py-2 z-100 text-white rounded shadow-lg ${bgColor}`}
    >
      {notification.message}
    </div>
  );
}
