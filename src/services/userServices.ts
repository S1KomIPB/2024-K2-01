import api from "./api";
import { db } from "../firebase/clientApp";
import { doc, collection, query, setDoc, getDocs, getDoc, where } from "firebase/firestore";

export const getUsers = async () => await api.get("/users");

export const getUserById = async (id: string) => {
  try {
    const userDocSnap = await getDoc(doc(db, "users", id));
    if (userDocSnap.exists()) {
      return userDocSnap.data();
    } else {
      throw new Error("User not found");
    }
  } catch (error: any) {
    throw new Error("Error fetching user data: " + error.message);
  }
};

export const updateProfile = async ({ id, data }: { id?: string; data: any }) => {
  try {
    // Memeriksa apakah ID pengguna tersedia sebelum memperbarui profil
    if (!id) {
      throw new Error("ID user tidak valid");
    }
    // Memperbarui dokumen pengguna dengan ID yang diberikan dengan data yang diberikan
    const userRef = doc(db, "users", id);
    await setDoc(userRef, data, { merge: true });
    return { success: true }; // Mengembalikan keberhasilan jika operasi berhasil
  } catch (error) {
    console.log(id);
    console.error("Error updating profile:", error);
    return { success: false, error }; // Mengembalikan kesalahan jika operasi gagal
  }
};

export const getUsersFS = async () => {
  const q = query(collection(db, "users"));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const getInnovators = async () => {
  const q = query(collection(db, "users"), where("role", "==", "innovator"), where("innovatorName", "!=", ""));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const getVillages = async () => {
  const q = query(collection(db, "users"), where("role", "==", "village"), where("nameVillage", "!=", ""));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};
