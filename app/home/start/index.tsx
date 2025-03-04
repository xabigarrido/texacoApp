import { updateUser } from "@/api/auth.api";
import { verEmpresas } from "@/api/empresas.api";
import { useApp } from "@/context/appContext";
import { useAuthApp } from "@/context/userContext";
import {
  Boton,
  Box,
  EstadoTrabajando,
  HeaderUser,
  MarcoLayout,
  TextSmall,
} from "@/utils/utils";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Image, TouchableOpacity, View } from "react-native";

const pickEmpresas = React.memo(() => {
  const {
    userId,
    isLoaded,
    isSignedIn,
    dataUser,
    setEmpresaPick,
    empresaPick,
  } = useAuthApp();
  const [empresas, setEmpresas] = useState([]);
  const router = useRouter();
  const { setLoadingData } = useApp();
  useEffect(() => {
    setLoadingData(true);

    if (!isLoaded) return;
    if (!isSignedIn) return;
    const getData = async () => {
      const data = await verEmpresas(dataUser.empresasPostuladas);
      return setEmpresas(data.message);
    };
    getData();
    setEmpresaPick(null);
    setLoadingData(false);
    if (dataUser.newUser) return router.replace("/home/");
  }, [dataUser, empresaPick]);
  const handleButtons = async () => {
    try {
      await updateUser(userId, { newUser: true });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <MarcoLayout darkMode={true}>
      <View className="items-center">
        <HeaderUser dataUser={dataUser} />
        <Box className={"p-3 mt-2 items-center"}>
          <View className="flex-row flex-wrap gap-6">
            {empresas.length > 0 &&
              empresas.map((empresa) => (
                <TouchableOpacity
                  key={empresa.id}
                  onPress={() => {
                    setEmpresaPick(empresa);
                    router.replace("/home/start/optionsEmpresa");
                  }}
                >
                  <View className="h-[100px] w-[100px] items-center justify-center">
                    <Image
                      source={{ uri: empresa.logotipoUrl || "default" }}
                      style={{ width: 70, height: 70, borderRadius: 20 }}
                    />
                    <TextSmall className={"text-2xl font-semibold"}>
                      {empresa.nameEmpresa}
                    </TextSmall>
                  </View>
                </TouchableOpacity>
              ))}
          </View>
          {/* {empresas.length === 0 && (
            <View>
              <Boton className="my-1 bg-violet-500" onPress={handleButtons}>
                Crear una empresa
              </Boton>
              <Boton className="my-1 bg-green-500" onPress={handleButtons}>
                Ingresar en una empresa
              </Boton>
            </View>
          )} */}
        </Box>
      </View>
    </MarcoLayout>
  );
});
export default pickEmpresas;
