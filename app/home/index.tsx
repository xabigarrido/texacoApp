import { useApp } from "@/context/appContext";
import { useAuthApp } from "@/context/userContext";
import { MarcoLayout, TextSmall } from "@/utils/utils";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { TouchableOpacity } from "react-native";

export default function Home() {
  const { dataUser, signOut, isLoaded, isSignedIn } = useAuthApp();
  const { setLoadingData } = useApp();
  const router = useRouter();
  useEffect(() => {}, [dataUser, isLoaded, isSignedIn]);
  return (
    <MarcoLayout darkMode={true} className={"justify-center"}></MarcoLayout>
  );
}
