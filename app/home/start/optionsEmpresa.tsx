import { useAuthApp } from "@/context/userContext";
import {
  BotonesHome,
  Box,
  FadeIn,
  HeaderUser,
  MarcoLayout,
  MiIcono,
  TabMenu,
  TextSmall,
} from "@/utils/utils";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

const OptionsEmpresa = () => {
  const { empresaPick, dataUser, setEmpresaPick, userId } = useAuthApp();
  const router = useRouter();

  return (
    <MarcoLayout darkMode={true} className={"justify-between"}>
      <TabMenu />
      <FadeIn>
        <HeaderUser />
      </FadeIn>
      <FadeIn>
        <Box className={"py-6 px-6 mt-2 items-center"}>
          <View className="flex-row flex-wrap items-center justify-center w-[200px] gap-10">
            <BotonesHome
              onPress={() => router.navigate("/home/start/config/pruebasMapa")}
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
            {empresaPick.superAdmin === userId && (
              <BotonesHome
                onPress={() => router.navigate("/home/start/config/")}
                name={"settings"}
                type={"MaterialIcons"}
                nameBoton={"Administración"}
                color={"#8f8f8f"}
              />
            )}
          </View>
        </Box>
      </FadeIn>
      <View />
      <View />
      <View />
    </MarcoLayout>
  );
};

export default OptionsEmpresa;
