import React, { useEffect, useRef, useState } from "react";
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
import { db, storage } from "../../../firebase/clientApp"; // Import database Firestore
import {
  setDoc,
  getDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { paths } from "Consts/path"; // Menambahkan paths agar bisa berpindah halaman
import { useController, UseControllerProps } from 'react-hook-form';
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { ControllerRenderProps } from 'react-hook-form';

interface DropdownProps {
  options: string[];
  field: ControllerRenderProps<any, string>;
  placeholder: string;
}

const schema = z.object({
  innovatorName: z.string().min(1, { message: "*Nama inovator wajib diisi" }),
  category: z.string().min(1, { message: "*Pilih Kategori yang sesuai" }),
  description: z.string().min(1, { message: "*Deskripsi wajib diisi" }),
  modelBusiness: z.string().min(1, { message: "*Model bisnis wajib diisi" }),
  whatsApp: z.string().min(1, { message: "*Nomor whatsapp wajib diisi" }),
  website: z.string().min(1, { message: "*Website wajib diisi" }),
  instagram: z.string().min(1, { message: "*Instagram wajib diisi" }),
});

const Dropdown: React.FC<DropdownProps> = ({ options, field, placeholder }) => {
  return (
    <select {...field}>
      <option value="" disabled>
        {placeholder}
      </option>
      {options.map((option, index) => (
        <option key={index} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
};

const forms = [
  {
    label: "Nama Inovator",
    type: "text",
    name: "innovatorName",
  },
  {
    label: "Kategori Inovator",
    type: "dropdown",
    name: "category",
    placeholder: "Pilih kategori",
    options: [
      "Pemerintah Pusat",
      "Pemerintah Daerah",
      "Swasta",
      "Lainnya"
    ],
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
    type: "file",
    name: "logo",
  },
  {
    label: "Header Inovator",
    type: "file",
    name: "background",
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

  const [selectedLogo, setSelectedLogo] = useState<string>("");
  const [selectedHeader, setSelectedHeader] = useState<string>("");
  const selectLogoRef = useRef<HTMLInputElement>(null);
  const selectHeaderRef = useRef<HTMLInputElement>(null);

  const onSelectLogo = (event: React.ChangeEvent<HTMLInputElement>) => {
    const reader = new FileReader();
    if (event.target.files?.[0]) {
      reader.readAsDataURL(event.target.files[0]);
    }
    reader.onload = (readerEvent) => {
      if (readerEvent.target?.result) {
        setSelectedLogo(readerEvent.target.result as string);
      }
    };
  };

  const onSelectHeader = (event: React.ChangeEvent<HTMLInputElement>) => {
    const reader = new FileReader();
    if (event.target.files?.[0]) {
      reader.readAsDataURL(event.target.files[0]);
    }
    reader.onload = (readerEvent) => {
      if (readerEvent.target?.result) {
        setSelectedHeader(readerEvent.target.result as string);
      }
    };
  };

  const onProfileSave = async (data: any) => {
    try {
      if (auth?.id) {
        const docRef = doc(collection(db, "innovators"), auth.id);

        console.log("Saving profile data...");

        await setDoc(docRef, {
          innovatorName: data.innovatorName,
          category: data.category,
          description: data.description,
          modelBusiness: data.modelBusiness,
          whatsApp: data.whatsApp,
          website: data.website,
          instagram: data.instagram,
          user_id: auth.id,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });

        console.log("Profile data saved. Uploading logo...");

        if (selectedLogo) {
          try {
            const logoRef = ref(storage, `innovators/${auth.id}/logo`);
            await uploadString(logoRef, selectedLogo, "data_url");
            const downloadURL = await getDownloadURL(logoRef);
            await updateDoc(docRef, { logo: downloadURL });
            console.log("Logo uploaded and URL saved:", downloadURL);
          } catch (error) {
            console.error("Error uploading logo:", error);
          }
        }

        console.log("Uploading header...");

        if (selectedHeader) {
          try {
            const headerRef = ref(storage, `innovators/${auth.id}/header`);
            await uploadString(headerRef, selectedHeader, "data_url");
            const downloadURL = await getDownloadURL(headerRef);
            await updateDoc(docRef, { background: downloadURL });
            console.log("Header uploaded and URL saved:", downloadURL);
          } catch (error) {
            console.error("Error uploading header:", error);
          }
        }

        toast("Data profil berhasil disimpan", { type: "success" });
      } else {
        toast("Tidak dapat menyimpan data profil. Harap masuk terlebih dahulu", { type: "error" });
        navigate(paths.LOGIN_PAGE);
      }
    } catch (error) {
      toast("Terjadi kesalahan jaringan", { type: "error" });
      console.error("Error saving profile data:", error);
    }
  };


  useEffect(() => {
    const fetchData = async () => {
      try {
        if (auth?.id) {
          const userDocSnap = await getDoc(doc(db, "innovators", auth.id));
          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            form.reset(userData);
          }
        } else {
          console.error("Cannot fetch user data. User ID is undefined.");
        }
      } catch (error) {
        console.error("Error getting user document:", error);
      }
    };

    fetchData();
  }, [auth?.id]);

  return (
    <Container page>
      <TopBar title="Profil Inovator" onBack={() => navigate(-1)} />
      <FormContainer>
        <form onSubmit={handleSubmit(onProfileSave)}>
          {forms?.map(({ label, type, name, placeholder, options }, idx) => {
            if (type === "dropdown") {
              const { field } = useController({ name, control: form.control });
              return (
                <React.Fragment key={idx}>
                  <Label mt={12}>{label} </Label>
                  <Dropdown
                    options={options || []}
                    field={field}
                    placeholder={placeholder || ''}
                  />
                </React.Fragment>
              );
            }

            if (type === "file") {
              return (
                <React.Fragment key={idx}>
                  <Label mt={12}>{label} </Label>
                  <input
                    type="file"
                    name={name}
                    ref={name === "logo" ? selectLogoRef : selectHeaderRef}
                    onChange={name === "logo" ? onSelectLogo : onSelectHeader}
                  />
                </React.Fragment>
              );
            }

            return (
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
            );
          })}
          <Button mt={12} type="submit">
            Simpan
          </Button>
        </form>
      </FormContainer>
    </Container>
  );
}

export default Profile;