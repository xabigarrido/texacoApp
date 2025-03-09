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
  Text,
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
  const [tarifaPorHora, setTarifaPorHora] = useState(0);

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
      <View className="p-4 bg-white dark:bg-neutral-900 rounded-xl shadow-md border border-gray-300 dark:border-neutral-700 w-full mt-4">
        {/* Encabezado con el día */}
        <View className="absolute -top-5 right-2 bg-blue-500 dark:bg-gray-700 px-3 py-1 rounded-lg shadow-md">
          <Text className="text-white font-bold text-lg">
            {formatearFechaFirestore(tikada?.entrada, "diaLetra")}
          </Text>
        </View>

        {/* Contenedor Principal */}
        <View className="flex-row items-center gap-4">
          {/* Nuevo Diseño del Ícono de Calendario */}
          <View className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center shadow-md">
            <Text className="text-4xl font-bold text-gray-900 dark:text-gray-100">
              {formatearFechaFirestore(tikada?.entrada, "diaNumero")}
            </Text>
            <Text className="text-lg font-semibold text-gray-700 dark:text-gray-300">
              {formatearFechaFirestore(tikada?.entrada, "mesDiminutivo")}
            </Text>
          </View>

          {/* Datos de asistencia */}
          <View className="flex-1 space-y-3">
            {/* Entrada y salida */}
            <View className="flex-row justify-between items-center">
              <View className="flex-row items-center gap-2">
                <MiIcono
                  type="Ionicons"
                  name="enter"
                  color="#3d9b59"
                  size={32}
                />
                <Text className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                  {formatearFechaFirestore(tikada?.entrada, "hora")}
                </Text>
              </View>
              <View className="flex-row items-center gap-2">
                <MiIcono
                  type="Ionicons"
                  name="exit"
                  size={32}
                  color="#f35959"
                />
                <Text className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                  {!tikada?.estado
                    ? formatearFechaFirestore(tikada?.salida, "hora")
                    : "Pendiente"}
                </Text>
              </View>
            </View>

            {/* Tiempo trabajado y pago */}
            <View className="flex-row justify-between items-center">
              <View className="flex-row items-center gap-2">
                <MiIcono
                  type="Ionicons"
                  name="time"
                  color="#fdab40"
                  size={28}
                />
                <Text className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                  {tikada?.estado
                    ? calcularTiempoTrabajadoAdmin(tikada?.entrada, new Date())
                    : calcularTiempoTrabajadoAdmin(
                        tikada?.entrada,
                        tikada?.salida
                      )}
                </Text>
              </View>
              <View className="flex-row items-center gap-2">
                <MiIcono
                  type="FontAwesome6"
                  name="sack-dollar"
                  size={26}
                  color="#81aae7"
                />
                <Text className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                  {!tikada?.estado ? `${pago}€` : "Pendiente"}
                </Text>
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
      <NewBox className={"mt-2 px-2"}>
        <TextInput
          onChangeText={(text) => setTarifaPorHora(text)}
          value={tarifaPorHora}
          placeholder="Tarifa por hora"
          placeholderTextColor={colorScheme === "dark" ? "white" : "black"}
          keyboardType="number-pad"
          className="bg-inputBackground dark:bg-dark-inputBackground p-3 text-center text-textPrimary dark:text-dark-textPrimary rounded-2xl mb-2"
          // style={{ marginTop: 20, marginBottom: 10 }}
        />

        <FlatList
          data={tikadas}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <TikadasScreen tikada={item} />}
          contentContainerStyle={{
            flexGrow: 1,
            // width: "100%",
            paddingTop: 8,
            paddingBottom: 300, // Agrega espacio extra al final
          }}
          scrollEnabled={true} // Habilita el desplazamiento
        />
      </NewBox>
    </MarcoLayoutSinDismiss>
  );
};

export default TikadasEmpleado;
