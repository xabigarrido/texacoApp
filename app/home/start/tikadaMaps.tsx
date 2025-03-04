import { useApp } from "@/context/appContext";
import { useAuthApp } from "@/context/userContext";
import {
  Box,
  FadeIn,
  HeaderUser,
  MarcoLayout,
  TextSmall,
  formatDistance,
  haversineDistance,
} from "@/utils/utils";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import MapView, { Circle, Marker } from "react-native-maps";
import * as Location from "expo-location";
import { TouchableOpacity, View } from "react-native";
import { addTikadaSinPosicion } from "@/api/empresas.api";

const AdminEmpresa = () => {
  const { empresaPick, dataUser } = useAuthApp();
  const { setLoadingData } = useApp();
  const router = useRouter();
  const [location, setLocation] = useState(null);
  const [markers, setMarkers] = useState({
    latitude: empresaPick.locationEmpresa.latitude,
    longitude: empresaPick.locationEmpresa.longitude,
  });
  const [errorMsg, setErrorMsg] = useState(null);
  const [metrosRange, setMetrosRange] = useState(empresaPick.distancePick);
  const [distancia, setDistancia] = useState(null);

  useEffect(() => {
    const getLocation = async () => {
      try {
        setLoadingData(true);
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setErrorMsg("Permiso denegado para acceder a la ubicación.");
          setLoadingData(false);
          return;
        }
        let userLocation = await Location.getCurrentPositionAsync({});
        setLocation(userLocation);

        // Calcula la distancia en metros (valor numérico)
        const distanceMeters = haversineDistance(
          userLocation.coords.latitude,
          userLocation.coords.longitude,
          empresaPick.locationEmpresa.latitude,
          empresaPick.locationEmpresa.longitude
        );
        setDistancia(distanceMeters);

        setLoadingData(false);
      } catch (error) {
        console.log(error);
        setLoadingData(false);
      }
    };
    getLocation();
  }, []);

  useEffect(() => {
    setMarkers({
      latitude: empresaPick.locationEmpresa.latitude,
      longitude: empresaPick.locationEmpresa.longitude,
    });
  }, [empresaPick.locationEmpresa]);

  if (!location) {
    return (
      <MarcoLayout darkMode={true}>
        <TextSmall>Cargando ubicación...</TextSmall>
      </MarcoLayout>
    );
  }

  const handleIniciar = async () => {
    console.log("Distancia:", distancia, "Limite:", metrosRange);
    // Compara la distancia numérica
    if (distancia > metrosRange) {
      alert(
        `Debes acercarte a ${empresaPick.nameEmpresa} ${formatDistance(
          distancia - metrosRange
        )}`
      );
    } else {
      await addTikadaSinPosicion(dataUser, empresaPick);
      router.replace("/home/start/optionsEmpresa");
    }
  };

  return (
    <MarcoLayout darkMode={true} className={"justify-between"}>
      <FadeIn>
        <Box className="absolute bottom-20 w-full items-center p-4 flex-row gap-2 justify-center z-50">
          {dataUser.trabajando ? (
            <TouchableOpacity
              className="bg-buttonDanger px-4 py-2 rounded"
              onPress={handleIniciar}
            >
              <TextSmall className={"font-sans text-2xl text-white"}>
                Cerrar turno
              </TextSmall>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              className="bg-buttonPrimary px-4 py-2 rounded"
              onPress={handleIniciar}
            >
              <TextSmall className={"font-sans text-2xl text-white"}>
                Iniciar turno
              </TextSmall>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            className="bg-dark-buttonSecondary px-4 py-2 rounded"
            onPress={() => router.replace("/home/start/optionsEmpresa")}
          >
            <TextSmall className={"font-sans text-2xl text-white"}>
              Volver atras
            </TextSmall>
          </TouchableOpacity>
        </Box>
        <MapView
          style={{ width: "100%", height: "100%" }}
          initialRegion={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
        >
          <Marker
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
            title="📍 Mi ubicación"
            pinColor="red"
          />
          {markers.latitude && markers.longitude && (
            <>
              <Marker
                coordinate={{
                  latitude: markers.latitude,
                  longitude: markers.longitude,
                }}
                title={empresaPick.nameEmpresa}
              />
              <Circle
                center={{
                  latitude: markers.latitude,
                  longitude: markers.longitude,
                }}
                radius={metrosRange} // Radio en metros (ajusta según necesidad)
                strokeWidth={2}
                strokeColor="rgba(197, 2, 200, 0.5)"
                fillColor="rgba(223, 45, 255, 0.2)"
              />
            </>
          )}
        </MapView>
      </FadeIn>
    </MarcoLayout>
  );
};

export default AdminEmpresa;
