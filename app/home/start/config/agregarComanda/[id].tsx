import React, { useState } from "react";
import { View, Button, Image, Text, StyleSheet } from "react-native";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";

const CrearCategoria = () => {
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
      uploadImageToCloudinary(result.assets[0].uri); // Subir la imagen a Cloudinary
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

  return (
    <View style={styles.container}>
      <Button title="Seleccionar Imagen" onPress={pickImage} />

      {selectedImage && (
        <View style={styles.imageContainer}>
          <Text>Imagen seleccionada:</Text>
          <Image source={{ uri: selectedImage }} style={styles.image} />
        </View>
      )}

      {uploadedImageUrl && (
        <View style={styles.imageContainer}>
          <Text>Imagen optimizada:</Text>
          <Image source={{ uri: uploadedImageUrl }} style={styles.image} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  imageContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  image: {
    width: 50,
    height: 50,
    marginTop: 10,
  },
});

export default CrearCategoria;
