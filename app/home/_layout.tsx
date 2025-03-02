import { Stack } from "expo-router";
import { ClerkProvider, ClerkLoaded } from "@clerk/clerk-expo";
import { tokenCache } from "@/cache";
import { AuthProvider } from "@/context/userContext";
import { AppProvider } from "@/context/appContext";
export default function _layout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="firstHome" />
      <Stack.Screen name="crearEmpresa" />
      <Stack.Screen name="start" />
      {/* <Stack.Screen name="crearEmpresa" /> */}
    </Stack>
  );
}
