import { useAuthApp } from "@/context/userContext";
import { collection, db, onSnapshot } from "@/firebaseConfig";
import { TextSmall } from "@/utils/utils";
import React, { useEffect, useState } from "react";
import { View } from "react-native";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated from "react-native-reanimated";

const DibujarZona = React.memo(({ id }) => {
  useEffect(() => {
    console.log("Zona renderizadaa", id);
  }, [id]);
  const panGesture = Gesture.Pan();
  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View>
        <Animated.View />
      </Animated.View>
    </GestureDetector>
  );
});
export default function CrearZona() {
  const [zonas, setZonas] = useState([]);
  const { empresaPick } = useAuthApp();
  const subCollectRef = collection(db, "Empresas", empresaPick.id, "Zonas");

  useEffect(() => {
    const suscribe = onSnapshot(subCollectRef, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setZonas(data);
    });
  }, []);

  return (
    <GestureHandlerRootView>
      <View style={{ marginTop: 30 }}>
        {zonas.map((zona) => (
          <DibujarZona key={zona.id} {...zona} />
        ))}
      </View>
    </GestureHandlerRootView>
  );
}
