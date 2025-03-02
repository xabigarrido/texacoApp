import {
  setDoc,
  doc,
  db,
  getDoc,
  collection,
  updateDoc,
  addDoc,
  query,
  where,
  getDocs,
} from "../firebaseConfig";
const collecRefEmpresa = collection(db, "Empresas");
export const addEmpresa = async (empresa) => {
  const existe = await existeEmpresa(empresa.nameEmpresaOriginal);
  if (!existe) {
    await addDoc(collecRefEmpresa, empresa);
    console.log("Empresa añadida");
  } else {
    alert("El nombre de la empresa ya esta en uso por favor eliga otro");
  }
  try {
  } catch (error) {
    console.log(error);
  }
};

export const existeEmpresa = async (name) => {
  try {
    const q = query(collecRefEmpresa, where("nameEmpresaOriginal", "==", name));
    const docs = await getDocs(q);
    if (docs.empty) {
      return false;
    } else {
      return true;
    }
  } catch (error) {
    console.log(error);
  }
};
