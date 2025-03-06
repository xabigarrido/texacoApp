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
  const { empresaPick, dataUser, setEmpresaPick, userId } = useAuthApp();
  const [dataEmpleado, setDataEmpleado] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (!empresaPick?.id || !userId) return; // Verificamos que existan valores sssssssssss
    const getData = async () => {
      try {
        const data = await getEmpleadoEmpresa(empresaPick.id, userId);
        setDataEmpleado(data);
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
          {dataEmpleado?.encargadoEmpresa && (
            <TouchableOpacity
              onPress={() => router.navigate("/home/start/config")}
            >
              <View style={{ position: "absolute", right: 10, top: 5 }}>
                <MiIcono size={36} type="Ionicons" name="settings" />
              </View>
            </TouchableOpacity>
          )}
          <View className="flex-row flex-wrap gap-4 self-center">
            <BotonesHome
              onPress={() => router.navigate("/home/start/config/crearZona")}
              name={"tablet-dashboard"}
              type={"MaterialCommunityIcons"}
              nameBoton={"Zonas"}
              color={"#2094bc"}
            />
            <BotonesHome
              name={"calendar"}
              type={"Ionicons"}
              nameBoton={"Reservas"}
              color={"#bc2069"}
            />
          </View>
        </NewBox>
      </FadeIn>
    </MarcoLayout>
  );
};

export default OptionsEmpresa;
