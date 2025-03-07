import React, { useState } from "react";
import {
  View,
  Button,
  Image,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import {
  Boton,
  HeaderUser,
  MarcoLayout,
  MiInput,
  NewBox,
  TextSmall,
} from "@/utils/utils";
import { useColorScheme } from "nativewind";
import { addCategoryEmpresa } from "@/api/empresas.api";
import { useAuthApp } from "@/context/userContext";

const CrearCategoria = () => {
  const { colorScheme } = useColorScheme();
  const { empresaPick } = useAuthApp();
  const [nameCategory, setNameCategory] = useState("Categoria por defecto");
  const styles2 = StyleSheet.create({
    box: {
      width: 100,
      height: 100,
      backgroundColor: colorScheme === "dark" ? "#1E1E1E" : "#f5f5f5",
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 10,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    text: {
      fontSize: 16,
      fontWeight: "600",
      color: colorScheme === "dark" ? "#f5f5f5" : "#333",
    },
  });
  const [selectedImage, setSelectedImage] = useState(null); // Imagen seleccionada
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null); // Imagen optimizada subida

  const pickImage = async () => {
    // Solicitar permisos y abrir la galería
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const uploadImageToCloudinary = async (uri) => {
    const formData = new FormData();
    formData.append("file", {
      uri: uri,
      type: "image/jpeg", // Cambia el tipo si es necesario
      name: "photo.jpg", // Nombre asignado a la imagen
    });
    formData.append("upload_preset", "ml_default"); // Sustituye con tu upload preset de Cloudinary

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

      // Obtenemos la URL segura de la imagen subida
      const secureUrl = response.data.secure_url;

      // Transformamos la imagen: 100x100, recorte para llenar y calidad 80 (un poquito más de calidad)
      const optimizedUrl = secureUrl.replace(
        "/upload/",
        "/upload/w_100,h_100,c_fill,q_80/"
      );

      setUploadedImageUrl(optimizedUrl);
      console.log("Imagen subida y optimizada:", optimizedUrl);
    } catch (error) {
      console.error(
        "Error subiendo la imagen:",
        error.response ? error.response.data : error
      );
    }
  };
  const addCategory = async () => {
    if (!nameCategory.trim()) {
      return alert("El nombre de la categoria es requerido");
    }
    try {
      const newCategoryModel = {
        idEmpresa: empresaPick.id,
        nameCategory,
        imageUrl: uploadedImageUrl,
        position: 0,
      };
      uploadImageToCloudinary(selectedImage); // Subir la imagen a Cloudinary
      await addCategoryEmpresa(empresaPick.id, newCategoryModel);
      setSelectedImage(null);
      setUploadedImageUrl(null);
      setNameCategory("");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <MarcoLayout darkMode={true}>
      <HeaderUser />
      <NewBox>
        <View className="items-center">
          <TouchableOpacity onPress={pickImage}>
            {!selectedImage && (
              <View style={styles2.box}>
                <Text style={styles2.text}>Agregar</Text>
                <Text style={styles2.text}>imagen</Text>
              </View>
            )}
            {selectedImage && (
              <View style={styles2.box}>
                <Image
                  source={{ uri: selectedImage }}
                  style={{ width: 75, height: 75 }}
                />
              </View>
            )}
          </TouchableOpacity>
          <MiInput
            placeholder="Nombre de la categoria"
            onChangeText={(text) => {
              setNameCategory(text);
            }}
          />
          <Boton
            className="p-2 bg-green-700 dark:bg-[#1e1e1e]"
            onPress={addCategory}
          >
            ¡Crear Categoria!
          </Boton>
        </View>
      </NewBox>
    </MarcoLayout>
  );
};

export default CrearCategoria;
