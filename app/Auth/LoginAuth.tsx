import {
  AnimacionXYRotate,
  Boton,
  BotonIcon,
  FadeIn,
  MarcoLayout,
  MiIcono,
  MiInput,
  TextError,
  TextSmall,
  useWarmUpBrowser,
} from "@/utils/utils";
import React, { useEffect, useRef, useState, useCallback } from "react";
import { KeyboardAvoidingView, TouchableOpacity, View } from "react-native";
import Animated from "react-native-reanimated";
import { useColorScheme } from "nativewind";
import ContainerBotonesGoogleApple from "../../components/ContainerBotonesGoogleApple";
import { Link, useRouter } from "expo-router";
import { Formik } from "formik";
import * as Yup from "yup";
import { useAuth, useSignIn } from "@clerk/clerk-react";
import { useApp } from "@/context/appContext";
import * as WebBrowser from "expo-web-browser";
const LoginAuth = () => {
  const [userLogin, setUserLogin] = useState({ email: "", password: "" });
  return (
    <MarcoLayout className={"justify-center"} darkMode={true}>
      <KeyboardAvoidingView behavior="padding">
        <HeaderLogos />
        <FadeIn duration={1000} timeOut={1000}>
          <FormularioLogin />
        </FadeIn>
        <View className="h-[20%]" />
      </KeyboardAvoidingView>
    </MarcoLayout>
  );
};

export default LoginAuth;

const HeaderLogos = React.memo(() => {
  const { colorScheme } = useColorScheme();

  return (
    <View className="flex-row justify-center gap-4 mt-6 mb-6">
      <AnimacionXYRotate
        initialX={-1000}
        duration={750}
        scale={1.2}
        durationScale={300}
      >
        <MiIcono
          type="FontAwesome6"
          name="person-walking-arrow-right"
          size={100}
        />
      </AnimacionXYRotate>
      <AnimacionXYRotate
        initialX={1000}
        duration={900}
        rotate={90}
        durationRotate={1500}
      >
        <MiIcono
          type="MaterialCommunityIcons"
          name="tablet-dashboard"
          size={100}
        />
      </AnimacionXYRotate>
    </View>
  );
});

const FormularioLogin = React.memo(() => {
  const router = useRouter();
  const passwordRef = useRef();
  const { isLoaded, setActive, signIn } = useSignIn();
  const { setLoadingData } = useApp();
  const { signOut, isSignedIn } = useAuth();
  const validateSchema = Yup.object().shape({
    emailAddress: Yup.string()
      .email("Debes introducir un correo electronico valido")
      .required("Debes introducir un correo electronico"),
    password: Yup.string().min(8, "La contraseña debe ser 8 caracteres minimo"),
  });
  const handleSubmit = async (values) => {
    if (!isLoaded) return;
    try {
      setLoadingData(true);
      const signInAttempt = await signIn.create({
        identifier: values.emailAddress,
        password: values.password,
      });

      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace("/Auth/RegisterAuth");
      } else {
        console.error(JSON.stringify(signInAttempt, null, 2));
      }
    } catch (error) {
      alert(error);
      console.log(error);
      console.error(JSON.stringify(error, null, 2));
    } finally {
      setLoadingData(false);
    }
  };
  return (
    <View className="justify-center items-center mt-2">
      <Formik
        initialValues={{ emailAddress: "", password: "" }}
        onSubmit={(values) => {
          handleSubmit(values);
        }}
        // validationSchema={validateSchema}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
        }) => {
          return (
            <>
              <MiInput
                placeholder={"Introducir correo electronico"}
                className={"w-[80%]"}
                onChangeText={handleChange("emailAddress")}
                onBlur={handleBlur("emailAddress")}
                value={values.emailAddress}
                onSubmitEditing={() => {
                  passwordRef.current.focus();
                }}
              />
              {touched.emailAddress && errors.emailAddress && (
                <TextError className={"text-red-500"}>
                  {errors.emailAddress}
                </TextError>
              )}
              <MiInput
                ref={passwordRef}
                placeholder={"Introduce la contraseña"}
                className={"w-[80%]"}
                onChangeText={handleChange("password")}
                onBlur={handleBlur("password")}
                value={values.password}
                onSubmitEditing={handleSubmit}
              />
              {touched.password && errors.password && (
                <TextError className={"text-red-500"}>
                  {errors.password}
                </TextError>
              )}
              <BotonIcon
                name="login"
                type={"MaterialCommunityIcons"}
                className={"w-[80%] bg-green-700"}
                onPress={handleSubmit}
              >
                Iniciar sesion
              </BotonIcon>
            </>
          );
        }}
      </Formik>
      <View className="w-[80%] my-2">
        <TextSmall className={"text-left"}>
          ¿Aun no tienes una cuenta?
        </TextSmall>
        <TouchableOpacity onPress={() => router.push("/Auth/RegisterAuth")}>
          <TextSmall className={"text-right"}>¡Registrate ahora!</TextSmall>
        </TouchableOpacity>
      </View>
      <Separador />
      <ContainerBotonesGoogleApple />
    </View>
  );
});
const Separador = () => {
  return (
    <View className="w-[80%] flex-row justify-center items-center">
      <View className="border-t-2 border-textPrimary dark:border-white w-[40%]" />
      <TextSmall> oo </TextSmall>
      <View className="border-t-2 border-textPrimary dark:border-white w-[40%]" />
    </View>
  );
};
