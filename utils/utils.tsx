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
import Feather from "@expo/vector-icons/Feather";
import { useApp } from "@/context/appContext";
import { useAuthApp } from "@/context/userContext";
import { Timestamp } from "firebase/firestore";
import {
  addTikadaSinPosicion,
  obtenerEmpresasSolicitud,
} from "@/api/empresas.api";
import { useRouter } from "expo-router";
import {
  db,
  collection,
  getDocs,
  onSnapshot,
  query,
  where,
} from "@/firebaseConfig";
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
export const MarcoLayoutSinDismiss = ({
  children,
  className,
  darkMode = false,
  classDark = "bottom-3 right-3",
}) => {
  const insets = useSafeAreaInsets();
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const { loadingData } = useApp();
  return (
    <View className="bg-background dark:bg-dark-background">
      <StatusBar />
      <View
        style={{
          height:
            Platform.OS === "android"
              ? heightScreen - insets.bottom
              : heightScreen - insets.bottom - 10,
          marginTop: insets.top,
          alignItems: "center",
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
      className={`rounded ${className} justify-center`}
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
        ref={ref} // Asegurarse de pasar la referencia al TextInputs
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
  } else if (type === "Feather") {
    return <Feather name={name} size={size} color={color} />;
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
export const NewBox = ({
  children,
  ancho = true,
  paddingHandle = true,
  noExpandir = false,
}) => {
  return (
    <View
      style={{
        // backgroundColor: "white", // Necesario para que la sombra sea visible
        // padding: 20,
        // borderRadius: 10,
        shadowColor: "#000", // Color de la sombra
        shadowOffset: { width: 0, height: 4 }, // Desplazamiento
        shadowOpacity: 0.3, // Opacidad de la sombra
        shadowRadius: 4, // Difusión de la sombra
        elevation: 20, // Requerido para Androi
        width: ancho ? "98%" : "auto",
        paddingBottom: paddingHandle ? 32 : 10,
        marginBottom: 10,
        alignSelf: noExpandir ? "" : "center",
      }}
      className={
        "p-4 bg-cardBackground dark:bg-dark-cardBackground rounded-2xl self-center"
      }
    >
      {children}
    </View>
  );
};
export const HeaderUser = React.memo(() => {
  const { dataUser, empresaPick, setEmpresaPick } = useAuthApp();
  const [invitaciones, setInvitaciones] = useState([]);
  const [datosTikada, setDatosTikada] = useState({
    horaEntrada: "No disponible",
    tiempoTrabajado: { horas: 0, minutos: 0 },
  });
  const isFocus = useIsFocused();
  const router = useRouter();

  function obtenerHoraActual() {
    const ahora = new Date();
    const horas = ahora.getHours().toString().padStart(2, "0");
    const minutos = ahora.getMinutes().toString().padStart(2, "0");

    return { hora: `${horas}:${minutos}` };
  }
  useEffect(() => {
    const horaActual = obtenerHoraActual();
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
              horaEntrada: horaActual.hora,
              tiempoTrabajado: { horas: 0, minutos: 0 },
            });
          }
        } else {
          setDatosTikada({
            horaEntrada: horaActual.hora,
            tiempoTrabajado: { horas: 0, minutos: 0 },
          });
        }
      } catch (error) {
        console.log("Error obteniendo datos:", error);
      }
    };
    getTikada();
  }, [isFocus, dataUser]);

  useEffect(() => {
    const q2 = query(
      collection(db, "Solicitudes"),
      where("enviarA", "==", dataUser.emailAddress)
    );
    const unsuscribe2 = onSnapshot(q2, (snapshot) => {
      const data2 = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setInvitaciones(data2);
    });
    return () => unsuscribe2();
  }, []);
  return (
    <View
      style={{
        // backgroundColor: "white", // Necesario para que la sombra sea visible
        // padding: 20,
        // borderRadius: 10,
        shadowColor: "#000", // Color de la sombra
        shadowOffset: { width: 0, height: 4 }, // Desplazamiento
        shadowOpacity: 0.3, // Opacidad de la sombra
        shadowRadius: 4, // Difusión de la sombra
        elevation: 20, // Requerido para Androi
        width: "98%",
        paddingBottom: 32,
        marginBottom: 10,
      }}
      className={
        "p-4 bg-cardBackground dark:bg-dark-cardBackground rounded-2xl"
      }
    >
      <View className="flex-row items-center justify-around">
        <View className="gap-2">
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
          {dataUser?.trabajando && datosTikada && (
            <View className="flex-row justify-center items-center">
              <MiIcono type="Ionicons" name="enter" color="#007226" size={30} />
              <TextSmall className={"text-center text-lg "}>
                {datosTikada.horaEntrada}
              </TextSmall>
            </View>
          )}
        </View>
        <View className="self-start gap-1">
          {dataUser?.trabajando && (
            <Etiqueta className={"bg-green-800"}>
              Trabajando en {dataUser?.trabajandoPara}
            </Etiqueta>
          )}
          {!dataUser?.trabajando && (
            <Etiqueta className={"bg-violet-800"}>No trabajando</Etiqueta>
          )}
          {!empresaPick && (
            <TouchableOpacity
              onPress={() => router.replace("/home/iniciarEnEmpresa")}
            >
              <Etiqueta className={"bg-violet-800"}>
                Invitaciones {invitaciones.length}
              </Etiqueta>
            </TouchableOpacity>
          )}
          {!dataUser?.trabajando && empresaPick && (
            <TouchableOpacity
              onPress={() => {
                if (!empresaPick.posicionHabilitada) {
                  addTikadaSinPosicion(dataUser, empresaPick);
                } else {
                  router.replace("/home/start/tikadaMaps");
                }
              }}
            >
              <Etiqueta className={"bg-green-800"}>Iniciar turno</Etiqueta>
            </TouchableOpacity>
          )}
          {dataUser?.trabajando &&
            empresaPick &&
            dataUser?.idEmpresaTrabajando == empresaPick.id && (
              <TouchableOpacity
                onPress={() => {
                  if (!empresaPick.posicionHabilitada) {
                    addTikadaSinPosicion(dataUser, empresaPick);
                  } else {
                    router.replace("/home/start/tikadaMaps");
                  }
                }}
              >
                <Etiqueta className={"bg-red-800"}>Salir del turno</Etiqueta>
              </TouchableOpacity>
            )}
        </View>

        {empresaPick && (
          <View className="items-center">
            {dataUser?.trabajando && (
              <View className="flex-row ml-1">
                <TextSmall className={"text-center text-lg"}>
                  {`${datosTikada?.tiempoTrabajado.horas}h ${datosTikada?.tiempoTrabajado.minutos} min`}
                </TextSmall>
              </View>
            )}
            <TouchableOpacity
              onPress={() => {
                setEmpresaPick(null);
                router.replace("/home/");
              }}
            >
              <Image
                source={{ uri: empresaPick?.logotipoUrl }}
                style={{ width: 80, height: 80, borderRadius: 15 }}
              />
            </TouchableOpacity>
          </View>
        )}
      </View>
      <View
        className="self-center absolute p-2 bg-background dark:bg-dark-background rounded-lg"
        style={{
          bottom: -15,
          shadowColor: "#000", // Color de la sombra
          shadowOffset: { width: 0, height: 4 }, // Desplazamiento
          shadowOpacity: 0.3, // Opacidad de la sombra
          shadowRadius: 4, // Difusión de la sombra
          elevation: 20, // Requerido para Androi
          zIndex: 99999999999,
        }}
      >
        <TextSmall className={"text-gray-700 font-sans font-semibold text-lg"}>
          {dataUser?.name} {dataUser?.subname}
        </TextSmall>
      </View>
    </View>
  );
});
export const Etiqueta = ({ children, className }) => {
  return (
    <View className={`px-2 py-1 rounded self-start ${className}`}>
      <TextSmall className={"text-white text-lg"}>{children}</TextSmall>
    </View>
  );
};
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
  // day: "2-digit",
  // month: "short", // "short" para abreviado (ej. "ene"), "long" para completo (ej. "enero")
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
export function haversineDistanceNew([lat1, lon1], [lat2, lon2]) {
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

export const TabMenu = () => {
  const router = useRouter();
  const { setEmpresaPick, empresaPick } = useAuthApp();
  return (
    <View className="absolute z-50 bottom-10 left-5 flex-row items-center">
      <TouchableOpacity
        className="ml-2 "
        onPress={() => {
          setEmpresaPick(null);
          router.replace("/home/start");
        }}
      >
        <MiIcono type="Ionicons" name="home" size={40} />
      </TouchableOpacity>
    </View>
  );
};
export const formatearFechaFirestore = (timestamp, formato) => {
  if (!timestamp?.seconds) return "Fecha inválida"; // Validación de la fecha

  // Convertimos el timestamp de Firestore a un objeto Date
  const date = new Date(timestamp.seconds * 1000); // Convertimos segundos a milisegundos

  // Opciones para formatear la hora
  const opcionesHora = {
    hour: "2-digit", // Hora con dos dígitos
    minute: "2-digit", // Minutos con dos dígitos
    hour12: false, // Formato 24h
  };

  // Formateamos la hora por separado
  const horaFormateada = new Intl.DateTimeFormat("es-ES", opcionesHora).format(
    date
  );
  const [hora, minuto] = horaFormateada.split(":");

  // Lista de días de la semana en español
  const diasSemana = [
    "Domingo",
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
  ];

  // Mapeo de meses en palabras
  const mesesCompletos = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];

  // Mapeo de meses abreviados
  const mesesDiminutivos = [
    "Ene",
    "Feb",
    "Mar",
    "Abr",
    "May",
    "Jun",
    "Jul",
    "Ago",
    "Sep",
    "Oct",
    "Nov",
    "Dic",
  ];

  // Obtenemos el día de la semana, mes, día y año
  const diaSemana = diasSemana[date.getDay()]; // Día de la semana
  const dia = date.getDate(); // Día del mes
  const mes = date.getMonth(); // Mes (0-11)
  const año = date.getFullYear(); // Año

  // Hacemos que el día de la semana sea mayúscula
  const diaSemanaMayuscula =
    diaSemana.charAt(0).toUpperCase() + diaSemana.slice(1);

  // Condicionales para retornar el formato solicitado
  switch (formato) {
    case "hora":
      return `${hora}:${minuto}`; // Formato de hora
    case "diaLetra":
      return diaSemanaMayuscula; // Solo el día de la semana en letra, sin coma ni espacio extra
    case "diaNumero":
      return dia.toString().padStart(2, "0"); // Día en número con dos dígitos
    case "mesNumero":
      return (mes + 1).toString().padStart(2, "0"); // Mes en número (1-12)
    case "mesCompleto":
      return mesesCompletos[mes]; // Mes completo (Enero, Febrero, ...)
    case "mesDiminutivo":
      return mesesDiminutivos[mes]; // Mes abreviado (Ene, Feb, ...)
    case "anio":
      return año.toString(); // Solo el año
    case "fechaCompleta":
      return `${diaSemanaMayuscula} ${dia.toString().padStart(2, "0")}/${(
        mes + 1
      )
        .toString()
        .padStart(2, "0")} ${año} ${hora}:${minuto}`; // Fecha completa con hora
    default:
      return "Formato no válido"; // Si el formato no está en los casos anteriores
  }
};
export const calcularTiempoTrabajadoAdmin = (entrada, salida) => {
  // Verifica si los valores son timestamps de Firestore y conviértelos a Date si es necesario
  const entradaDate =
    entrada instanceof Date ? entrada : new Date(entrada.seconds * 1000); // Si es un timestamp, lo convertimos
  const salidaDate =
    salida instanceof Date ? salida : new Date(salida.seconds * 1000); // Si es un timestamp, lo convertimos

  const diferenciaMs = salidaDate - entradaDate; // Diferencia en milisegundos
  const horas = Math.floor(diferenciaMs / (1000 * 60 * 60));
  const minutos = Math.floor((diferenciaMs % (1000 * 60 * 60)) / (1000 * 60));
  const segundos = Math.floor((diferenciaMs % (1000 * 60)) / 1000);

  return `${horas}:${minutos < 10 ? "0" : ""}${minutos}`; // Retorna las horas y minutos, en formato "horas:minutos"
};
export function calcularPago(
  entrada: { seconds: number; nanoseconds: number },
  salida: { seconds: number; nanoseconds: number },
  tarifaPorHora: number
) {
  // Convertir los timestamps a objetos Date
  const entradaFecha = new Date(
    entrada.seconds * 1000 + entrada.nanoseconds / 1e6
  );
  const salidaFecha = new Date(
    salida.seconds * 1000 + salida.nanoseconds / 1e6
  );

  // Calcular la diferencia en milisegundos
  const tiempoTrabajadoMS = salidaFecha.getTime() - entradaFecha.getTime();
  if (tiempoTrabajadoMS < 0) {
    return "0,00"; // Evita cálculos erróneos si la entrada es mayor a la salida
  }

  // Convertir a horas
  const tiempoTrabajadoHoras = tiempoTrabajadoMS / (1000 * 60 * 60);
  const pagoTotal = tiempoTrabajadoHoras * tarifaPorHora;

  // Separar euros y céntimos
  const euros = Math.floor(pagoTotal);
  const centimos = Math.round((pagoTotal - euros) * 100);

  // Asegurar que los céntimos siempre tengan dos dígitos
  const centimosFormateados = centimos.toString().padStart(2, "0");

  return `${euros},${centimosFormateados}`;
}
