import api from "./api";
import { db } from "../firebase/clientApp";
import { doc, collection, query, setDoc, getDocs, getDoc, where } from "firebase/firestore";

export const getUsers = async () => await api.get("/users");

export const getUserById = async (id: string) => {
  try {
    // Memeriksa apakah pengguna ada di koleksi 'users'
    const userDocSnap = await getDoc(doc(db, "users", id));
    if (!userDocSnap.exists()) {
      throw new Error("User not found");
    }

    const userData = userDocSnap.data();
    
    // Memeriksa role pengguna
    const { role } = userData;

    let result;
    if (role === "innovator") {
      // Jika role adalah inovator, mencari di koleksi 'innovators'
      const innovatorDocSnap = await getDoc(doc(db, "innovators", id));
      if (innovatorDocSnap.exists()) {
        result = innovatorDocSnap.data();
      } else {
        throw new Error("Innovator not found");
      }
    } else if (role === "village") {
      // Jika role adalah perangkat desa, mencari di koleksi 'villages'
      const villageDocSnap = await getDoc(doc(db, "village", id));
      if (villageDocSnap.exists()) {
        result = villageDocSnap.data();
      } else {
        throw new Error("Village not found");
      }
    } else {
      throw new Error("Invalid user role");
    }

    return { ...userData, ...result };
  } catch (error: any) {
    throw new Error("Error fetching user data: " + error.message);
  }
};

export const updateVillageProfile = async ({ id, data }) => {
  try {
    if (!id) {
      throw new Error("ID user tidak valid");
    }
    const villageRef = doc(db, "village", id);
    await setDoc(villageRef, data, { merge: true });
    return { success: true };
  } catch (error) {
    console.error("Error updating profile:", error);
    return { success: false, error };
  }
};

export const getUsersFS = async () => {
  const q = query(collection(db, "users"));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const getInnovators = async () => {
  const q = query(collection(db, "innovators"));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const getVillages = async () => {
  const q = query(collection(db, "village"));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};
