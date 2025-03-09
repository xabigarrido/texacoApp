import {
  addComandaMesa,
  changeMesaToZona,
  comandaEnCurso,
  getCategoriasEmpresa,
  obetenerProductosEmpresa,
  obtenerMesaEmpresa,
  obtenerZonasFirebase,
  updateMesaFirebase,
  updateZonaFirebase,
} from "@/api/empresas.api";
import { useAuthApp } from "@/context/userContext";
import {
  collection,
  db,
  doc,
  getDocs,
  onSnapshot,
  query,
  where,
} from "@/firebaseConfig";
import {
  DarkMode,
  FadeInSinInputs,
  MarcoLayout,
  MarcoLayoutSinDismiss,
  MiIcono,
  NewBox,
  NewEtiqueta,
  TextSmall,
} from "@/utils/utils";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { useLocalSearchParams, useRouter } from "expo-router/build/hooks";
import { useColorScheme } from "nativewind";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  Image,
  Dimensions,
} from "react-native";
import {
  GestureHandlerRootView,
  ScrollView,
} from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
const { height: heightScreen } = Dimensions.get("window");
const Comanda = React.memo(() => {
  const { id } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const { colorScheme } = useColorScheme();
  const { empresaPick, dataUser } = useAuthApp();
  const [dataMesa, setDataMesa] = useState(null);
  const [dataProductos, setDataProductos] = useState([]);
  const [loadingPage, setLoadingPage] = useState(true);
  const [dataCategorias, setDataCategorias] = useState([]);
  const [pickCategoria, setPickCategoria] = useState(null);
  const [verProductos, setVerProductos] = useState([]);
  const [comanda, setComanda] = useState([]);
  const [modoExtra, setModoExtra] = useState(false);
  const [comandaExtras, setComandaExtras] = useState([]);
  const [changeZona, setChangeZona] = useState(false);
  const idMesita = id;
  const router = useRouter();
  const [dataZonas, setDataZonas] = useState([]);
  const [openModal, setOpenModal] = useState(false)
  const getMesaEmpresa = useCallback(async () => {
    try {
      const response = await obtenerMesaEmpresa(empresaPick.id, id);

      if (response) {
        setDataMesa(response);
        await updateMesaFirebase(empresaPick.id, idMesita, {
          pendiente: false,
        });
        await updateZonaFirebase(empresaPick.id, response.idZona, {
          pendiente: false,
        });
        setTimeout(() => {
          setLoadingPage(false);
        }, 200);
      }
    } catch (error) {
      console.log(error);
    }
  });
  const getProductosEmpresa = useCallback(async () => {
    try {
      const response = await obetenerProductosEmpresa(empresaPick.id);
      if (response?.estado) {
        setDataProductos(response.data);
        setTimeout(() => {
          setLoadingPage(false);
        }, 200);
      }
    } catch (error) {
      console.log(error);
    }
  });
  const getCategorias = useCallback(async () => {
    try {
      const response = await getCategoriasEmpresa(empresaPick.id);
      if (response?.estado) {
        setDataCategorias(response.data);
        setTimeout(() => {
          setLoadingPage(false);
        }, 200);
      }
    } catch (error) {
      console.log(error);
    }
  });
  const getComandaEncurso = async () => {
    try {
      const response = await comandaEnCurso(empresaPick.id, idMesita);
      if (response) {
        setComanda(response.contenidoComanda);
        if (response.contenidoExtras) {
          setComandaExtras(response.contenidoExtras);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  const getZonas = async () => {
    try {
      const response = await obtenerZonasFirebase(empresaPick.id);

      if (response) {
        setDataZonas(response);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getMesaEmpresa();
    getProductosEmpresa();
    getCategorias();
    getComandaEncurso();
    getZonas();

    return () => {
      // getMesaEmpresa();
      getProductosEmpresa();
      getCategorias();
      getComandaEncurso();
      getZonas();
    };
  }, []);
  const getComanda = async () => {
    try {
      const comandaRef = collection(db, "Empresas", empresaPick.id, "Comandas");
      const q = query(
        comandaRef,
        where("idMesa", "==", idMesita),
        where("estado", "==", "creando")
      );
      const docSnap = await getDocs(q);
      if (!docSnap.empty) {
        return docSnap.docs[0].id;
      }
    } catch (error) {
      console.log(error);
    }
  };
  const [idComanda, setIdComanda] = useState(null);
  useEffect(() => {
    const obtenerId = async () => {
      const id = await getComanda();
      if (id) {
        setIdComanda(id);
      }
    };
    obtenerId();
  }, [empresaPick.id, idMesita, id]);
  // useEffect(() => {
  //   if (!idComanda) return;
  //   console.log("comanda: "+idComanda)
  //   const docRef = doc(db, "Empresas", empresaPick.id, "Comandas", idComanda);

  //   const unsuscribe = onSnapshot(docRef, (snapshot) => {
  //     if (snapshot.exists()) {
  //       setComanda(snapshot.data().contenidoComanda);
  //       if(snapshot.data().contenidoExtras){
  //         setComandaExtras(snapshot.data().contenidoExtras);

  //       }
  //     }
  //   });
  //   return () => unsuscribe()
  // }, [idComanda, empresaPick.id]);
  const sheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["25%", "50%", "60%", "82%"], []);
  const handleSheetChange = useCallback((index) => {
    // if (index == 0) {
    //   setPickCategoria(null);
    //   sheetRef.current?.close();
    // }
  }, []);
  const handleSnapPress = useCallback((index) => {
    sheetRef.current?.snapToIndex(index);
  }, []);
  const handleClosePress = useCallback(() => {
    sheetRef.current?.close();
    setChangeZona(false);
    setPickCategoria(null);
    setOpenModal(false)
  }, []);
  if (loadingPage) {
    return (
      <View className="flex-1 bg-background dark:bg-zinc-900 justify-center items-center">
        <ActivityIndicator size={"large"} />
      </View>
    );
  }
  const ChangeZonaScreen = React.memo(() => {
    return (
      <View className="mt-10 items-center justify-center flex-row flex-wrap px-2">
        {dataZonas.length > 0 &&
          dataZonas.map((zona) => (
            <TouchableOpacity
              key={zona.id}
              onPress={async () => {
                try {
                  const response = await changeMesaToZona(
                    empresaPick.id,
                    idMesita,
                    zona.id,
                    zona.nameZona
                  );
                  if (response) {
                    router.replace("/home/start/config/mesasZonas/" + zona.id);
                  }
                } catch (error) {
                  console.log(error);
                }
              }}
            >
              <View
                style={{
                  width: 160,
                  height: 80,
                  backgroundColor: zona.color,
                  borderRadius: 10,
                  borderWidth: 2,
                  borderColor: "rgba(255, 255, 255, 0.3)",
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.2,
                  shadowRadius: 6,
                  elevation: 6,
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: Math.min(160, 80) * 0.3,
                    flexWrap: "wrap",
                    textAlign: "center",
                  }}
                  className="text-white font-sans font-bold items-center"
                >
                  {zona.nameZona}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
      </View>
    );
  });
  const Comandero = React.memo(() => {
    const renderItem = ({ item }) => (
      <TouchableOpacity
        key={item.id}
        onPress={() => {
          const getProductos = dataProductos.filter(
            (producto) => producto.idCategoria === item.id
          );
          setVerProductos(getProductos);
          setPickCategoria(item);
        }}
        style={{
          alignItems: "center",
          justifyContent: "center",
          margin: 5,
          padding: 8,
          backgroundColor: item.color,
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
        {/* Ícono o imagen de la categoría */}
        {item.icono && !item.imageUrl && (
          <MiIcono
            name={item.icono.name}
            type={item.icono.type}
            size={30}
            color="white"
            darkColor={true}
          />
        )}
        {item.imageUrl && (
          <Image
            source={{ uri: item.imageUrl }}
            style={{ width: 40, height: 40, borderRadius: 20 }}
          />
        )}
        {/* Nombre de la categoría */}
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
          {item.nameCategory}
        </Text>
      </TouchableOpacity>
    );

    return (
      <View className="items-center">
        {/* Seleccionar Categoria  */}
        {!pickCategoria && (
          <View className="flex-row flex-wrap gap-2 mt-10 justify-center">
            {dataCategorias.map((categoria) => (
              <TouchableOpacity
                key={categoria.id}
                onPress={() => {
                  const getProductos = dataProductos.filter(
                    (producto) => producto.idCategoria == categoria.id
                  );
                  setVerProductos(getProductos);
                  setPickCategoria(categoria);
                }}
                style={{
                  width: 90,
                  height: 90,
                  borderRadius: 12,
                  backgroundColor: categoria.color || "#f0f0f0", // Color de fondo
                  overflow: "hidden",
                  justifyContent: "center",
                  alignItems: "center",
                  // marginBottom: 12,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.2,
                  shadowRadius: 6,
                  elevation: 4, // Sombra para Android
                }}
              >
                {categoria.icono ? (
                  <MiIcono
                    name={categoria.icono.name}
                    type={categoria.icono.type}
                    size={45} // Tamaño del icono
                    color="#fff" // Color del icono
                  />
                ) : (
                  <Image
                    source={{ uri: categoria.imageUrl }}
                    style={{ width: 45, height: 45, borderRadius: 8 }} // Ajustar la imagen dentro del botón
                  />
                )}

                <View
                  className="mt-2"
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.8)",
                    paddingVertical: 4,
                    paddingHorizontal: 6,
                    borderRadius: 8,
                    width: "100%",
                    textAlign: "center",
                  }}
                >
                  <Text
                    style={{
                      color: "#333", // Color de texto
                      fontSize: 14, // Tamaño del texto
                      textAlign: "center",
                      width: "100%", // Asegura que el texto ocupe todo el ancho disponible
                    }}
                    numberOfLines={1} // Limita el texto a una sola línea
                  >
                    {categoria.nameCategory}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Seleccionar Producto */}

        {pickCategoria && (
          <View style={{ marginVertical: 40 }}>
            <FlatList
              data={dataCategorias}
              renderItem={renderItem}
              keyExtractor={(item) => item.id.toString()}
              ListHeaderComponent={() => (
                <TouchableOpacity
                  onPress={() => {
                    setPickCategoria(null);
                  }}
                  className="dark:bg-neutral-950"
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                    margin: 5,
                    padding: 8,
                    // backgroundColor: "white",
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
                    name="dashboard"
                    // color="black"
                    size={36}
                    type="MaterialIcons"
                  />
                </TouchableOpacity>
              )}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                paddingHorizontal: 10,
                // width: "100%",
                alignItems: "flex-start",
              }}
            />
            <View className="flex-row flex-wrap gap-3 mt-5 justify-center">
              {verProductos.map((producto) => {
                const {
                  icono,
                  color,
                  imageUrl,
                  nameProducto,
                  precioProducto,
                  id,
                } = producto;
                const displayPrice = (precioProducto / 100).toFixed(2);
                return (
                  <TouchableOpacity
                    key={id}
                    style={{
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                    onPress={async () => {
                      const uniqueNumber =
                        Date.now() + Math.floor(Math.random() * 1000);
                      if (modoExtra) {
                        // añadimos en otra comanda
                        // Comprobar si el producto ya existe en la listass
                        const existingProduct = comandaExtras.find(
                          (item) => item.id === id
                        );

                        let newArray;
                        if (existingProduct) {
                          // Si el producto ya existe, incrementamos la cantidad
                          newArray = comandaExtras.map((item) =>
                            item.id === id
                              ? { ...item, cantidad: item.cantidad + 1 } // Incrementamos la cantidad
                              : item
                          );
                        } else {
                          // Si el producto no existe, lo agregamos a la lista
                          newArray = [
                            {
                              icono,
                              color: color == undefined ? null : color,
                              imageUrl:
                                imageUrl === undefined ? null : imageUrl,
                              nameProducto,
                              precioProducto: 0,
                              id,
                              uniqueNumber: uniqueNumber + id,
                              position: comandaExtras.length, // Asigna la posición al final de la lista
                              cantidad: 1, // Iniciamos la cantidad en 1
                            },
                            ...comandaExtras,
                          ];
                        }
                        const newComanda = {
                          idMesa: idMesita,
                          idZona: dataMesa.idZona,
                          nameTrabajador: dataUser.name,
                          estado: "creando",
                          vista: false,
                          despachada: false,
                          contenidoExtras: newArray,
                        };
                        await addComandaMesa(empresaPick.id, newComanda);

                        setComandaExtras(newArray);
                      } else {
                        // Comprobar si el producto ya existe en la listass
                        const existingProduct = comanda.find(
                          (item) => item.id === id
                        );

                        let newArray;
                        if (existingProduct) {
                          // Si el producto ya existe, incrementamos la cantidad
                          newArray = comanda.map((item) =>
                            item.id === id
                              ? { ...item, cantidad: item.cantidad + 1 } // Incrementamos la cantidad
                              : item
                          );
                        } else {
                          // Si el producto no existe, lo agregamos a la lista
                          newArray = [
                            {
                              icono,
                              color: color == undefined ? null : color,
                              imageUrl:
                                imageUrl === undefined ? null : imageUrl,
                              nameProducto,
                              precioProducto,
                              id,
                              uniqueNumber: uniqueNumber + id,
                              position: comanda.length, // Asigna la posición al final de la lista
                              cantidad: 1, // Iniciamos la cantidad en 1
                            },
                            ...comanda,
                          ];
                        }
                        const newComanda = {
                          idMesa: idMesita,
                          idZona: dataMesa.idZona,
                          nameTrabajador: dataUser.name,
                          estado: "creando",
                          vista: false,
                          despachada: false,
                          contenidoComanda: newArray,
                        };
                        await addComandaMesa(empresaPick.id, newComanda);
                        setComanda(newArray);
                      }
                    }}
                    className="justify-between my-2 "
                  >
                    {/* Ícono del producto */}
                    <View
                      className="bg-gray-200 dark:bg-zinc-900 "
                      style={{
                        width: 64,
                        height: 64,
                        borderRadius: 32,
                        elevation: 4,
                        justifyContent: "center",
                        alignItems: "center",
                        // backgroundColor: "#E5E7EB", // bg-gray-200
                      }}
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
                          style={{ width: 60, height: 60, borderRadius: 30 }}
                        />
                      )}
                    </View>

                    {/* Nombre del producto */}
                    <View style={{ width: 90, position: "" }}>
                      <Text
                        numberOfLines={2}
                        ellipsizeMode="tail"
                        style={{ textAlign: "center" }}
                        className="text-textPrimary dark:text-dark-textPrimary"
                      >
                        {nameProducto}
                      </Text>
                    </View>

                    {/* Precio estilizado */}
                    {precioProducto && !modoExtra && (
                      <View
                        className="bg-green-700"
                        style={{
                          // backgroundColor: "#EF4444", // bg-red-500
                          paddingHorizontal: 12,
                          paddingVertical: 4,
                          borderRadius: 8,
                          // marginTop: 2,
                          elevation: 3,
                          shadowColor: "#000",
                          shadowOffset: { width: 0, height: 2 },
                          shadowOpacity: 0.2,
                          shadowRadius: 3,
                        }}
                      >
                        <Text style={{ color: "#fff", fontWeight: "bold" }}>
                          {displayPrice} €
                        </Text>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
              {verProductos.length == 0 && (
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

        {/* Fin Seleccionar producto  */}
      </View>
    );
  });

  const MostrarComanda = React.memo(() => {
    // Agrupar productos con su cantidad
    const comandaAgrupada = React.useMemo(() => {
      const agrupada = {};
      comanda?.forEach((producto) => {
        if (agrupada[producto.id]) {
          agrupada[producto.id].cantidad += producto.cantidad; // Sumar la cantidad
        } else {
          agrupada[producto.id] = { ...producto }; // Crear el producto si no existe
        }
      });
      return Object.values(agrupada);
    }, [comanda]);

    // Función para eliminar una unidad o quitar el producto
    const quitarUnidad = async (comandaToRemove) => {
      const updatedComanda = comanda
        .map((comandaItem) => {
          if (comandaItem.id === comandaToRemove.id) {
            if (comandaItem.cantidad > 1) {
              // Si la cantidad es mayor que 1, solo disminuimos la cantidad
              return {
                ...comandaItem,
                cantidad: comandaItem.cantidad - 1,
              };
            } else {
              // Si la cantidad es 1, eliminamos el producto
              return null;
            }
          }
          return comandaItem;
        })
        .filter((item) => item !== null);
      const newComanda = {
        idMesa: idMesita,
        contenidoComanda: updatedComanda,
      };
      await addComandaMesa(empresaPick.id, newComanda);
      setComanda(updatedComanda); // Actualizamos el estado con los cambios
    };

    // Calcular el total de la comanda
    const precioTotal = comandaAgrupada
      .reduce((total, producto) => {
        const { precioProducto, cantidad } = producto;
        return total + (precioProducto * cantidad) / 100;
      }, 0)
      .toFixed(2);

    return (
      <View>
        {(comanda.length > 0 || comandaExtras.length > 0) && (
          <View className="flex items-center mt-4 px-6">
            <View className="w-full flex-row justify-between items-center">
              <TouchableOpacity
                onPress={async () => {
                  // Acción al enviar la comandass
                  const newComanda = {
                    idMesa: idMesita,
                    idZona: dataMesa.idZona,
                    nameTrabajador: dataUser.name,
                    estado: "tomada",
                    vista: false,
                    despachada: false,
                    contenidoComanda: comanda,
                    contenidoExtras: comandaExtras,
                  };
                  await addComandaMesa(empresaPick.id, newComanda);
                  console.log("Comanda tomada y terminada por el camarero");
                  router.back();
                }}
                className="bg-[#10B981]"
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingVertical: 14,
                  paddingHorizontal: 16,
                  // backgroundColor: "#10B981", // Color verde brillante
                  borderRadius: 8,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.1,
                  shadowRadius: 6,
                  elevation: 4, // Sombra en Android
                  minWidth: 140,
                  justifyContent: "center",
                }}
              >
                <MiIcono
                  name="send"
                  color="white"
                  type="FontAwesome"
                  size={20}
                />
                <TextSmall className="ml-2 text-white font-bold text-sm">
                  Enviar Comanda
                </TextSmall>
              </TouchableOpacity>
              <TextSmall className="text-3xl font-bold text-gray-800 text-center flex-1">
                {precioTotal} €
              </TextSmall>
            </View>

            {/* Separador sutil */}
            <View
              style={{
                width: "100%",
                height: 2,
                backgroundColor: "#e0e0e0", // Línea sutil
                marginVertical: 10,
              }}
            />
          </View>
        )}

        <View className=" flex-row flex-wrap justify-center dark:bg-neutral-950">
          {comandaAgrupada
            .sort((a, b) => b.position - a.position) // Ordenar por posición
            .map((comanda) => {
              const {
                icono,
                color,
                imageUrl,
                nameProducto,
                precioProducto,
                id,
                cantidad,
              } = comanda;
              const displayPrice = ((precioProducto * cantidad) / 100).toFixed(
                2
              );
              return (
                <TouchableOpacity
                  key={id}
                  style={{ alignItems: "center" }}
                  onPress={() => quitarUnidad(comanda)}
                  className="justify-between my-2 dark:bg-zinc-800 mx-[1px] rounded"
                >
                  {/* Ícono del producto */}
                  <View
                    className="bg-gray-200 dark:bg-zinc-900"
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: 32,
                      elevation: 4,
                      justifyContent: "center",
                      alignItems: "center",
                      // backgroundColor: "#E5E7EB", // bg-gray-200
                    }}
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
                        style={{ width: 60, height: 60, borderRadius: 30 }}
                      />
                    )}
                  </View>

                  {/* Nombre del producto */}
                  <View style={{ width: 90, position: "" }}>
                    <Text
                      numberOfLines={2}
                      ellipsizeMode="tail"
                      style={{ textAlign: "center" }}
                      className="text-textPrimary dark:text-dark-textPrimary"
                    >
                      {nameProducto}
                    </Text>
                  </View>

                  {/* Precio estilizado */}
                  {precioProducto && (
                    <View
                      className="bg-green-700 dark:bg-neutral-700"
                      style={{
                        // backgroundColor: "#EF4444", // bg-red-500
                        paddingHorizontal: 12,
                        paddingVertical: 4,
                        borderRadius: 8,
                        // marginTop: 2,
                        elevation: 3,
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.2,
                        shadowRadius: 3,
                      }}
                    >
                      <Text style={{ color: "#fff", fontWeight: "bold" }}>
                        {displayPrice} €
                      </Text>
                    </View>
                  )}
                  {/* Cantidad */}
                  {cantidad > 0 && (
                    <View
                      className="py-1 px-2 rounded-full bg-violet-500"
                      style={{
                        // backgroundColor: "#EF4444", // bg-red-500ss
                        position: "absolute",
                        right: 8,
                        top: -8,
                      }}
                    >
                      <TextSmall className={"text-white"}>
                        x{cantidad}
                      </TextSmall>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
        </View>
      </View>
    );
  });
  const MostrarComandaExtras = React.memo(() => {
    // Agrupar productos con su cantidad

    const comandaAgrupada = React.useMemo(() => {
      const agrupada = {};
      comandaExtras?.forEach((producto) => {
        if (agrupada[producto.id]) {
          agrupada[producto.id].cantidad += producto.cantidad; // Sumar la cantidad
        } else {
          agrupada[producto.id] = { ...producto }; // Crear el producto si no existe
        }
      });
      return Object.values(agrupada);
    }, [comandaExtras]);

    // Función para eliminar una unidad o quitar el producto
    const quitarUnidad = async (comandaToRemove) => {
      const updatedComanda = comandaExtras
        .map((comandaItem) => {
          if (comandaItem.id === comandaToRemove.id) {
            if (comandaItem.cantidad > 1) {
              // Si la cantidad es mayor que 1, solo disminuimos la cantidad
              return {
                ...comandaItem,
                cantidad: comandaItem.cantidad - 1,
              };
            } else {
              // Si la cantidad es 1, eliminamos el producto
              return null;
            }
          }
          return comandaItem;
        })
        .filter((item) => item !== null);
      const newComanda = {
        idMesa: idMesita,
        contenidoExtras: updatedComanda,
      };
      await addComandaMesa(empresaPick.id, newComanda);
      setComandaExtras(updatedComanda); // Actualizamos el estado con los cambios
    };

    // Calcular el total de la comanda
    const precioTotal = comandaAgrupada
      .reduce((total, producto) => {
        const { precioProducto, cantidad } = producto;
        return total + (precioProducto * cantidad) / 100;
      }, 0)
      .toFixed(2);

    return (
      <View className=" flex-row flex-wrap justify-center dark:bg-neutral-950">
        {comandaAgrupada
          .sort((a, b) => b.position - a.position) // Ordenar por posición
          .map((comanda) => {
            const {
              icono,
              color,
              imageUrl,
              nameProducto,
              precioProducto,
              id,
              cantidad,
            } = comanda;
            const displayPrice = ((precioProducto * cantidad) / 100).toFixed(2);
            return (
              <TouchableOpacity
                key={id}
                style={{ alignItems: "center" }}
                onPress={() => quitarUnidad(comanda)}
                className="justify-between my-2 dark:bg-zinc-800 mx-[1px] rounded"
              >
                {/* Ícono del producto */}
                <View
                  className="bg-gray-200 dark:bg-zinc-900"
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: 32,
                    elevation: 4,
                    justifyContent: "center",
                    alignItems: "center",
                    // backgroundColor: "#E5E7EB", // bg-gray-200
                  }}
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
                      style={{ width: 60, height: 60, borderRadius: 30 }}
                    />
                  )}
                </View>

                {/* Nombre del producto */}
                <View style={{ width: 90, position: "" }}>
                  <Text
                    numberOfLines={2}
                    ellipsizeMode="tail"
                    style={{ textAlign: "center" }}
                    className="text-textPrimary dark:text-dark-textPrimary"
                  >
                    {nameProducto}
                  </Text>
                </View>

                {/* Cantidad */}
                {cantidad > 0 && (
                  <View
                    className="py-1 px-2 rounded-full bg-violet-500"
                    style={{
                      // backgroundColor: "#EF4444", // bg-red-500ss
                      position: "absolute",
                      right: 8,
                      top: -8,
                    }}
                  >
                    <TextSmall className={"text-white"}>x{cantidad}</TextSmall>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
      </View>
    );
  });
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View className="flex-1 bg-background dark:bg-zinc-900">
{!openModal &&       <View
            className="self-center"
            style={{
              position: "absolute",
              bottom: 10,
              // left: 10,
              zIndex: 100,
            }}
          >
            <DarkMode />
          </View>}
        <SafeAreaView
          style={{
            flex: 1,
            marginTop: insets.top,
            marginBottom: insets.bottom,
          }}
        >
          {/* Primer NewBox (arriba) */}
          <NewBox style={{ marginTop: 20 }} paddingHandle={false}>
            <View className="items-center">
              <View className="flex-row w-full justify-end gap-2 absolute z-50 -top-11">
                <TouchableOpacity
                  onPress={() => {
                    setModoExtra(!modoExtra);
                  }}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingVertical: 8,
                    paddingHorizontal: 12,
                    backgroundColor: modoExtra ? "#EF4444" : "#10B981",
                    borderRadius: 8,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.1,
                    shadowRadius: 6,
                    elevation: 4,
                  }}
                >
                  <MiIcono
                    name={modoExtra ? "close" : "check-circle"}
                    color="white"
                    type="FontAwesome"
                    size={20}
                  />
                  <TextSmall className="ml-2 text-white font-bold text-sm">
                    {modoExtra ? "Desactivar extras" : "Activar extras"}
                  </TextSmall>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setChangeZona(false);
                    setOpenModal(true)
                    handleSnapPress(3);
                  }}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingVertical: 10,
                    paddingHorizontal: 12,
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
                    Agregar
                  </TextSmall>
                </TouchableOpacity>
              </View>

              {/* Contenido desplazable */}
              <ScrollView
                contentContainerStyle={{ paddingBottom: 120 }}
                style={{}}
              >
                {comanda.length === 0 && comandaExtras.length === 0 ? (
                  <FadeInSinInputs>
                    <View className="flex items-center justify-center px-2 text-center mt-10">
                      <TextSmall className="text-4xl font-bold text-gray-800 mb-2">
                        Comanda vacía
                      </TextSmall>
                      <TextSmall className="text-3xl font-bold text-gray-800 mb-2">
                        ¡Es hora de empezar!
                      </TextSmall>
                      <TextSmall className="text-lg font-bold text-gray-800 mb-2">
                        Añade tus productos y empieza a organizar.
                      </TextSmall>
                      <TextSmall className="text-base text-gray-600">
                        Vende lo mejor de tu menú y sorprende a tus clientes.
                      </TextSmall>
                      <TextSmall className="text-base text-gray-600 text-center">
                        Recuerda mantener la atención en cada detalle para
                        ofrecer el mejor servicio.
                      </TextSmall>
                      <TouchableOpacity
                        onPress={() => {
                          handleSnapPress(3);
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
                          Agregar Productos
                        </TextSmall>
                      </TouchableOpacity>
                    </View>
                  </FadeInSinInputs>
                ) : (
                  <View className="mt-3">
                    <MostrarComanda />
                    {comandaExtras.length > 0 && (
                      <View className="flex items-center my-6">
                        <TextSmall className="text-center font-bold text-2xl mb-4">
                          Extras
                        </TextSmall>
                        <View
                          className="bg-blue-500 dark:bg-white"
                          style={{
                            width: "80%",
                            height: 2,
                            backgroundColor: "#e0e0e0",
                            marginVertical: 10,
                          }}
                        >
                          <View
                            className="border-blue-500 dark:border-white"
                            style={{
                              position: "absolute",
                              top: -6,
                              left: "50%",
                              transform: [{ translateX: -15 }],
                              width: 30,
                              height: 30,
                              backgroundColor: "#fff",
                              borderRadius: 15,
                              borderWidth: 2,
                            }}
                          />
                        </View>
                      </View>
                    )}
                    <MostrarComandaExtras />
                  </View>
                )}
              </ScrollView>
            </View>
          </NewBox>

          {/* Segundo NewBox (abajo, fijo) */}
          <View
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              // paddingBottom: insets.bottom,
            }}
          >
            <NewBox ancho={true} paddingHandle={false} flex={false}>
              <View className="flex-row gap-2 relative">
                <View
                  style={{
                    width: 160,
                    height: 80,
                    backgroundColor: dataMesa.color,
                    borderRadius: 10,
                    borderWidth: 2,
                    borderColor: "rgba(255, 255, 255, 0.3)",
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.2,
                    shadowRadius: 6,
                    elevation: 6,
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{
                      fontSize: Math.min(dataMesa.width, dataMesa.height) * 0.3,
                      flexWrap: "wrap",
                      textAlign: "center",
                    }}
                    className="text-white font-sans font-bold items-center"
                  >
                    {dataMesa.nameMesa}
                  </Text>
                  <View
                    className="absolute self-center -bottom-10"
                    style={{
                      paddingHorizontal: 12,
                      paddingVertical: 6,
                      borderRadius: 8,
                      zIndex: 1000,
                    }}
                  >
                    <NewBox
                      style={{ backgroundColor: dataMesa?.colorZona }}
                      paddingHandle={false}
                    >
                      <TextSmall className="text-md font-bold text-white">
                        {dataMesa?.ubicationZona}
                      </TextSmall>
                    </NewBox>
                  </View>
                </View>
                <View className="gap-1 justify-center items-center flex-1">
                  <TouchableOpacity
                    onPress={() => {
                      setChangeZona(true);
                      handleSnapPress(3);
                    }}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      paddingVertical: 10,
                      paddingHorizontal: 12,
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
                      name="move"
                      type="Feather"
                      color="white"
                      size={20}
                    />
                    <TextSmall className="ml-2 text-white font-bold text-sm">
                      Cambiar mesa de zona
                    </TextSmall>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      // handleSnapPress(3);
                      router.navigate("/home/start/config/qr/id123");
                    }}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      paddingVertical: 10,
                      paddingHorizontal: 12,
                      backgroundColor: "#3B82F6",
                      borderRadius: 8,
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 0.1,
                      shadowRadius: 6,
                      elevation: 4,
                    }}
                  >
                    <MiIcono name="qrcode" color="white" size={20} />
                    <TextSmall className="ml-2 text-white font-bold text-sm">
                      Ver QR
                    </TextSmall>
                  </TouchableOpacity>
                </View>
              </View>
            </NewBox>
          </View>
        </SafeAreaView>
      </View>
      <BottomSheet
        ref={sheetRef}
        index={-1}
        snapPoints={snapPoints}
        onChange={handleSheetChange}
        handleStyle={{ backgroundColor: colorScheme === "dark" && "#0a0a0a" }}
        handleIndicatorStyle={{
          backgroundColor: colorScheme === "dark" ? "white" : "gray",
        }}
      >
        <BottomSheetScrollView
          className={`bg-gray-100 dark:bg-[#0e0e0eec] `}
          style={{ flex: 1 }}
        >
          {changeZona && <ChangeZonaScreen />}
          {!changeZona && <Comandero />}
          {dataCategorias.length == 0 && !changeZona && (
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
          )}
          <TouchableOpacity
            className="absolute right-3 top-0 p-2 bg-red-500 dark:bg-zinc-800 rounded-full z-50 "
            onPress={handleClosePress}
          >
            <MiIcono name="close" color="white" size={20} />
          </TouchableOpacity>
        </BottomSheetScrollView>
      </BottomSheet>
    </GestureHandlerRootView>
  );
});
export default Comanda;
