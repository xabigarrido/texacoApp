import { addEncargadoEmpresa, deleteEmpleadoEmpresa } from "@/api/empresas.api";
import { useAuthApp } from "@/context/userContext";
import { collection, db, doc, getDoc } from "@/firebaseConfig";
import {
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

  useEffect(() => {
    const getEmpleado = async () => {
      const docRef = doc(empleadosRef, id);
      const docSnap = await getDoc(docRef);
      setEmpleado(docSnap.data());
    };
    getEmpleado();
    return () => id;
  }, [id]);

  return (
    <MarcoLayout darkMode={true} className={"justify-between"}>
      <FadeIn>
        <HeaderUser />
        <NewBox className={"p-6 mt-2 items-center"}>
          <View className="items-center">
            <Image
              source={{ uri: empleado.imageUrl }}
              style={{ height: 100, width: 100, borderRadius: 15 }}
            />
            <TextSmall className={"text-xl font-bold"}>
              {empleado.name} {empleado.subname}
            </TextSmall>
            <TextSmall className={"text-lg font-semibold"}>
              Incorporacion
            </TextSmall>
            <TextSmall className={"text-lg"}>
              {convertirFecha(empleado.createdAt)}
            </TextSmall>
            <View className="justify-center">
              <TouchableOpacity
                className="bg-violet-700 px-4 py-2 rounded my-1 self-center"
                onPress={() => {
                  router.push("/home/start/config/tikadasEmpleado/" + id);
                }}
              >
                <TextSmall
                  className={"font-sans font-semibold text-white text-xl"}
                >
                  Ver Entradas y Salidas
                </TextSmall>
              </TouchableOpacity>
              <TouchableOpacity
                className="bg-buttonPrimary px-4 py-2 rounded my-1 self-start"
                onPress={async () => {
                  await addEncargadoEmpresa(id, empresaPick.id);
                }}
              >
                <TextSmall
                  className={"font-sans font-semibold text-white text-xl"}
                >
                  Asignar puesto encargado
                </TextSmall>
              </TouchableOpacity>
              <TouchableOpacity
                className="bg-red-700 px-4 py-2 rounded my-1 self-center"
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
              >
                <TextSmall
                  className={"font-sans font-semibold text-white text-xl"}
                >
                  Eliminar empleado
                </TextSmall>
              </TouchableOpacity>
            </View>
          </View>
        </NewBox>
      </FadeIn>
    </MarcoLayout>
  );
};

export default AdminEmpresa;
