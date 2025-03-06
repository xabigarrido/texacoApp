import {
  addEncargadoEmpresa,
  deleteEmpleadoEmpresa,
  obtenerTikadas,
} from "@/api/empresas.api";
import { useAuthApp } from "@/context/userContext";
import { collection, db, doc, getDoc } from "@/firebaseConfig";
import {
  Box,
  calcularPago,
  calcularTiempoTrabajado,
  calcularTiempoTrabajadoAdmin,
  convertirFecha,
  FadeIn,
  formatearFechaFirestore,
  HeaderUser,
  MarcoLayout,
  MarcoLayoutSinDismiss,
  MiIcono,
  MiInput,
  mostrarAlerta,
  NewBox,
  TextSmall,
} from "@/utils/utils";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useColorScheme } from "nativewind";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const TikadasEmpleado = () => {
  const { empresaPick, dataUser } = useAuthApp();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const empleadosRef = collection(db, "Empresas", empresaPick.id, "Empleados");
  const [empleado, setEmpleado] = useState({});
  const [tikadas, setTikadas] = useState([]);
  const { colorScheme } = useColorScheme();
  const [tarifaPorHora, setTarifaPorHora] = useState(10);

  useEffect(() => {
    const getEmpleado = async () => {
      const docRef = doc(empleadosRef, id);
      const docSnap = await getDoc(docRef);
      setEmpleado(docSnap.data());
    };
    getEmpleado();

    return () => id;
  }, [id]);
  useEffect(() => {
    if (!empleado?.id) return; // Evitamos llamar a la función si el empleado aún no se ha cargadoe

    const getTikadas = async () => {
      try {
        const response = await obtenerTikadas(empleado.id);
        if (response.estado) {
          setTikadas(response.data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    getTikadas();
  }, [empleado]); // Se ejecuta cuando cambia el estado de empleado
  const TikadasScreen = React.memo(({ tikada }) => {
    const pago = calcularPago(tikada?.entrada, tikada?.salida, tarifaPorHora);

    return (
      <View
        className="p-3 bg-background dark:bg-dark-background"
        style={{
          borderWidth: 0.3,
          borderRadius: 5,
          marginTop: 20,
          width: "100%",
        }}
      >
        <View className="flex-row gap-10 items-center">
          <View
            style={{
              right: -5,
              top: -25,
              position: "absolute",
              justifyContent: "flex-end",
            }}
          >
            <TextSmall className={"font-sans text-3xl font-extrabold"}>
              {formatearFechaFirestore(tikada?.entrada, "diaLetra")}
            </TextSmall>
          </View>
          <View>
            <MiIcono
              type="Ionicons"
              name="calendar-clear"
              size={80}
              color={colorScheme === "dark" ? "#c0c0c084" : "#8181817a"}
            />
          </View>
          <View style={{ position: "absolute", top: 22, left: 23 }}>
            <TextSmall className={"text-3xl font-sans font-extrabold"}>
              {formatearFechaFirestore(tikada?.entrada, "diaNumero")}
            </TextSmall>
            <TextSmall className={"text-xl font-sans font-semibold"}>
              {formatearFechaFirestore(tikada?.entrada, "mesDiminutivo")}
            </TextSmall>
          </View>
          <View
            className="mt-2
           flex-1"
          >
            <View className="flex-1 flex-row justify-evenly items-center">
              <View className="flex-row items-center gap-2">
                <MiIcono
                  type="Ionicons"
                  name="enter"
                  color="#3d9b59"
                  size={36}
                />
                <TextSmall className={"text-xl font-semibold"}>
                  {formatearFechaFirestore(tikada?.entrada, "hora")}
                </TextSmall>
              </View>
              <View className="flex-row items-center gap-2">
                <MiIcono
                  type="Ionicons"
                  name="exit"
                  size={36}
                  color="#f35959"
                />
                <TextSmall className={"text-xl font-semibold"}>
                  {!tikada?.estado
                    ? formatearFechaFirestore(tikada?.salida, "hora")
                    : "Pendiente"}
                </TextSmall>
              </View>
            </View>
            <View className="flex-1 flex-row justify-evenly items-center">
              <View className="flex-row items-center gap-2">
                <MiIcono
                  type="Ionicons"
                  name="time"
                  color="#fdab40"
                  size={30}
                />
                <TextSmall className={"text-xl font-semibold"}>
                  {tikada?.estado
                    ? calcularTiempoTrabajadoAdmin(tikada?.entrada, new Date())
                    : calcularTiempoTrabajadoAdmin(
                        tikada?.entrada,
                        tikada?.salida
                      )}
                </TextSmall>
              </View>
              <View className="flex-row items-center gap-2">
                <MiIcono
                  type="FontAwesome6"
                  name="sack-dollar"
                  size={26}
                  color="#81aae7"
                />
                <TextSmall className={"text-xl font-semibold"}>
                  {!tikada?.estado ? `${pago}€` : "Pendiente"}
                </TextSmall>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  });
  return (
    <MarcoLayoutSinDismiss darkMode={true} style={{ flex: 1 }}>
      <HeaderUser />
      <NewBox className={"mt-2 px-2"} style={{ flex: 1 }}>
        <TextInput
          onChangeText={(text) => setTarifaPorHora(text)}
          value={tarifaPorHora}
          placeholder="Tarifa por hora"
          placeholderTextColor={colorScheme === "dark" ? "white" : "black"}
          keyboardType="number-pad"
          className="bg-inputBackground dark:bg-dark-inputBackground p-3 text-center text-textPrimary dark:text-dark-textPrimary rounded"
          style={{ marginTop: 20, marginBottom: 10 }}
        />

        <FlatList
          data={tikadas}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <TikadasScreen tikada={item} />}
          contentContainerStyle={{
            flexGrow: 1,
            // width: "100%",
            paddingBottom: 300, // Agrega espacio extra al final
          }}
          scrollEnabled={true} // Habilita el desplazamiento
        />
      </NewBox>
    </MarcoLayoutSinDismiss>
  );
};

export default TikadasEmpleado;
