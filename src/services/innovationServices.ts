import api from "./api";
import { db } from "../firebase/clientApp";
import { collection, doc, getDocs, getDoc, addDoc, setDoc, query, where } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

export const uploadImage = async (file: File, path: string) => {
  const storage = getStorage();
  const storageRef = ref(storage, path);

  await uploadBytes(storageRef, file);
  const url = await getDownloadURL(storageRef);

  return url;
};

export const addInnovation = async (body: any): Promise<any> => {
  try {
    // Tambahkan dokumen baru ke koleksi "innovations" dan dapatkan ID unik
    const docRef = await addDoc(collection(db, "innovations"), body);

    // Simpan ID unik Firestore dalam field idUnik
    await setDoc(doc(db, "innovations", docRef.id), { idUnik: docRef.id }, { merge: true });

    return docRef.id; // Kembalikan ID unik dari dokumen yang ditambahkan
  } catch (error: any) {
    throw new Error("Error adding innovation: " + error.message);
  }
};


export const getInnovationById = async (id: string) => {
  try {
    const docRef = doc(db, "innovations", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      throw new Error("Innovation not found");
    }
  } catch (error: any) {
    throw new Error("Error fetching innovation data: " + error.message);
  }
};

export const getInnovations = async () => {
  const querySnapshot = await getDocs(collection(db, "innovations"));
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const getInnovationByInnovators = async (userId: string) => {
  try {
    const q = query(collection(db, "innovations"), where("user_id", "==", userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error: unknown) {
    if (error instanceof Error) {
        throw new Error("Error fetching innovations by user: " + error.message);
    } else {
        throw new Error("An unknown error occurred");
    }
  }
};