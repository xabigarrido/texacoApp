import {
  Boton,
  Box,
  FadeIn,
  MarcoLayout,
  MiIcono,
  MiInput,
  TextSmall,
} from "@/utils/utils";
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  KeyboardAvoidingView,
  TextInput,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import { useApp } from "@/context/appContext";
import { useSharedValue } from "react-native-reanimated";
import { Link, useRouter } from "expo-router";
import { useAuthApp } from "@/context/userContext";
import { addEmpresa, existeEmpresa } from "@/api/empresas.api";
import { updateUser } from "@/api/auth.api";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import { arrayUnion } from "firebase/firestore";

export default function Crear() {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const { userId, dataUser, setEmpresaPick } = useAuthApp();
  const { setLoadingData } = useApp();

  const router = useRouter();
  const [empresa, setEmpresa] = useState({
    name: "",
    nameComplete: false,
    ubicacion: false,
    ubicacionComplete: false,
    logotipoComplete: false,
    logotipoUrl: "default",
  });

  const pickImage = async () => {
    // Solicitar permisos y abrir la galería
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    // console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);

      uploadImageToCloudinary(result.assets[0].uri); // Subir la imagen a Cloudinary
    }
  };
  const uploadImageToCloudinary = async (uri: string) => {
    setLoading(true);
    setLoadingData(true);

    const formData = new FormData();
    formData.append("file", {
      uri: uri,
      type: "image/jpeg", // Cambia el tipo de imagen si es necesario
      name: "photo.jpg", // Asigna un nombre a la imagen
    });
    formData.append("upload_preset", "ml_default"); // Substituye con tu upload preset de Cloudinary

    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dkbsom45h/image/upload", // Reemplaza con tu cloud name
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setLoading(false);
      setLoadingData(false);
      setImageUrl(response.data.secure_url); // Aquí obtenemos la URL de la imagen subida
      setEmpresa({ ...empresa, logotipoUrl: response.data.secure_url });
      console.log("Imagen subida: ", response.data.secure_url);
    } catch (error) {
      setLoading(false);
      // Mostrar más detalles del error
      console.error(
        "Error subiendo la imagen: ",
        error.response ? error.response.data : error
      );
    }
  };

  function generarNombreUnico(nombre) {
    const nombreLimpio = nombre
      .toLowerCase()
      .replace(/\s+/g, "")
      .replace(/[^\w-]+/g, "");

    const numeroUnico = Math.floor(Math.random() * 1000000);

    const nombreUnico = `${nombreLimpio}-${numeroUnico}`;

    return nombreUnico;
  }
  const handlePressNewEmpresa = async ({ ubicacion }) => {
    try {
      setLoadingData(true);
      const newEmpresa = {
        superAdmin: userId,
        identificador: generarNombreUnico(empresa.name),
        nameEmpresa: empresa.name,
        nameEmpresaOriginal: empresa.name.toLowerCase(),
        posicionHabilitada: empresa.ubicacion,
        distancePick: 0,
        logotipoUrl: empresa.logotipoUrl,
        empleadosEmpresa: [userId],
        createdAt: new Date(),
      };
      const response = await addEmpresa(newEmpresa, dataUser);
      await updateUser(userId, {
        newUser: ubicacion ? true : false,
        empresasPostuladas: arrayUnion(response),
      });
      if (!ubicacion) {
        router.replace("/home/start");
      } else {
        router.replace(
          `/home/start/config/pickRangeUbicacion?identificador=${newEmpresa.identificador}`
        );
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingData(false);
    }
  };
  const handleName = async () => {
    if (!empresa.name.trim()) {
      return alert("No puedes dejar el nombre en blanco");
    }
    const existe = await existeEmpresa(empresa.name.toLowerCase());
    if (!existe) {
      setEmpresa({ ...empresa, nameComplete: true });
    } else {
      alert("El nombre de la empresa ya existe por favor elige otro");
    }
  };
  return (
    <MarcoLayout className={" justify-center"} darkMode={true}>
      <KeyboardAvoidingView behavior="padding">
        {!empresa.nameComplete && (
          <View className="items-center">
            <Box className={"p-4 items-center h-[100%] justify-center"}>
              <View className="my-3 h-[200px] w-full">
                <View className="absolute left-1/2 -translate-x-1/2 shadow-black">
                  <MiIcono
                    name="circle"
                    type="FontAwesome"
                    size={200}
                    color="#f3f4f6"
                  />
                </View>
                <View className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 ">
                  <MiIcono name="form" size={100} color="black" />
                </View>
              </View>
              <TextSmall className={"text-2xl font-bold mb-1 text-center"}>
                Registra tu negocio y comienza a gestionar todo en un solo
                lugar.
              </TextSmall>
              <TextSmall className={"my-4"}>
                Rellena los siguientes campos para crear tu empresa y optimiza
                la administración de tus empleados, ventas y más:
              </TextSmall>
              <MiInput
                placeholder="Escribe el nombre oficial de tu empresa."
                className="w-[80%]"
                onChangeText={(text) => setEmpresa({ ...empresa, name: text })}
              />
              <Boton
                onPress={handleName}
                className="bg-green-600 w-[80%] items-center"
              >
                Registrar empresa
              </Boton>
              <Boton
                className="mt-2 bg-buttonPrimary"
                onPress={() => {
                  setEmpresaPick(null);
                  router.replace("/home/start");
                }}
              >
                Volver atras
              </Boton>
            </Box>
          </View>
        )}
        {empresa.name && !empresa.logotipoComplete && (
          <View className="items-center">
            <Box className={"p-4 items-center h-[100%] justify-center"}>
              <View className="my-3 h-[200px] w-full">
                <View className="absolute left-1/2 -translate-x-1/2 shadow-black">
                  <MiIcono
                    name="circle"
                    type="FontAwesome"
                    size={200}
                    color="#f3f4f6"
                  />
                </View>
                <View className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 ">
                  <TouchableOpacity onPress={pickImage}>
                    {image === null ? (
                      <MiIcono
                        name="edit"
                        type="Entypo"
                        size={100}
                        color="black"
                      />
                    ) : (
                      <Image
                        source={{ uri: image }}
                        style={{ width: 100, height: 100, borderRadius: 20 }}
                      />
                    )}
                  </TouchableOpacity>
                </View>
              </View>
              <TextSmall className={"text-2xl font-bold mb-1 text-center"}>
                Logotipo para {empresa.name}
              </TextSmall>
              <TextSmall className={" mb-2"}>
                Sube el logotipo que refleje la identidad de tu negocio.
              </TextSmall>
              <TextSmall className={"mb-4"}>
                Si no deseas cargar uno ahora, puedes cambiar de logitpo mas
                adelante desde los ajustes de empresa.
              </TextSmall>

              <Boton
                className="bg-violet-600 w-[80%] items-center mb-2"
                onPress={pickImage}
              >
                Cambiar logotipo
              </Boton>
              <Boton
                className="bg-green-600 w-[80%] items-center"
                onPress={() =>
                  setEmpresa({ ...empresa, logotipoComplete: true })
                }
              >
                Siguiente
              </Boton>
              <Boton
                className="mt-2 bg-buttonPrimary"
                onPress={() =>
                  setEmpresa({ ...empresa, name: "", nameComplete: false })
                }
              >
                Volver atras
              </Boton>
            </Box>
          </View>
        )}
        {empresa.nameComplete && empresa.name && empresa.logotipoComplete && (
          <View className="items-center">
            <Box className={"p-4 items-center h-[100%] justify-center"}>
              <View className="my-3 h-[200px] w-full">
                <View className="absolute left-1/2 -translate-x-1/2 shadow-black">
                  <MiIcono
                    name="circle"
                    type="FontAwesome"
                    size={200}
                    color="#f3f4f6"
                  />
                </View>
                <View className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 ">
                  <MiIcono
                    type="MaterialCommunityIcons"
                    name="google-maps"
                    color="#1D4ED8"
                    size={100}
                  />
                </View>
              </View>
              <TextSmall className={"text-2xl font-bold mb-1 text-center"}>
                Ubicación {empresa.name}
              </TextSmall>
              <TextSmall className={"my-4"}>
                Puedes establecer una ubicación y un rango en metros para que
                tus empleados solo puedan fichar dentro de la zona de trabajo.
              </TextSmall>
              <View className="border border-gray-400 p-2 rounded-lg items-center">
                <TextSmall>
                  Esta opción es opcional y puedes activarla o desactivarla en
                  ajustes cuando quieras.
                </TextSmall>

                <Boton
                  className="bg-violet-500 w-[60%] my-2 items-center"
                  onPress={() => {
                    setEmpresa({ ...empresa, ubicacion: true });
                    handlePressNewEmpresa({ ubicacion: true });
                  }}
                >
                  Activar ahora
                </Boton>
              </View>
              <Boton
                className="w-[80%] bg-green-600 items-center my-2"
                onPress={() => {
                  setEmpresa({ ...empresa, ubicacion: false });
                  handlePressNewEmpresa({ ubicacion: false });
                }}
              >
                Continuar sin activar
              </Boton>
              <Boton
                className="mt-2 bg-buttonPrimary"
                onPress={() => {
                  setEmpresa({ ...empresa, logotipoComplete: false });
                }}
              >
                Volver atrás
              </Boton>
            </Box>
          </View>
        )}
      </KeyboardAvoidingView>
    </MarcoLayout>
  );
}
