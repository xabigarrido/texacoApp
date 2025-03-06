import { MiTexto } from "@/components/Utils";
import {
  addDoc,
  collection,
  db,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  where,
  updateDoc,
} from "../../../../firebaseConfig";
import {
  Dimensions,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { limit } from "firebase/firestore";
import Feather from "@expo/vector-icons/Feather";
import Entypo from "@expo/vector-icons/Entypo";

const { height: heightScreen, width: widthScreen } = Dimensions.get("window");
const collecRef = collection(db, "Mesitas");

const obtenerZindex = async () => {
  try {
    const q = query(collecRef, orderBy("zIndex", "desc"), limit(1));
    const querySnapShot = await getDocs(q);
    if (querySnapShot.empty) return 0;
    const maxlength = querySnapShot.docs[0].data().zIndex;
    return maxlength;
  } catch (error) {
    console.log(error);
  }
};

// Ahora updateMesa espera valores relativos (entre 0 y 1)
const updateMesa = async (id, relativeX, relativeY, rotate, scaleNow) => {
  const number = await obtenerZindex();
  try {
    await updateDoc(doc(db, "Mesitas", id), {
      zIndex: number + 1,
      // Se guardan los valores relativos
      initialX: relativeX,
      initialY: relativeY,
      rotate,
      scale: scaleNow,
    });
  } catch (error) {
    console.log(error);
  }
};

const changeNewMesa = async (id) => {
  try {
    await updateDoc(doc(collecRef, id), {
      isNewMesa: false,
    });
    console.log("Mesa nueva ahora es false");
  } catch (error) {
    console.log(error);
  }
};

const DibujarMesa = React.memo(
  ({
    id,
    initialX,
    initialY,
    width,
    height,
    rotate,
    name,
    editMove,
    status,
    color,
    zIndex,
    scale,
    mesaSelected,
    setMesaSelected,
    isNewMesa,
    eneabledMove,
  }) => {
    // Los valores iniciales que vienen de la DB son relativos (0 a 1),
    // por lo que se convierten a posición absoluta:
    const translateX = useSharedValue(initialX * widthScreen);
    const translateY = useSharedValue(initialY * heightScreen);

    const offsetX = useSharedValue(translateX.value);
    const offsetY = useSharedValue(translateY.value);

    const rotateRad = useSharedValue(rotate);
    const baseRotate = useSharedValue(rotate);
    const scaleBox = useSharedValue(scale);
    const offScale = useSharedValue(scale);
    const [rotateMode, setRotateMode] = useState(true);
    const [pinchMode, setPinchMode] = useState(true);
    const [zindexNow, setZindexNow] = useState(0);
    const opacity = useSharedValue(0);
    const zIn = useSharedValue(0);
    const insets = useSafeAreaInsets();

    useEffect(() => {
      console.log("Mesa renderizada", color, zIndex);
      // Actualizamos la posición a partir de los valores relativos almacenados
      translateX.value = withSpring(initialX * widthScreen);
      translateY.value = withSpring(initialY * heightScreen);
      rotateRad.value = withSpring(rotate);
      scaleBox.value = withSpring(scale);
      setZindexNow(zIndex);
    }, [initialX, initialY, rotate, scale, id, zIndex]);

    useEffect(() => {
      if (isNewMesa == true) {
        // Para mesas nuevas, se posicionan de forma absoluta y luego se
        // actualiza la posición relativa en la DB.
        translateX.value = widthScreen / 2 + 50;
        translateY.value = -400;
        const inicioAnimacionX = 0;
        const inicioAnimacionY = 0;
        opacity.value = withTiming(1, { duration: 1000 });
        translateX.value = withSpring(inicioAnimacionX, {
          stiffness: 50,
          damping: 20,
          mass: 1,
        });
        translateY.value = withTiming(
          inicioAnimacionY,
          { duration: 2000 },
          () => {
            translateY.value = withSpring(inicioAnimacionY, {
              stiffness: 50,
              damping: 20,
              mass: 1,
            });
          }
        );
        // Se guarda en la DB la posición relativa (dividiendo entre dimensiones)
        updateMesa(
          id,
          inicioAnimacionX / widthScreen,
          inicioAnimacionY / heightScreen,
          0,
          1
        );
        updateZindex(id);
        changeNewMesa(id);
      }
    }, []);

    useEffect(() => {
      if (mesaSelected == id) {
        console.log("opacity");
        opacity.value = withRepeat(withTiming(0, { duration: 500 }), -1, true);
      } else {
        opacity.value = withTiming(1, { duration: 500 });
      }
    }, [mesaSelected]);

    const changeMode = (mode, status) => {
      if (mode === "rotate") {
        return setRotateMode(status);
      }
      if (mode === "pinch") {
        return setPinchMode(status);
      }
    };

    const updateZindex = async () => {
      const number = await obtenerZindex();
      setZindexNow(number);
      zIn.value = number;
    };

    const selectedMesa = (id) => {
      setMesaSelected(id);
    };

    const clearId = () => {
      setMesaSelected(null);
    };

    const mesaContenedorAnimated = useAnimatedStyle(() => ({
      opacity: opacity.value,
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { rotate: withSpring(`${rotateRad.value}rad`) },
        { scale: withSpring(scaleBox.value) },
      ],
    }));

    const stylesMesaContenedor = useMemo(() => {
      const isSelected = id === mesaSelected;
      const originalWidth = width + 40;
      const originalHeight = height + 40;
      const expandedWidth = width + 130;
      const expandedHeight = height + 130;
      const newWidth = isSelected ? expandedWidth : originalWidth;
      const newHeight = isSelected ? expandedHeight : originalHeight;
      const deltaX = (newWidth - originalWidth) / 2;
      const deltaY = (newHeight - originalHeight) / 2;
      return {
        height: newHeight,
        width: newWidth,
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        zIndex: zindexNow,
        left: isSelected ? -deltaX : 0,
        top: isSelected ? -deltaY : 0,
      };
    }, [id, height, width, zindexNow, mesaSelected]);

    const animatedText = useAnimatedStyle(() => ({
      fontSize: Math.min(width, height) * 0.8,
      textAlign: "center",
      lineHeight: height,
    }));

    const mesaHijoStyle = useMemo(
      () => ({ width, height, backgroundColor: color, borderRadius: 10 }),
      []
    );

    // Modificamos el gesto para usar offset (valor absoluto) y luego actualizar translateX/Y
    const panGesture = Gesture.Pan()
      .enabled(rotateMode && pinchMode && eneabledMove)
      .onStart(() => {
        offsetX.value = translateX.value;
        offsetY.value = translateY.value;
      })
      .onUpdate((event) => {
        translateX.value = offsetX.value + event.translationX;
        translateY.value = offsetY.value + event.translationY;
      });

    const pinchGesture = Gesture.Pinch()
      .enabled(eneabledMove)
      .onStart(() => {
        offScale.value = scaleBox.value;
      })
      .onUpdate((event) => {
        scaleBox.value = offScale.value * event.scale;
      })
      .onFinalize(() => {})
      .hitSlop(
        Platform.OS === "android"
          ? { top: 5, left: 5, bottom: 5, right: 5 }
          : { top: 20, left: 20, bottom: 20, right: 20 }
      );

    const rotateGesture = Gesture.Rotation()
      .enabled(eneabledMove)
      .onStart(() => {
        runOnJS(changeMode)("rotate", false);
        baseRotate.value = rotateRad.value;
      })
      .onUpdate((event) => {
        rotateRad.value = baseRotate.value + event.rotation;
      })
      .onFinalize(() => {
        runOnJS(changeMode)("rotate", true);
      })
      .hitSlop(
        Platform.OS === "android"
          ? { top: 5, left: 5, bottom: 5, right: 5 }
          : { top: 20, left: 20, bottom: 20, right: 20 }
      );

    const tapGesture = Gesture.Tap()
      .enabled(eneabledMove)
      .onTouchesDown(() => {
        console.log("pulsaste");
        runOnJS(updateZindex)(id);
        runOnJS(selectedMesa)(id);
      })
      .onTouchesUp(() => {
        console.log("levantaste el dedo");
      });

    // Al finalizar el gesto, se actualiza la DB usando la posición relativa
    const finishGesture = Gesture.Pan().onFinalize(() => {
      console.log("termine");
      runOnJS(updateMesa)(
        id,
        translateX.value / widthScreen,
        translateY.value / heightScreen,
        rotateRad.value,
        scaleBox.value
      );
      runOnJS(clearId)();
    });

    const gestureComposition = Gesture.Simultaneous(
      panGesture,
      pinchGesture,
      rotateGesture,
      tapGesture,
      finishGesture
    );

    return (
      <GestureDetector gesture={gestureComposition}>
        <Animated.View style={[mesaContenedorAnimated, stylesMesaContenedor]}>
          <Animated.View style={[mesaHijoStyle]}>
            <Animated.Text style={[animatedText]}>{name}</Animated.Text>
          </Animated.View>
        </Animated.View>
      </GestureDetector>
    );
  }
);

export default function MesasScreen() {
  const insets = useSafeAreaInsets();
  const [mesasAlmacen, setMesasAlmacen] = useState([]);
  const [mesaSelected, setMesaSelected] = useState(null);
  const [eneabledMove, setEneabledMove] = useState(true);

  useEffect(() => {
    console.log("App renderizada");
    const suscribirme = onSnapshot(collecRef, (snapShot) => {
      const data = snapShot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setMesasAlmacen(data);
    });
    return () => suscribirme();
  }, []);

  const addMesa = useCallback(async () => {
    console.log("renderizado Funcion añadir mesa");
    try {
      const sizeCollection = await getDocs(collecRef);
      const maxZindex = await obtenerZindex();
      const number = Math.floor(Math.random() * 5);
      const color = () => {
        switch (number) {
          case 0:
            return "red";
          case 1:
            return "blue";
          case 2:
            return "green";
          case 3:
            return "orange";
          case 4:
            return "pink";
          default:
            return "black";
        }
      };
      // Al crear una nueva mesa, se guardan posiciones relativas.
      await addDoc(collecRef, {
        name: sizeCollection.size,
        initialX: 0, // 0 equivale a la izquierda
        initialY: 0, // 0 equivale a la parte superior
        width: Math.floor(Math.random() * 101) + 50,
        height: Math.floor(Math.random() * 101) + 50,
        color: color(),
        rotate: 0,
        status: false,
        editMove: false,
        zIndex: maxZindex + 1,
        scale: 1,
        isNewMesa: true,
      });
      console.log("Mesa añadida");
    } catch (error) {
      console.log(error);
    }
  }, []);

  const deleteAllMesas = useCallback(async () => {
    try {
      const dataMesas = await getDocs(collecRef);
      const deletePromises = dataMesas.docs.map((mesa) => deleteDoc(mesa.ref));
      await Promise.all(deletePromises);
    } catch (error) {
      console.log(error);
    }
  }, []);

  return (
    <GestureHandlerRootView>
      <View className="bg-background dark:bg-dark-background">
        <View
          style={{
            marginTop: insets.top,
            height: heightScreen - insets.bottom,
          }}
        >
          {mesasAlmacen.map((mesa) => (
            <DibujarMesa
              key={mesa.id}
              {...mesa}
              mesaSelected={mesaSelected}
              setMesaSelected={setMesaSelected}
              eneabledMove={eneabledMove}
            />
          ))}
          <View className="absolute right-5 bottom-10 flex-row gap-2 z-[9999999999999999]">
            <TouchableOpacity
              className="h-[60px] w-[60px] bg-red-800 rounded-md justify-center items-center"
              onPress={deleteAllMesas}
            >
              <MaterialIcons name="delete" size={40} color="white" />
            </TouchableOpacity>
            {eneabledMove && (
              <TouchableOpacity
                className="h-[60px] w-[60px] bg-green-800 rounded-md justify-center items-center"
                onPress={() => setEneabledMove(false)}
              >
                <Feather name="move" size={40} color="white" />
              </TouchableOpacity>
            )}
            {!eneabledMove && (
              <TouchableOpacity
                className="h-[60px] w-[60px] bg-red-800 rounded-md justify-center items-center"
                onPress={() => setEneabledMove(true)}
              >
                <Feather name="move" size={40} color="white" />
              </TouchableOpacity>
            )}
            <TouchableOpacity
              className="h-[60px] w-[60px] bg-green-800 rounded-md justify-center items-center"
              onPress={addMesa}
            >
              <MaterialIcons name="add-to-photos" size={40} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </GestureHandlerRootView>
  );
}
