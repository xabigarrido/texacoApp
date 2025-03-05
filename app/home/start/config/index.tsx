import { useAuthApp } from "@/context/userContext";
import {
  BotonesAdmin,
  BotonesHome,
  Box,
  FadeIn,
  FadeInRepeat,
  HeaderUser,
  MarcoLayout,
  MiIcono,
  TabMenu,
  TextSmall,
} from "@/utils/utils";
import { useRouter } from "expo-router";
import {
  collection,
  db,
  onSnapshot,
  query,
  where,
  getDocs,
} from "../../../../firebaseConfig";
import { useEffect, useState } from "react";
import { Image, Text, View } from "react-native";

const AdminEmpresa = () => {
  const { empresaPick, dataUser } = useAuthApp();
  const router = useRouter();
  const collectRefSolicitudes = collection(db, "Solicitudes");
  const [solicitudes, setSolicitudes] = useState([]);
  useEffect(() => {
    if (!empresaPick?.identificador) return; // Si empresaPick no está listo, salimos
    const q = query(
      collectRefSolicitudes,
      where("identificador", "==", empresaPick.identificador),
      where("userId", "!=", null)
    );
    const fetchData = async () => {
      try {
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setSolicitudes(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();

    const unsuscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setSolicitudes(data);
    });

    return () => unsuscribe();
  }, [empresaPick]);
  return (
    <MarcoLayout darkMode={true} className={"justify-between"}>
      <TabMenu />
      <FadeIn>
        <HeaderUser />
        <Box className={"my-2 w-[80%] py-3"}>
          <TextSmall className={"text-center font-bold text-3xl"}>
            Administracion de {empresaPick.nameEmpresa}
          </TextSmall>

          <Text
            className={"text-center font-bold font-sans text-red-500 text-xl"}
          >
            {empresaPick.identificador}
          </Text>
          <TextSmall className={"text-center"}>
            Código emparejamiento de empleados
          </TextSmall>
        </Box>
        <Box className={"p-6 m-2"}>
          <View className="items-center justify-center mt-2">
            <View className="flex-row items-center gap-1">
              <BotonesAdmin
                type={"MaterialCommunityIcons"}
                name={"email-fast"}
                color={"#63c466"}
                size={40}
                nameBoton={"Gestion Solicitudes"}
                onPress={() =>
                  router.navigate("/home/start/config/gestionSolicitudes")
                }
              />
              {solicitudes.length > 0 && (
                <FadeInRepeat duration={2000}>
                  <View className="bg-red-500 w-[40px] h-[40px] rounded-full justify-center items-center">
                    <TextSmall className={"text-4xl font-bold text-white"}>
                      {solicitudes.length}
                    </TextSmall>
                  </View>
                </FadeInRepeat>
              )}
            </View>
            <BotonesAdmin
              type={"FontAwesome"}
              name={"users"}
              color={"#efb644"}
              size={40}
              nameBoton={"Gestion Empleados"}
              onPress={() => router.push("/home/start/config/gestionEmpleados")}
            />

            <BotonesAdmin
              name={"tablet-dashboard"}
              type={"MaterialCommunityIcons"}
              nameBoton={"Gestion Zonas"}
              color={"#2094bc"}
              size={40}
            />
            <BotonesAdmin
              name={"box"}
              type={"FontAwesome5"}
              nameBoton={"Gestion Caja"}
              color={"#eb6757"}
              size={40}
            />
          </View>
        </Box>
      </FadeIn>
    </MarcoLayout>
  );
};

export default AdminEmpresa;
