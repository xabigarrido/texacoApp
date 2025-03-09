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
  cancelAnimation,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useAuthApp } from "@/context/userContext";
import {
  addZonaFirebase,
  updateZonaFirebase,
  updateZonaZIndex,
} from "@/api/empresas.api";
import {
  collection,
  db,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "@/firebaseConfig";
import { useRouter } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
const { height: heightScreen, width: widthScreen } = Dimensions.get("window");

const DibujarZonas = React.memo(
  ({
    id,
    initialX,
    initialY,
    width,
    height,
    color,
    zIndex,
    nameZona,
    rotate,
    scale,
    eneabledMove,
    setModalOpen,
    setEditZona,
    setZonaConfig,
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
      router.navigate("/home/start/config/mesasZonas/" + id);
    };
    useEffect(() => {
      console.log("Zona renderizada", id);
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
    }, [
      initialX,
      initialY,
      rotate,
      scale,
      zIndex,
      color,
      width,
      height,
      pendiente,
    ]);
    const collecRef = collection(db, "Mesitas");
    const updateZona = useCallback(async (id, x, y, rotate, scale) => {
      try {
        const zonaRef = doc(db, "Empresas", empresaPick.id, "Zonas", id);
        await updateDoc(zonaRef, {
          initialX: x,
          initialY: y,
          rotate,
          scale,
        });
      } catch (error) {
        console.log(error);
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
    const longPress = Gesture.LongPress().onStart(() => {
      console.log("pulsaste demasiado");
      runOnJS(setModalOpen)(true);
      runOnJS(setEditZona)(true);
      runOnJS(setZonaConfig)({ id, width, height, color, nameZona, scale });
    });
    const tapGesture = Gesture.Tap()
      .onTouchesDown(() => {
        if (!eneabledMove) {
          runOnJS(navigateToZone)(id);
        }
        zonaSelected.value = eneabledMove ? 1 : 0;
      })
      .numberOfTaps(2)
      .onEnd(() => {
        console.log("doble Tap");

        runOnJS(setModalOpen)(true);
        runOnJS(setEditZona)(true);
        runOnJS(setZonaConfig)({ id, width, height, color, nameZona, scale });
      });
    const gestureFinish = Gesture.Pan()
      .enabled(eneabledMove)
      .onFinalize(() => {
        zonaSelected.value = 0;
        runOnJS(updateZona)(
          id,
          translateX.value / widthScreen,
          translateY.value / heightScreen,
          rotateRad.value,
          scaleBox.value
        );
        runOnJS(updateZonaZIndex)(empresaPick.id, id);
      });
    const gestureCombined = Gesture.Simultaneous(
      panGesture,
      rotateGesture,
      pinchGesture,
      tapGesture,
      // longPress,
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
                {nameZona}
              </Animated.Text>
            </Animated.View>
          </Animated.View>
        </Animated.View>
      </GestureDetector>
    );
  }
);
const CrearZona = () => {
  const insets = useSafeAreaInsets();
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const { empresaPick, dataUser, empleadoEmpresa } = useAuthApp();
  const [zonasEmpresa, setZonasEmpresa] = useState([]);
  const modalAddZonaY = useSharedValue(heightScreen);
  const [modalOpen, setModalOpen] = useState(false);
  const collecRef = collection(db, "Empresas", empresaPick.id, "Zonas");
  const [eneabledMove, setEneabledMove] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editZona, setEditZona] = useState(false);
  const [zonaConfig, setZonaConfig] = useState(null);
  const comandasRef = collection(db, "Empresas", empresaPick.id, "Comandas");
  const router = useRouter();

  useEffect(() => {
    const getDataZonas = async () => {
      try {
        setLoading(true);
        const docSnaps = await getDocs(collecRef);
        const data = docSnaps.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setZonasEmpresa(data);
      } catch (error) {
        console.log(error);
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 500);
      }
    };
    getDataZonas();
    // const q = query(comandasRef, where("vista", "==", false));
    // const unsuscribe2 = onSnapshot(q, (snapshot) => {
    //   const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    //   updateZonaFirebase(empresaPick.id, snapshot.docs[0].data().idZona, {
    //     pendiente: true,
    //   });
    // });
    const unsuscribe = onSnapshot(collecRef, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setZonasEmpresa(data);
    });
    return () => {
      unsuscribe();
      // unsuscribe2();
      setLoading(true);
    };
  }, [empresaPick.id]);
  const CrearZonaLayout = React.memo(() => {
    const [pickColor, setPickColor] = useState("#3B82F6");
    const [nameZona, setNameZona] = useState("");
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
      if (!editZona) return;
      sizeX.value = zonaConfig.width;
      sizeY.value = zonaConfig.height;
      colorEdit.value = zonaConfig.color;
      setPickColor(zonaConfig.color);
      setNameZona(zonaConfig.nameZona);
      scaleNow.value = zonaConfig.scale;
      setTimeout(() => {
        setLoading(false);
      }, 500);
    }, [editZona]);
    const addZona = useCallback(async () => {
      if (editZona) {
        try {
          const newEdit = {
            width: sizeX.value,
            height: sizeY.value,
            color: pickColor,
            nameZona,
          };
          await updateZonaFirebase(empresaPick.id, zonaConfig.id, newEdit);
        } catch (error) {
          console.log(error);
        } finally {
          setEditZona(false);
          setZonaConfig(null);
          setModalOpen(false);
          setNameZona("");
        }
      } else {
        try {
          const newZona = {
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
            nameZona,
          };
          await addZonaFirebase(newZona);
          setModalOpen(false);

          console.log("Zona añadida");
        } catch (error) {
          console.log(error);
        } finally {
          setEditZona(false);
          setZonaConfig(null);
          setNameZona("");
          handleClosePress();
        }
      }
    });
    const animatedZonaStyle = useCallback(
      useAnimatedStyle(() => ({
        width: withSpring(sizeX.value),
        height: withSpring(sizeY.value),
        backgroundColor: editZona ? colorEdit.value : pickColor,
        borderRadius: 10, // Bordes más suaves
        position: "relative",
        borderWidth: 2,
        borderColor: "rgba(255, 255, 255, 0.3)", // Borde sutil semitransparente
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 6, // Sombra en Android
        transform: [{ scale: scaleNow.value }],
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
    const handleDeleteZona = async () => {
      try {
        const zonaRef = doc(
          db,
          "Empresas",
          empresaPick.id,
          "Zonas",
          zonaConfig.id
        );
        await deleteDoc(zonaRef);
        console.log("Zona Eliminada");
      } catch (error) {
        console.log(error);
      } finally {
        setEditZona(false);
        setZonaConfig(null);
        setModalOpen(false);
        setNameZona("");
      }
    };
    return (
      <View className="flex-1 w-full items-center dark:bg-dark-navbarBackground ">
        <TouchableOpacity
          className="p-2 bg-red-400 dark:bg-textTertiary top-1 absolute right-5 rounded-full"
          onPress={() => {
            setEditZona(false);
            setZonaConfig(null);
            setModalOpen(false);
            setNameZona("");
          }}
        >
          <MiIcono name="close" color="white" />
        </TouchableOpacity>
        <View className="w-[300px] h-[200px] justify-center items-center">
          {loading && zonaConfig !== null && (
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
                    {nameZona}
                  </Animated.Text>
                </Animated.View>
              </Animated.View>
            </GestureDetector>
          )}
          {loading && zonaConfig === null && (
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
                    {nameZona}
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
              onChangeText={(text) => setNameZona(text)}
              //   value={nameZona}
            />
            {editZona ? (
              <Boton className="self-center bg-blue-500 p-2" onPress={addZona}>
                Editar zona
              </Boton>
            ) : (
              <Boton className="self-center bg-green-700 p-2" onPress={addZona}>
                Añadir zona
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
            {zonaConfig && (
              <TouchableOpacity
                className="mt-5 px-4 py-2 bg-red-600 rounded"
                onPress={handleDeleteZona}
              >
                <TextSmall className={"text-xl text-white"}>
                  Eliminar zona
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
              {zonasEmpresa.length > 0 &&
                !modalOpen &&
                zonasEmpresa.map((zona) => (
                  <DibujarZonas
                    key={zona.id}
                    {...zona}
                    eneabledMove={eneabledMove}
                    setModalOpen={setModalOpen}
                    setEditZona={setEditZona}
                    setEditZona={setEditZona}
                    setZonaConfig={setZonaConfig}
                  />
                ))}
              {zonasEmpresa.length == 0 && !modalOpen && (
                <View className="absolute inset-0 flex items-center justify-center px-6 text-center">
                  <TextSmall className="text-xl font-bold text-gray-800 mb-2">
                    ¡Dale vida a tu negocio!
                  </TextSmall>
                  <TextSmall className="text-base text-gray-600 mb-1 text-center">
                    Crea tu primera zona y organiza las mesas a tu manera.
                  </TextSmall>
                  <TextSmall className="text-base text-gray-600 text-center">
                    ¡No esperes más! Configura tu primera zona y gestiona tu
                    espacio fácilmente.
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
                      onPress={() =>
                        router.replace("/home/start/optionsEmpresa")
                      }
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
                        type="FontAwesome5"
                        name="home"
                        size={23}
                        color="white"
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() =>
                        router.replace("/home/start/optionsEmpresa")
                      }
                    >
                    <TextSmall className="font-bold text-xl">
                      {empresaPick.nameEmpresa}
                    </TextSmall>
                    </TouchableOpacity>

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

export default CrearZona;
