import React, { useState } from "react";
import { View, Button, Image, Alert, TouchableOpacity, Text } from "react-native";
import { MarcoLayout, MiIcono, NewBox, TextSmall } from "@/utils/utils";
import { useAuthApp } from "@/context/userContext";

const qrUrl =
  "https://api.qrserver.com/v1/create-qr-code/?data=www.midominio.com/mesas?id=mesa123&size=200x200";

const App = () => {
  const{empresaPick}=useAuthApp()
  return (
    <MarcoLayout>
    <View className="flex-1 justify-center items-center  bg-background dark:bg-zinc-900 p-4">
      <NewBox paddingHandle={false} className="w-full max-w-md bg-white p-6 rounded-2xl shadow-lg">
        {/* Nombre de la empresa */}
        <Text className="text-5xl font-extrabold text-gray-800 dark:text-dark-textPrimary text-center mb-4">
          {empresaPick?.nameEmpresa}
        </Text>

        {/* Texto explicativo */}
        <View className="items-center justify-center px-4 text-center mb-6">
          <Text className="text-lg text-gray-600 font-semibold dark:text-dark-textPrimary">
            Escanea el código QR para acceder a la carta digital y realizar pedidos fácilmente.
          </Text>
          <Text className="text-sm text-gray-500 mt-2 dark:text-dark-textPrimary text-center">
            También puedes hacer una captura de pantalla, imprimirlo y pegarlo en la mesa.
          </Text>
        </View>

        {/* QR con marco atractivo */}
        <View className="bg-white p-4 rounded-xl shadow-md border border-gray-300 items-center">
          <Image source={{ uri: qrUrl }} style={{ width: 200, height: 200 }} />
        </View>

        {/* Mensaje adicional */}
        <Text className="text-sm text-gray-500 text-center mt-4 dark:text-dark-textPrimary">
          ¡Haz que tus clientes disfruten de una experiencia más rápida y sencilla!
        </Text>
      </NewBox>
    </View>
  </MarcoLayout>
  );
};

export default App;
