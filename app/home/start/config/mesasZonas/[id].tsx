import React, {
  useCallback,
  useRef,
  useMemo,
  useState,
  useEffect,
} from "react";
import {
  StyleSheet,
  View,
  Text,
  Button,
  Dimensions,
  SafeAreaView,
  TouchableOpacity,
  Platform,
  FlatList,
  ActivityIndicator,
} from "react-native";
import Modal from "react-native-modal";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
  TextInput,
} from "react-native-gesture-handler";
import BottomSheet, {
  BottomSheetFlashList,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Boton, Etiqueta, MiIcono, MiInput, TextSmall } from "@/utils/utils";
import { colorScheme, useColorScheme } from "nativewind";
import { StatusBar } from "expo-status-bar";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useAuthApp } from "@/context/userContext";
import {
  addMesaFirebase,
  addZonaFirebase,
  getNextMesasZindex,
  updateMesaFirebase,
  updateZonaZIndex,
} from "@/api/empresas.api";
import {
  collection,
  db,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "@/firebaseConfig";
import { useLocalSearchParams, useRouter } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
const { height: heightScreen, width: widthScreen } = Dimensions.get("window");

const DibujarMesas = React.memo(
  ({
    id,
    initialX,
    initialY,
    width,
    height,
    color,
    zIndex,
    nameMesa,
    rotate,
    scale,
    eneabledMove,
    idZona,
    setModalOpen,
    setMesaConfig,
    setEditMesa,
    pendiente,
  }) => {
    const { empresaPick, empleadoEmpresa } = useAuthApp();
    const translateX = useSharedValue(initialX * widthScreen);
    const translateY = useSharedValue(initialY * heightScreen);
    const offSetX = useSharedValue(0);
    const offSetY = useSharedValue(0);
    const rotateRad = useSharedValue(rotate);
    const baseRotate = useSharedValue(rotate);
    const scaleBox = useSharedValue(scale);
    const offScale = useSharedValue(scale);
    const zIndexNow = useSharedValue(zIndex);
    const zonaSelected = useSharedValue(0);
    const opacityBox = useSharedValue(1);
    const [gestureEneabled, setGestureEneabled] = useState(true);

    const router = useRouter();
    const navigateToZone = (id) => {
      console.log(id);
      // router.navigate("/home/start/config/agregarComanda/" + id);
    };
    useEffect(() => {
      console.log("Mesa renderizada", id);
      translateX.value = withSpring(initialX * widthScreen);
      translateY.value = withSpring(initialY * heightScreen);
      scaleBox.value = withSpring(scale);
      rotateRad.value = withSpring(rotate);
      zIndexNow.value = zIndex;
      if (pendiente) {
        console.log(pendiente);
        opacityBox.value = withRepeat(
          withTiming(0.1, { duration: 700 }),
          -1,
          true
        );
        scaleBox.value = withRepeat(
          withTiming(scale * 0.9, { duration: 500 }),
          -1,
          true
        );
      } else {
        opacityBox.value = withTiming(1, { duration: 500 });
        scaleBox.value = withTiming(scale, { duration: 500 });
      }
    }, [initialX, initialY, rotate, scale, zIndex, pendiente]);
    const updateMesa = useCallback(async (id, x, y, rotate, scale) => {
      try {
        const mesaRef = doc(db, "Empresas", empresaPick.id, "Mesas", id);
        await updateDoc(mesaRef, {
          initialX: x,
          initialY: y,
          rotate,
          scale,
        });
      } catch (error) {
        console.log(error);
      }
    });
    const updateMesaZindex = useCallback(async (empresaId, zonaId, idMesa) => {
      try {
        const nextZIndex = await getNextMesasZindex(empresaId, zonaId);
        const mesaRef = doc(db, "Empresas", empresaId, "Mesas", idMesa);

        await updateDoc(mesaRef, { zIndex: nextZIndex });
      } catch (error) {
        console.error("Error al actualizar el zIndex:", error);
      }
    });
    const animatedBoxPadre = useAnimatedStyle(() => {
      const isSelected = zonaSelected.value === 1;
      const originalWidth = width;
      const originalHeight = height;
      const expandedWidth = width + 130;
      const expandedHeight = height + 130;
      const newWidth = isSelected ? expandedWidth : originalWidth;
      const newHeight = isSelected ? expandedHeight : originalHeight;
      const deltaX = (newWidth - originalWidth) / 2;
      const deltaY = (newHeight - originalHeight) / 2;
      return {
        zIndex: zIndexNow.value,
        // backgroundColor: zonaSelected.value === 1 ? "blue" : "green",
        width: newWidth,
        height: newHeight,
        left: isSelected ? -deltaX : 0,
        top: isSelected ? -deltaY : 0,
        opacity: opacityBox.value,
        transform: [
          { translateX: translateX.value },
          { translateY: translateY.value },
          { rotate: `${rotateRad.value}rad` },
          { scale: scaleBox.value },
        ],
      };
    });
    const stylesBoxPadre = useMemo(
      () => ({
        // borderWidth: 1,
        // borderColor: "red",
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
      }),
      []
    );
    const animatedText = useAnimatedStyle(() => ({
      fontSize: Math.min(width, height) * 0.3,
      flexWrap: "wrap",
      // width: width,
      textAlign: "center",
    }));
    const stylesBoxHijo = useMemo(
      () => ({
        position: "absolute",
        width,
        height,
        backgroundColor: color,
        borderRadius: 10, // Bordes más suaves
        borderWidth: 2,
        borderColor: "rgba(255, 255, 255, 0.3)", // Borde sutil semitransparente
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 6, // Sombra en Android
        overflow: "hidden", // Asegura que nada se salga de los bordes redondeadoss
      }),
      [color, width, height]
    );
    const panGesture = Gesture.Pan()
      .enabled(gestureEneabled && eneabledMove)
      .onStart(() => {
        offSetX.value = translateX.value;
        offSetY.value = translateY.value;
        zIndexNow.value = 99999999;
      })
      .onUpdate((e) => {
        translateX.value = offSetX.value + e.translationX;
        translateY.value = offSetY.value + e.translationY;
      });

    const rotateGesture = Gesture.Rotation()
      .enabled(eneabledMove)
      .onStart(() => {
        // runOnJS(changeMode)("rotate", false);
        runOnJS(setGestureEneabled)(false);
        baseRotate.value = rotateRad.value;
      })
      .onUpdate((event) => {
        rotateRad.value = baseRotate.value + event.rotation;
      })
      .onFinalize(() => {
        // runOnJS(changeMode)("rotate", true);
        runOnJS(setGestureEneabled)(true);
      })
      .hitSlop(
        Platform.OS === "android"
          ? { top: 5, left: 5, bottom: 5, right: 5 }
          : { top: 20, left: 20, bottom: 20, right: 20 }
      );
    const pinchGesture = Gesture.Pinch()
      .enabled(eneabledMove)
      .onStart(() => {
        offScale.value = scaleBox.value;
      })
      .onUpdate((event) => {
        scaleBox.value = offScale.value * event.scale;
      })
      .hitSlop(
        Platform.OS === "android"
          ? { top: 5, left: 5, bottom: 5, right: 5 }
          : { top: 20, left: 20, bottom: 20, right: 20 }
      );
    const tapGesture = Gesture.Tap()
      .onTouchesDown(() => {
        if (!eneabledMove) {
          runOnJS(navigateToZone)(id);
        }
        zonaSelected.value = eneabledMove ? 1 : 0;
      })
      .numberOfTaps(2)
      .onEnd(() => {
        if (empleadoEmpresa.encargadoEmpresa && eneabledMove) {
          runOnJS(setModalOpen)(true);
          runOnJS(setEditMesa)(true);
          runOnJS(setMesaConfig)({ id, width, height, color, nameMesa, scale });
        } else {
          console.log("no eres jefe");
        }
      });
    const gestureFinish = Gesture.Pan()
      .enabled(eneabledMove)
      .onFinalize(() => {
        zonaSelected.value = 0;
        runOnJS(updateMesa)(
          id,
          translateX.value / widthScreen,
          translateY.value / heightScreen,
          rotateRad.value,
          scaleBox.value
        );
        runOnJS(updateMesaZindex)(empresaPick.id, idZona, id);
      });
    const gestureCombined = Gesture.Simultaneous(
      panGesture,
      rotateGesture,
      pinchGesture,
      tapGesture,
      gestureFinish
    );
    return (
      <GestureDetector gesture={gestureCombined}>
        <Animated.View style={[animatedBoxPadre, stylesBoxPadre]}>
          <Animated.View style={[stylesBoxHijo]}>
            <Animated.View
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Animated.Text
                style={[animatedText]}
                className={"text-white font-sans font-bold"}
              >
                {nameMesa}
              </Animated.Text>
            </Animated.View>
          </Animated.View>
        </Animated.View>
      </GestureDetector>
    );
  }
);
const MesasZona = () => {
  const insets = useSafeAreaInsets();
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const { empresaPick, dataUser, empleadoEmpresa } = useAuthApp();
  const modalAddZonaY = useSharedValue(heightScreen);
  const [modalOpen, setModalOpen] = useState(false);
  const collecRef = collection(db, "Empresas", empresaPick.id, "Mesas");
  const [eneabledMove, setEneabledMove] = useState(false);
  const [mesasZona, setMesasZona] = useState([]);
  const [zonaData, setZonaData] = useState({});
  const { id } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [editMesa, setEditMesa] = useState(false);
  const [mesaConfig, setMesaConfig] = useState(null);
  const router = useRouter();

  
  const getDataZona = useCallback(async () => {
    try {
      setLoading(true);

      const zonaRef = doc(db, "Empresas", empresaPick.id, "Zonas", id);
      const docSnap = await getDoc(zonaRef);
      if (docSnap.exists()) {
        setZonaData(docSnap.data());
      }
    } catch (error) {
      console.log(error);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 500);
    }
  });
  useEffect(() => {
    const q = query(collecRef, where("idZona", "==", id));
    // const q2 = query(collecRef, where("pendiente", "==", true));
    getDataZona();
    const unsuscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMesasZona(data);
    });
    // const unsuscribe2 = onSnapshot(q2, snapshot =>{

    // })
    return () => {
      setLoading(true);
      unsuscribe();
    };
  }, [id]);
  const CrearZonaLayout = React.memo(() => {
    const [pickColor, setPickColor] = useState("#3B82F6");
    const [nameMesa, setNameMesa] = useState("Nombre mesa");
    const colores = [
      "#EF4444", // bg-red-500
      "#3B82F6", // bg-blue-500
      "#10B981", // bg-green-500
      "#F59E0B", // bg-yellow-500
      "#8B5CF6", // bg-purple-500
      "#EC4899", // bg-pink-500
      "#6366F1", // bg-indigo-500
      "#14B8A6", // bg-teal-500
      "#FB923C", // bg-orange-500
      "#84CC16", // bg-lime-500
      "#10B981", // bg-emerald-500
      "#22D3EE", // bg-cyan-500
      "#D946EF", // bg-fuchsia-500
      "#8B5CF6", // bg-violet-500
      "#F43F5E", // bg-rose-500
      "#0EA5E9", // bg-sky-500
      "#202020",
      "#e0e0e0",
    ];
    const sizeX = useSharedValue(180);
    const sizeY = useSharedValue(85);
    const scaleNow = useSharedValue(1);

    const offsetX = useSharedValue(0);
    const offsetY = useSharedValue(0);
    const colorEdit = useSharedValue(pickColor);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
      setLoading(true);
      if (!editMesa) return;
      sizeX.value = mesaConfig.width;
      sizeY.value = mesaConfig.height;
      colorEdit.value = mesaConfig.color;
      setPickColor(mesaConfig.color);
      setNameMesa(mesaConfig.nameMesa);
      scaleNow.value = mesaConfig.scale;
      setTimeout(() => {
        setLoading(false);
      }, 500);
    }, [editMesa]);
    const addMesa = useCallback(async () => {
      if (editMesa) {
        try {
          const newEdit = {
            width: sizeX.value,
            height: sizeY.value,
            color: pickColor,
            nameMesa,
          };
          await updateMesaFirebase(empresaPick.id, mesaConfig.id, newEdit);
        } catch (error) {
          console.log(error);
        } finally {
          setEditMesa(false);
          setMesaConfig(null);
          setModalOpen(false);
          setNameMesa("");
        }
      } else {
        try {
          const newMesa = {
            width: sizeX.value,
            height: sizeY.value,
            idEmpresa: empresaPick?.id,
            pendiente: false,
            habilitada: false,
            initialX: 0,
            initialY: 0,
            rotate: 0,
            scale: 1,
            color: pickColor,
            creadaPor: dataUser?.name,
            createdAt: new Date(),
            nameMesa,
            idZona: id,
            colorZona: zonaData.color,
            ubicationZona: zonaData.nameZona,
          };
          await addMesaFirebase(newMesa, id);
          setModalOpen(false);
          console.log("Mesa añadida");
        } catch (error) {
          console.log(error);
        } finally {
          setEditMesa(false);
          setMesaConfig(null);
          setModalOpen(false);
          setNameMesa("");
        }
      }
    });
    const animatedZonaStyle = useCallback(
      useAnimatedStyle(() => ({
        width: withSpring(sizeX.value),
        height: withSpring(sizeY.value),
        backgroundColor: editMesa ? colorEdit.value : pickColor,
        borderRadius: 10, // Bordes más suaves
        position: "relative",
        borderWidth: 2,
        borderColor: "rgba(255, 255, 255, 0.3)", // Borde sutil semitransparente
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 6, // Sombra en Android
        //   overflow: "hidden", // Asegura que nada se salga de los bordes redondeadoss
      }))
    );

    const animatedText = useCallback(
      useAnimatedStyle(() => ({
        fontSize: Math.min(sizeX.value, sizeY.value) * 0.3,
        flexWrap: "wrap",
        width: withSpring(sizeX.value),
        textAlign: "center",
      }))
    );

    const panGesture = Gesture.Pan()
      .onStart((e) => {
        offsetX.value = sizeX.value;
        offsetY.value = sizeY.value;
      })
      .onUpdate((e) => {
        const newX = offsetX.value + e.translationX;
        const newY = offsetY.value + e.translationY;
        sizeX.value = Math.max(Math.min(newX, 300), 50);
        sizeY.value = Math.max(Math.min(newY, 200), 50);
      });
    const handleDeleteMesa = useCallback(async () => {
      try {
        const mesaRef = doc(
          db,
          "Empresas",
          empresaPick.id,
          "Mesas",
          mesaConfig.id
        );
        await deleteDoc(mesaRef);
        console.log("Mesa Eliminada");
      } catch (error) {
        console.log(error);
      } finally {
        setEditMesa(false);
        setMesaConfig(null);
        setModalOpen(false);
        setNameMesa("");
      }
    });
    return (
      <View className="flex-1 w-full items-center bg-navbarBackground dark:bg-dark-navbarBackground ">
        <TouchableOpacity
          className="p-2 bg-red-400 dark:bg-textTertiary top-1 absolute right-5 rounded-full"
          onPress={() => {
            setModalOpen(false);
            setEditMesa(false);
            setMesaConfig(null);
            setNameMesa("");
          }}
        >
          <MiIcono name="close" color="white" />
        </TouchableOpacity>
        <View className="w-[300px] h-[200px] justify-center items-center">
          {loading && mesaConfig !== null && (
            <ActivityIndicator size={"large"} />
          )}
          {!loading && (
            <GestureDetector gesture={panGesture}>
              <Animated.View style={[animatedZonaStyle]}>
                <Animated.View
                  style={{
                    height: 20,
                    width: 20,
                    margin: 10,
                    backgroundColor: "red",
                    borderRadius: 100,
                    position: "absolute",
                    bottom: -20,
                    right: -20,
                  }}
                />
                <Animated.View
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Animated.Text
                    style={[animatedText]}
                    className={"text-white font-sans font-bold"}
                  >
                    {nameMesa}
                  </Animated.Text>
                </Animated.View>
              </Animated.View>
            </GestureDetector>
          )}
          {loading && mesaConfig === null && (
            <GestureDetector gesture={panGesture}>
              <Animated.View style={[animatedZonaStyle]}>
                <Animated.View
                  style={{
                    height: 20,
                    width: 20,
                    margin: 10,
                    backgroundColor: "red",
                    borderRadius: 100,
                    position: "absolute",
                    bottom: -20,
                    right: -20,
                  }}
                />
                <Animated.View
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Animated.Text
                    style={[animatedText]}
                    className={"text-white font-sans font-bold"}
                  >
                    {nameMesa}
                  </Animated.Text>
                </Animated.View>
              </Animated.View>
            </GestureDetector>
          )}
        </View>
        <View className="items-center">
          <View className="flex-row gap-3 mb-10">
            <MiInput
              className="w-[200px]"
              placeholder="Nombre de la zona"
              onChangeText={(text) => setNameMesa(text)}
              //   value={nameZona}
            />
            {editMesa ? (
              <Boton className="self-center bg-blue-500 p-2" onPress={addMesa}>
                Editar mesa
              </Boton>
            ) : (
              <Boton className="self-center bg-green-700 p-2" onPress={addMesa}>
                Añadir mesa
              </Boton>
            )}
          </View>
          <View className="flex-row gap-4 flex-wrap justify-center">
            {colores.map((color, index) => (
              <TouchableOpacity
                onPress={() => {
                  setPickColor(color);
                  colorEdit.value = color;
                }}
                key={index}
                style={{
                  width: 50,
                  height: 50,
                  backgroundColor: color,
                  borderRadius: 25, // 100 se sustituye por la mitad del ancho/alto
                  borderWidth: 2,
                  borderColor: "#fff", // Borde blanco sutil
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.2,
                  shadowRadius: 4,
                  elevation: 5, // Sombra en Android
                  justifyContent: "center",
                  alignItems: "center",
                }}
                activeOpacity={0.7} // Efecto de pulsación
              ></TouchableOpacity>
            ))}
            {mesaConfig && (
              <TouchableOpacity
                className="mt-5 px-4 py-2 bg-red-600 rounded"
                onPress={handleDeleteMesa}
              >
                <TextSmall className={"text-xl text-white"}>
                  Eliminar mesa
                </TextSmall>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    );
  });
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {/* SafeAreaView se encarga de ajustar el contenido a las áreas segussrass */}
      <SafeAreaView
        className="bg-background dark:bg-zinc-900"
        style={{ flex: 1 }}
      >
        <View
          style={{
            flex: 1,
            marginTop: Platform.OS === "android" && insets.top,
            // borderWidth: 1,
            // borderColor: "red",
          }}
        >
          {loading ? (
            <>
              <View className="absolute inset-0 flex items-center justify-center px-6 text-center">
                <ActivityIndicator size={"large"} />
                <TextSmall className="text-xl font-bold text-gray-800 my-2">
                  Cargando zonas
                </TextSmall>
              </View>
            </>
          ) : (
            <>
              {mesasZona.length > 0 &&
                !modalOpen &&
                mesasZona.map((mesa) => (
                  <DibujarMesas
                    key={mesa.id}
                    {...mesa}
                    eneabledMove={eneabledMove}
                    setModalOpen={setModalOpen}
                    setMesaConfig={setMesaConfig}
                    setEditMesa={setEditMesa}
                  />
                ))}
              {mesasZona.length == 0 && (
                <View className="absolute inset-0 flex items-center justify-center px-6 text-center">
                  <TextSmall className="text-4xl font-bold text-gray-800 mb-2">
                    {zonaData?.nameZona}
                  </TextSmall>
                  <TextSmall className="text-xl font-bold text-gray-800 mb-2">
                    Organiza las mesas de tu zona
                  </TextSmall>
                  <TextSmall className="text-base text-gray-600 mb-1 text-center">
                    Añade y posiciona las mesas según la disposición de tu
                    espacio.
                  </TextSmall>
                  <TextSmall className="text-base text-gray-600 text-center">
                    Personaliza cada mesa para mejorar la gestión y facilitar el
                    servicio.
                  </TextSmall>
                </View>
              )}
              {modalOpen && <CrearZonaLayout />}
              {!modalOpen && (
                <View
                  style={{ position: "absolute", bottom: 12, left: 10 }}
                  className="p-2 bg-navbarBackground dark:bg-dark-navbarBackground rounded-xl shadow-sm border border-gray-300 dark:border-stone-900"
                >
                  <View className="flex-row justify-center gap-2 items-center">
                    <TouchableOpacity
                      onPress={() => router.replace("/home/start/config/crearZona") }
                      style={{
                        padding: 8,
                        backgroundColor: "#1d65b8",
                        borderRadius: 50,
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.2,
                        shadowRadius: 3,
                        elevation: 3,
                      }}
                      activeOpacity={0.8}
                    >
                      <MiIcono
                        type="MaterialIcons"
                        name="dashboard"
                        size={23}
                        color="white"
                      />
                    </TouchableOpacity>
                    <TextSmall className="font-bold text-xl">
                      {empresaPick.nameEmpresa} - {zonaData.nameZona}
                    </TextSmall>
                  </View>
                </View>
              )}

              {/* Botones flotantes */}
              {!modalOpen && (
                <View
                  style={{ position: "absolute", bottom: 12, right: 12 }}
                  className="p-2 bg-navbarBackground dark:bg-dark-navbarBackground rounded-xl shadow-sm border border-gray-300 dark:border-stone-900"
                >
                  <View className="flex-row justify-center gap-2">
                    <TouchableOpacity
                      onPress={() => toggleColorScheme()}
                      style={{
                        padding: 8,
                        // backgroundColor: "#10B981",
                        borderRadius: 50,
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.2,
                        shadowRadius: 3,
                        elevation: 3,
                      }}
                      activeOpacity={0.8}
                    >
                      {colorScheme === "dark" && (
                        <MaterialIcons
                          name="light-mode"
                          size={24}
                          color="white"
                        />
                      )}
                      {colorScheme === "light" && (
                        <MaterialIcons
                          name="dark-mode"
                          size={24}
                          color="black"
                        />
                      )}
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => setModalOpen(true)}
                      style={{
                        padding: 8,
                        backgroundColor: "#10B981",
                        borderRadius: 50,
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.2,
                        shadowRadius: 3,
                        elevation: 3,
                      }}
                      activeOpacity={0.8}
                    >
                      <MiIcono
                        type="FontAwesome6"
                        name="add"
                        size={24}
                        color="white"
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => setEneabledMove(!eneabledMove)}
                      style={{
                        padding: 8,
                        backgroundColor: eneabledMove ? "#10B981" : "#EF4444",
                        borderRadius: 50,
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.2,
                        shadowRadius: 3,
                        elevation: 3,
                      }}
                      activeOpacity={0.8}
                    >
                      <MiIcono
                        type="MaterialIcons"
                        name="create"
                        size={24}
                        color="white"
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </>
          )}
        </View>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default MesasZona;
