import React, { useCallback, useEffect } from "react";
import * as WebBrowser from "expo-web-browser";
import * as AuthSession from "expo-auth-session";
import { useSSO, useUser } from "@clerk/clerk-expo";
import { View, Button } from "react-native";
import { BotonIcon } from "@/utils/utils";
import { createdUserFirebase } from "@/api/auth.api";
import { useApp } from "@/context/appContext";
import { useRouter } from "expo-router";
import { useAuthApp } from "@/context/userContext";

export const useWarmUpBrowser = () => {
  useEffect(() => {
    void WebBrowser.warmUpAsync();
    return () => {
      void WebBrowser.coolDownAsync();
    };
  }, []);
};

WebBrowser.maybeCompleteAuthSession();

export default function ContainerBotonesGoogleApple() {
  useWarmUpBrowser();
  const { setLoadingData } = useApp();
  const { startSSOFlow } = useSSO();
  const { dataUser } = useAuthApp();
  const router = useRouter();

  const onPress = useCallback(async () => {
    try {
      setLoadingData(true);
      const { createdSessionId, setActive, signIn, signUp } =
        await startSSOFlow({
          strategy: "oauth_google",
        });
      router.replace("/home/start");
      if (createdSessionId) {
        setActive!({ session: createdSessionId });
      } else {
        console.log("error al iniciar sesion");
      }
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    } finally {
      setLoadingData(false);
    }
  }, []);

  return (
    <>
      <BotonIcon
        className="bg-buttonPrimary w-[80%]"
        name={"google"}
        onPress={onPress}
      >
        Iniciar sesion con Google
      </BotonIcon>
      <BotonIcon className="bg-black w-[80%]" name={"apple1"}>
        Iniciar sesion con Apple
      </BotonIcon>
    </>
  );
}
