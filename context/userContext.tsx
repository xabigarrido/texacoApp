import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth, useUser } from "@clerk/clerk-expo";
import {
  createdUserFirebase,
  existeUser,
  obtenerDatosUser,
} from "@/api/auth.api";
import { useRouter } from "expo-router";
import { useApp } from "./appContext";

const AuthContext = createContext();
const useAuthApp = () => useContext(AuthContext);

const AuthProvider = ({ children }) => {
  const router = useRouter();
  const { isSignedIn, isLoaded, userId, signOut } = useAuth();
  const { user } = useUser();
  const [dataUser, setDataUser] = useState(false);
  const { setLoadingData } = useApp();

  useEffect(() => {
    if (!isLoaded) return; // Esperar hasta que Clerk esté listo
    if (!isSignedIn) return router.replace("/Auth/LoginAuth"); // Si no hay sesión, redirigir al login
    if (!user) return; // Esperar hasta que `user` esté disponible
    const checkAndCreateUser = async () => {
      const userExists = await existeUser(userId);

      if (!userExists) {
        await createdUserFirebase(userId, {
          emailAddress: user.emailAddresses[0]?.emailAddress || "",
          name: user.firstName || "",
          subname: user.lastName || "",
          imageUrl: user.imageUrl || "",
          newUser: true,
          createdAt: new Date(),
        });
      }
      fetchUserData();
    };

    const fetchUserData = async () => {
      const data = await obtenerDatosUser(userId);
      setDataUser(data);
      router.replace("/home/firstHome");
    };

    checkAndCreateUser();
  }, [userId, isSignedIn, isLoaded, user]); // Agregamos `user` a las dependencias

  return (
    <AuthContext.Provider
      value={{
        isSignedIn,
        isLoaded,
        userId,
        signOut,
        dataUser,
        setDataUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, useAuthApp };
