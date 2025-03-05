// import { useApp } from "@/context/appContext";
// import { useAuthApp } from "@/context/userContext";
// import { useRouter } from "expo-router";
// import { useEffect, useRef, useState } from "react";
// import { TouchableOpacity, View } from "react-native";
// import WebView from "react-native-webview";

// const urlpage = "http://192.168.50.68:5173/entrarEmpresa"; // URL de tu página web

// const EntrarEmpresa = () => {
//   const { empresaPick, dataUser } = useAuthApp();
//   const { setLoadingData } = useApp();
//   const router = useRouter();
//   const [metrosRange, setMetrosRange] = useState(empresaPick.distancePick);
//   const [distancia, setDistancia] = useState(null);
//   const webViewRef = useRef(null); // Cambiado de useState a useRef

//   const handleIniciar = async () => {
//     console.log("Distancia:", distancia, "Limite:", metrosRange);
//     // Compara la distancia numérica
//     if (distancia > metrosRange) {
//       alert(
//         `Debes acercarte a ${empresaPick.nameEmpresa} ${formatDistance(
//           distancia - metrosRange
//         )}`
//       );
//     } else {
//       await addTikadaSinPosicion(dataUser, empresaPick);
//       router.replace("/home/start/optionsEmpresa");
//     }
//   };

//   useEffect(() => {
//     if (webViewRef.current) {
//       // Aquí puedes enviar las coordenadas cuando la WebView esté lista
//       const coordenadas = {
//         latitude: 37.7749, // Usa las coordenadas reales
//         longitude: -122.4194, // Usa las coordenadas reales
//       };

//       // Enviar las coordenadas a la web a través de postMessage
//       webViewRef.current.postMessage(JSON.stringify(coordenadas));
//     }
//   }, [webViewRef.current]); // Dependencia sobre la referencia

//   return (
//     <View style={{ flex: 1 }}>
//       <WebView
//         ref={webViewRef} // Asignamos la referencia
//         source={{ uri: urlpage }} // URL de la página web
//         onMessage={(event) => {
//           // Aquí puedes manejar los mensajes recibidos desde la web
//           const data = JSON.parse(event.nativeEvent.data);
//           console.log("Mensaje recibido desde la web:", data);
//         }}
//       />
//     </View>
//   );
// };

// export default EntrarEmpresa;
// import { addTikadaSinPosicion } from "@/api/empresas.api";
// import { useAuthApp } from "@/context/userContext";
// import { formatDistance, haversineDistanceNew } from "@/utils/utils";
// import { useRouter } from "expo-router";
// import React, { useEffect, useRef } from "react";
// import { View } from "react-native";
// import { WebView } from "react-native-webview";

// export default function MapaWebView() {
//   const webViewRef = useRef(null);
//   const { empresaPick, dataUser } = useAuthApp();
//   const router = useRouter();

//   useEffect(() => {
//     const coordenadas = JSON.stringify({
//       lat: empresaPick.locationEmpresa[0],
//       lng: empresaPick.locationEmpresa[1],
//       distancePick: empresaPick.distancePick,
//       nameEmpresa: empresaPick.nameEmpresa,
//       trabajando: dataUser.trabajando,
//     }); // Convertir a string

//     setTimeout(() => {
//       if (webViewRef.current) {
//         webViewRef.current.postMessage(coordenadas); // Enviar JSON string
//       }
//     }, 500); // Esperamos 1 segundo para asegurarnos de que WebView está listo
//   }, []);

//   // Construir la URL con los parámetros
//   // const url = `http://192.168.50.68:5173/entrarempresa`;
//   const url = "https://regal-figolla-a5f516.netlify.app/entrarempresa";
//   const handleMessage = async (event: any) => {
//     const message = event.nativeEvent.data;

//     try {
//       const locationData = JSON.parse(message);
//       console.log(locationData.action);
//       const disctanciaTrabajo = haversineDistanceNew(
//         locationData.ubicacionEmpleado,
//         empresaPick.locationEmpresa
//       );
//       if (locationData.action == "confirm") {
//         if (disctanciaTrabajo > empresaPick.distancePick) {
//           const distancia = formatDistance(
//             disctanciaTrabajo - empresaPick.distancePick
//           );
//           console.log(distancia);
//           alert(`Estas lejos debes acercarte: ${distancia}`);
//         } else {
//           addTikadaSinPosicion(dataUser, empresaPick);
//           router.replace("/home/start");
//         }
//       } else {
//         router.replace("/home/start");
//       }
//     } catch (error) {
//       console.error("Error al recibir los datos:", error);
//     }
//   };
//   return (
//     <View style={{ flex: 1 }}>
//       <WebView
//         ref={webViewRef}
//         source={{
//           uri: url,
//         }} // URL de tu web
//         onMessage={handleMessage}
//       />
//     </View>
//   );
// }
import { addTikadaSinPosicion } from "@/api/empresas.api";
import { useAuthApp } from "@/context/userContext";
import { formatDistance, haversineDistanceNew } from "@/utils/utils";
import { useRouter } from "expo-router";
import React, { useEffect, useRef } from "react";
import { View } from "react-native";
import { WebView } from "react-native-webview";

export default function MapaWebView() {
  const webViewRef = useRef(null);
  const { empresaPick, dataUser } = useAuthApp();
  const router = useRouter();

  // Construcción de coordenadas
  const coordenadas = {
    lat: empresaPick.locationEmpresa[0],
    lng: empresaPick.locationEmpresa[1],
    distancePick: empresaPick.distancePick,
    nameEmpresa: empresaPick.nameEmpresa,
    trabajando: dataUser.trabajando,
  };

  // Inyección de datos antes de la carga de la web
  // const injectedJS = `
  //   window.initialData = ${coordenadas};
  //   true;
  // `;
  const injectedJS = `
    window.nameEmpresa = "${empresaPick.nameEmpresa}";
    window.latEmpresa = "${empresaPick.locationEmpresa[0]}";
    window.longEmpresa = "${empresaPick.locationEmpresa[1]}";
    window.distancePick = "${empresaPick.distancePick}";
    window.trabajando = "${dataUser.trabajando}";
    true;
  `;
  // URL del WebView
  const url = "https://regal-figolla-a5f516.netlify.app/entrarempresa";
  // const url = "http://192.168.50.68:5173/entrarempresa";

  // Manejo de mensajes desde la WebView
  const handleMessage = async (event: any) => {
    const message = event.nativeEvent.data;

    try {
      const locationData = JSON.parse(message);
      console.log(locationData.action);

      const disctanciaTrabajo = haversineDistanceNew(
        locationData.ubicacionEmpleado,
        empresaPick.locationEmpresa
      );

      if (locationData.action === "confirm") {
        if (disctanciaTrabajo > empresaPick.distancePick) {
          const distancia = formatDistance(
            disctanciaTrabajo - empresaPick.distancePick
          );
          alert(`Estás lejos, debes acercarte: ${distancia}`);
        } else {
          addTikadaSinPosicion(dataUser, empresaPick);
          router.replace("/home/start");
        }
      } else {
        router.replace("/home/start");
      }
    } catch (error) {
      console.error("Error al recibir los datos:", error);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <WebView
        ref={webViewRef}
        source={{ uri: url }}
        injectedJavaScript={injectedJS}
        onMessage={handleMessage}
      />
    </View>
  );
}
