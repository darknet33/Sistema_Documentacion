import { createContext, useContext, useState } from "react";

export type NotificationProps = {
  message: string;
  type?: "success" | "error";
  duration?: number; // ms
};

interface NotificationContextType {
  notification: NotificationProps | null;
  setNotification: React.Dispatch<React.SetStateAction<NotificationProps | null>>;
}

export const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notification, setNotification] = useState<NotificationProps | null>(null);

  return (
    <NotificationContext.Provider value={{ notification, setNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error("useNotification debe usarse dentro de <NotificationProvider>");
  return context;
};
