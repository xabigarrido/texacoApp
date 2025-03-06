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
  MiIcono,
  NewBox,
  TextSmall,
} from "@/utils/utils";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Image, TouchableOpacity, View } from "react-native";

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
    // if (dataUser.newUser) return router.replace("/home/");
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
        <NewBox className={""}>
          <View className="absolute top-2 right-2">
            <TouchableOpacity
              onPress={() => router.navigate("/home/crearEmpresa")}
            >
              <MiIcono
                name="add-circle"
                type="Ionicons"
                color="green"
                size={36}
              />
            </TouchableOpacity>
          </View>
          {empresas.length == 0 &&
            !dataUser.newUser &&
            dataUser.empresasPostuladas.length > 0 && (
              <>
                <ActivityIndicator />
                <TextSmall>Cargando empresas</TextSmall>
              </>
            )}
          <View className="flex-row flex-wrap items-center justify-center gap-4">
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
          {empresas.length == 0 && dataUser.empresasPostuladas.length === 0 && (
            <View>
              <Boton className="my-1 bg-violet-800" onPress={handleButtons}>
                Crear una empresa
              </Boton>
              <Boton className="my-1 bg-green-800" onPress={handleButtons}>
                Ingresar en una empresa
              </Boton>
            </View>
          )}
        </NewBox>
      </View>
    </MarcoLayout>
  );
});
export default pickEmpresas;
