import {
  crearSolicitudEmpresa,
  obtenerEmpresasSolicitud,
  updateEmpresaAddToUser,
  updateUserAddToEmpresa,
} from "@/api/empresas.api";
import { useApp } from "@/context/appContext";
import { useAuthApp } from "@/context/userContext";
import {
  Boton,
  Box,
  MarcoLayout,
  MiIcono,
  MiInput,
  TextSmall,
} from "@/utils/utils";
import { M } from "@clerk/clerk-react/dist/useAuth-BQT424bY";
import { useRouter } from "expo-router";
import {
  collection,
  db,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  where,
} from "../../firebaseConfig";
import { useEffect, useState } from "react";
import { Image, TouchableOpacity, View } from "react-native";

export default function IniciarEnEmpresa() {
  const router = useRouter();
  const { userId, isLoaded, signOut, dataUser, isSignedIn } = useAuthApp();
  const [identificador, setIdentificador] = useState("");
  const [empresasPostuladas, setEmpresasPostuladas] = useState([]);
  const [empresasSolicitudes, setEmpresasSolicitudes] = useState([]);
  const { setLoadingData } = useApp();
  const collecRefSolicitudes = collection(db, "Solicitudes");
  const handleSubmit = async () => {
    if (!identificador.trim()) {
      return alert("Campo identificador en blanco");
    }
    const response = await crearSolicitudEmpresa(
      userId,
      identificador,
      dataUser
    );
    if (response) {
      setLoadingData(true);
      console.log("Solicitud enviada");
      setIdentificador("");
      setTimeout(() => {
        setLoadingData(false);
      }, 500);
    }
  };
  // const fetchDataSolicitudes = async () => {
  //   console.log(dataUser.emailAddress);
  //   try {
  //     // Definir las dos queries
  //     const q1 = query(collecRefSolicitudes, where("userId", "==", userId));
  //     const q2 = query(
  //       collecRefSolicitudes,
  //       where("enviarA", "==", dataUser.emailAddress)
  //     );

  //     // Obtener datos iniciales de ambas queries
  //     const snapshot1 = await getDocs(q1);
  //     const data1 = snapshot1.docs.map((doc) => ({
  //       id: doc.id,
  //       ...doc.data(),
  //     }));

  //     const snapshot2 = await getDocs(q2);
  //     const data2 = snapshot2.docs.map((doc) => ({
  //       id: doc.id,
  //       ...doc.data(),
  //     }));

  //     // Combinar y eliminar duplicados (por ejemplo, basándonos en el id)
  //     const combinedInitial = Array.from(
  //       new Map([...data1, ...data2].map((item) => [item.id, item])).values()
  //     );
  //     // Actualizamos el estado con los datos iniciales
  //     setEmpresasPostuladas(combinedInitial);

  //     // Ahora, suscribirse a cambios en tiempo real con onSnapshot
  //     const unsubscribe1 = onSnapshot(q1, (snapshot) => {
  //       const newData1 = snapshot.docs.map((doc) => ({
  //         id: doc.id,
  //         ...doc.data(),
  //       }));
  //       setEmpresasPostuladas((prev) => {
  //         const merged = [...prev, ...newData1];
  //         return Array.from(
  //           new Map(merged.map((item) => [item.id, item])).values()
  //         );
  //       });
  //     });

  //     const unsubscribe2 = onSnapshot(q2, (snapshot) => {
  //       const newData2 = snapshot.docs.map((doc) => ({
  //         id: doc.id,
  //         ...doc.data(),
  //       }));
  //       setEmpresasPostuladas((prev) => {
  //         const merged = [...prev, ...newData2];
  //         return Array.from(
  //           new Map(merged.map((item) => [item.id, item])).values()
  //         );
  //       });
  //     });

  //     // Retornar la función de limpieza que cancele ambas suscripciones
  //     return () => {
  //       unsubscribe1();
  //       unsubscribe2();
  //     };
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !dataUser) return;
    const q = query(collecRefSolicitudes, where("userId", "==", userId));
    const q2 = query(
      collecRefSolicitudes,
      where("enviarA", "==", dataUser.emailAddress)
    );
    const unsuscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setEmpresasPostuladas(data);
    });
    const unsuscribe2 = onSnapshot(q2, (snapshot) => {
      const data2 = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setEmpresasSolicitudes(data2);
    });

    return () => {
      unsuscribe();
      unsuscribe2();
    };
  }, [isLoaded, isSignedIn, dataUser, userId]); // Dependencias actualizadas
  const deleteSolicitud = async (id) => {
    try {
      const docRef = doc(collecRefSolicitudes, id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        await deleteDoc(docRef);
        console.log("Eliminada con exito ");
      } else {
        console.log("No se ha encontrado");
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleAdd = (solicitud) => {
    console.log(solicitud.dataEmpresa.id);
    updateEmpresaAddToUser(userId, solicitud.dataEmpresa.id);
    updateUserAddToEmpresa(
      solicitud.dataEmpresa.id,
      solicitud,
      userId,
      dataUser
    );
  };
  return (
    <MarcoLayout darkMode={true} className={"justify-center items-center"}>
      <Box className={"p-4 mb-2"}>
        <TextSmall className={"text-center text-2xl"}>
          Tienes {empresasSolicitudes.length} solicutudes para participar en
          empresas
        </TextSmall>
        {empresasSolicitudes.length > 0 &&
          empresasSolicitudes.map((empresa) => (
            <View
              key={empresa.id}
              className="flex-row items-center gap-2 justify-around"
            >
              <Image
                source={{ uri: empresa.dataEmpresa.logotipoUrl }}
                style={{ width: 50, height: 50, borderRadius: 15 }}
              />
              <TextSmall className={"text-2xl font-bold"}>
                {empresa.dataEmpresa.nameEmpresa}
              </TextSmall>
              <View className="flex-row gap-6">
                <TouchableOpacity
                  onPress={() => {
                    handleAdd(empresa);
                  }}
                >
                  <MiIcono name="checkcircle" size={35} color="green" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => deleteSolicitud(empresa.id)}>
                  <MiIcono name="closecircle" size={35} color="red" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
      </Box>
      <Box className={"p-4 items-center"}>
        <TextSmall className={"text-xl"}>
          Introduce el codido de la empresa y espera la aprobacion:
        </TextSmall>
        <View className="flex-row p-2">
          <MiInput
            className="w-[60%] mr-5"
            onChangeText={(text) => setIdentificador(text)}
          />
          <TouchableOpacity
            onPress={handleSubmit}
            className="justify-center items-center bg-green-700 self-center p-2 rounded"
          >
            <TextSmall className={"text-white font-sans font-bold"}>
              Introducir
            </TextSmall>
          </TouchableOpacity>
        </View>
        <View className=" border-t-2 border-textPrimary" />
        <TextSmall className={"font-bold text-lg"}>
          Empresas esperando que aprueben tu solicitud:
        </TextSmall>
        {empresasPostuladas.length == 0 && (
          <TextSmall> Ninguna empresa actualmente</TextSmall>
        )}
        <View className="flex-wrap flex-row">
          {empresasPostuladas.length > 0 &&
            empresasPostuladas.map((empresa) => (
              <View
                key={empresa.id}
                className="p-2 justify-center items-center"
              >
                <Image
                  source={{ uri: empresa.dataEmpresa.logotipoUrl }}
                  style={{ width: 50, height: 50 }}
                />
                <TextSmall>{empresa.dataEmpresa.nameEmpresa}</TextSmall>
              </View>
            ))}
        </View>
        <Boton
          className="bg-buttonPrimary w-[50%] items-center my-2"
          onPress={() => router.replace("/home/")}
        >
          Volver atras
        </Boton>
      </Box>
    </MarcoLayout>
  );
}
