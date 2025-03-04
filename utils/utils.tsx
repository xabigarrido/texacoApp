import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  Keyboard,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColorScheme } from "nativewind";
import { StatusBar } from "expo-status-bar";
import React, { Children, forwardRef, useEffect, useState } from "react";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useApp } from "@/context/appContext";
import { useAuthApp } from "@/context/userContext";
import {
  collection,
  getDocs,
  query,
  Timestamp,
  where,
} from "firebase/firestore";
import { addTikadaSinPosicion } from "@/api/empresas.api";
import { useRouter } from "expo-router";
import { db } from "@/firebaseConfig";
import { useIsFocused } from "@react-navigation/native";
import { updateUser } from "@/api/auth.api";

const { width: widthScreen, height: heightScreen } = Dimensions.get("window");
export const DarkMode = () => {
  const { colorScheme, toggleColorScheme } = useColorScheme();
  return (
    <TouchableOpacity
      className="bg-navbarBackground dark:bg-[#181818] rounded-full w-[60px] h-[60px] justify-center items-center"
      onPress={() => toggleColorScheme()}
    >
      {colorScheme === "dark" && (
        <MaterialIcons name="light-mode" size={24} color="white" />
      )}
      {colorScheme === "light" && (
        <MaterialIcons name="dark-mode" size={24} color="black" />
      )}
    </TouchableOpacity>
  );
};
export const MarcoLayout = ({
  children,
  className,
  darkMode = false,
  classDark = "bottom-3 right-3",
}) => {
  const insets = useSafeAreaInsets();
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const { loadingData } = useApp();
  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View className="bg-background dark:bg-dark-background">
        <StatusBar />
        <View
          style={{
            height:
              Platform.OS === "android"
                ? heightScreen - insets.bottom
                : heightScreen - insets.bottom - 10,
            marginTop: insets.top,
          }}
          className={className}
        >
          {darkMode && (
            <View className={`absolute z-50 ${classDark}`}>
              <FadeIn timeOut={1000}>
                <DarkMode />
              </FadeIn>
            </View>
          )}
          {loadingData && (
            <View className="items-center w-full">
              <Box
                className={
                  "justify-center items-center h-[100px] w-[90%] rounded-lg"
                }
              >
                <ActivityIndicator size={"large"} />
                <TextSmall>Cargando</TextSmall>
              </Box>
            </View>
          )}
          {!loadingData && children}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};
export const TextSmall = ({ children, className }) => {
  return (
    <Text
      className={`text-textSecondary dark:text-dark-textSecondary font-sans ${className}`}
    >
      {children}
    </Text>
  );
};
export const TextError = ({ children, className }) => {
  return <Text className={`font-sans text-lg ${className}`}>{children}</Text>;
};
export const Boton = ({ children, onPress, className = "bg-green-600" }) => {
  return (
    <TouchableOpacity
      className={`rounded py-4 px-5 ${className} justify-center`}
      onPress={onPress}
      onPressIn={() => Keyboard.dismiss()}
    >
      <Text className="text-white dark:text-white font-sans font-bold text-lg">
        {children}
      </Text>
    </TouchableOpacity>
  );
};
export const BotonIcon = ({
  children,
  onPress,
  className = "bg-green-700",
  type = "AntDesign",
  name = "plussquare",
  size = 24,
  color = "white",
}) => {
  return (
    <TouchableOpacity
      className={`rounded my-2 py-4 px-5 ${className}`}
      onPress={onPress}
      onPressIn={() => Keyboard.dismiss()}
    >
      <View className="flex-row gap-4 justify-between">
        {children && (
          <Text className="text-white dark:text-white font-sans font-bold text-lg">
            {children}
          </Text>
        )}

        <MiIcono type={type} name={name} size={size} color={color} />
      </View>
    </TouchableOpacity>
  );
};
export const BotonIconSize = ({
  children,
  onPress,
  className = "bg-green-700",
  type = "AntDesign",
  name = "plussquare",
  size = 24,
  color = "white",
}) => {
  return (
    <TouchableOpacity
      className={`rounded my-2 ${className}`}
      onPress={onPress}
      onPressIn={() => Keyboard.dismiss()}
    >
      <View className="flex-row gap-4 justify-between">
        {children && (
          <Text className="text-white dark:text-white font-sans font-bold text-lg">
            {children}
          </Text>
        )}

        <MiIcono type={type} name={name} size={size} color={color} />
      </View>
    </TouchableOpacity>
  );
};
export const Box = ({ children, className }) => {
  return (
    <View
      className={`bg-cardBackground dark:bg-dark-cardBackground w-[98%] ${className}`}
    >
      {children}
    </View>
  );
};
export const BoxSize = ({ children, className }) => {
  return (
    <View
      className={`bg-cardBackground dark:bg-dark-cardBackground ${className}`}
    >
      {children}
    </View>
  );
};
export const FadeIn = ({
  children,
  duration = 1000,
  timeOut = 0,
  initial = 0,
}) => {
  const opacity = useSharedValue(initial);
  useEffect(() => {
    const timeOutId = setTimeout(() => {
      opacity.value = withTiming(0, { duration }, () => {
        opacity.value = withTiming(1, { duration });
      });
    }, timeOut);
    return () => clearTimeout(timeOutId);
  }, []);
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));
  return (
    <Animated.View
      className={"items-center"}
      style={[
        animatedStyle,
        {
          // width: "100%",
          // alignItems: "center",
        },
      ]}
    >
      {children}
    </Animated.View>
  );
};
export const FadeInSinInputs = ({
  children,
  duration = 1000,
  timeOut = 0,
  initial = 0,
}) => {
  const opacity = useSharedValue(initial);
  useEffect(() => {
    const timeOutId = setTimeout(() => {
      opacity.value = withTiming(0, { duration }, () => {
        opacity.value = withTiming(1, { duration });
      });
    }, timeOut);
    return () => clearTimeout(timeOutId);
  }, []);
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));
  return (
    <Animated.View
      style={[
        animatedStyle,
        {
          width: "100%",
          alignItems: "center",
        },
      ]}
    >
      {children}
    </Animated.View>
  );
};
interface MiInputProps {
  className?: string;
  placeholder?: string;
  onChangeText?: (text: string) => void;
  onBlur?: () => void;
  value?: string;
  errors?: boolean;
  onSubmitEditing?: () => void;
  keyboardType?: string;
}
export const MiInput = forwardRef<TextInput, MiInputProps>(
  (
    {
      className = "w-[80%]",
      placeholder,
      onChangeText,
      onBlur,
      value,
      errors,
      onSubmitEditing,
      keyboardType = "default",
    },
    ref
  ) => {
    const { colorScheme } = useColorScheme();

    // Establecer estilo de error si es necesario
    let styleErrors;
    if (errors) {
      styleErrors = {
        borderWidth: 1,
        borderColor: "red",
      };
    }

    return (
      <TextInput
        ref={ref} // Asegurarse de pasar la referencia al TextInput
        placeholder={placeholder}
        placeholderTextColor={colorScheme === "dark" ? "white" : "black"}
        className={`bg-inputBackground dark:bg-dark-inputBackground my-2 h-14 text-center text-textPrimary dark:text-dark-textPrimary rounded ${className}`}
        onChangeText={onChangeText}
        onBlur={onBlur}
        value={value}
        style={styleErrors}
        onSubmitEditing={onSubmitEditing}
        keyboardType={keyboardType}
      />
    );
  }
);
// export const MiInput = forwardRef(
//   (
//     {
//       className,
//       placeholder,
//       onChangeText,
//       onBlur,
//       value,
//       errors,
//       onSubmitEditing,
//     },
//     ref
//   ) => {
//     const { colorScheme } = useColorScheme();
//     let styleErrors;
//     if (errors) {
//       styleErrors = {
//         borderWidth: 1,
//         borderColor: "red",
//       };
//     }
//     return (
//       <TextInput
//         placeholder={placeholder}
//         placeholderTextColor={colorScheme === "dark" ? "white" : "black"}
//         className={`bg-inputBackground dark:bg-dark-inputBackground my-2 h-14 text-center text-textPrimary dark:text-dark-textPrimary rounded ${className}`}
//         onChangeText={onChangeText}
//         onBlur={onBlur}
//         value={value}
//         style={styleErrors}
//         onSubmitEditing={onSubmitEditing}
//       />
//     );
//   }
// );
export const useDarkMode = () => {
  const { toggleColorScheme } = useColorScheme();
  return { toggleDarkMode: toggleColorScheme };
};
export const AnimacionXYRotate = ({
  children,
  initialX = 0,
  initialY = 0,
  rotate = 0,
  durationTranslate = 1000,
  durationRotate = 1000,
  scale = 1,
  durationScale = 1000,
}) => {
  const translateX = useSharedValue(initialX);
  const translateY = useSharedValue(initialY);
  const rotateNow = useSharedValue(0);
  const scaleNow = useSharedValue(1);
  useEffect(() => {
    translateX.value = withTiming(0, { duration: durationTranslate });
    translateY.value = withTiming(0, { duration: durationTranslate });
    let timeOutRotate;
    let timeOutScale;

    if (rotate !== 0) {
      timeOutRotate = setTimeout(() => {
        rotateNow.value = withSequence(
          withTiming(rotate, { duration: durationRotate }),
          withTiming(0, { duration: durationRotate })
        );
      }, durationTranslate);
    }

    if (scale !== 1) {
      timeOutScale = setTimeout(() => {
        scaleNow.value = withSequence(
          withTiming(scale, { duration: durationScale }),
          withTiming(1, { duration: durationScale })
        );
      }, durationTranslate);
    }

    return () => {
      if (timeOutRotate) clearTimeout(timeOutRotate);
      if (timeOutScale) clearTimeout(timeOutScale);
    };
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      // width: "100%",
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { rotate: `${rotateNow.value}deg` },
        { scale: scaleNow.value },
      ],
    };
  });
  return <Animated.View style={[animatedStyle]}>{children}</Animated.View>;
};
export const MiIcono = ({
  type = "AntDesign",
  name = "infocirlce",
  size = 24,
  color = "",
  className = "",
}) => {
  const { colorScheme } = useColorScheme();
  if (color == "" && className == "") {
    color = colorScheme === "dark" ? "#E0E0E0" : "#333333";
  } else if (color != "") {
    color = color;
  } else {
    color = className;
  }
  if (type === "Entypo") {
    return <Entypo name={name} size={size} color={color} />;
  } else if (type === "FontAwesome") {
    return <FontAwesome name={name} size={size} color={color} />;
  } else if (type === "AntDesign") {
    return <AntDesign name={name} size={size} color={color} />;
  } else if (type === "MaterialCommunityIcons") {
    return <MaterialCommunityIcons name={name} size={size} color={color} />;
  } else if (type === "FontAwesome6") {
    return <FontAwesome6 name={name} size={size} color={color} />;
  } else if (type === "Ionicons") {
    return <Ionicons name={name} size={size} color={color} />;
  } else if (type === "MaterialIcons") {
    return <MaterialIcons name={name} size={size} color={color} />;
  } else if (type === "FontAwesome5") {
    return <FontAwesome5 name={name} size={size} color={color} />;
  } else {
    return null;
  }
};

export const ScaleAnimation = ({
  children,
  duration = 1000,
  scaleAfter = 1.5,
}) => {
  const scaleNow = useSharedValue(1);

  useEffect(() => {
    scaleNow.value = withRepeat(withTiming(scaleAfter, { duration }), -1, true);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleNow.value }],
  }));
  return <Animated.View style={[animatedStyle]}>{children}</Animated.View>;
};
export const AnimationRotation = ({
  children,
  rotate = 360,
  duration = 1000,
}) => {
  const rotateNow = useSharedValue(0);
  useEffect(() => {
    rotateNow.value = withRepeat(
      withTiming(rotate, { duration, easing: Easing.linear }),
      -1,
      false
    );
  }, []);
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotateNow.value}deg` }],
    };
  });
  return <Animated.View style={[animatedStyle]}>{children}</Animated.View>;
};
export const HeaderUser = React.memo(() => {
  const { dataUser, empresaPick } = useAuthApp();
  const [datosTikada, setDatosTikada] = useState({
    horaEntrada: "No disponible",
    tiempoTrabajado: { horas: 0, minutos: 0 },
  });
  const isFocus = useIsFocused();
  const router = useRouter();

  useEffect(() => {
    if (!dataUser) return;
    const getTikada = async () => {
      try {
        const q = query(
          collection(db, "Tikadas"),
          where("idEmpleado", "==", dataUser.id),
          where("estado", "==", true)
        );
        const docSnap = await getDocs(q);

        if (!docSnap.empty) {
          const data = docSnap.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))[0];

          if (data?.entrada?.seconds) {
            const entradaDate = new Date(data.entrada.seconds * 1000);
            setDatosTikada({
              horaEntrada: fechaFormateada(entradaDate),
              tiempoTrabajado: calcularTiempoTrabajado(entradaDate, new Date()),
            });
          } else {
            setDatosTikada({
              horaEntrada: "No disponible",
              tiempoTrabajado: { horas: 0, minutos: 0 },
            });
          }
        } else {
          setDatosTikada({
            horaEntrada: "No disponible",
            tiempoTrabajado: { horas: 0, minutos: 0 },
          });
        }
      } catch (error) {
        console.log("Error obteniendo datos:", error);
      }
    };
    console.log(empresaPick);
    getTikada();
  }, [isFocus]);

  return (
    <Box className={"p-3"}>
      <View className="flex-row justify-around items-center ">
        <View className="flex-1">
          <TextSmall className={"text-2xl font-medium"}>
            {dataUser.name} {dataUser?.subname}
            {empresaPick && (
              <>
                <TextSmall> en </TextSmall>
                <TextSmall
                  className={"text-blue-700 dark:text-blue-400 font-bold"}
                >
                  {empresaPick.nameEmpresa}
                </TextSmall>
              </>
            )}
          </TextSmall>
          <View className="flex-row gap-2">
            <>
              <View className="flex-row gap-2">
                <View
                  className={`p-2 ${
                    dataUser.trabajando ? "bg-green-800" : "bg-red-600"
                  } rounded self-start mt-1 w-auto`}
                >
                  <TextSmall className={"text-white"}>
                    {dataUser.trabajando ? "Trabajando" : " No trabajando"}
                  </TextSmall>
                </View>
                {empresaPick &&
                  dataUser.trabajando &&
                  dataUser.idEmpresaTrabajando == empresaPick.id && (
                    <TouchableOpacity
                      onPress={() => {
                        if (!empresaPick.posicionHabilitada) {
                          addTikadaSinPosicion(dataUser, empresaPick);
                        } else {
                          router.replace("/home/start/tikadaMaps");
                        }
                      }}
                    >
                      <View
                        className={`p-2 ${
                          dataUser.trabajando ? "bg-red-600" : "bg-green-800"
                        } rounded self-start mt-1 w-auto`}
                      >
                        <TextSmall className={"text-white"}>
                          {dataUser.trabajando
                            ? "Salir del turno ahora"
                            : "Iniciar turno ahora"}
                        </TextSmall>
                      </View>
                    </TouchableOpacity>
                  )}
                {empresaPick && !dataUser.trabajando && (
                  <TouchableOpacity
                    onPress={() => {
                      if (!empresaPick.posicionHabilitada) {
                        addTikadaSinPosicion(dataUser, empresaPick);
                      } else {
                        router.replace("/home/start/tikadaMaps");
                      }
                    }}
                  >
                    <View
                      className={`p-2 ${
                        dataUser.trabajando ? "bg-red-600" : "bg-green-800"
                      } rounded self-start mt-1 w-auto`}
                    >
                      <TextSmall className={"text-white"}>
                        {dataUser.trabajando
                          ? "Salir del turno ahora"
                          : "Iniciar turno ahora"}
                      </TextSmall>
                    </View>
                  </TouchableOpacity>
                )}
                {/* {empresaPick ? (
                  <TouchableOpacity
                    onPress={() => {
                      if (!empresaPick.posicionHabilitada) {
                        addTikadaSinPosicion(dataUser, empresaPick);
                      } else {
                        router.replace("/home/start/tikadaMaps");
                      }
                    }}
                  >
                    <View
                      className={`p-2 ${
                        dataUser.trabajando ? "bg-red-600" : "bg-green-800"
                      } rounded self-start mt-1 w-auto`}
                    >
                      <TextSmall className={"text-white"}>
                        {dataUser.trabajando
                          ? "Salir del turno ahora"
                          : "Iniciar turno ahora"}
                      </TextSmall>
                    </View>
                  </TouchableOpacity>
                ) : (
                  empresaPick &&
                  dataUser.trabajando &&
                  dataUser.idEmpresaTrabajando == empresaPick.id && (
                    <TouchableOpacity
                      onPress={() => {
                        addTikadaSinPosicion(dataUser, {
                          id: dataUser?.idEmpresaTrabajando,
                        });
                      }}
                    >
                      <View
                        className={`p-2 ${
                          dataUser.trabajando ? "bg-red-600" : "bg-green-800"
                        } rounded self-start mt-1 w-auto`}
                      >
                        <TextSmall className={"text-white"}>
                          {dataUser.trabajando
                            ? "Salir del turno ahora"
                            : "Iniciar turno ahora"}
                        </TextSmall>
                      </View>
                    </TouchableOpacity>
                  )
                )} */}
              </View>
            </>
          </View>

          {dataUser.trabajando && (
            <>
              <View className="flex-row gap-2">
                <View
                  className={`p-2 bg-green-800 rounded self-start mt-1 w-auto`}
                >
                  <TextSmall className={"text-white"}>Entrada</TextSmall>
                </View>
                <View className={`p-2  rounded self-start mt-1 w-auto`}>
                  <TextSmall className={"font-sans font-semibold"}>
                    {datosTikada.horaEntrada}
                  </TextSmall>
                </View>
              </View>
              <View className="flex-row gap-2">
                <View
                  className={`p-2 bg-violet-800 rounded self-start mt-1 w-auto`}
                >
                  <TextSmall className={"text-white"}>
                    Tiempo trabajado
                  </TextSmall>
                </View>
                <View className={`p-2  rounded self-start mt-1 w-auto`}>
                  <TextSmall className={"font-sans font-semibold"}>
                    {datosTikada.tiempoTrabajado.horas} h{" "}
                    {datosTikada.tiempoTrabajado.minutos} min
                  </TextSmall>
                </View>
              </View>
            </>
          )}
        </View>
        <TouchableOpacity
          onPress={async () => {
            await updateUser(dataUser.id, { newUser: true });
          }}
        >
          <Image
            source={{ uri: dataUser.imageUrl }}
            style={{ width: 80, height: 80, borderRadius: 15 }}
          />
        </TouchableOpacity>
      </View>
    </Box>
  );
});
export const BotonesHome = ({ nameBoton, onPress, type, name, color }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View className="items-center h-[120px]">
        <MiIcono type={type} name={name} size={80} color={color} />
        <TextSmall className={"font-bold text-xl"}>{nameBoton}</TextSmall>
      </View>
    </TouchableOpacity>
  );
};
export const BotonesAdmin = ({
  type,
  name,
  color,
  size,
  nameBoton,
  onPress,
}) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View className="flex-row items-center gap-3 border-[.5px] p-1 rounded-xl w-[300px] justify-between my-1 dark:border-white">
        <MiIcono type={type} name={name} color={color} size={size} />
        <TextSmall className={"text-xl text-center"}>{nameBoton}</TextSmall>

        <View />
      </View>
    </TouchableOpacity>
  );
};
export const FadeInRepeat = ({ duration = 1000, children }) => {
  const opacity = useSharedValue(1);
  useEffect(() => {
    opacity.value = withRepeat(withTiming(0, { duration }), -1, true);
  }, []);
  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));
  return <Animated.View style={[animatedStyle]}>{children}</Animated.View>;
};
export const mostrarAlerta = (titulo, mensaje, onPressTrue, onPressFalse) => {
  Alert.alert(
    titulo,
    mensaje,
    [
      {
        text: "Cancelar",
        onPress: onPressFalse,
        style: "cancel",
      },
      {
        text: "Aceptar",
        onPress: onPressTrue,
      },
    ],
    { cancelable: true } // Evita que se cierre tocando fuera de la alerta
  );
};

export const convertirFecha = (fechaFirestore) => {
  if (fechaFirestore instanceof Timestamp) {
    return fechaFirestore.toDate().toLocaleDateString(); // Convierte a una fecha legible
  }
  return "Fecha no disponible"; // Manejo de error
};

export function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371000; // Radio de la Tierra en metros
  const toRad = (value) => (value * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distancia en metros
}
export function formatDistance(distanceMeters) {
  if (distanceMeters < 1000) {
    // Redondea a entero y añade "m"
    return Math.round(distanceMeters) + " m";
  } else {
    // Convierte a kilómetros, con 1 decimal, y añade "km"
    return (distanceMeters / 1000).toFixed(1) + " km";
  }
}
const opciones = {
  day: "2-digit",
  month: "short", // "short" para abreviado (ej. "ene"), "long" para completo (ej. "enero")
  hour: "2-digit",
  minute: "2-digit",
};

export const fechaFormateada = (data) => {
  if (!data) return "Fecha no disponible";
  // Verifica si data tiene el método toDate (es un Timestamp de Firestore)
  if (typeof data.toDate === "function") {
    return data.toDate().toLocaleString("es-ES", opciones);
  } else {
    // Si data ya es un objeto Date o una cadena válida, conviértelo a Date
    const dateObj =
      typeof data === "object" && data.seconds
        ? new Date(data.seconds * 1000)
        : new Date(data);
    return dateObj.toLocaleString("es-ES", opciones);
  }
};

export const calcularTiempoTrabajado = (entrada, salida) => {
  const diferenciaMs = salida - entrada; // Diferencia en milisegundos
  const horas = Math.floor(diferenciaMs / (1000 * 60 * 60));
  const minutos = Math.floor((diferenciaMs % (1000 * 60 * 60)) / (1000 * 60));
  const segundos = Math.floor((diferenciaMs % (1000 * 60)) / 1000);

  return { horas, minutos, segundos };
};

// console.log(
//   `Horas: ${tiempoTrabajado.horas}, Minutos: ${tiempoTrabajado.minutos}, Segundos: ${tiempoTrabajado.segundos}`
// );
