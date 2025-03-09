import { useMemo } from "react";

export const useColores = () => {
  const colores = useMemo(
    () => [
      "#EF4444", // bg-red-500
      "#3B82F6", // bg-blue-500
      "#10B981", // bg-green-500
      "#F59E0B", // bg-yellow-500
      "#8B5CF6", // bg-purple-500
      "#EC4899", // bg-pink-500
      "#6366F1", // bg-indigo-500
      "#14B8A6", // bg-teal-500
      "#FB923C", // bg-orange-500
      "#84CC16", // bg-lime-500
      "#10B981", // bg-emerald-500
      "#22D3EE", // bg-cyan-500
      "#D946EF", // bg-fuchsia-500
      "#8B5CF6", // bg-violet-500
      "#F43F5E", // bg-rose-500
      "#0EA5E9", // bg-sky-500
      "#202020",
      "#e0e0e0",
    ],
    []
  );
  return colores;
};
