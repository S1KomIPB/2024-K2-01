import api from "./api";
import { db } from "../firebase/clientApp";
import { collection, doc, getDocs, getDoc, addDoc, setDoc } from "firebase/firestore";

export const addInnovation = async (body: any): Promise<any> => {
  try {
    // Tambahkan dokumen baru ke koleksi innovations
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