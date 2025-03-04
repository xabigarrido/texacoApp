/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  darkMode: "class",
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./utils/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      // Definimos la fuente "San Francisco" como la predeterminada
      fontFamily: {
        sans: ["San Francisco", "Arial", "sans-serif"], // Usamos 'San Francisco' como la principal
      },
      colors: {
        // Colores claros
        background: "#EAEAEA", // Fondo más oscuro para resaltar las tarjetas
        cardBackground: "#FFFFFF", // Fondo de las tarjetas más claro
        inputBackground: "#E0E0E0", // Fondo de los inputs más oscuro
        navbarBackground: "#F1F5F9", // Fondo para la navbar
        textPrimary: "#333333", // Texto principal oscuro
        textSecondary: "#555555", // Texto secundario más suave
        textTertiary: "#777777", // Texto terciario
        placeholder: "#B0B0B0", // Texto de los placeholders
        buttonPrimary: "#1D4ED8", // Azul para botones principales
        buttonSecondary: "#E5E7EB", // Botón secundario más claro
        buttonTextPrimary: "#FFFFFF", // Color de texto en botones
        buttonSuccess: "#22C55E", // Verde para botones de éxito
        buttonDanger: "#EF4444", // Rojo para botones de advertencia o error
        buttonWarning: "#F59E0B", // Amarillo para advertencias
        buttonInfo: "#3B82F6", // Azul para información
        cardHighlight: "#FDE68A", // Amarillo para resaltar dentro de tarjetas
        cardInfo: "#E0F2FE", // Azul claro para resaltar información dentro de las tarjetas
        cardSuccess: "#D1FAE5", // Verde claro para resaltar elementos de éxito dentro de las tarjetas
        border: "#D1D5DB", // Bordes más suaves
        shadow: "rgba(0, 0, 0, 0.2)", // Sombra ligera
        inputBorder: "#D1D5DB", // Bordes de los inputs
        inputText: "#333333", // Texto en los inputs

        // Colores oscuros
        dark: {
          background: "#1F1F1F", // Fondo oscuro para resaltar las tarjetas
          cardBackground: "#333333", // Fondo de las tarjetas oscuro pero destacado
          inputBackground: "#444444", // Fondo para inputs oscuros
          navbarBackground: "#1A1A1A", // Fondo de la navbar oscuro
          textPrimary: "#FFFFFF", // Texto en blanco
          textSecondary: "#E0E0E0", // Texto secundario claro
          textTertiary: "#B0B0B0", // Texto terciario más suave
          placeholder: "#666666", // Texto de los placeholders oscuros
          buttonPrimary: "#3B82F6", // Botón azul en modo oscuro
          buttonSecondary: "#4B5563", // Botón secundario en modo oscuro
          buttonTextPrimary: "#FFFFFF", // Color de texto en botones
          buttonSuccess: "#22C55E", // Verde para botones de éxito en modo oscuro
          buttonDanger: "#EF4444", // Rojo para botones de error en modo oscuro
          buttonWarning: "#F59E0B", // Amarillo para advertencias en modo oscuro
          buttonInfo: "#3B82F6", // Azul para información en modo oscuro
          cardHighlight: "#FDE68A", // Amarillo para resaltar dentro de tarjetas en modo oscuro
          cardInfo: "#E0F2FE", // Azul claro para resaltar información dentro de las tarjetas en modo oscuro
          cardSuccess: "#D1FAE5", // Verde claro para resaltar elementos de éxito dentro de las tarjetas en modo oscuro
          border: "#444444", // Bordes oscuros
          shadow: "rgba(0, 0, 0, 0.7)", // Sombra fuerte
          inputBorder: "#666666", // Bordes de los inputs en modo oscuro
          inputText: "#FFFFFF", // Texto en los inputs en modo oscuro
        },
      },
      fontSize: {
        xlg: "1.25rem", // Puedes agregar tamaños de fuente adicionales si lo necesitas
      },
    },
  },
  plugins: [],
};
