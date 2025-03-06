import { arrayUnion } from "firebase/firestore";
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
  deleteDoc,
} from "../firebaseConfig";
import { updateUser } from "./auth.api";
import { useRouter } from "expo-router";
const collecRefEmpresa = collection(db, "Empresas");
const collecRefSolicitudes = collection(db, "Solicitudes");
const collecRefUsuarios = collection(db, "Usuarios");
const collecRefTikadas = collection(db, "Tikadas");
export const addEmpresa = async (empresa, dataUser) => {
  const existe = await existeEmpresa(empresa.nameEmpresaOriginal);
  if (!existe) {
    const docRef = await addDoc(collecRefEmpresa, empresa);
    const empleadosRef = collection(docRef, "Empleados");
    await addDoc(empleadosRef, { ...dataUser, encargadoEmpresa: true });
    return docRef.id;
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

export const crearSolicitudEmpresa = async (
  userId,
  identificador,
  dataUser,
  enviarA = null
) => {
  console.log(identificador);
  try {
    const q = query(
      collecRefEmpresa,
      where("identificador", "==", identificador)
    );
    const docSnap = await getDocs(q);

    if (docSnap.empty) {
      return alert(
        "No existe ese identificador asegurate de escribirlo bien minusculas y mayuculas"
      );
    }
    const companyDoc = docSnap.docs[0];
    const companyData = { id: companyDoc.id, ...companyDoc.data() };
    const docData = { id: docSnap.docs[0].id, ...docSnap.docs[0].data() };

    const q2 = query(
      collecRefSolicitudes,
      where("userId", "==", userId),
      where("identificador", "==", identificador)
    );
    const empleadosSubRef = collection(
      db,
      "Empresas",
      companyData.id,
      "Empleados"
    );
    const qUserExist = query(
      empleadosSubRef,
      where("emailAddress", "==", enviarA)
    );
    const docsExist = await getDocs(qUserExist);
    if (!docsExist.empty) {
      return alert("Ya forma parte de la empresa");
    }
    const docs2 = await getDocs(q2);
    if (!docs2.empty) {
      return alert("Ya enviaste la solicutud");
    }

    await addDoc(collecRefSolicitudes, {
      userId,
      identificador,
      dataUser,
      dataEmpresa: docData,
      enviarA,
      estado: false,
    });
    return true;
  } catch (error) {
    console.log(error);
  }
};

export const obtenerEmpresasSolicitud = async (userId) => {
  try {
    const q = query(collecRefSolicitudes, where("userId", "==", userId));
    const solicitudDocs = await getDocs(q);
    const identificadores = [
      ...new Set(solicitudDocs.docs.map((doc) => doc.data().identificador)),
    ];
    if (identificadores.length === 0) {
      console.log("No hay empresas asociadas a estas solicitudes.");
      return [];
    }
    const qEmpresas = query(
      collecRefEmpresa,
      where("identificador", "in", identificadores)
    );
    const empresaDocs = await getDocs(qEmpresas);

    const empresas = empresaDocs.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // console.log("Empresas asociadas:", empresas);
    return empresas;
  } catch (error) {
    console.log(error);
  }
};

export const verEmpresas = async (empresasId) => {
  try {
    let empresas = [];

    for (let i = 0; i < empresasId.length; i++) {
      const docRef = doc(collecRefEmpresa, empresasId[i]);
      const docSnaps = await getDoc(docRef);
      if (docSnaps.exists()) {
        empresas.push({ id: docSnaps.id, ...docSnaps.data() });
      } else {
        console.log("No se encontro esa empresa con ese id");
      }
    }
    return { success: true, message: empresas };
  } catch (error) {
    console.log(error);
    return { success: false, message: error };
  }
};
export const updateEmpresaAddToUser = async (idEmpleado, idEmpresa) => {
  try {
    const docRef = doc(collecRefUsuarios, idEmpleado);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      console.log("No se encontró el usuario");
      return;
    }

    await updateDoc(docRef, {
      empresasPostuladas: arrayUnion(idEmpresa),
      newUser: false,
    });

    console.log("Empresa añadida al usuario");
  } catch (error) {
    console.error("Error al actualizar el usuario:", error);
  }
};
export const updateUserAddToEmpresa = async (
  idEmpresa,
  solicitud,
  userId,
  dataUser
) => {
  console.log(solicitud);
  try {
    const docRef = doc(collecRefEmpresa, idEmpresa);
    const docSnap = await getDoc(docRef);
    const docRefSolicitd = doc(collecRefSolicitudes, solicitud.id);
    if (!docSnap.exists()) {
      console.log("La empresa no se encontro");
      return;
    }
    await updateDoc(docRef, {
      empleadosEmpresa: arrayUnion(userId),
    });
    const empleadosSubRef = collection(docRef, "Empleados");
    await addDoc(empleadosSubRef, dataUser);
    await deleteDoc(docRefSolicitd);
    console.log("Usuario añadido a la empresa");
  } catch (error) {
    console.log(error);
  }
};
export const deleteEmpleadoEmpresa = async (idEmpleado, idEmpresa, idDoc) => {
  console.log(idDoc);
  try {
    const empleadoRef = doc(db, "Empresas", idEmpresa, "Empleados", idDoc);

    const docUserRef = doc(collecRefUsuarios, idEmpleado);
    const docUserSnap = await getDoc(docUserRef);

    if (!docUserSnap.exists()) {
      return alert("No existe el empleado");
    }
    const dataUser = { id: docUserSnap.id, ...docUserSnap.data() };
    const newUserEmpresas = dataUser.empresasPostuladas.filter(
      (empresa) => empresa !== idEmpresa
    );
    await updateDoc(docUserRef, { empresasPostuladas: newUserEmpresas });

    const docEmpresaRef = doc(collecRefEmpresa, idEmpresa);
    const docEmpresaSnap = await getDoc(docEmpresaRef);
    if (!docEmpresaSnap.exists()) {
      return alert("No existe la empresa");
    }
    const dataEmpresa = { id: docEmpresaSnap.id, ...docEmpresaSnap.data() };
    const newDataEmpresa = dataEmpresa.empleadosEmpresa.filter(
      (empleado) => empleado !== idEmpleado
    );
    await updateDoc(docEmpresaRef, { empleadosEmpresa: newDataEmpresa });
    await deleteDoc(empleadoRef);
    console.log("Usuario Eliminado");
  } catch (error) {
    console.log(error);
  }
};
export const addTikadaSinPosicion = async (dataUser, empresaPcik) => {
  try {
    const docUserRef = doc(collecRefUsuarios, dataUser.id);
    const docDataUser = await getDoc(docUserRef);
    if (!docDataUser.exists()) {
      return alert("No existe el usuario");
    }
    const empleadosRef = collection(
      db,
      "Empresas",
      empresaPcik.id,
      "Empleados"
    );
    const q = query(
      empleadosRef,
      where("emailAddress", "==", dataUser.emailAddress)
    );
    const docsSnap = await getDocs(q);
    if (docsSnap.empty) {
      return alert("No existe el empleado");
    }
    const docIdRef = docsSnap.docs[0].id;

    if (!docDataUser.exists()) {
      return alert("No existe el usuario");
    }
    await updateDoc(docUserRef, {
      trabajando: !dataUser.trabajando,
      entradaTrabajar: new Date(),
      idEmpresaTrabajando: empresaPcik.id,
      trabajandoPara: empresaPcik.nameEmpresa,
    });
    await updateDoc(
      doc(db, "Empresas", empresaPcik.id, "Empleados", docIdRef),
      {
        trabajando: !dataUser.trabajando,
        entradaTrabajar: new Date(),
        idEmpresaTrabajando: empresaPcik.id,
        trabajandoPara: empresaPcik.nameEmpresa,
      }
    );

    const empresaRef = doc(collecRefEmpresa, empresaPcik.id);
    const docEmpresa = await getDoc(empresaRef);
    const dataEmpresa = docEmpresa.data();
    const tikadaQuery = query(
      collecRefTikadas,
      where("idEmpleado", "==", dataUser.id),
      where("estado", "==", true)
    );
    const tikadaSnap = await getDocs(tikadaQuery);
    if (!tikadaSnap.empty) {
      const tikadaRef = doc(db, "Tikadas", tikadaSnap.docs[0].id);
      return await updateDoc(tikadaRef, {
        estado: false,
        salida: new Date(),
      });
    }
    if (!dataEmpresa.posicionHabilitada && tikadaSnap.empty) {
      await addDoc(collecRefTikadas, {
        idEmpleado: dataUser.id,
        empresa: empresaPcik.id,
        entrada: new Date(),
        salida: "Aun no se ha registrado salida",
        estado: true,
      });
    }
    if (dataEmpresa.posicionHabilitada && tikadaSnap.empty) {
      await addDoc(collecRefTikadas, {
        idEmpleado: dataUser.id,
        empresa: empresaPcik.id,
        entrada: new Date(),
        salida: "Aun no se ha registrado salida",
        estado: true,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

export const addEncargadoEmpresa = async (idDoc, idEmpresa) => {
  try {
    const empleadoRef = doc(db, "Empresas", idEmpresa, "Empleados", idDoc);
    await updateDoc(empleadoRef, { encargadoEmpresa: true });
    console.log("Encargado añadido");
  } catch (error) {
    console.log(error);
  }
};

export const getEmpleadoEmpresa = async (idEmpresa, idEmpleado) => {
  try {
    const empleadosRef = collection(db, "Empresas", idEmpresa, "Empleados");
    const q = query(empleadosRef, where("id", "==", idEmpleado));
    const empleadoSnap = await getDocs(q);
    if (empleadoSnap.empty) {
      return alert("No existe ese empleado");
    }

    const dataEmpleado = {
      idDocument: empleadoSnap.docs[0].id,
      ...empleadoSnap.docs[0].data(),
    };
    return dataEmpleado;
  } catch (error) {
    console.log(error);
  }
};
export const listarEmpleados = async (idEmpresa) => {
  try {
    const empleadosRef = collection(db, "Empresas", idEmpresa, "Empleados");
    const empleadosSnap = await getDocs(empleadosRef);

    if (empleadosSnap.empty) {
      console.log("No hay empleados en esta empresa");
      return;
    }

    empleadosSnap.forEach((doc) => {
      console.log("Empleado encontrado:", doc.id, doc.data());
    });
  } catch (error) {
    console.log(error);
  }
};

export const obtenerTikadas = async (idUser) => {
  console.log(idUser);
  if (!idUser) {
    return { estado: false, data: "ID de usuario no válido" };
  }

  try {
    const q = query(collecRefTikadas, where("idEmpleado", "==", idUser));
    const docSnaps = await getDocs(q);

    if (docSnaps.empty) {
      return { estado: false, data: "No hay tikadas de este empleado" };
    }

    const dataTikadas = docSnaps.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return { estado: true, data: dataTikadas };
  } catch (error) {
    console.error("Error obteniendo tikadas:", error);
    return { estado: false, data: error.message };
  }
};
