import { createContext, Context, useContext, useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-expo";
import { MarcoLayout } from "@/utils/utils";
import { ActivityIndicator, View } from "react-native";

const AppContext = createContext();

const useApp = () => useContext(AppContext);

const AppProvider = ({ children }) => {
  const [loadingData, setLoadingData] = useState(false);
  return (
    <AppContext.Provider value={{ loadingData, setLoadingData }}>
      {children}
    </AppContext.Provider>
  );
};
export { AppProvider, useApp };
