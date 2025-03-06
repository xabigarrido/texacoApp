import { useAuthApp } from "@/context/userContext";
import {
  Box,
  FadeIn,
  HeaderUser,
  MarcoLayout,
  NewBox,
  TabMenu,
  TextSmall,
} from "@/utils/utils";
import { useRouter } from "expo-router";
import {
  collection,
  db,
  doc,
  getDocs,
  onSnapshot,
} from "../../../../firebaseConfig";
import { useEffect, useState } from "react";
import { Image, TouchableOpacity, View } from "react-native";
import { useIsFocused } from "@react-navigation/native";

const GestionEmpleados = () => {
  const { empresaPick, dataUser } = useAuthApp();
  const [empleados, setEmpleados] = useState([]);
  const isFocus = useIsFocused();
  const router = useRouter();

  const empleadosRef = collection(db, "Empresas", empresaPick.id, "Empleados");
  useEffect(() => {
    if (!empresaPick || !empresaPick.id) return;
    const unsuscribe = onSnapshot(empleadosRef, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        idDoc: doc.id,
        ...doc.data(),
      }));
      setEmpleados(data);
    });

    return () => unsuscribe();
  }, [isFocus]);

  return (
    <MarcoLayout darkMode={true} className={"justify-between"}>
      <TabMenu />
      <FadeIn>
        <HeaderUser />
        <NewBox className={"p-6 m-2"}>
          <TextSmall className={"text-center text-xl"}>
            Haz click en los empleados para mas informacion
          </TextSmall>
          {empleados.length > 0 &&
            empleados.map((empleado) => (
              <TouchableOpacity
                key={empleado.id}
                onPress={() =>
                  router.push(
                    "/home/start/config/detallesEmpleado/" + empleado.idDoc
                  )
                }
              >
                <View className="p-3 my-1 flex-row gap-2">
                  <Image
                    source={{ uri: empleado.imageUrl }}
                    style={{ height: 50, width: 50, borderRadius: 15 }}
                  />
                  <View>
                    <TextSmall className={"text-lg"}>
                      {empleado.name} {empleado.subname}
                    </TextSmall>
                    {empleado.trabajando ? (
                      <View className="bg-green-800 self-start px-3 py-1 rounded">
                        <TextSmall className={"font-sans text-white font-bold"}>
                          Trabajando
                        </TextSmall>
                      </View>
                    ) : (
                      <View className="bg-red-800 self-start px-3 py-1 rounded">
                        <TextSmall className={"font-sans text-white font-bold"}>
                          No trabajando
                        </TextSmall>
                      </View>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            ))}
        </NewBox>
      </FadeIn>
    </MarcoLayout>
  );
};

export default GestionEmpleados;
