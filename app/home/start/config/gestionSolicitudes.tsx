import { useAuthApp } from "@/context/userContext";
import {
  Box,
  FadeIn,
  HeaderUser,
  MarcoLayout,
  MiInput,
  mostrarAlerta,
  TabMenu,
  TextSmall,
} from "@/utils/utils";
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
  updateDoc,
  addDoc,
  where,
} from "../../../../firebaseConfig";
import { useEffect, useState } from "react";
import { Image, Keyboard, TouchableOpacity, View } from "react-native";
import { arrayUnion } from "firebase/firestore";
import { crearSolicitudEmpresa } from "@/api/empresas.api";
const gestionSolicitudes = () => {
  const { empresaPick, dataUser } = useAuthApp();
  const router = useRouter();
  const collectRefSolicitudes = collection(db, "Solicitudes");
  const collecRefUsuarios = collection(db, "Usuarios");
  const collecRefEmpresas = collection(db, "Empresas");
  const [solicitudes, setSolicitudes] = useState([]);
  const [emailSolicitud, setEmailSolicitud] = useState("");

  useEffect(() => {
    if (!empresaPick?.identificador) return; // Si empresaPick no está listo, salimos
    const q = query(
      collectRefSolicitudes,
      where("identificador", "==", empresaPick.identificador),
      where("userId", "!=", null)
    );
    const fetchData = async () => {
      try {
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setSolicitudes(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();

    const unsuscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setSolicitudes(data);
    });
    return () => unsuscribe();
  }, [empresaPick]);
  const handleDelete = async (solicitud) => {
    try {
      const deleteDocRef = async () => {
        await deleteDoc(doc(collectRefSolicitudes, solicitud.id));
        console.log("Eliminado");
      };
      mostrarAlerta(
        `¿Quieres Eliminar?`,
        `Estas a punto de eliminar la solicitud de: ${solicitud.dataUser.name}`,
        () => deleteDocRef()
      );
    } catch (error) {
      console.log(error);
    }
  };
  const handleAceptar = (solicitud) => {
    console.log(solicitud.dataUser);
    const updateEmpresaAddToUser = async () => {
      try {
        const docRef = doc(collecRefUsuarios, solicitud.dataUser.id);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
          console.log("No se encontró el usuario");
          return;
        }

        await updateDoc(docRef, {
          empresasPostuladas: arrayUnion(empresaPick.id),
          newUser: false,
        });

        console.log("Empresa añadida al usuario");
      } catch (error) {
        console.error("Error al actualizar el usuario:", error);
      }
    };
    const updateUserAddToEmpresa = async () => {
      try {
        const docRef = doc(collecRefEmpresas, empresaPick.id);
        const docSnap = await getDoc(docRef);
        const docRefSolicitd = doc(collectRefSolicitudes, solicitud.id);
        if (!docSnap.exists()) {
          console.log("La empresa no se encontro");
          return;
        }
        await updateDoc(docRef, {
          empleadosEmpresa: arrayUnion(solicitud.dataUser.id),
        });
        const empleadosSubRef = collection(docRef, "Empleados");
        await addDoc(empleadosSubRef, solicitud.dataUser);
        await deleteDoc(docRefSolicitd);
        console.log("Usuario añadido a la empresa");
      } catch (error) {
        console.log(error);
      }
    };

    updateEmpresaAddToUser();
    updateUserAddToEmpresa();
  };
  const handleSendEmail = () => {
    try {
      crearSolicitudEmpresa(
        null,
        empresaPick.identificador,
        null,
        emailSolicitud.toLowerCase()
      );
      alert("Solicitud enviada con exito");
      Keyboard.dismiss();
      setEmailSolicitud("");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <MarcoLayout darkMode={true} className={"justify-between"}>
      <TabMenu />
      <FadeIn>
        <HeaderUser />
        <Box className={"p-6 m-2"}>
          <View className="items-center">
            <TextSmall className={"text-center text-2xl mb-2"}>
              Tienes {solicitudes.length} solicitudes pendientes
            </TextSmall>
            <MiInput
              placeholder="Escribe el correo electronico"
              onChangeText={(text) => setEmailSolicitud(text)}
              value={emailSolicitud}
            />
            <TouchableOpacity
              className="bg-buttonPrimary px-4 py-2 rounded"
              onPress={handleSendEmail}
            >
              <TextSmall className={"text-white"}>Enviar solicitud</TextSmall>
            </TouchableOpacity>
          </View>
          <View>
            {solicitudes.map((solicitud) => (
              <View
                key={solicitud.id}
                className="flex-row items-center justify-evenly gap-2 border-[.2px] rounded dark:border-white p-2"
              >
                <Image
                  source={{ uri: solicitud.dataUser?.imageUrl }}
                  style={{ width: 40, height: 40, borderRadius: 20 }}
                />
                <View>
                  <TextSmall className={"font-bold"}>
                    {solicitud.dataUser?.name} {solicitud.dataUser?.subname}
                  </TextSmall>
                  <TextSmall>{solicitud.dataUser?.emailAddress}</TextSmall>
                  <View className={"self-end flex-row gap-1"}>
                    <TouchableOpacity
                      className="py-2 px-4 bg-red-700 rounded"
                      onPress={() => handleDelete(solicitud)}
                    >
                      <TextSmall className={"text-white font-semibold"}>
                        Eliminar
                      </TextSmall>
                    </TouchableOpacity>
                    <TouchableOpacity
                      className="py-2 px-4 bg-green-700 rounded"
                      onPress={() => handleAceptar(solicitud)}
                    >
                      <TextSmall className={"text-white font-semibold"}>
                        Aceptar
                      </TextSmall>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </Box>
      </FadeIn>
    </MarcoLayout>
  );
};

export default gestionSolicitudes;
