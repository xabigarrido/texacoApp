import { useMemo } from "react";

export const useCategorias = () => {
  const categoriasScheme = useMemo(
    () => [
      {
        nameCategory: "Desayunos",
        icono: { name: "coffee", type: "MaterialCommunityIcons", size: 80 },
        color: "#F59E0B",
        position: 0,
      },
      {
        nameCategory: "Almuerzos",
        icono: { name: "restaurant", type: "Ionicons", size: 80 },
        color: "#10B981",
        position: 1,
      },
      {
        nameCategory: "Cenas",
        icono: { name: "food", type: "MaterialCommunityIcons", size: 80 },
        color: "#EF4444",
        position: 2,
      },
      {
        nameCategory: "Bebidas",
        icono: { name: "drink", type: "Entypo", size: 80 },
        color: "#3B82F6",
        position: 3,
      },
      {
        nameCategory: "Postres",
        icono: { name: "cupcake", type: "MaterialCommunityIcons", size: 80 },
        color: "#EC4899",
        position: 4,
      },
      {
        nameCategory: "Entradas",
        icono: { name: "fast-food", type: "Ionicons", size: 80 },
        color: "#8B5CF6",
        position: 5,
      },
      {
        nameCategory: "Comida rápida",
        icono: { name: "hamburger", type: "FontAwesome5", size: 80 },
        color: "#FB923C",
        position: 6,
      },
      {
        nameCategory: "Mariscos",
        icono: { name: "fish", type: "MaterialCommunityIcons", size: 80 },
        color: "#14B8A6",
        position: 7,
      },
      {
        nameCategory: "Vegetariana",
        icono: { name: "seedling", type: "FontAwesome5", size: 80 },
        color: "#84CC16",
        position: 8,
      },
      {
        nameCategory: "Parrilla",
        icono: { name: "fire", type: "FontAwesome6", size: 80 },
        color: "#b6414b",
        position: 9,
      },
      {
        nameCategory: "Pizzería",
        icono: { name: "pizza-slice", type: "FontAwesome5", size: 80 },
        color: "#F43F5E",
        position: 10,
      },
      {
        nameCategory: "Tacos",
        icono: { name: "taco", type: "MaterialCommunityIcons", size: 80 },
        color: "#FB923C",
        position: 11,
      },
      {
        nameCategory: "Sushi",
        icono: { name: "fish", type: "MaterialCommunityIcons", size: 80 },
        color: "#6366F1",
        position: 12,
      },
      {
        nameCategory: "Bares",
        icono: { name: "beer", type: "FontAwesome5", size: 80 },
        color: "#FFB020",
        position: 13,
      },
      {
        nameCategory: "Coctelería",
        icono: { name: "cocktail", type: "Fontisto", size: 80 },
        color: "#A855F7",
        position: 14,
      },
      {
        nameCategory: "Cerveza",
        icono: { name: "beer-sharp", type: "Ionicons", size: 80 },
        color: "#FF9F1C",
        position: 15,
      },
      {
        nameCategory: "Heladería",
        icono: { name: "ice-cream", type: "FontAwesome5", size: 80 },
        color: "#FBBF24",
        position: 16,
      },

      {
        nameCategory: "Cafetería",
        icono: {
          name: "coffee-outline",
          type: "MaterialCommunityIcons",
          size: 80,
        },
        color: "#6B7280",
        position: 18,
      },
      {
        nameCategory: "Tetería",
        icono: {
          name: "tea-outline",
          type: "MaterialCommunityIcons",
          size: 80,
        },
        color: "#0EA5E9",
        position: 19,
      },

      {
        nameCategory: "Hookah",
        icono: { name: "smoke-free", type: "MaterialIcons", size: 80 },
        color: "#22D3EE",
        position: 23,
      },
      {
        nameCategory: "Buffet",
        icono: {
          name: "food-fork-drink",
          type: "MaterialCommunityIcons",
          size: 80,
        },
        color: "#9333EA",
        position: 24,
      },
      {
        nameCategory: "Brunch",
        icono: { name: "brunch-dining", type: "MaterialIcons", size: 80 },
        color: "#84CC16",
        position: 25,
      },

      {
        nameCategory: "Taberna",
        icono: { name: "wine-glass", type: "FontAwesome5", size: 80 },
        color: "#FACC15",
        position: 28,
      },
      {
        nameCategory: "Vinos",
        icono: { name: "glass-wine", type: "MaterialCommunityIcons", size: 80 },
        color: "#991B1B",
        position: 29,
      },
      {
        nameCategory: "Gastrobar",
        icono: { name: "chef-hat", type: "MaterialCommunityIcons", size: 80 },
        color: "#10B981",
        position: 30,
      },
      {
        nameCategory: "Panadería",
        icono: {
          name: "bread-slice",
          type: "MaterialCommunityIcons",
          size: 80,
        },
        color: "#FFB020",
        position: 31,
      },
      {
        nameCategory: "Pastelería",
        icono: { name: "cupcake", type: "MaterialCommunityIcons", size: 80 },
        color: "#EC4899",
        position: 32,
      },
      {
        nameCategory: "Asador",
        icono: { name: "fire", type: "MaterialCommunityIcons", size: 80 },
        color: "#F87171",
        position: 33,
      },
      {
        nameCategory: "Oriental",
        icono: { name: "bowl-rice", type: "FontAwesome6", size: 80 },
        color: "#14B8A6",
        position: 34,
      },
    ],
    []
  );
  return categoriasScheme;
};
