import { createContext, useContext, useState } from "react";

// 🔹 Definimos el tipo de los valores del contexto
interface AppContextType {
  loadingData: boolean;
  setLoadingData: React.Dispatch<React.SetStateAction<boolean>>;
}

// 🔹 Creamos el contexto con un valor inicial tipado
const AppContext = createContext<AppContextType | undefined>(undefined);

// 🔹 Hook personalizado para acceder al contexto con seguridad
const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp debe usarse dentro de un AppProvider");
  }
  return context;
};

// 🔹 Definimos el proveedor con tipado
const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loadingData, setLoadingData] = useState<boolean>(false);

  return (
    <AppContext.Provider value={{ loadingData, setLoadingData }}>
      {children}
    </AppContext.Provider>
  );
};

export { AppProvider, useApp };
