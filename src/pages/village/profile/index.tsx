import React, { useState, useEffect } from "react";
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
} from "Services/locationServices";
import { updateProfile, getUsersFS } from "Services/userServices"
import useAuthLS from "Hooks/useAuthLS";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../../firebase/clientApp"

const schema = z.object({
  nameVillage: z.string().min(1, { message: "*Nama desa wajib diisi" }),
  description: z.string().min(1, { message: "*Deskripsi desa wajib diisi" }),
  benefit: z.string().min(1, { message: "*Keuntungan wajib diisi" }),
  whatsApp: z.string().min(1, { message: "*Nomor whatsapp wajib diisi" }),
  province: z.string().min(1, { message: "*Pilih Provinsi" }),
  district: z.string().min(1, { message: "*Pilih Kabupaten/Kota" }),
  subDistrict: z.string().min(1, { message: "*Pilih Kecamatan" }),
  village: z.string().min(1, { message: "*Pilih Kelurahan" }),
  logo: z.string().min(1, { message: "*Silahkan masukkan logo" }),
  header: z.string().min(1, { message: "*Silahkan masukkan background" }),
});

function AddVillage() {
  const form = useForm({ resolver: zodResolver(schema) });
  const { handleSubmit, reset } = form;

  const { auth } = useAuthLS();
  const { mutateAsync } = useMutation(updateProfile);
  const { data, isFetched } = useQuery<any>(
    "profileVillage",
    getUsersFS,
  );
  
  // id
  const [selectedProvinsi, setSelectedProvinsi] = useState("");
  const [selectedKabupaten, setSelectedKabupaten] = useState("");
  const [selectedKecamatan, setSelectedKecamatan] = useState("");

  const { data: provinsi } = useQuery<any>("provinsi", getProvinsi);
  const { data: kabupaten } = useQuery<any>(
    ["kabupaten", selectedProvinsi],
    () => getKabupaten(selectedProvinsi || data?.province),
    { enabled: !!selectedProvinsi || isFetched }
  );
  const { data: kecamatan } = useQuery<any>(
    ["kecamatan", selectedKabupaten],
    () => getKecamatan(selectedKabupaten || data?.district),
    { enabled: !!selectedKabupaten || isFetched }
  );
  const { data: kelurahan } = useQuery<any>(
    ["kelurahan", selectedKecamatan],
    () => getKelurahan(selectedKecamatan || data?.subDistrict),
    { enabled: !!selectedKecamatan || isFetched }
  );

  const forms = [
    {
      label: "Provinsi",
      type: "text",
      name: "province",
      placeholder: "Pilih provinsi",
      defaultValue: data?.province,
      isDisabled: !!data?.province,
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
      defaultValue: data?.district,
      isDisabled: !!data?.district,
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
      defaultValue: data?.subDistrict,
      isDisabled: !!data?.subDistrict,
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
      value: data?.village,
      defaultValue: data?.village,
      isDisabled: data?.village,
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
      type: "url",
      name: "logo",
      placeholder: "https://",
    },
    {
      label: "Header Desa",
      type: "url",
      name: "header",
      placeholder: "https://",
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

  const onProfileSave = async (formData: any) => {
    try {
      // Memeriksa apakah pengguna telah terotentikasi
      if (!auth) {
        throw new Error("Pengguna belum terotentikasi");
      }

      const payload = {
        id: auth.id, // Menggunakan ID pengguna dari auth
        data: formData,
      };
      await mutateAsync(payload);
      toast("Data berhasil disimpan", { type: "success" });
    } catch (error) {
      toast("Terjadi kesalahan jaringan", { type: "error" });
    }
  };

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        if (auth?.id) {
          const userDocSnap = await getDoc(doc(db, "users", auth.id));
          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
  
            // Check if user has filled out the profile before
            if (userData.province && userData.district && userData.subDistrict) {
              const { province, district, subDistrict } = userData;
  
              // Assign values from user profile to corresponding variables
              const idProvinsi = province;
              const idKota = district;
              const idKecamatan = subDistrict;

              // Set selected values for province, district, and subDistrict
              setSelectedProvinsi(idProvinsi);
              setSelectedKabupaten(idKota);
              setSelectedKecamatan(idKecamatan);
  
              // Fetch data for kabupaten, kecamatan, and kelurahan based on user's profile
              getKabupaten(idProvinsi);
              getKecamatan(idKota);
              getKelurahan(idKecamatan);
            }
  
            // Reset form with user data
            reset(userData);
          }
        } else {
          console.error("Auth ID is undefined. Cannot fetch profile data.");
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };
  
    fetchProfileData();
  }, [auth?.id, reset]);  
  
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
