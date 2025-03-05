import { updateUser } from "@/api/auth.api";
import { useAuthApp } from "@/context/userContext";
import {
  Boton,
  BotonIcon,
  BotonIconSize,
  Box,
  FadeIn,
  FadeInSinInputs,
  MarcoLayout,
  MiIcono,
  ScaleAnimation,
  TextSmall,
} from "@/utils/utils";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

const FirstHome = () => {
  const { userId, isLoaded, signOut, dataUser, isSignedIn } = useAuthApp();
  const [verMasEmpresa, setVerMasEmpresa] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;
    if (!isSignedIn) return;
    if (!dataUser) return;
    if (!dataUser.newUser) return router.replace("/home/start");
  }, [isLoaded, isSignedIn, dataUser]);
  return (
    <MarcoLayout className={"justify-center items-center"} darkMode={true}>
      <FadeInSinInputs duration={2000}>
        {dataUser.newUser && (
          <>
            {!verMasEmpresa && (
              <HeaderPrimeraVez dataUser={dataUser} signOut={signOut} />
            )}

            <PrimeraVez
              setVerMasEmpresa={setVerMasEmpresa}
              verMasEmpresa={verMasEmpresa}
            />
          </>
        )}
      </FadeInSinInputs>
    </MarcoLayout>
  );
};
const PrimeraVez = ({ verMasEmpresa, setVerMasEmpresa }) => {
  return (
    <Box className={"w-[90%] py-4 rounded-xl justify-around items-center"}>
      {!verMasEmpresa && <IniciarEmpresa />}

      <CrearEntorno
        setVerMasEmpresa={setVerMasEmpresa}
        verMasEmpresa={verMasEmpresa}
      />
    </Box>
  );
};
export default FirstHome;

const CrearEntorno = ({ setVerMasEmpresa, verMasEmpresa }) => {
  const router = useRouter();
  return (
    <FadeInSinInputs duration={1300}>
      <View className="w-full p-1 mt-2">
        <View className="bg-navbarBackground dark:bg-dark-navbarBackground rounded-xl p-3">
          <View className="flex-row px-1 py-2 bg-white rounded-full border border-gray-200 absolute right-0 z-50 -top-5 dark:bg-dark-navbarBackground dark:border-0">
            <View className="absolute z-50 -left-2">
              <ScaleAnimation duration={1500} scaleAfter={1.3}>
                <MiIcono
                  type="FontAwesome"
                  name="plus"
                  size={38}
                  color="#16a34a"
                />
              </ScaleAnimation>
            </View>
            <MiIcono
              type="MaterialCommunityIcons"
              name="folder-home"
              size={45}
              color="#fdba34"
              classname="bg-orange-300"
            />
          </View>

          <View>
            <TextSmall className={"font-extrabold text-3xl"}>
              Registro de Empresa
            </TextSmall>
          </View>

          <View className="border-t-2 border-textPrimary dark:border-white w-[76%] mb-4" />
          <View className="mb-1">
            <View className="flex-row items-center">
              <TextSmall className={"text-4xl font-bold"}>· </TextSmall>
              <TextSmall className={"text-textSecondary"}>
                Crea tu empresa y lleva el control total de tu negocio en un
                solo lugar.
              </TextSmall>
            </View>
            <View className="flex-row items-center">
              <TextSmall className={"text-4xl font-bold"}>· </TextSmall>
              <TextSmall className={"text-textSecondary"}>
                Optimiza tus espacios de trabajo y asigna tareas fácilmente.
              </TextSmall>
            </View>
            <View className="flex-row items-center">
              <TextSmall className={"text-4xl font-bold"}>· </TextSmall>
              <TextSmall className={"text-textSecondary"}>
                Gestiona empleados, ventas y más.
              </TextSmall>
            </View>

            {verMasEmpresa && (
              <View>
                <View className="items-center">
                  <TextSmall className={"text-2xl mt-2 font-bold"}>
                    Gestión de Empleados
                  </TextSmall>
                  <View className="border-t-2 border-textPrimary dark:border-white w-[63%] mb-2" />
                </View>

                <TextSmall>
                  - Administra turnos, fichajes y roles en segundos.
                </TextSmall>
                <TextSmall>
                  - Control total de tu equipo: entradas, salidas y rendimiento.
                </TextSmall>
                <TextSmall>
                  - Organiza a tu equipo y mejora la productividad.
                </TextSmall>
                <View className="items-center">
                  <TextSmall className={"text-2xl mt-2 font-bold"}>
                    Gestión de Mesas
                  </TextSmall>
                  <View className="border-t-2 border-textPrimary dark:border-white w-[63%] mb-2" />
                </View>

                <TextSmall>
                  - Optimiza tus espacios de trabajo y asigna tareas fácilmente
                </TextSmall>
                <TextSmall>
                  - Gestiona mesas y zonas de trabajo con un solo clic.
                </TextSmall>
                <TextSmall>
                  - Distribuye tu negocio de forma eficiente y sin
                  complicaciones
                </TextSmall>

                <View className="items-center">
                  <TextSmall className={"text-2xl mt-2 font-bold"}>
                    Órdenes y Comandas
                  </TextSmall>
                  <View className="border-t-2 border-textPrimary dark:border-white w-[63%] mb-2" />
                </View>
                <TextSmall>
                  - Gestiona pedidos y comandas en tiempo real, sin confusiones.
                </TextSmall>
                <TextSmall>
                  - Cada pedido en su lugar, cada cliente satisfecho.
                </TextSmall>
                <TextSmall>
                  - Conecta a tu equipo y agiliza el servicio.
                </TextSmall>
              </View>
            )}
          </View>
          <Boton
            className="bg-buttonPrimary items-center mt-2"
            onPress={() => setVerMasEmpresa(!verMasEmpresa)}
          >
            {verMasEmpresa ? "Cerrar" : "Ver mas"}
          </Boton>
          <Boton
            className="bg-green-600 items-center mt-2"
            onPress={() => router.replace("/home/crearEmpresa")}
          >
            Registrar Empresa
          </Boton>
        </View>
      </View>
    </FadeInSinInputs>
  );
};
const IniciarEmpresa = () => {
  const router = useRouter();
  return (
    <View className="w-full p-1">
      <View className="bg-navbarBackground dark:bg-dark-navbarBackground rounded-xl p-3">
        <View className="flex-row gap-2 px-1 py-2 bg-white rounded-full border border-gray-200 absolute right-0 -top-5 dark:bg-dark-navbarBackground dark:border-0">
          <View className="absolute -left-8 top-10 py-2 px-2 bg-white rounded-full border border-gray-200 dark:bg-dark-navbarBackground dark:border-0">
            <MiIcono type="Ionicons" name="person" size={38} color="#5194ff" />
          </View>
          <MiIcono
            type="MaterialCommunityIcons"
            name="home"
            size={45}
            color="#8b5cf6"
          />
        </View>

        <View>
          <TextSmall className={"font-extrabold text-3xl"}>
            Ingresar a Empresa
          </TextSmall>
        </View>
        <View className="border-t-2 border-textPrimary dark:border-white w-[67%] mb-4" />
        <View className="mb-1">
          <View className="flex-row items-center">
            <TextSmall className={"text-4xl font-bold"}>· </TextSmall>
            <TextSmall className={"text-textSecondary"}>
              Ingresa a tu equipo y empieza a gestionar tu día a día.
            </TextSmall>
          </View>
          <View className="flex-row items-center">
            <TextSmall className={"text-4xl font-bold"}>· </TextSmall>
            <TextSmall className={"text-textSecondary"}>
              Introduce tu clave o acepta la invitacion y únete a la empresa en
              segundos
            </TextSmall>
          </View>
          <View className="flex-row items-center">
            <TextSmall className={"text-4xl font-bold"}>· </TextSmall>
            <TextSmall className={"text-textSecondary"}>
              Accede a tu espacio de trabajo y mantente conectado con tu equipo.
            </TextSmall>
          </View>
          {/* {verMasEmpresa && (
              <View>
                <View className="items-center">
                  <TextSmall className={"text-2xl mt-2 font-bold"}>
                    Gestión de Empleados
                  </TextSmall>
                  <View className="border-t-2 border-textPrimary dark:border-white w-[63%] mb-2" />
                </View>

                <TextSmall>
                  - Administra turnos, fichajes y roles en segundos.
                </TextSmall>
                <TextSmall>
                  - Control total de tu equipo: entradas, salidas y rendimiento.
                </TextSmall>
                <TextSmall>
                  - Organiza a tu equipo y mejora la productividad.
                </TextSmall>
                <View className="items-center">
                  <TextSmall className={"text-2xl mt-2 font-bold"}>
                    Gestión de Mesas
                  </TextSmall>
                  <View className="border-t-2 border-textPrimary dark:border-white w-[63%] mb-2" />
                </View>

                <TextSmall>
                  - Optimiza tus espacios de trabajo y asigna tareas fácilmente
                </TextSmall>
                <TextSmall>
                  - Gestiona mesas y zonas de trabajo con un solo clic.
                </TextSmall>
                <TextSmall>
                  - Distribuye tu negocio de forma eficiente y sin
                  complicaciones
                </TextSmall>

                <View className="items-center">
                  <TextSmall className={"text-2xl mt-2 font-bold"}>
                    Órdenes y Comandas
                  </TextSmall>
                  <View className="border-t-2 border-textPrimary dark:border-white w-[63%] mb-2" />
                </View>
                <TextSmall>
                  - Gestiona pedidos y comandas en tiempo real, sin confusiones.
                </TextSmall>
                <TextSmall>
                  - Cada pedido en su lugar, cada cliente satisfecho.
                </TextSmall>
                <TextSmall>
                  - Conecta a tu equipo y agiliza el servicio.
                </TextSmall>
              </View>
            )} */}
        </View>
        <Boton
          className="bg-violet-500 items-center mt-2"
          onPress={() => router.replace("/home/iniciarEnEmpresa")}
        >
          Iniciar en una empresa
        </Boton>
      </View>
    </View>
  );
};

const HeaderPrimeraVez = ({ dataUser, signOut }) => {
  const router = useRouter();
  return (
    <Box
      className={"mb-2 rounded-xl flex-row justify-around items-center py-2"}
    >
      <View>
        <TextSmall className={"text-3xl font-bold"}>Bienvenido/a</TextSmall>
        <TextSmall className={"text-xl"}>
          {dataUser.name} {dataUser.subname}
        </TextSmall>
        <BotonIconSize
          onPress={async () => {
            await signOut();
            router.replace("/Auth/LoginAuth");
          }}
          className="bg-red-400 px-2 py-1"
          type="FontAwesome"
          name="sign-out"
        >
          Desconectar
        </BotonIconSize>
      </View>
      <TouchableOpacity
        onPress={async () => {
          await updateUser(dataUser.id, { newUser: false });
        }}
      >
        <Image
          source={{ uri: dataUser.imageUrl }}
          style={{ width: 80, height: 80, borderRadius: 25 }}
        />
      </TouchableOpacity>
    </Box>
  );
};
