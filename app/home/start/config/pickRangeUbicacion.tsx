import { updateUser } from "@/api/auth.api";
import { useAuthApp } from "@/context/userContext";
import {
  collection,
  db,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "@/firebaseConfig";
import { Boton } from "@/utils/utils";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { View, Text, Alert } from "react-native";
import { WebView } from "react-native-webview";

// La URL de tu página web
const urlpage = "https://regal-figolla-a5f516.netlify.app/crearempresa";
// const urlpage = "http://192.168.50.68:5173/crearEmpresa";

export default function App() {
  const { identificador } = useLocalSearchParams();
  const { userId } = useAuthApp();
  const router = useRouter();

  const handleMessage = async (event: any) => {
    const message = event.nativeEvent.data;

    try {
      const locationData = JSON.parse(message);
      console.log(locationData.ubicacionEmpresa);
      console.log(locationData.metrosRange);
      const q = query(
        collection(db, "Empresas"),
        where("identificador", "==", identificador)
      );
      const docSnap = await getDocs(q);
      if (docSnap.empty) {
        return alert("No se encontro la empresa");
      }
      const empresaRef = doc(db, "Empresas", docSnap.docs[0].id);
      await updateDoc(empresaRef, {
        distancePick: locationData.metrosRange,
        locationEmpresa: locationData.ubicacionEmpresa,
        posicionHabilitada: true,
      });
      await updateUser(userId, { newUser: false });
      router.replace("/home/start");
      console.log("Empresa creada con ubicacion");
    } catch (error) {
      console.error("Error al recibir los datos:", error);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <WebView
        source={{ uri: urlpage }} // Reemplaza con la URL de tu web
        onMessage={handleMessage} // Recibir mensajes del WebView
      />
    </View>
  );
}
