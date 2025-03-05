import "react-native-reanimated";
import "../global.css";
import Auth from "./Auth";
import { MarcoLayout, TextSmall } from "@/utils/utils";
import { useAuthApp } from "@/context/userContext";
import { useEffect } from "react";
import FirstHome from "./home";
import { ActivityIndicator } from "react-native";
export default function initialApp() {
  const { isLoaded, isSignedIn } = useAuthApp();
  if (!isLoaded) {
    return (
      <MarcoLayout className={"justify-center items-center"}>
        <ActivityIndicator size="large" color="white" />
        <TextSmall>Cargando</TextSmall>
      </MarcoLayout>
    );
  }
  return isSignedIn ? <FirstHome /> : <Auth />;
}
