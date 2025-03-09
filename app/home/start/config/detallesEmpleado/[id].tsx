import { addEncargadoEmpresa, deleteEmpleadoEmpresa } from "@/api/empresas.api";
import { useAuthApp } from "@/context/userContext";
import { collection, db, doc, getDoc } from "@/firebaseConfig";
import {
  BotonesAdmin,
  Box,
  convertirFecha,
  FadeIn,
  HeaderUser,
  MarcoLayout,
  mostrarAlerta,
  NewBox,
  TextSmall,
} from "@/utils/utils";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Image, TouchableOpacity, View } from "react-native";

const AdminEmpresa = () => {
  const { empresaPick, dataUser } = useAuthApp();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const empleadosRef = collection(db, "Empresas", empresaPick.id, "Empleados");
  const [empleado, setEmpleado] = useState({});
  const getEmpleado = async () => {
    const docRef = doc(empleadosRef, id);
    const docSnap = await getDoc(docRef);
    setEmpleado(docSnap.data());
  };
  useEffect(() => {
    getEmpleado();
    return () => id;
  }, [id]);

  return (
    <MarcoLayout darkMode={true} className={"justify-between"}>
      <FadeIn>
        <HeaderUser />
        <NewBox className={"p-6 mt-2 items-center"}>
          <View className="items-center">
            <View
              className="flex-row w-full shadow-black shadow-lg bg-gray-200 dark:bg-neutral-900 p-1 rounded-2xl"
              style={{ elevation: 3 }}
            >
              {/* Contenedor de la imagen */}
              <View className="">
                <Image
                  source={{ uri: empleado.imageUrl }}
                  style={{ height: 100, width: 100, borderRadius: 15 }}
                />
              </View>

              {/* Contenedor del texto que ocupa el espacio restante */}
              <View className="flex-1 justify-center">
                <View className="items-center ">
                  <TextSmall className="text-xl font-bold">
                    {empleado.name} {empleado.subname}
                  </TextSmall>

                  <TextSmall className="text-lg font-bold">
                    Incorporación
                  </TextSmall>
                  <TextSmall className="text-lg">
                    {convertirFecha(empleado.createdAt)}
                  </TextSmall>
                </View>
              </View>
            </View>

            <BotonesAdmin
              type={"FontAwesome6"}
              name={"person-walking-dashed-line-arrow-right"}
              color={"#58ac74"}
              size={40}
              nameBoton={"Ver entradas y salidas"}
              onPress={() => {
                router.push("/home/start/config/tikadasEmpleado/" + id);
              }}
            />
            {empresaPick.superAdmin === dataUser?.id &&
              !empleado.encargadoEmpresa &&
              empleado.id !== dataUser.id && (
                <BotonesAdmin
                  type={"FontAwesome6"}
                  name={"person-arrow-up-from-line"}
                  color={"#1D4ED8"}
                  size={40}
                  nameBoton={"Asignar puesto encargado"}
                  onPress={async () => {
                    await addEncargadoEmpresa(id, empresaPick.id);
                    getEmpleado();
                  }}
                />
              )}
            {empresaPick.superAdmin == dataUser?.id &&
              empleado.encargadoEmpresa &&
              empleado.id !== dataUser.id && (
                <BotonesAdmin
                  type={"FontAwesome6"}
                  name={"person-arrow-up-from-line"}
                  color={"#d8421d"}
                  size={40}
                  nameBoton={"Quitar puesto encargado"}
                  onPress={async () => {
                    await addEncargadoEmpresa(id, empresaPick.id);
                    getEmpleado();
                  }}
                />
              )}

            {dataUser?.id == empresaPick.superAdmin &&
              dataUser.id !== empleado.id && (
                <BotonesAdmin
                  type={"Feather"}
                  name={"user-x"}
                  color={"#b91c1c"}
                  size={40}
                  nameBoton={"Eliminar empleado"}
                  onPress={async () => {
                    mostrarAlerta(
                      "¿Estas Seguro?",
                      `Deseas eliminar a ${empleado.name}`,
                      async () => {
                        await deleteEmpleadoEmpresa(
                          empleado.id,
                          empresaPick.id,
                          id
                        );
                        router.replace("/home/start/config/gestionEmpleados");
                      }
                    );
                  }}
                />
              )}
          </View>
        </NewBox>
      </FadeIn>
    </MarcoLayout>
  );
};

export default AdminEmpresa;
