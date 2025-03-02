import {
  ActivityIndicator,
  Dimensions,
  Keyboard,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColorScheme } from "nativewind";
import { StatusBar } from "expo-status-bar";
import { Children, forwardRef, useEffect } from "react";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Ionicons from "@expo/vector-icons/Ionicons";

import { useApp } from "@/context/appContext";

const { width: widthScreen, height: heightScreen } = Dimensions.get("window");
export const DarkMode = () => {
  const { colorScheme, toggleColorScheme } = useColorScheme();
  return (
    <TouchableOpacity
      className="bg-navbarBackground dark:bg-[#181818] rounded-full w-[60px] h-[60px] justify-center items-center"
      onPress={() => toggleColorScheme()}
    >
      {colorScheme === "dark" && (
        <MaterialIcons name="light-mode" size={24} color="white" />
      )}
      {colorScheme === "light" && (
        <MaterialIcons name="dark-mode" size={24} color="black" />
      )}
    </TouchableOpacity>
  );
};
export const MarcoLayout = ({
  children,
  className,
  darkMode = false,
  classDark = "bottom-3 right-3",
}) => {
  const insets = useSafeAreaInsets();
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const { loadingData } = useApp();
  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View className="bg-background dark:bg-dark-background">
        <StatusBar />
        <View
          style={{
            height:
              Platform.OS === "android"
                ? heightScreen - insets.bottom
                : heightScreen - insets.bottom - 10,
            marginTop: insets.top,
          }}
          className={className}
        >
          {darkMode && (
            <View className={`absolute z-50 ${classDark}`}>
              <FadeIn timeOut={1000}>
                <DarkMode />
              </FadeIn>
            </View>
          )}
          {loadingData && (
            <View className="items-center w-full">
              <Box
                className={
                  "justify-center items-center h-[100px] w-[90%] rounded-lg"
                }
              >
                <ActivityIndicator size={"large"} />
                <TextSmall>Cargando</TextSmall>
              </Box>
            </View>
          )}
          {!loadingData && children}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};
export const TextSmall = ({ children, className }) => {
  return (
    <Text
      className={`text-textPrimary dark:text-dark-textPrimary font-sans ${className}`}
    >
      {children}
    </Text>
  );
};
export const TextError = ({ children, className }) => {
  return <Text className={`font-sans text-lg ${className}`}>{children}</Text>;
};
export const Boton = ({ children, onPress, className = "bg-green-500" }) => {
  return (
    <TouchableOpacity
      className={`rounded py-4 px-5 ${className}`}
      onPress={onPress}
      onPressIn={() => Keyboard.dismiss()}
    >
      <Text className="text-white dark:text-white font-sans font-bold text-lg">
        {children}
      </Text>
    </TouchableOpacity>
  );
};
export const BotonIcon = ({
  children,
  onPress,
  className = "bg-green-700",
  type = "AntDesign",
  name = "plussquare",
  size = 24,
  color = "white",
}) => {
  return (
    <TouchableOpacity
      className={`rounded my-2 py-4 px-5 ${className}`}
      onPress={onPress}
      onPressIn={() => Keyboard.dismiss()}
    >
      <View className="flex-row gap-4 justify-between">
        {children && (
          <Text className="text-white dark:text-white font-sans font-bold text-lg">
            {children}
          </Text>
        )}

        <MiIcono type={type} name={name} size={size} color={color} />
      </View>
    </TouchableOpacity>
  );
};
export const BotonIconSize = ({
  children,
  onPress,
  className = "bg-green-700",
  type = "AntDesign",
  name = "plussquare",
  size = 24,
  color = "white",
}) => {
  return (
    <TouchableOpacity
      className={`rounded my-2 ${className}`}
      onPress={onPress}
      onPressIn={() => Keyboard.dismiss()}
    >
      <View className="flex-row gap-4 justify-between">
        {children && (
          <Text className="text-white dark:text-white font-sans font-bold text-lg">
            {children}
          </Text>
        )}

        <MiIcono type={type} name={name} size={size} color={color} />
      </View>
    </TouchableOpacity>
  );
};
export const Box = ({ children, className }) => {
  return (
    <View
      className={`bg-cardBackground dark:bg-dark-cardBackground w-[98%] ${className}`}
    >
      {children}
    </View>
  );
};
export const BoxSize = ({ children, className }) => {
  return (
    <View
      className={`bg-cardBackground dark:bg-dark-cardBackground ${className}`}
    >
      {children}
    </View>
  );
};
export const FadeIn = ({
  children,
  duration = 1000,
  timeOut = 0,
  initial = 0,
}) => {
  const opacity = useSharedValue(initial);
  useEffect(() => {
    const timeOutId = setTimeout(() => {
      opacity.value = withTiming(0, { duration }, () => {
        opacity.value = withTiming(1, { duration });
      });
    }, timeOut);
    return () => clearTimeout(timeOutId);
  }, []);
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));
  return (
    <Animated.View
      style={[
        animatedStyle,
        {
          // width: "100%",
          // alignItems: "center",
        },
      ]}
    >
      {children}
    </Animated.View>
  );
};
export const FadeInSinInputs = ({
  children,
  duration = 1000,
  timeOut = 0,
  initial = 0,
}) => {
  const opacity = useSharedValue(initial);
  useEffect(() => {
    const timeOutId = setTimeout(() => {
      opacity.value = withTiming(0, { duration }, () => {
        opacity.value = withTiming(1, { duration });
      });
    }, timeOut);
    return () => clearTimeout(timeOutId);
  }, []);
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));
  return (
    <Animated.View
      style={[
        animatedStyle,
        {
          width: "100%",
          alignItems: "center",
        },
      ]}
    >
      {children}
    </Animated.View>
  );
};
interface MiInputProps {
  className?: string;
  placeholder?: string;
  onChangeText?: (text: string) => void;
  onBlur?: () => void;
  value?: string;
  errors?: boolean;
  onSubmitEditing?: () => void;
  keyboardType?: string;
}
export const MiInput = forwardRef<TextInput, MiInputProps>(
  (
    {
      className = "w-[80%]",
      placeholder,
      onChangeText,
      onBlur,
      value,
      errors,
      onSubmitEditing,
      keyboardType = "default",
    },
    ref
  ) => {
    const { colorScheme } = useColorScheme();

    // Establecer estilo de error si es necesario
    let styleErrors;
    if (errors) {
      styleErrors = {
        borderWidth: 1,
        borderColor: "red",
      };
    }

    return (
      <TextInput
        ref={ref} // Asegurarse de pasar la referencia al TextInput
        placeholder={placeholder}
        placeholderTextColor={colorScheme === "dark" ? "white" : "black"}
        className={`bg-inputBackground dark:bg-dark-inputBackground my-2 h-14 text-center text-textPrimary dark:text-dark-textPrimary rounded ${className}`}
        onChangeText={onChangeText}
        onBlur={onBlur}
        value={value}
        style={styleErrors}
        onSubmitEditing={onSubmitEditing}
        keyboardType={keyboardType}
      />
    );
  }
);
// export const MiInput = forwardRef(
//   (
//     {
//       className,
//       placeholder,
//       onChangeText,
//       onBlur,
//       value,
//       errors,
//       onSubmitEditing,
//     },
//     ref
//   ) => {
//     const { colorScheme } = useColorScheme();
//     let styleErrors;
//     if (errors) {
//       styleErrors = {
//         borderWidth: 1,
//         borderColor: "red",
//       };
//     }
//     return (
//       <TextInput
//         placeholder={placeholder}
//         placeholderTextColor={colorScheme === "dark" ? "white" : "black"}
//         className={`bg-inputBackground dark:bg-dark-inputBackground my-2 h-14 text-center text-textPrimary dark:text-dark-textPrimary rounded ${className}`}
//         onChangeText={onChangeText}
//         onBlur={onBlur}
//         value={value}
//         style={styleErrors}
//         onSubmitEditing={onSubmitEditing}
//       />
//     );
//   }
// );
export const useDarkMode = () => {
  const { toggleColorScheme } = useColorScheme();
  return { toggleDarkMode: toggleColorScheme };
};
export const AnimacionXYRotate = ({
  children,
  initialX = 0,
  initialY = 0,
  rotate = 0,
  durationTranslate = 1000,
  durationRotate = 1000,
  scale = 1,
  durationScale = 1000,
}) => {
  const translateX = useSharedValue(initialX);
  const translateY = useSharedValue(initialY);
  const rotateNow = useSharedValue(0);
  const scaleNow = useSharedValue(1);
  useEffect(() => {
    translateX.value = withTiming(0, { duration: durationTranslate });
    translateY.value = withTiming(0, { duration: durationTranslate });
    let timeOutRotate;
    let timeOutScale;

    if (rotate !== 0) {
      timeOutRotate = setTimeout(() => {
        rotateNow.value = withSequence(
          withTiming(rotate, { duration: durationRotate }),
          withTiming(0, { duration: durationRotate })
        );
      }, durationTranslate);
    }

    if (scale !== 1) {
      timeOutScale = setTimeout(() => {
        scaleNow.value = withSequence(
          withTiming(scale, { duration: durationScale }),
          withTiming(1, { duration: durationScale })
        );
      }, durationTranslate);
    }

    return () => {
      if (timeOutRotate) clearTimeout(timeOutRotate);
      if (timeOutScale) clearTimeout(timeOutScale);
    };
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      // width: "100%",
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { rotate: `${rotateNow.value}deg` },
        { scale: scaleNow.value },
      ],
    };
  });
  return <Animated.View style={[animatedStyle]}>{children}</Animated.View>;
};
export const MiIcono = ({
  type = "AntDesign",
  name = "infocirlce",
  size = 24,
  color = "",
  className = "",
}) => {
  const { colorScheme } = useColorScheme();
  if (color == "" && className == "") {
    color = colorScheme === "dark" ? "white" : "black";
  } else if (color != "") {
    color = color;
  } else {
    color = className;
  }
  if (type === "Entypo") {
    return <Entypo name={name} size={size} color={color} />;
  } else if (type === "FontAwesome") {
    return <FontAwesome name={name} size={size} color={color} />;
  } else if (type === "AntDesign") {
    return <AntDesign name={name} size={size} color={color} />;
  } else if (type === "MaterialCommunityIcons") {
    return <MaterialCommunityIcons name={name} size={size} color={color} />;
  } else if (type === "FontAwesome6") {
    return <FontAwesome6 name={name} size={size} color={color} />;
  } else if (type === "Ionicons") {
    return <Ionicons name={name} size={size} color={color} />;
  } else if (type === "MaterialIcons") {
    return <MaterialIcons name={name} size={size} color={color} />;
  } else {
    return null;
  }
};

export const ScaleAnimation = ({
  children,
  duration = 1000,
  scaleAfter = 1.5,
}) => {
  const scaleNow = useSharedValue(1);

  useEffect(() => {
    scaleNow.value = withRepeat(withTiming(scaleAfter, { duration }), -1, true);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleNow.value }],
  }));
  return <Animated.View style={[animatedStyle]}>{children}</Animated.View>;
};
export const AnimationRotation = ({
  children,
  rotate = 360,
  duration = 1000,
}) => {
  const rotateNow = useSharedValue(0);
  useEffect(() => {
    rotateNow.value = withRepeat(
      withTiming(rotate, { duration, easing: Easing.linear }),
      -1,
      false
    );
  }, []);
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotateNow.value}deg` }],
    };
  });
  return <Animated.View style={[animatedStyle]}>{children}</Animated.View>;
};
