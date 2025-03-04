import {
  setDoc,
  doc,
  db,
  getDoc,
  collection,
  updateDoc,
} from "../firebaseConfig";
const collecRefUser = collection(db, "Usuarios");
export const createdUserFirebase = async (userId, user) => {
  try {
    const userRef = doc(collecRefUser, userId);
    await setDoc(userRef, user);
    console.log("Usuario agregado a la base de datos firebase");
  } catch (error) {
    console.log(error);
  }
};
export const existeUser = async (id) => {
  try {
    if (id) {
      const docRef = doc(collecRefUser, id);
      const docExist = await getDoc(docRef);
      if (docExist.exists()) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
  }
};
export const obtenerDatosUser = async (userId) => {
  try {
    const docRef = doc(collecRefUser, userId);
    const data = await getDoc(docRef);
    const dataUser = { id: data.id, ...data.data() };
    console.log("Se obtienen los datos del usuario y se guardan en el estado");
    return dataUser;
  } catch (error) {
    console.log(error);
  }
};
export const updateUser = async (userId, data) => {
  if (!userId) {
    console.error("El userId es requerido");
    return;
  }

  if (!data || Object.keys(data).length === 0) {
    console.error("No se proporcionaron datos para actualizar");
    return;
  }

  try {
    const docRef = doc(collecRefUser, userId);
    await updateDoc(docRef, data);
    console.log("Datos del usuario actualizados");
  } catch (error) {
    console.error("Error al actualizar los datos del usuario:", error);
  }
};
