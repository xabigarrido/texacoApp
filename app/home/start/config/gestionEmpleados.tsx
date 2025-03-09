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
  orderBy,
  query,
} from "../../../../firebaseConfig";
import { useEffect, useState } from "react";
import { Image, TouchableOpacity, View } from "react-native";
import { useIsFocused } from "@react-navigation/native";

const GestionEmpleados = () => {
  const { empresaPick, dataUser } = useAuthApp();
  const [empleados, setEmpleados] = useState([]);
  const [cantidadEmpleados, setCantidadEmpleados] = useState(0);
  const isFocus = useIsFocused();
  const router = useRouter();

  const empleadosRef = collection(db, "Empresas", empresaPick.id, "Empleados");
  useEffect(() => {
    if (!empresaPick?.id) return;

    // Suscribirse a cambios en tiempo real
    const q = query(empleadosRef, orderBy("name", "asc"));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          idDoc: doc.id,
          ...doc.data(),
        }));
        setEmpleados(data);
        setCantidadEmpleados(data.length); // Se evita una consulta extra
      },
      (error) => console.log("Error al obtener empleados:", error)
    );

    return () => unsubscribe();
  }, [empresaPick?.id]); // Se elimina `isFocus` para evitar recargas innecesarias

  return (
    <MarcoLayout darkMode={true} className={"justify-between"}>
      <TabMenu />
      <FadeIn>
        <HeaderUser />
        <NewBox className={"p-6 m-2"}>
          <TextSmall
            className={"text-center text-2xl font-bold text-gray-800 mb-2"}
          >
            Empleados en {empresaPick.nameEmpresa} {cantidadEmpleados}
          </TextSmall>
          <View className="gap-1 justify-center">
            {empleados.length > 0 &&
              empleados.map((empleado) => (
                <TouchableOpacity
                  className="p-1 shadow-lg bg-white dark:bg-neutral-900 flex my-1"
                  key={empleado.id}
                  onPress={() =>
                    router.push(
                      "/home/start/config/detallesEmpleado/" + empleado.idDoc
                    )
                  }
                  style={{
                    borderRadius: 10,
                  }}
                >
                  <View className="rounded-lg flex-row">
                    <View>
                      <Image
                        source={{ uri: empleado.imageUrl }}
                        style={{
                          height: 60,
                          width: 60,
                          borderRadius: 30,
                          borderWidth: 3,
                          borderColor: "#d8d8d8",
                        }}
                      />
                    </View>

                    <View className="flex-1 justify-center">
                      <TextSmall
                        className={
                          "text-xl font-semibold text-gray-800 text-center"
                        }
                      >
                        {empleado.name}
                      </TextSmall>
                      {!empleado.trabajando && empleado?.subname && (
                        <TextSmall
                          className={
                            "text-base font-semibold text-neutral-400 text-center"
                          }
                        >
                          {empleado?.subname}
                        </TextSmall>
                      )}
                      {empleado.trabajando && (
                        <View className="bg-green-800 self-center px-2 py-1 rounded-lg">
                          <TextSmall className={"text-white font-bold"}>
                            Trabajando en {empleado?.trabajandoPara}
                          </TextSmall>
                        </View>
                      )}
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
          </View>
        </NewBox>
      </FadeIn>
    </MarcoLayout>
  );
};

export default GestionEmpleados;
