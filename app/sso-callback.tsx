import { useApp } from "@/context/appContext";
import { useAuthApp } from "@/context/userContext";
import { Box, FadeIn, HeaderUser, MarcoLayout, TextSmall } from "@/utils/utils";
import { useRouter } from "expo-router";
import { useEffect } from "react";

const SSOCallback = () => {
  //   const { empresaPick, dataUser } = useAuthApp();
  //   const router = useRouter();
  const { setLoadingData } = useApp();
  useEffect(() => {
    setLoadingData(true);
    return () => setLoadingData(false);
  }, []);
  return (
    <MarcoLayout
      darkMode={true}
      className={"justify-between items-center"}
    ></MarcoLayout>
  );
};

export default SSOCallback;
