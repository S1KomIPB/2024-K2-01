import React, { useEffect } from "react";
import TopBar from "Components/topBar";
import Container from "Components/container";
import TextField from "Components/textField";
import Button from "Components/button";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Label, FormContainer } from "./_innovatorStyles";
import { toast } from "react-toastify";
import useAuthLS from "Hooks/useAuthLS";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { db } from "../../../firebase/clientApp"; // Import database Firestore
import { doc, getDoc, setDoc } from "firebase/firestore"; // Import Firestore methods
import { paths } from "Consts/path";// Menambahkan paths agar bisa berpindah halaman


const schema = z.object({
  innovatorName: z.string().min(1, { message: "*Nama inovator wajib diisi" }),
  targetUser: z.string().min(1, { message: "*Target pengguna wajib diisi" }),
  product: z.string().min(1, { message: "*Isi nama produk" }),
  description: z.string().min(1, { message: "*Deskripsi wajib diisi" }),
  modelBusiness: z.string().min(1, { message: "*Model bisnis wajib diisi" }),
  logo: z.string().min(1, { message: "*Silahkan masukkan logo" }),
  background: z.string().min(1, { message: "*Silahkan masukkan background" }),
  whatsApp: z.string().min(1, { message: "*Nomor whatsapp wajib diisi" }),
  website: z.string().min(1, { message: "*Website wajib diisi" }),
  instagram: z.string().min(1, { message: "*Instagram wajib diisi" }),
});

const forms = [
  {
    label: "Nama Inovator",
    type: "text",
    name: "innovatorName",
  },
  {
    label: "Target Pengguna",
    type: "text",
    name: "targetUser",
    placeholder: "contoh: nelayan",
  },
  {
    label: "Produk",
    type: "text",
    name: "product",
    placeholder: "Masukkan nama produk",
  },
  {
    label: "Model Bisnis Digital",
    type: "text",
    name: "modelBusiness",
    placeholder: "Masukkan model bisnis secara singkat",
  },
  {
    label: "Deskripsi",
    type: "text",
    name: "description",
    placeholder: "Masukkan deskripsi singkat tentang inovator",
  },
  {
    label: "Logo Inovator",
    type: "url",
    name: "logo",
    placeholder: "https://",
  },
  {
    label: "Header Inovator",
    type: "url",
    name: "background",
    placeholder: "https://",
  },
  {
    label: "Nomor WhatsApp",
    type: "tel",
    name: "whatsApp",
    placeholder: "0812345678",
  },
  {
    label: "Link Instagram",
    type: "url",
    name: "instagram",
    placeholder: "https://instagram.com/username",
  },
  {
    label: "Link Website",
    type: "url",
    name: "website",
    placeholder: "https://",
  },
];

function Profile() {
  const navigate = useNavigate();
  const form = useForm({
    resolver: zodResolver(schema),
  });
  const { handleSubmit, reset } = form;

  const { auth } = useAuthLS();

  const onProfileSave = async (data: any) => {
    try {
      if (auth?.id) {
        const userDocRef = doc(db, "users", auth.id); // Reference to user document in Firestore
        const userDocSnap = await getDoc(userDocRef); // Get user document from Firestore
  
        if (userDocSnap.exists()) {
          const existingData = userDocSnap.data(); // Existing user data from document snapshot
  
          // Merge existing data with new data
          const newData = {
            ...existingData,
            ...data
          };
  
          await setDoc(userDocRef, newData); // Set user document data in Firestore
          toast("Data profil berhasil disimpan", { type: "success" });
        } else {
          toast("User document doesn't exist", { type: "error" });
        }
      } else {
        // Handle case when auth.id is undefined
        toast("Tidak dapat menyimpan data profil. Harap masuk terlebih dahulu", { type: "error" });
        navigate(paths.LOGIN_PAGE); // Redirect to login page
      }
    } catch (error) {
      toast("Terjadi kesalahan jaringan", { type: "error" });
    }
  };
  
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (auth?.id) {
          const userDocSnap = await getDoc(doc(db, "users", auth.id)); // Get user document from Firestore
          if (userDocSnap.exists()) {
            const userData = userDocSnap.data(); // Extract user data from document snapshot
            form.reset(userData); // Set form values to user data
          }
        } else {
          // Handle case when auth.id is undefined
          console.error("Cannot fetch user data. User ID is undefined.");
        }
      } catch (error) {
        console.error("Error getting user document:", error);
      }
    };
    
    fetchData();
  }, [auth?.id]); // Fetch user data when auth ID changes


  return (
    <Container page>
      <TopBar title="Profil Inovator" onBack={() => navigate(-1)} />
      <FormContainer>
        <form onSubmit={handleSubmit(onProfileSave)}>
          {forms?.map(({ label, type, name, placeholder }, idx) => (
            <React.Fragment key={idx}>
              <Label mt={12}>{label} </Label>
              <TextField
                mt={4}
                placeholder={placeholder || label}
                type={type}
                name={name}
                form={form}
              />
            </React.Fragment>
          ))}

          <Button size="m" fullWidth mt={12} type="submit">
            Simpan
          </Button>
        </form>
      </FormContainer>
    </Container>
  );
}

export default Profile;
