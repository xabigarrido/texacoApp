import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth, useUser } from "@clerk/clerk-expo";
import {
  createdUserFirebase,
  existeUser,
  obtenerDatosUser,
} from "@/api/auth.api";
import { useRouter } from "expo-router";
import { useApp } from "./appContext";
import { onSnapshot, db, collection, doc } from "../firebaseConfig";

// 🔹 Definimos el tipo de los valores del contexto
interface AuthContextType {
  isSignedIn: boolean;
  isLoaded: boolean;
  userId?: string | null;
  signOut: () => Promise<void>;
  dataUser: any;
  setDataUser: React.Dispatch<React.SetStateAction<any>>;
  empresaPick: any;
  setEmpresaPick: React.Dispatch<React.SetStateAction<any>>;
  empleadoEmpresa: any;
  setEmpleadoEmpresa: React.Dispatch<React.SetStateAction<any>>;
  fetchUserData: () => Promise<void>;
}

// 🔹 Creamos el contexto con un valor inicial tipado
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 🔹 Hook personalizado para usar el contexto con seguridad
const useAuthApp = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthApp debe usarse dentro de un AuthProvider");
  }
  return context;
};

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const router = useRouter();
  const { isSignedIn, isLoaded, userId, signOut } = useAuth();
  const { user } = useUser();
  const [dataUser, setDataUser] = useState<any>(false);
  const [empresaPick, setEmpresaPick] = useState<any>(null);
  const [empleadoEmpresa, setEmpleadoEmpresa] = useState<any>(null);
  const { setLoadingData, loadingData } = useApp();

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user) return;
    console.log("Renderizado UserContext");
    const checkAndCreateUser = async () => {
      const userExists = await existeUser(userId);
      if (!userExists) {
        await createdUserFirebase(userId, {
          emailAddress: user.emailAddresses[0]?.emailAddress || "",
          name: user.firstName || "",
          subname: user.lastName || "",
          imageUrl: user.imageUrl || "",
          newUser: true,
          empresasPostuladas: [],
          trabajando: false,
          createdAt: new Date(),
        });
      }
      fetchUserData();
    };

    checkAndCreateUser();
  }, [userId, isSignedIn, isLoaded, user]);

  useEffect(() => {
    if (!userId) return; // No suscribirse si no hay userId

    const suscribirme = onSnapshot(
      doc(collection(db, "Usuarios"), userId),
      (snapshot) => {
        if (snapshot.exists()) {
          setDataUser({ id: snapshot.id, ...snapshot.data() });
        } else {
          console.log("El documento no existe");
        }
      }
    );

    return () => suscribirme();
  }, [userId]); // Asegurar que se ejecuta cuando cambia userId

  const fetchUserData = async () => {
    const data = await obtenerDatosUser(userId);
    setDataUser(data);
    // router.replace("/home/");
  };
  return (
    <AuthContext.Provider
      value={{
        isSignedIn,
        isLoaded,
        userId,
        signOut,
        dataUser,
        setDataUser,
        fetchUserData,
        empresaPick,
        setEmpresaPick,
        empleadoEmpresa,
        setEmpleadoEmpresa,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, useAuthApp };
