import { useMemo } from "react";
export const useProducts = () => {
  const products = useMemo(
    () => [
      // ----- BEBIDAS -----
      {
        nameProduct: "Cerveza IPA",
        icono: { name: "beer", type: "FontAwesome5", size: 80 },
        color: "#EF4444", // rojo
        price: 4.0,
        position: 1,
      },
      {
        nameProduct: "Cerveza IPA Especial",
        icono: { name: "beer-sharp", type: "Ionicons", size: 80 },
        color: "#3B82F6", // azul
        price: 4.0,
        position: 2,
      },
      {
        nameProduct: "Cerveza Pilsner",
        icono: { name: "glass-mug", type: "MaterialCommunityIcons", size: 80 },
        color: "#10B981", // verde
        price: 3.8,
        position: 3,
      },
      {
        nameProduct: "Cerveza Pilsner Premium",
        icono: { name: "wine-bottle", type: "FontAwesome6", size: 80 },
        color: "#F59E0B", // amarillo
        price: 3.8,
        position: 4,
      },
      {
        nameProduct: "Vino Tinto",
        icono: { name: "glass-wine", type: "MaterialCommunityIcons", size: 80 },
        color: "#8B5CF6", // púrpura
        price: 5.0,
        position: 5,
      },
      {
        nameProduct: "Vino Blanco",
        icono: { name: "wine-glass-alt", type: "FontAwesome5", size: 80 },
        color: "#EC4899", // rosa
        price: 5.0,
        position: 6,
      },
      {
        nameProduct: "Cocktail Clásico",
        icono: {
          name: "glass-cocktail",
          type: "MaterialCommunityIcons",
          size: 80,
        },
        color: "#6366F1", // índigo
        price: 6.0,
        position: 7,
      },
      {
        nameProduct: "Cocktail Tropical",
        icono: { name: "emoji-food-beverage", type: "MaterialIcons", size: 80 },
        color: "#14B8A6", // teal
        price: 6.0,
        position: 8,
      },
      {
        nameProduct: "Cocktail de Manzana",
        icono: { name: "food-apple", type: "MaterialCommunityIcons", size: 80 },
        color: "#FB923C", // naranja
        price: 6.0,
        position: 9,
      },
      {
        nameProduct: "Mojito",
        icono: { name: "glass-martini", type: "FontAwesome5", size: 80 },
        color: "#84CC16", // lima
        price: 6.5,
        position: 10,
      },
      {
        nameProduct: "Café Espresso",
        icono: { name: "fast-food-sharp", type: "Ionicons", size: 80 },
        color: "#22D3EE", // cian
        price: 3.0,
        position: 11,
      },
      {
        nameProduct: "Café Espresso",
        icono: {
          name: "food-turkey",
          type: "MaterialCommunityIcons",
          size: 80,
        },
        color: "#D946EF", // fucsia
        price: 3.0,
        position: 12,
      },
      {
        nameProduct: "Café Espresso",
        icono: {
          name: "food-drumstick",
          type: "MaterialCommunityIcons",
          size: 80,
        },
        color: "#F43F5E", // rosa fuerte
        price: 3.0,
        position: 13,
      },
      {
        nameProduct: "Champagne Brut",
        icono: {
          name: "bottle-wine",
          type: "MaterialCommunityIcons",
          size: 80,
        },
        color: "#0EA5E9", // azul cielo
        price: 8.0,
        position: 14,
      },
      {
        nameProduct: "Café Americano",
        icono: { name: "coffee", type: "FontAwesome", size: 80 },
        color: "#202020", // gris oscuro
        price: 2.75,
        position: 15,
      },
      {
        nameProduct: "Té Verde",
        icono: { name: "leaf", type: "Entypo", size: 80 },
        color: "#59881c", // gris claro
        price: 2.0,
        position: 16,
      },
      {
        nameProduct: "Batido de Fresa",
        icono: { name: "local-drink", type: "MaterialIcons", size: 80 },
        color: "#FACC15", // dorado suave
        price: 4.5,
        position: 17,
      },
      {
        nameProduct: "Refresco de Cola",
        icono: {
          name: "food-fork-drink",
          type: "MaterialCommunityIcons",
          size: 80,
        },
        color: "#F59E0B", // amarillo (reutilizado)
        price: 1.5,
        position: 18,
      },
      {
        nameProduct: "Refresco Cola Especial",
        icono: { name: "flower", type: "Entypo", size: 80 },
        color: "#3B82F6", // azul (reutilizado)
        price: 1.5,
        position: 19,
      },

      // ----- COMIDAS -----
      {
        nameProduct: "Hamburguesa Clásica",
        icono: { name: "hamburger", type: "MaterialCommunityIcons", size: 80 },
        color: "#FB923C", // naranja
        price: 7.0,
        position: 20,
      },
      {
        nameProduct: "Croissant de Jamón",
        icono: {
          name: "food-croissant",
          type: "MaterialCommunityIcons",
          size: 80,
        },
        color: "#dba43d", // gris claro
        price: 7.0,
        position: 21,
      },
      {
        nameProduct: "Ensalada César Clásica",
        icono: { name: "food-steak", type: "MaterialCommunityIcons", size: 80 },
        color: "#F43F5E", // rosa fuerte
        price: 6.0,
        position: 22,
      },
      {
        nameProduct: "Ensalada Verde",
        icono: { name: "leaf", type: "FontAwesome5", size: 80 },
        color: "#10B981", // verde
        price: 6.0,
        position: 23,
      },
      {
        nameProduct: "Pizza Margarita",
        icono: { name: "pizza-slice", type: "FontAwesome5", size: 80 },
        color: "#84CC16", // lima
        price: 8.0,
        position: 24,
      },
      {
        nameProduct: "Papas Fritas",
        icono: {
          name: "french-fries",
          type: "MaterialCommunityIcons",
          size: 80,
        },
        color: "#22D3EE", // cian
        price: 4.0,
        position: 25,
      },
      {
        nameProduct: "Papas en Bowl",
        icono: { name: "bowl", type: "Entypo", size: 80 },
        color: "#EE8522", // naranja quemado
        price: 4.0,
        position: 26,
      },
      {
        nameProduct: "Hot Dog Clásico",
        icono: { name: "hotdog", type: "FontAwesome6", size: 80 },
        color: "#0EA5E9", // azul cielo
        price: 5.5,
        position: 27,
      },
      {
        nameProduct: "Sushi Especial",
        icono: { name: "fish", type: "Ionicons", size: 80 },
        color: "#0EA5E9", // azul cielo (reutilizado)
        price: 9.0,
        position: 28,
      },
      {
        nameProduct: "Helado de Vainilla",
        icono: { name: "ice-cream", type: "MaterialCommunityIcons", size: 80 },
        color: "#202020", // gris oscuro
        price: 4.5,
        position: 29,
      },
      {
        nameProduct: "Tarta de Chocolate",
        icono: { name: "birthday-cake", type: "FontAwesome5", size: 80 },
        color: "#C05E5E", // tono chocolate
        price: 5.0,
        position: 30,
      },
    ],
    []
  );

  return products;
};
