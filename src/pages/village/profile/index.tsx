import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TopBar from "Components/topBar";
import Container from "Components/container";
import TextField from "Components/textField";
import Button from "Components/button";
import { useForm } from "react-hook-form";
import { Label } from "./_profileStyle";
import Dropdown from "Components/dropDown";
import { useMutation, useQuery } from "react-query";
import { toast } from "react-toastify";
import {
  getProvinsi,
  getKabupaten,
  getKecamatan,
  getKelurahan,
  getNamaProvinsi,
  getNamaKabupaten,
  getNamaKecamatan,
  getNamaKelurahan
} from "Services/locationServices";
import { paths } from "Consts/path"; // Menambahkan paths agar bisa berpindah halaman
import { updateVillageProfile } from "Services/userServices";
import useAuthLS from "Hooks/useAuthLS";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { db, storage } from "../../../firebase/clientApp"; // Import storage dari Firebase
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import {
  collection,
  doc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";

const schema = z.object({
  nameVillage: z.string().min(1, { message: "*Nama desa wajib diisi" }),
  description: z.string().min(1, { message: "*Deskripsi desa wajib diisi" }),
  benefit: z.string().min(1, { message: "*Keuntungan wajib diisi" }),
  whatsApp: z.string().min(1, { message: "*Nomor whatsapp wajib diisi" }),
  province: z.string().min(1, { message: "*Pilih Provinsi" }),
  district: z.string().min(1, { message: "*Pilih Kabupaten/Kota" }),
  subDistrict: z.string().min(1, { message: "*Pilih Kecamatan" }),
  village: z.string().min(1, { message: "*Pilih Kelurahan" }),
  //logo: z.string().min(1, { message: "*Silahkan masukkan logo" }),
  //header: z.string().min(1, { message: "*Silahkan masukkan background" }),
});

function AddVillage() {
  const navigate = useNavigate();
  const form = useForm({ resolver: zodResolver(schema) });
  const { handleSubmit, reset } = form;

  const { auth } = useAuthLS();
  const { mutateAsync } = useMutation(updateVillageProfile);

  // id
  const [selectedProvinsi, setSelectedProvinsi] = useState("");
  const [selectedKabupaten, setSelectedKabupaten] = useState("");
  const [selectedKecamatan, setSelectedKecamatan] = useState("");

  const { data: provinsi } = useQuery<any>("provinsi", getProvinsi);
  const { data: kabupaten } = useQuery<any>(
    ["kabupaten", selectedProvinsi],
    () => getKabupaten(selectedProvinsi),
    { enabled: !!selectedProvinsi }
  );
  const { data: kecamatan } = useQuery<any>(
    ["kecamatan", selectedKabupaten],
    () => getKecamatan(selectedKabupaten),
    { enabled: !!selectedKabupaten }
  );
  const { data: kelurahan } = useQuery<any>(
    ["kelurahan", selectedKecamatan],
    () => getKelurahan(selectedKecamatan),
    { enabled: !!selectedKecamatan }
  );

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

  const forms = [
    {
      label: "Provinsi",
      type: "text",
      name: "province",
      placeholder: "Pilih provinsi",
      options:
        provinsi?.map((item: any) => ({
          id: item?.id,
          nama: item?.name, // Sesuaikan dengan nama properti pada respon API
        })) || [],
      onChange: (id: any) => setSelectedProvinsi(id),
    },
    {
      label: "Kabupaten/Kota",
      type: "text",
      name: "district",
      placeholder: "Pilih kabupaten/kota",
      options:
        kabupaten?.map((item: any) => ({
          id: item?.id,
          nama: item?.name, // Sesuaikan dengan nama properti pada respon API
        })) || [],
      onChange: (id: any) => setSelectedKabupaten(id),
    },
    {
      label: "Kecamatan",
      type: "text",
      name: "subDistrict",
      placeholder: "Pilih kecamatan",
      options:
        kecamatan?.map((item: any) => ({
          id: item?.id,
          nama: item?.name, // Sesuaikan dengan nama properti pada respon API
        })) || [],
      onChange: (id: any) => setSelectedKecamatan(id),
    },
    {
      label: "Desa/Kelurahan",
      type: "text",
      name: "village",
      placeholder: "Pilih kelurahan",
      options:
        kelurahan?.map((item: any) => ({
          id: item?.id,
          nama: item?.name, // Sesuaikan dengan nama properti pada respon API
        })) || [],
    },
    {
      label: "Nama Desa",
      type: "text",
      name: "nameVillage",
      placeholder: "Nama desa",
    },
    {
      label: "Tentang Desa",
      type: "text",
      name: "description",
      placeholder: "Masukan deskripsi desa",
    },
    {
      label: "Logo Desa",
      type: "file",
      name: "logo",
    },
    {
      label: "Header Desa",
      type: "file",
      name: "header",
    },
    {
      label: "Potensi Desa",
      type: "text",
      name: "benefit",
      placeholder: "Masukkan potensi desa",
    },
    {
      label: "Nomor WhatsApp",
      type: "tel",
      name: "whatsApp",
      placeholder: "62812345678",
    },
  ];

  const onProfileSave = async (data: any) => {
    try {
      console.log("auth?.id:", auth?.id);
      console.log("Data yang diterima:", data);
      if (auth?.id) {
        const docRef = doc(collection(db, "village"), auth.id);

        // Konversi ID lokasi menjadi nama lokasi
        const provinceName = await getNamaProvinsi(data.province); // (Baris 168)
        const districtName = await getNamaKabupaten(data.district); // (Baris 169)
        const subDistrictName = await getNamaKecamatan(data.subDistrict); // (Baris 170)
        const villageName = await getNamaKelurahan(data.village); // (Baris 171)

        console.log("Saving profile data...");

        // Simpan data profil desa ke firestore
        await setDoc(docRef, {
          nameVillage: data.nameVillage,
          description: data.description,
          benefit: data.benefit,
          whatsApp: data.whatsApp,
          province: provinceName, // Gunakan nama lokasi (Baris 178)
          district: districtName, // Gunakan nama lokasi (Baris 179)
          subDistrict: subDistrictName, // Gunakan nama lokasi (Baris 180)
          village: villageName, // Gunakan nama lokasi (Baris 181)
          user_id: auth.id,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });

        console.log("Profile data saved. Uploading logo...");

        // Upload logo jika ada
        if (selectedLogo) {
          try {
            const logoRef = ref(storage, `villages/${auth.id}/logo`);
            await uploadString(logoRef, selectedLogo, "data_url");
            const downloadURL = await getDownloadURL(logoRef);
            await updateDoc(docRef, { logo: downloadURL }); // Simpan URL logo di Firestore (Baris 193)
          } catch (error) {
            console.error("Error uploading logo:", error);
          }
        }

        console.log("Uploading header...");

        // Upload header jika ada
        if (selectedHeader) {
          try {
            const headerRef = ref(storage, `villages/${auth.id}/header`);
            await uploadString(headerRef, selectedHeader, "data_url");
            const downloadURL = await getDownloadURL(headerRef);
            await updateDoc(docRef, { header: downloadURL }); // Simpan URL header di Firestore (Baris 205)
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
    reset();
  }, [reset]);

  return (
    <Container page px={16}>
      <TopBar title="Profil Desa" />
      <form onSubmit={handleSubmit(onProfileSave)}>
        {forms?.map(
          (
            {
              label,
              type,
              name,
              placeholder,
              options,
              onChange,
              defaultValue,
              isDisabled,
            },
            idx
          ) => {
            // dropdown
            if (!!options)
              return (
                <React.Fragment key={idx}>
                  <Label mt={12}>{label} </Label>
                  <Dropdown
                    form={form}
                    name={name}
                    options={options}
                    onChange={onChange}
                    placeholder={placeholder}
                    defaultValue={defaultValue}
                    isDisabled={isDisabled}
                  />
                </React.Fragment>
              );
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
          }
        )}

        <Button size="m" fullWidth mt={12} type="submit">
          Simpan
        </Button>
      </form>
    </Container>
  );

}

export default AddVillage;