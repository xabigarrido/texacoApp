import { useAuthApp } from "@/context/userContext";
import {
  BotonesHome,
  Box,
  FadeIn,
  HeaderUser,
  MarcoLayout,
  MiIcono,
  TextSmall,
} from "@/utils/utils";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

const OptionsEmpresa = () => {
  const { empresaPick, dataUser, setEmpresaPick, userId } = useAuthApp();
  const router = useRouter();
  useEffect(() => {}, []);
  return (
    <MarcoLayout darkMode={true} className={"justify-between"}>
      <View className="absolute z-50 bottom-10 left-5 flex-row items-center">
        <Image
          source={{ uri: empresaPick.logotipoUrl }}
          style={{ width: 80, height: 80, borderRadius: 15 }}
        />
        <TouchableOpacity
          className="bg-violet-400 p-2 rounded-r-full"
          onPress={() => {
            setEmpresaPick(null);
            router.replace("/home/start");
          }}
        >
          <TextSmall className={"text-white font-bold"}>
            Ver otras empresas
          </TextSmall>
        </TouchableOpacity>
      </View>
      <FadeIn>
        <HeaderUser />
      </FadeIn>
      <FadeIn>
        <Box className={"py-6 px-6 mt-2 items-center"}>
          <View className="flex-row flex-wrap items-center justify-center w-[200px] gap-10">
            <BotonesHome
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
