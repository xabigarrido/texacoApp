import {
  AnimacionXYRotate,
  Boton,
  BotonIcon,
  Box,
  FadeIn,
  MarcoLayout,
  MiIcono,
  MiInput,
  TextError,
  TextSmall,
} from "@/utils/utils";
import React, { useEffect, useRef, useState } from "react";
import { KeyboardAvoidingView, TouchableOpacity, View } from "react-native";
import Animated from "react-native-reanimated";
import { useColorScheme } from "nativewind";
import ContainerBotonesGoogleApple from "../../components/ContainerBotonesGoogleApple";
import { Link, useRouter } from "expo-router";
import { Formik } from "formik";
import * as Yup from "yup";
import { useSignUp } from "@clerk/clerk-expo";
import { useApp } from "@/context/appContext";
import { createdUserFirebase } from "@/api/auth.api";

const RegisterAuth = () => {
  const [emailVerify, setEmailVerify] = useState(false);
  const [dataUser, setDataUser] = useState(null);
  return (
    <MarcoLayout className={"justify-center"} darkMode={true}>
      {!emailVerify && (
        <FadeIn duration={1000}>
          <KeyboardAvoidingView behavior="position">
            <HeaderLogos />
            <FormularioLogin
              setEmailVerify={setEmailVerify}
              setDataUser={setDataUser}
            />
          </KeyboardAvoidingView>
        </FadeIn>
      )}
      {emailVerify && (
        <KeyboardAvoidingView behavior="position">
          <CodigoActivate setEmailVerify={setEmailVerify} dataUser={dataUser} />
        </KeyboardAvoidingView>
      )}
    </MarcoLayout>
  );
};

export default RegisterAuth;

const CodigoActivate = ({ setEmailVerify, dataUser }) => {
  const [codeEmail, setCodeEmail] = useState(null);
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();
  const { setLoadingData } = useApp();
  const verifyPress = async () => {
    if (!isLoaded) return;
    setLoadingData(true);
    try {
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code: codeEmail,
      });

      if (signUpAttempt.status === "complete") {
        await setActive({ session: signUpAttempt.createdSessionId });
        router.replace("/home/index");
        setEmailVerify(false);
      } else {
        console.error(JSON.stringify(signUpAttempt, null, 2));
      }
    } catch (err) {
      alert(err);
    } finally {
      setLoadingData(false);
    }
  };
  return (
    <View className="items-center">
      <Box className="justify-center items-center p-10">
        <MiIcono type="MaterialCommunityIcons" name="email-send" size={100} />
        <TextSmall>
          Se ha enviado un codigo de activacion a tu correo electronico, por
          favor introduce ese codigo aqui
        </TextSmall>
        <MiInput
          placeholder="Introducir codigo"
          onChangeText={setCodeEmail}
          keyboardType="phone-pad"
        />
        <Boton
          className="bg-purple-700 w-[80%] items-center"
          onPress={verifyPress}
        >
          Activar cuenta
        </Boton>
        <Boton
          className="bg-buttonPrimary w-[80%] mt-2 items-center"
          onPress={() => router.replace("/Auth/RegisterAuth")}
        >
          Volver
        </Boton>
      </Box>
    </View>
  );
};
const HeaderLogos = React.memo(() => {
  const { colorScheme } = useColorScheme();

  return (
    <View className="flex-row justify-center gap-4 mt-2">
      <MiIcono type="FontAwesome" name="user-circle" size={100} />
    </View>
  );
});

const FormularioLogin = React.memo(({ setEmailVerify, setDataUser }) => {
  const { setLoadingData } = useApp();
  const router = useRouter();
  const { isLoaded, signUp, setActive } = useSignUp();
  const [errorsClerk, setErrorsClerk] = useState(null);
  const subnameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const validateSchema = Yup.object().shape({
    emailAddress: Yup.string()
      .email("Debe ser un correo electronico valido")
      .required("Debes introducir un correo electronico valido"),
    password: Yup.string()
      .min(8, "La contraseña debe ser minimo 8 caracteres")
      .required("Debes escribir una contraseña"),
    name: Yup.string().required("Debes escribir un nombre"),
    subname: Yup.string().required("Debes escribir un apellido"),
  });
  const handleSubmit = async (values) => {
    const { emailAddress, password, name, subname } = values;
    setDataUser({ emailAddress, name, subname });
    if (!isLoaded) return;
    try {
      setLoadingData(true);
      await signUp.create({
        emailAddress,
        password,
        firstName: name,
        lastName: subname,
      });
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setLoadingData(false);
      setEmailVerify(true);
    } catch (error) {
      console.log(error);
      if (error.errors && error.errors.length > 0) {
        alert(error.errors[0].message); //modificar en el futuro
      }
    } finally {
      setLoadingData(false);
    }
  };
  return (
    <View className="justify-center items-center mt-2">
      <ContainerBotonesGoogleApple />
      <Separador />
      <Formik
        initialValues={{
          emailAddress: "",
          password: "",
          name: "",
          subname: "",
        }}
        // validationSchema={validateSchema}
        onSubmit={(values) => {
          handleSubmit(values);
        }}
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
                placeholder={"Introducir nombre"}
                className={"w-[80%]"}
                onChangeText={handleChange("name")}
                onBlur={handleBlur("name")}
                value={values.name}
                errors={errors.name}
                onSubmitEditing={() => {
                  subnameRef.current.focus();
                }}
              />
              {touched.name && errors.name && (
                <TextError className={"text-red-500"}>{errors.name}</TextError>
              )}
              <MiInput
                ref={subnameRef}
                placeholder={"Introducir apellidos"}
                className={"w-[80%]"}
                onChangeText={handleChange("subname")}
                onBlur={handleBlur("subname")}
                value={values.subname}
                errors={errors.subname}
                onSubmitEditing={() => {
                  emailRef.current.focus();
                }}
              />
              {touched.subname && errors.subname && (
                <TextError className={"text-red-500"}>
                  {errors.subname}
                </TextError>
              )}
              <MiInput
                ref={emailRef}
                placeholder={"Introduce su correo electronico"}
                className={"w-[80%]"}
                onChangeText={handleChange("emailAddress")}
                onBlur={handleBlur("emailAddress")}
                value={values.emailAddress}
                errors={errors.emailAddress}
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
                errors={errors.password}
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
                className={"w-[80%] bg-purple-600"}
                onPress={handleSubmit}
              >
                Crear una cuenta
              </BotonIcon>
            </>
          );
        }}
      </Formik>

      <View className="w-[80%] my-2">
        <TextSmall className={"text-left"}>¿Ya tienes una cuenta?</TextSmall>
        <TouchableOpacity onPress={() => router.push("/Auth/LoginAuth")}>
          <TextSmall className={"text-right"}>¡Inicia sesion!</TextSmall>
        </TouchableOpacity>
      </View>
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
