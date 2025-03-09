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
import {
  ActivityIndicator,
  Image,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const pickEmpresas = React.memo(() => {
  const {
    userId,
    isLoaded,
    isSignedIn,
    dataUser,
    setEmpresaPick,
    empresaPick,
    setEmpleadoEmpresa,
    empleadoEmpresa,
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
    setEmpleadoEmpresa(null);
    // if (dataUser.newUser) return router.replace("/home/");
  }, [dataUser, empresaPick, empleadoEmpresa]);
  const handleButtons = async () => {
    try {
      await updateUser(userId, { newUser: true });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <MarcoLayout darkMode={true}>
      <View className="absolute" style={{ bottom: 20, left: 20 }}>
        <TouchableOpacity onPress={() => router.replace("/home/crearEmpresa")}>
          <MiIcono name="add-circle" type="Ionicons" color="green" size={50} />
        </TouchableOpacity>
      </View>
      <View className="items-center">
        <HeaderUser dataUser={dataUser} />
        <View className="w-full mt-10">
          {empresas.length == 0 &&
            !dataUser.newUser &&
            dataUser.empresasPostuladas.length > 0 && (
              <>
                <ActivityIndicator />
              </>
            )}
          {/* <View className="flex-row flex-wrap items-center justify-center gap-4">
            {empresas.length > 0 &&
              empresas.map((empresa) => (
                <TouchableOpacity
                  key={empresa.id}
                  onPress={() => {
                    setEmpresaPick(empresa);
                    router.replace("/home/start/optionsEmpresa");
                  }}
                  className={`w-[120px] h-[120px] rounded-xl bg-gray-100 dark:bg-zinc-900 shadow-md items-center justify-center ${
                    Platform.OS === "android" && "shadow-black"
                  }`}
                >
                  <View style={{ paddingVertical: 5 }}>
                    <Image
                      source={{ uri: empresa?.logotipoUrl }}
                      style={{ width: 80, height: 80, borderRadius: 20 }}
                    />
                    <Text className="text-lg font-bold text-gray-900 dark:text-white mt-2 text-center">
                      {empresa.nameEmpresa}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
          </View> */}
          <View className="flex-row flex-wrap items-center justify-center gap-4">
            {empresas.length > 0 &&
              empresas.map((empresa) => (
                <TouchableOpacity
                  key={empresa.id}
                  onPress={() => {
                    setEmpresaPick(empresa);
                    router.replace("/home/start/optionsEmpresa");
                  }}
                  className={`w-[120px] h-[120px] rounded-xl bg-gray-100 dark:bg-neutral-950 shadow-md items-center justify-center ${
                    Platform.OS === "android" && "shadow-black"
                  }`}
                >
                  <View style={{ paddingVertical: 5 }}>
                    <Image
                      source={{ uri: empresa?.logotipoUrl }}
                      style={{ width: 80, height: 80, borderRadius: 20 }}
                    />
                    {/* <View
                      className="absolute self-center px-2 py-1 rounded-xl dark:bg-neutral-950 bg-gray-100"
                      style={{ bottom: -10 }}
                    >
                      <Text className="text-md font-bold text-gray-900 dark:text-white text-center">
                        {empresa.nameEmpresa}
                      </Text>
                    </View> */}
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
        </View>
      </View>
    </MarcoLayout>
  );
});
export default pickEmpresas;
