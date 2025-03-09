import { getEmpleadoEmpresa } from "@/api/empresas.api";
import { useAuthApp } from "@/context/userContext";
import {
  BotonesHome,
  Box,
  FadeIn,
  HeaderUser,
  MarcoLayout,
  MiIcono,
  NewBox,
  TabMenu,
  TextSmall,
} from "@/utils/utils";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

const OptionsEmpresa = () => {
  const {
    empresaPick,
    dataUser,
    setEmpresaPick,
    userId,
    setEmpleadoEmpresa,
    empleadoEmpresa,
  } = useAuthApp();

  const router = useRouter();

  useEffect(() => {
    if (!empresaPick?.id || !userId) return; // Verificamos que existan valores
    const getData = async () => {
      try {
        const data = await getEmpleadoEmpresa(empresaPick.id, userId);
        setEmpleadoEmpresa(data);
      } catch (error) {
        console.log(error);
      }
    };
    getData();
  }, [empresaPick?.id, userId]);

  return (
    <MarcoLayout darkMode={true}>
      <TabMenu />
      <FadeIn>
        <HeaderUser />
      </FadeIn>
      <FadeIn>
        <NewBox>
          {empleadoEmpresa?.encargadoEmpresa && (
            <TouchableOpacity
              onPress={() => router.navigate("/home/start/config")}
              className="absolute self-center -bottom-8 bg-gray-200 dark:bg-neutral-900 p-3 rounded-full shadow-lg"
              style={{ elevation: 5 }}
            >
              <MiIcono
                size={36}
                type="Ionicons"
                name="settings"
                color="#353535"
              />
            </TouchableOpacity>
          )}
          <View className="flex-row flex-wrap gap-4 self-center">
            <BotonesHome
              onPress={() => router.navigate("/home/start/config/crearZona")}
              name={"tablet-dashboard"}
              type={"MaterialCommunityIcons"}
              nameBoton={"Zonas"}
              color={"#3B82F6"}
            />
            <BotonesHome
              onPress={() =>
                router.navigate("/home/start/config/crearZonaPrueba")
              }
              name={"tablet"}
              type={"MaterialCommunityIcons"}
              nameBoton={"Pruebas"}
              color={"#10B981"}
            />
            <BotonesHome
              name={"calendar"}
              type={"Ionicons"}
              nameBoton={"Reservas"}
              color={"#EF4444"}
            />
          </View>
        </NewBox>
      </FadeIn>
    </MarcoLayout>
  );
};

export default OptionsEmpresa;
