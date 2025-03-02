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
    console.log("Se obtienen los datos del usuario y se guardan en el estado");
    return data.data();
  } catch (error) {
    console.log(error);
  }
};
export const updateUser = async (userId, data) => {
  try {
    const docRef = doc(collecRefUser, userId);
    await updateDoc(docRef, data);
    console.log("Datos del usuario actualizados");
  } catch (error) {
    console.log(error);
  }
};
