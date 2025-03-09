import React, {
  Children,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  View,
  Button,
  Image,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import {
  Boton,
  Etiqueta,
  HeaderUser,
  MarcoLayout,
  MarcoLayoutSinDismiss,
  MiIcono,
  MiInput,
  mostrarAlerta,
  NewBox,
  NewEtiqueta,
  TextSmall,
} from "@/utils/utils";
import { useColorScheme } from "nativewind";
import {
  addCategoryEmpresa,
  addProductoEmpresa,
  deleteCategoriaEmpresa,
  deleteProductoEmpresa,
  editCategoriaEmpresa,
  getCategoriasEmpresa,
  obetenerProductosEmpresa,
  updateProductoEmpresa,
} from "@/api/empresas.api";
import { useAuthApp } from "@/context/userContext";
import {
  GestureHandlerRootView,
  ScrollView,
} from "react-native-gesture-handler";
import BottomSheet, {
  BottomSheetScrollView,
  BottomSheetTextInput,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { productsScheme, useProducts } from "@/utils/productos";
import { useCategorias } from "@/utils/categorias";
import { useColores } from "@/utils/colores";

const CrearCategoria = () => {
  const { colorScheme } = useColorScheme();
  const { empresaPick } = useAuthApp();
  const [nameCategory, setNameCategory] = useState("");
  const [categoriasEmpresa, setCategoriasEmpresa] = useState([]);
  const [productosEmpresa, setProductosEmpresa] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null); // Imagen seleccionada
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null); // Imagen optimizada subidass
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState(null);
  const [categoriaPick, setCategoriaPick] = useState(null);
  const productsScheme = useProducts();
  const categoriasScheme = useCategorias();
  const colores = useColores();
  const [pickColor, setPickColor] = useState(null);
  const [pickIcon, setPickIcon] = useState(null);
  const [addProduct, setAddProduct] = useState(false);
  const [product, setProduct] = useState(null);
  const [pickColorProduct, setpickColorProduct] = useState(null);
  const [productosCategoria, setProductosCategoria] = useState([]);
  const [personalizarProducto, setPersonalizarProducto] = useState(false);
  const [newColor, setNewColor] = useState(false);
  const [newIcon, setNewIcon] = useState(false);
  const [pickProduct, setPickProduct] = useState(null);
  // hooks
  const sheetRef = useRef<BottomSheet>(null);

  // variables
  const snapPoints = useMemo(() => ["25%", "50%", "85%", "90%"], []);

  // callbacks
  const handleSheetChange = useCallback((index) => {
    // if (index === 0) sheetRef.current?.close();
  }, []);
  const handleSnapPress = useCallback((index) => {
    sheetRef.current?.snapToIndex(index);
  }, []);
  const handleClosePress = useCallback(() => {
    setMode(null);
    setProductosCategoria([]);
    setPickColor(null);
    setPickIcon(null);
    setAddProduct(false);
    setProduct(null);
    setpickColorProduct(null);
    setPersonalizarProducto(false);
    setSelectedImage(null);
    setCategoriaPick(null);
    setNewIcon(false);
    setNewColor(false);
    setPickProduct(null);
    sheetRef.current?.close();
  }, []);
  const getCategorias = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getCategoriasEmpresa(empresaPick.id);
      if (response.estado) {
        setCategoriasEmpresa(response.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  });
  const getProductos = useCallback(async () => {
    try {
      const response = await obetenerProductosEmpresa(empresaPick.id);
      if (response?.estado) {
        setProductosEmpresa(response.data);
        console.log("me ejecuto");
      }
      return response.data;
    } catch (error) {
      console.log(error);
    }
  });
  useEffect(() => {
    getCategorias();
    getProductos();
  }, []);
  const pickImage = useCallback(async () => {
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
  });
  const PickProductScreen = React.memo(() => {
    useEffect(() => {}, []);
    const {
      nameProduct,
      icono,
      color,
      price,
      nameProducto,
      precioProducto,
      imageUrl,
      id,
    } = pickProduct;
    const displayPrice = (precioProducto / 100).toFixed(2);
    let newNombreProducto = "";
    let newPrecioProducto = "";
    return (
      <View className="items-center">
        <>
          {icono && !selectedImage && !imageUrl && (
            <>
              <MiIcono
                name={icono.name}
                type={icono.type}
                size={80}
                color={color}
                darkColor={true}
              />
              <TouchableOpacity onPress={pickImage} className="items-center">
                <Etiqueta className={"bg-blue-500 my-1"}>
                  Cambiar imagen
                </Etiqueta>
              </TouchableOpacity>
            </>
          )}

          {selectedImage && (
            <>
              <TouchableOpacity onPress={pickImage} className="items-center">
                <Image
                  source={{ uri: selectedImage }}
                  style={{ width: 80, height: 80, borderRadius: 5 }}
                />
                <Etiqueta className={"bg-blue-500 my-1"}>
                  Cambiar imagen
                </Etiqueta>
              </TouchableOpacity>
            </>
          )}
          {!selectedImage && imageUrl && (
            <>
              <TouchableOpacity onPress={pickImage} className="items-center">
                <Image
                  source={{ uri: imageUrl }}
                  style={{ width: 80, height: 80, borderRadius: 5 }}
                />
                <Etiqueta className={"bg-blue-500 my-1"}>
                  Cambiar imagen
                </Etiqueta>
              </TouchableOpacity>
            </>
          )}
          <MiInput
            placeholder={nameProducto}
            onChangeText={(text) => (newNombreProducto = text)}
          />
          <MiInput
            placeholder={displayPrice}
            keyboardType="numeric"
            onChangeText={(text) => (newPrecioProducto = text)}
          />
          <View className="flex-row gap-3">
            <TouchableOpacity
              onPress={async () => {
                try {
                  let prevImage;
                  if (imageUrl === undefined) {
                    prevImage = null;
                  } else {
                    prevImage = imageUrl;
                  }
                  const normalizedPrice = newPrecioProducto
                    .toString()
                    .replace(",", ".");
                  const parsedPrice = parseFloat(normalizedPrice);
                  const priceInCents = Math.round(parsedPrice * 100);
                  let newImage = null;
                  if (selectedImage) {
                    newImage = await uploadImageToCloudinary(selectedImage);
                  }
                  const editProduct = {
                    nameProducto:
                      newNombreProducto !== ""
                        ? newNombreProducto
                        : nameProducto,
                    precioProducto:
                      newPrecioProducto !== "" ? priceInCents : precioProducto,
                    icono,
                    imageUrl: selectedImage ? newImage : prevImage,
                  };
                  const response = await updateProductoEmpresa(
                    empresaPick.id,
                    id,
                    editProduct
                  );
                  if (response) {
                    const getData = await getProductos();
                    if (getData) {
                      const newProducts = getData.filter((producto) => {
                        if (producto.idCategoria === categoriaPick.id) {
                          return producto;
                        }
                      });
                      setSelectedImage(null);
                      setProductosCategoria(newProducts);
                      setPickProduct(null);
                    }
                  }
                } catch (error) {
                  console.log(error);
                }
              }}
            >
              <NewEtiqueta className={"bg-green-700 px-9 py-3"}>
                Editar
              </NewEtiqueta>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={async () => {
                try {
                  mostrarAlerta(
                    "¿Seguro desea eliminar el producto? " + nameProducto,
                    "",
                    async () => {
                      const responseDelete = await deleteProductoEmpresa(
                        empresaPick.id,
                        id
                      );
                      if (responseDelete) {
                        const response = await getProductos();
                        if (response) {
                          const newData = response.filter((producto) => {
                            if (producto.idCategoria == categoriaPick.id) {
                              return producto;
                            }
                          });
                          console.log(newData);
                          setProductosCategoria(newData);
                          setPickProduct(null);
                        }
                      }
                    }
                  );
                } catch (error) {
                  console.log(error);
                } finally {
                }
              }}
            >
              <NewEtiqueta className={"bg-red-700 px-9 py-3"}>
                Eliminar
              </NewEtiqueta>
            </TouchableOpacity>
          </View>
        </>
      </View>
    );
  });
  const handleAddProductoImage = useCallback(async (producto) => {
    try {
      const imageUpload = await uploadImageToCloudinary(selectedImage);
      if (!imageUpload) {
        alert("Hubo algun error subiendo la imagen");
      }
      const newProducto = {
        ...producto,
        imageUrl: imageUpload,
        icono: null,
      };
      addProductoEmpresa(empresaPick.id, newProducto);
    } catch (error) {
      console.log(error);
    }
  });
  const uploadImageToCloudinary = useCallback(async (uri) => {
    const formData = new FormData();
    formData.append("file", {
      uri: uri,
      type: "image/jpeg",
      name: "photo.jpg",
    });
    formData.append("upload_preset", "ml_default");

    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dkbsom45h/image/upload",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      const secureUrl = response.data.secure_url;
      const optimizedUrl = secureUrl.replace(
        "/upload/",
        "/upload/w_100,h_100,c_fill,q_80/"
      );

      setUploadedImageUrl(optimizedUrl);
      console.log("Imagen subida y optimizada:", optimizedUrl);

      return optimizedUrl; // Devolvemos la URL optimizada
    } catch (error) {
      console.error(
        "Error subiendo la imagen:",
        error.response ? error.response.data : error
      );
      return null;
    }
  });

  const addCategory = useCallback(async (nombreCategoria) => {
    if (nombreCategoria && !nombreCategoria.trim()) {
      return alert("El nombre de la categoria es requerido!!");
    }
    if (!nombreCategoria && !nameCategory.trim()) {
      return alert("El nombre de la categoría es requerido");
    }

    if (!selectedImage) {
      return alert("Debe seleccionar una imagen antes de continuar");
    }

    try {
      setLoading(true);

      // Esperar la subida de la imagen y obtener la URL
      const secureUrl = await uploadImageToCloudinary(selectedImage);

      // Verificar si la imagen se subió correctamente
      if (!secureUrl) {
        return alert("Hubo un error al subir la imagen. Inténtalo nuevamente.");
      }

      const newCategoryModel = {
        idEmpresa: empresaPick.id,
        nameCategory: nombreCategoria,
        imageUrl: secureUrl, // Usamos la URL de la imagen subida
        color: "#1e1e1e",
      };

      await addCategoryEmpresa(empresaPick.id, newCategoryModel);

      // Resetear valores después de la creación exitosa
      setSelectedImage(null);
      setUploadedImageUrl(null);
      setMode(null);
      setNameCategory(null);
      sheetRef.current?.close();
    } catch (error) {
      console.error("Error al crear la categoría:", error);
    } finally {
      getCategorias();
    }
  });

  const CategoriaBoxDefaultAdd = React.memo(
    ({ nameCategory, icono, color }) => {
      return (
        <TouchableOpacity
          onPress={async () => {
            await addCategoryEmpresa(empresaPick.id, {
              nameCategory,
              icono,
              color,
              categoriaDefault: true,
            });
            setLoading(true);
            getCategorias();
            sheetRef.current?.close();
          }}
          style={{
            alignItems: "center",
            justifyContent: "center",
            margin: 5,
            padding: 8,
            backgroundColor: color,
            borderRadius: 10,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.2,
            shadowRadius: 6,
            elevation: 5,
            width: 70,
            height: 70,
          }}
        >
          <MiIcono
            name={icono.name}
            type={icono.type}
            size={30}
            color="white"
            darkColor={true}
          />

          <Text
            style={{
              textAlign: "center",
              fontWeight: "bold",
              marginTop: 5,
              color: "white",
              fontSize: 12,
            }}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {nameCategory}
          </Text>
        </TouchableOpacity>
      );
    }
  );
  const CategoriaBoxDefaultCrear = React.memo(
    ({ nameCategory, icono, color }) => {
      return (
        <TouchableOpacity
          onPress={() => {
            setPickIcon({ icono, color });
            setPickColor(color);
          }}
        >
          <View className="w-[80px] h-[80px] rounded items-center justify-center my-2">
            <MiIcono
              name={icono.name}
              type={icono.type}
              size={icono.size}
              color={color}
              darkColor={true}
            />
            {/* <View className="absolute self-center -bottom-2 bg-gray-200 dark:bg-zinc-800 rounded w-[90px] py-1"></View> */}
          </View>
        </TouchableOpacity>
      );
    }
  );
  const CategoriaBox = React.memo(
    ({ nameCategory, icono, color, imageUrl, id }) => {
      return (
        <TouchableOpacity
          onPress={() => {
            setCategoriaPick({ nameCategory, icono, color, imageUrl, id });
            const getProducts = productosEmpresa.filter((product) => {
              if (product.idCategoria == id) {
                return product;
              }
            });
            setProductosCategoria(getProducts);
            setMode("GestionCategoria");
            handleSnapPress(3);
          }}
          style={{
            alignItems: "center",
            justifyContent: "center",
            margin: 5,
            padding: 8,
            backgroundColor: color,
            borderRadius: 10,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.2,
            shadowRadius: 6,
            elevation: 5,
            width: 90,
            height: 90,
          }}
        >
          {icono && (
            <MiIcono
              name={icono.name}
              type={icono.type}
              size={50}
              color="white"
              darkColor={true}
            />
          )}
          {!icono && (
            <Image
              source={{ uri: imageUrl }}
              style={{ width: 60, height: 60 }}
            />
          )}
          <Text
            style={{
              textAlign: "center",
              fontWeight: "bold",
              marginTop: 5,
              color: "white",
              fontSize: 12,
            }}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {nameCategory}
          </Text>
        </TouchableOpacity>
      );
    }
  );

  const Categorias = React.memo(() => {
    return (
      <View className="flex-1 p-3 pt-16">
        {/* <TextSmall className={"text-center font-bold text-lg"}>
          Selecciona una categoria ya predeterminada
        </TextSmall>
        <TextSmall className={"text-center font-bold text-lg"}>
          ¡Crea la tuya propia!
        </TextSmall> */}
        <View className="flex-wrap flex-row gap-5 justify-center">
          <TouchableOpacity
            style={{
              alignItems: "center",
              justifyContent: "center",
              margin: 5,
              padding: 8,
              backgroundColor: "#e7e7e7",
              borderRadius: 10,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.2,
              shadowRadius: 6,
              elevation: 5,
              width: 70,
              height: 70,
            }}
            onPress={() => setMode("CrearCategoria")}
          >
            <MiIcono name="plus" size={50} color="black" />
            <TextSmall className={"text-black dark:text-black font-bold"}>
              Crear
            </TextSmall>
          </TouchableOpacity>
          {categoriasScheme.map((categoria) => (
            <CategoriaBoxDefaultAdd key={categoria.position} {...categoria} />
          ))}
        </View>
      </View>
    );
  });
  const CrearCategorias = React.memo(() => {
    let nombreCategoria;
    return (
      <View className="flex-1 p-3 pt-5">
        {mode == "NameCategoria" && (
          <View className="items-center ">
            {selectedImage && (
              <Image
                source={{ uri: selectedImage }}
                style={{ width: 80, height: 80, marginBottom: 5 }}
              />
            )}
            {!selectedImage && (
              <TouchableOpacity onPress={pickImage}>
                <NewEtiqueta className={"bg-violet-500 p-4 self-center mb-2"}>
                  Seleccionar imagen
                </NewEtiqueta>
              </TouchableOpacity>
            )}
            <MiInput
              placeholder="Nombre categoria"
              onChangeText={(text) => {
                nombreCategoria = text;
                console.log(nombreCategoria);
              }}
            />
            <TouchableOpacity
              onPress={() => {
                addCategory(nombreCategoria);
              }}
            >
              <NewEtiqueta
                className={"bg-green-800 dark:bg-neutral-950 py-4 px-8 mt-2"}
              >
                Crear categoria
              </NewEtiqueta>
            </TouchableOpacity>
          </View>
        )}
        {mode !== "NameCategoria" && (
          <>
            <TouchableOpacity
              onPress={() => {
                setMode("NameCategoria");
                pickImage();
              }}
            >
              <View
                className={`px-10 py-4 rounded-lg self-center bg-blue-500 dark:bg-neutral-950`}
              >
                <Text className="text-white text-base font-medium">
                  Añadir mi propia imagen
                </Text>
              </View>
            </TouchableOpacity>
            <View className="flex-wrap flex-row gap-5 justify-center">
              {categoriasScheme.map((categoria) => (
                <CategoriaBoxDefaultCrear
                  key={categoria.position}
                  {...categoria}
                />
              ))}
            </View>
          </>
        )}
      </View>
    );
  });
  const CategoriaDefaultColorNombre = React.memo(() => {
    let nombreCategoria = "";
    return (
      <View className="flex-1 p-3 pt-5">
        <View className="items-center ">
          <MiIcono
            type={pickIcon.icono.type}
            name={pickIcon.icono.name}
            color={pickColor}
            size={80}
            darkColor={true}
          />
          <MiInput
            placeholder="Nombre categoria"
            onChangeText={(text) => {
              nombreCategoria = text;
              console.log(nombreCategoria);
            }}
          />
          <View className="flex-row gap-4 flex-wrap justify-center">
            {colores.map((color, index) => (
              <TouchableOpacity
                onPress={() => {
                  setPickColor(color);
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
          </View>

          <TouchableOpacity
            onPress={async () => {
              if (!nombreCategoria.trim()) {
                return alert("No puedes dejar el nombre de la categoria vacio");
              }
              await addCategoryEmpresa(empresaPick.id, {
                nameCategory: nombreCategoria,
                icono: pickIcon.icono,
                color: pickColor,
                categoriaDefault: true,
              });
              getCategorias();
              setPickColor(null);
              setPickIcon(null);
              setMode(null);
              sheetRef.current?.close();
            }}
          >
            <NewEtiqueta
              className={"bg-green-800 dark:bg-neutral-950 py-4 px-8 mt-2"}
            >
              Crear categoria
            </NewEtiqueta>
          </TouchableOpacity>
        </View>
      </View>
    );
  });

  const ProductoBox = React.memo(
    ({
      nameProduct,
      icono,
      color,
      price,
      nameProducto,
      precioProducto,
      imageUrl,
    }) => {
      const formattedPrice = price ? `${parseFloat(price).toFixed(2)} €` : "—";
      const formattedPrice2 = precioProducto
        ? `${parseFloat(precioProducto).toFixed(2)} €`
        : "—";

      const displayPrice = (precioProducto / 100).toFixed(2);
      return (
        <TouchableOpacity
          onPress={() => {
            setProduct({ icono, color });
            setpickColorProduct(color);
          }}
          style={{ alignItems: "center" }}
        >
          {/* Ícono del producto */}
          <View
            style={{
              width: 64,
              height: 64,
              borderRadius: 32,
              elevation: 4,
              justifyContent: "center",
              alignItems: "center",
            }}
            className="bg-gray-200 dark:bg-zinc-900"
          >
            {icono && (
              <MiIcono
                name={icono.name}
                type={icono.type}
                size={36}
                color={color}
                darkColor={true}
              />
            )}
            {imageUrl && (
              <Image
                source={{ uri: imageUrl }}
                style={{ width: 60, height: 60 }}
              />
            )}
          </View>

          {/* Nombre del producto */}
          <View style={{ width: 90, marginTop: 4 }}>
            <Text
              numberOfLines={2}
              ellipsizeMode="tail"
              style={{ flexWrap: "wrap", textAlign: "center" }}
              className="text-textSecondary dark:text-dark-textSecondary font-sans"
            >
              {nameProducto}
            </Text>
          </View>

          {/* Precio estilizado */}
          {precioProducto && (
            <View
              className="bg-green-500 dark:bg-green-600 px-3 py-1 rounded-lg mt-2"
              style={{
                elevation: 3, // Sombra en Android
                shadowColor: "#000", // Sombra en iOS
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 3,
              }}
            >
              <Text className="text-white text-base font-bold">
                {displayPrice}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      );
    }
  );

  const ProductoBoxEmpresa = React.memo(
    ({
      nameProduct,
      icono,
      color,
      price,
      nameProducto,
      precioProducto,
      imageUrl,
      id,
    }) => {
      const displayPrice = (precioProducto / 100).toFixed(2);
      return (
        <TouchableOpacity
          onPress={() => {
            setPickProduct({
              nameProduct,
              icono,
              color,
              price,
              nameProducto,
              precioProducto,
              imageUrl,
              id,
            });
          }}
          style={{ alignItems: "center" }}
        >
          {/* Ícono del producto */}
          <View
            style={{
              width: 64,
              height: 64,
              borderRadius: 32,
              elevation: 4,
              justifyContent: "center",
              alignItems: "center",
            }}
            className="bg-gray-200 dark:bg-zinc-900"
          >
            {icono && !imageUrl && (
              <MiIcono
                name={icono.name}
                type={icono.type}
                size={30}
                color={color}
                darkColor={true}
              />
            )}
            {imageUrl && (
              <Image
                source={{ uri: imageUrl }}
                style={{ width: 60, height: 60 }}
              />
            )}
          </View>

          {/* Nombre del producto */}
          <View style={{ width: 90, marginTop: 4 }}>
            <Text
              numberOfLines={2}
              ellipsizeMode="tail"
              style={{ flexWrap: "wrap", textAlign: "center" }}
              className="text-textSecondary dark:text-dark-textSecondary font-sans"
            >
              {nameProducto}
            </Text>
          </View>

          {/* Precio estilizado */}
          {precioProducto && (
            <View
              className="bg-green-500 dark:bg-green-600 px-3 py-1 rounded-lg mt-2"
              style={{
                elevation: 3, // Sombra en Android
                shadowColor: "#000", // Sombra en iOS
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 3,
              }}
            >
              <Text className="text-white text-base font-bold">
                {displayPrice} €
              </Text>
            </View>
          )}
        </TouchableOpacity>
      );
    }
  );
  const EditCategoria = React.memo(() => {
    let nombreCategoria = "";

    return (
      <View className="flex-1 p-3 pt-5">
        <View className="items-center ">
          {categoriaPick.icono && (
            <View 
            style={{
              alignItems: "center",
              justifyContent: "center",
              margin: 5,
              padding: 8,
              backgroundColor: pickColor,
              borderRadius: 10,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.2,
              shadowRadius: 6,
              elevation: 5,
              width: 90,
              height: 90,
            }}
            >
              <MiIcono
                type={categoriaPick.icono.type}
                name={categoriaPick.icono.name}
                // color={pickColor}
                size={50}
                darkColor={true}
              />
            </View>
          )}
          {!newIcon && (
            <View className="flex-row flex-wrap gap-2 justify-center">
              {categoriasScheme.map((categoria) => (
                <TouchableOpacity
                  key={categoria.position}
                  onPress={() => {
                    setNewIcon(true);
                    setCategoriaPick({
                      ...categoriaPick,
                      icono: {
                        name: categoria.icono.name,
                        type: categoria.icono.type,
                      },
                      color: pickColor,
                    });
                  }}
                >
                  <View className="w-[50px] h-[50px] rounded items-center justify-center my-2">
                    <MiIcono
                      name={categoria.icono.name}
                      type={categoria.icono.type}
                      size={50}
                      color={categoria.color}
                      darkColor={true}
                    />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
          {!newColor && newIcon && (
            <View className="flex-row gap-4 flex-wrap justify-center my-4">
              {colores.map((color, index) => (
                <TouchableOpacity
                  onPress={() => {
                    setPickColor(color);
                    setNewColor(true);
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
            </View>
          )}
          <>
            {newColor && newIcon && (
              <View className="w-full items-center">
                <MiInput
                  // value={categoriaPick.nameCategory}
                  className="w-[50%]"
                  placeholder={categoriaPick.nameCategory}
                  onChangeText={(text) => {
                    nombreCategoria = text;
                  }}
                />

                <View className="flex-row gap-2 mb-2">
                  <TouchableOpacity
                    onPress={async () => {
                      try {
                        await editCategoriaEmpresa(
                          empresaPick.id,
                          categoriaPick.id,
                          {
                            ...categoriaPick,
                            nameCategory:
                              nombreCategoria == ""
                                ? categoriaPick.nameCategory
                                : nombreCategoria,
                            color: pickColor,
                            imageUrl: null,
                          }
                        );
                        getCategorias();
                        handleClosePress();
                      } catch (error) {
                        console.log(error);
                      }
                    }}
                  >
                    <NewEtiqueta
                      className={
                        "bg-green-800 dark:bg-neutral-950 py-4 px-8 mt-2"
                      }
                    >
                      Editar categoria
                    </NewEtiqueta>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={async () => {
                      try {
                        mostrarAlerta(
                          "¿Seguro deseas eliminar la categoria " +
                            categoriaPick.nameCategory,
                          "",
                          async () => {
                            await deleteCategoriaEmpresa(
                              empresaPick.id,
                              categoriaPick.id
                            );
                            getCategorias();
                            setPickColor(null);
                            setPickIcon(null);
                            setMode(null);
                            sheetRef.current?.close();
                          }
                        );
                      } catch (error) {
                        console.log(error);
                      }
                    }}
                  >
                    <NewEtiqueta
                      className={
                        "bg-red-700 dark:bg-neutral-950 py-4 px-8 mt-2"
                      }
                    >
                      Eliminar Categoria
                    </NewEtiqueta>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </>
        </View>
      </View>
    );
  });

  const GestionCategoria = React.memo(() => {
    let nombreProducto = "";
    let precioProducto = "";
    const [nameAndPrice, setNameAndPrice] = useState(false);
    return (
      <View className="mt-6">
        <NewBox paddingHandle={false} ancho={false}>
          <View className="items-center flex-row gap-2">
            {categoriaPick.icono && (
              <MiIcono
                name={categoriaPick.icono.name}
                type={categoriaPick.icono.type}
                color={categoriaPick.color}
                size={60}
                darkColor={true}
              />
            )}
            {categoriaPick.imageUrl && (
              <Image
                source={{ uri: categoriaPick.imageUrl }}
                style={{ width: 60, height: 60 }}
              />
            )}
            <TextSmall className={"text-center text-3xl font-bold"}>
              {categoriaPick.nameCategory}
            </TextSmall>
            <TouchableOpacity
              onPress={() => {
                setMode("EditCategoria");
                setPickColor(categoriaPick.color);
              }}
            >
              <View className=" p-1 bg-blue-400 dark:bg-neutral-900 rounded-full  border-[.3px] border-gray-100 dark:border-neutral-800">
                <MiIcono name="edit" size={28} color="white" />
              </View>
            </TouchableOpacity>
          </View>
        </NewBox>
        {!addProduct && pickProduct && <PickProductScreen />}
        {!addProduct && !pickProduct && (
          <View className="items-center">
            <TouchableOpacity
              onPress={() => setAddProduct(true)}
              className="self-center"
              style={{ position: "absolute", top: -20 }}
            >
              <Etiqueta className={"bg-violet-500 self-center mb-2"}>
                Agregar Producto
              </Etiqueta>
            </TouchableOpacity>
            <View className="pt-10 flex-row flex-wrap gap-2 justify-center pb-20">
              {productosCategoria.map((producto) => (
                <ProductoBoxEmpresa key={producto.id} {...producto} />
              ))}
              {productosCategoria.length === 0 && (
                <View className="flex items-center justify-center px-2 text-center mt-10">
                  <TextSmall className="text-4xl font-bold text-gray-800 mb-2">
                    No hay productos
                  </TextSmall>
                  <TextSmall className="text-3xl font-bold text-gray-800 mb-2">
                    ¡Añade algunos!
                  </TextSmall>
                  <TextSmall className="text-lg font-bold text-gray-800 mb-2">
                    Empieza añadiendo productos para llenar tu categoria
                  </TextSmall>
                </View>
              )}
            </View>
          </View>
        )}
        {addProduct && !product && !personalizarProducto && (
          <View className="pb-10">
            <TouchableOpacity
              className="self-center"
              style={{ position: "absolute", top: -20 }}
              onPress={() => {
                setPersonalizarProducto(true);
              }}
            >
              <Etiqueta className={"bg-blue-500 self-center mb-1"}>
                Personalizar el tuyo
              </Etiqueta>
            </TouchableOpacity>
            <View className="flex-row flex-wrap gap-1 justify-center mt-8 pb-10">
              {productsScheme.map((producto) => (
                <ProductoBox key={producto.position} {...producto} />
              ))}
            </View>
            <TouchableOpacity
              onPress={() => {
                setAddProduct(false);
              }}
            >
              <NewEtiqueta className={"bg-blue-500 px-6 py-3 self-center"}>
                Volver
              </NewEtiqueta>
            </TouchableOpacity>
          </View>
        )}
        {addProduct && product && !nameAndPrice && (
          <View className="items-center">
            <MiIcono
              type={product.icono.type}
              name={product.icono.name}
              size={100}
              color={pickColorProduct}
              darkColor={true}
            />

            <View className="flex-row flex-wrap justify-center gap-4 my-2">
              {colores.map((color, index) => (
                <TouchableOpacity
                  onPress={() => {
                    setpickColorProduct(color);
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
            </View>
            <TouchableOpacity
              onPress={() => {
                setNameAndPrice(true);
              }}
            >
              <NewEtiqueta className={"bg-blue-500 px-6 py-3"}>
                Continuar
              </NewEtiqueta>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setProduct(null);
              }}
            >
              <NewEtiqueta className={"bg-blue-500 px-6 py-3 mt-2"}>
                Volver
              </NewEtiqueta>
            </TouchableOpacity>
          </View>
        )}
        {addProduct && nameAndPrice && (
          <View className="items-center">
            <MiIcono
              type={product.icono.type}
              name={product.icono.name}
              size={100}
              color={pickColorProduct}
              darkColor={true}
            />
            <MiInput
              placeholder="Nombre del producto"
              onChangeText={(text) => {
                nombreProducto = text;
              }}
            />
            <MiInput
              placeholder="Precio"
              keyboardType="numeric"
              onChangeText={(text) => {
                precioProducto = text;
              }}
            />
            <TouchableOpacity
              onPress={async () => {
                try {
                  if (!nombreProducto.trim() || !precioProducto.trim()) {
                    return alert("Debes poner un nombre y un precio");
                  }
                  const normalizedPrice = precioProducto
                    .toString()
                    .replace(",", ".");
                  const parsedPrice = parseFloat(normalizedPrice);
                  console.log(normalizedPrice);
                  const priceInCents = Math.round(parsedPrice * 100);
                  const newProducto = {
                    idCategoria: categoriaPick.id,
                    nameProducto: nombreProducto,
                    precioProducto: priceInCents,
                    icono: product.icono,
                    color:
                      pickColorProduct === null ? "tomato" : pickColorProduct,
                  };
                  await addProductoEmpresa(empresaPick.id, newProducto);
                  const response = await getProductos();
                  if (response) {
                    const newData = response.filter((producto) => {
                      if (producto.idCategoria == categoriaPick.id) {
                        return producto;
                      }
                    });
                    setProductosCategoria(newData);
                  }
                  setAddProduct(false);
                  setProduct(null);
                } catch (error) {
                  console.log(error);
                }
              }}
            >
              <NewEtiqueta className={"bg-blue-500 px-6 py-3 mb-2"}>
                Crear producto
              </NewEtiqueta>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setNameAndPrice(false)}>
              <NewEtiqueta className={"bg-blue-500 px-6 py-3"}>
                Volver
              </NewEtiqueta>
            </TouchableOpacity>
          </View>
        )}
        {!loading && personalizarProducto && (
          <View className="flex-1 p-4 items-center">
            {/* Área de imagen */}
            <View className="w-24 h-24 bg-gray-200 rounded-full overflow-hidden shadow-md mb-2">
              <TouchableOpacity
                onPress={pickImage}
                className="flex-1 justify-center items-center"
              >
                {!selectedImage ? (
                  <MiIcono
                    size={48}
                    type="FontAwesome6"
                    name="image"
                    color="black"
                  />
                ) : (
                  <Image
                    source={{ uri: selectedImage }}
                    style={{ width: "100%", height: "100%" }}
                  />
                )}
              </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={pickImage} className="mb-4">
              <Etiqueta className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-sm">
                Subir imagen
              </Etiqueta>
            </TouchableOpacity>

            {/* Inputs */}
            <View className="w-full mb-4 items-center">
              <MiInput
                placeholder="Nombre del producto"
                onChangeText={(text) => {
                  nombreProducto = text;
                }}
                style={{
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                  borderWidth: 1,
                  borderColor: "#E5E7EB",
                  borderRadius: 8,
                }}
              />
            </View>
            <View className="w-full mb-4 items-center">
              <MiInput
                placeholder="Precio"
                keyboardType="numeric"
                onChangeText={(text) => {
                  precioProducto = text;
                }}
                style={{
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                  borderWidth: 1,
                  borderColor: "#E5E7EB",
                  borderRadius: 8,
                }}
              />
            </View>

            <View className="items-center">
              {/* Botón "Crear producto" */}
              <TouchableOpacity
                onPress={async () => {
                  try {
                    if (
                      !nombreProducto.trim() ||
                      !precioProducto.trim() ||
                      selectedImage == null
                    ) {
                      return alert(
                        "Debes poner un nombre, un precio y una imagen"
                      );
                    }
                    setLoading(true)

                    const normalizedPrice = precioProducto
                      .toString()
                      .replace(",", ".");
                    const parsedPrice = parseFloat(normalizedPrice);
                    const priceInCents = Math.round(parsedPrice * 100);
                    const newProducto = {
                      idCategoria: categoriaPick.id,
                      nameProducto: nombreProducto,
                      precioProducto: priceInCents,
                    };
                    await handleAddProductoImage(newProducto);
                    const response = await getProductos();
                    if (response) {
                      const newData = response.filter(
                        (producto) => producto.idCategoria == categoriaPick.id
                      );
                      setProductosCategoria(newData);
                      setSelectedImage(null);
                      setPersonalizarProducto(false);
                      setAddProduct(false);
                    setLoading(false)

                    }
                  } catch (error) {
                    console.log(error);
                  }
                }}
                className="w-full mb-4 "
              >
                <Etiqueta className="bg-green-500 text-white px-4 py-3 rounded-md shadow-md text-center">
                  Crear producto
                </Etiqueta>
              </TouchableOpacity>

              {/* Botón "Volver" */}
              <TouchableOpacity
                onPress={() => setPersonalizarProducto(false)}
                className="w-full"
              >
                <Etiqueta className="bg-blue-500 text-white px-4 py-3 rounded-md shadow-md text-center">
                  Volver
                </Etiqueta>
              </TouchableOpacity>
            </View>
          </View>
        )}
        {loading && <ActivityIndicator size={"large"}/>}
      </View>
    );
  });

  return (
    <GestureHandlerRootView>
      <MarcoLayoutSinDismiss darkMode={true}>
        <HeaderUser />
        <NewBox paddingHandle={false} flex={true}>
          <ScrollView contentContainerStyle={{ paddingBottom: 70 }}>
            <View className="items-center">
              {loading && (
                <View className="absolute top-10">
                  <ActivityIndicator />
                </View>
              )}
              {!loading && categoriasEmpresa.length === 0 && (
                <>
                  <View className="flex items-center justify-center px-2 text-center mt-10">
                    <TextSmall className="text-4xl font-bold text-gray-800 mb-2">
                      No hay categorías
                    </TextSmall>
                    <TextSmall className="text-3xl font-bold text-gray-800 mb-2">
                      ¡Crea algunas!
                    </TextSmall>
                    <TextSmall className="text-lg text-center text-gray-800 mb-2">
                      Empieza añadiendo categorías para organizar tus productos.
                    </TextSmall>
                  </View>

                  <TouchableOpacity
                    onPress={() => {
                      setMode("addCategoria");
                      handleSnapPress(2);
                    }}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      paddingVertical: 20,
                      paddingHorizontal: 40,
                      backgroundColor: "#3B82F6",
                      borderRadius: 8,
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 0.1,
                      shadowRadius: 6,
                      elevation: 4,
                    }}
                  >
                    <MiIcono
                      name="add-circle"
                      type="Ionicons"
                      color="white"
                      size={20}
                    />
                    <TextSmall className="ml-2 text-white font-bold text-sm">
                      Crear Categoria
                    </TextSmall>
                  </TouchableOpacity>
                </>
              )}
            </View>
            <View className="flex-row flex-wrap justify-center gap-4 pt-2">
              {categoriasEmpresa.length > 0 && (
                <TouchableOpacity
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                    margin: 5,
                    padding: 8,
                    backgroundColor:
                      colorScheme === "dark" ? "#1e1e1e" : "#e7e7e7",
                    borderRadius: 10,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.2,
                    shadowRadius: 6,
                    elevation: 5,
                    width: 90,
                    height: 90,
                  }}
                  onPress={() => {
                    setMode("addCategoria");
                    handleSnapPress(2);
                  }}
                >
                  <MiIcono
                    name="add-circle"
                    type="Ionicons"
                    // color="black"
                    size={40}
                  />
                </TouchableOpacity>
              )}
              {!loading &&
                categoriasEmpresa.length > 0 &&
                categoriasEmpresa.map((categoria) => (
                  <CategoriaBox key={categoria.id} {...categoria} />
                ))}
            </View>
          </ScrollView>
        </NewBox>
      </MarcoLayoutSinDismiss>
      <BottomSheet
        ref={sheetRef}
        index={-1}
        snapPoints={snapPoints}
        keyboardBehavior="fillParent"
        enableDynamicSizing={false}
        onChange={handleSheetChange}
        handleStyle={{ backgroundColor: colorScheme === "dark" && "#0a0a0a" }}
        handleIndicatorStyle={{
          backgroundColor: colorScheme === "dark" ? "white" : "gray",
        }}
      >
        <BottomSheetScrollView className={`bg-gray-100 dark:bg-neutral-900`}>
          <View className="">
            {mode === "addCategoria" && <Categorias />}
            {mode == "CrearCategoria" && !pickIcon && <CrearCategorias />}
            {mode == "NameCategoria" && <CrearCategorias />}
            {pickIcon && <CategoriaDefaultColorNombre />}
            {mode == "GestionCategoria" && <GestionCategoria />}
            {mode == "EditCategoria" && <EditCategoria />}
            <TouchableOpacity
              className="absolute right-3 top-1 p-1 bg-red-500 dark:bg-zinc-800 self-start rounded-full z-50"
              onPress={() => {
                handleClosePress();
              }}
            >
              <MiIcono name="close" color="white" />
            </TouchableOpacity>
          </View>
        </BottomSheetScrollView>
      </BottomSheet>
    </GestureHandlerRootView>
  );
};

export default CrearCategoria;
