import React from "react";
import TopBar from "Components/topBar";
import Container from "Components/container";
import TextField from "Components/textField";
import Dropdown from "Components/dropDown";
import Button from "Components/button";
import { useForm } from "react-hook-form";
import { generatePath, useNavigate } from "react-router-dom";
import { Label } from "./_addStyle";
import { useMutation } from "react-query";
import { addInnovation, uploadImage } from "Services/innovationServices";
import { toast } from "react-toastify";
import { paths } from "Consts/path";
import useAuthLS from "Hooks/useAuthLS";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { addDoc, collection, doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../../firebase/clientApp";

const schema = z.object({
  name: z.string().min(1, { message: "*Nama inovator wajib diisi" }),
  description: z.string().min(1, { message: "*Deskripsi inovasi wajib diisi" }),
  benefit: z.string().min(1, { message: "*Keuntungan wajib diisi" }),
  requirement: z.string().min(1, { message: "*Contoh: memerlukan listrik" }),
  background: z.any().refine(file => file.length > 0, { message: "*Silahkan masukkan background" }),
  //logo: z.any().refine(file => file.length > 0, { message: "*Silahkan masukkan logo" }),
  category: z.string().min(1, { message: "*Pilih kategori" }),
  date: z.string().min(1, { message: "*Pilih tanggal" }),
});

const forms = [
  {
    label: "Nama Inovasi",
    type: "text",
    name: "name",
  },
  {
    label: "Citra Inovasi",
    type: "file",
    name: "background",
  },
  {
    label: "Kategori Inovasi",
    type: "text",
    name: "category",
    placeholder: "Pilih kategori",
    options: [
      "E-Government",
      "E-Tourism",
      "Infrastruktur Lokal",
      "Layanan Keuangan",
      "Layanan Sosial",
      "Pemasaran Agri-Food dan E-Commerce",
      "Pengembangan Masyarakat dan Ekonomi",
      "Pengelolaan Sumber Daya",
      "Pertanian Cerdas",
      "Sistem Informasi",
    ],
  },
  {
    label: "Tanggal dibuat inovasi",
    type: "date",
    name: "date",
  },
  {
    label: "Target Pengguna",
    type: "text",
    name: "targetUser",
    placeholder: "Pilih kategori",
    options: [
      "Petani",
      "Produsen",
      "Wanita pedesaan",
      "Pemuda",
      "Lansia/pensiunan desa",
      "Pedagang",
      "Agen keuangan/perbankan",
      "Penyedia layanan",
      "Pemasok",
      "Pekerja/buruh",
      "Agro-preneur",
      "Perangkat desa",
      "Tokoh masyarakat setempat",
      "Agen pemerintah",
      "nelayan",
      "peternak",
      "Lainnya:"
    ],
  },
  {
    label: "Deskripsi",
    type: "text",
    name: "description",
    placeholder: "Deskripsi singkat produk",
  },
  {
    label: "Keuntungan",
    type: "text",
    name: "benefit",
  },
  {
    label: "Perlu disiapkan",
    placeholder: "Contoh: memerlukan listrik",
    type: "text",
    name: "requirement",
  },
];

function AddInnovation() {
  const navigate = useNavigate();
  const form = useForm({
    resolver: zodResolver(schema),
  });
  const { handleSubmit, reset } = form;
  const { mutateAsync } = useMutation(addInnovation);
  const { auth } = useAuthLS();

  const onAddInnovation = async (data: any) => {
    try {
      const backgroundFile = data.background[0];

      // Buat id unik untuk inovasi baru dengan membuat dokumen kosong pada koleksi "innovations"
      const innovationDocRef = await addDoc(collection(db, "innovations"), {}); // Menambahkan dokumen kosong dan mendapatkan referensi dokumen baru

      // Upload gambar background pada id unik tersebut di storage
      const backgroundUrl = await uploadImage(backgroundFile, `innovations/${innovationDocRef.id}/background`);

      // Cari dokumen dengan kode unik pada koleksi "innovators"
      const innovatorDocRef = doc(collection(db, "innovators"), auth.id);
      const innovatorDoc = await getDoc(innovatorDocRef);

      // Ambil link dari data logo user tersebut
      let logoUrl = "";
      if (innovatorDoc.exists()) {
        const innovatorData = innovatorDoc.data();
        logoUrl = innovatorData?.logo || "";
      } else {
        console.error("No such innovator document!");
      }

      const payload = {
        ...data,
        logo: logoUrl, // Masukkan URL logo ke dalam payload
        background: backgroundUrl,
        innovatorId: auth?.id,
        user_id: auth?.id,
      };

      // Simpan link URL gambar tersebut dan data lainnya
      await setDoc(innovationDocRef, payload); // Menyimpan data inovasi ke dokumen yang baru dibuat

      toast("Inovasi berhasil ditambahkan", { type: "success" });
      navigate(
        generatePath(paths.INNOVATION_CATEGORY_PAGE, {
          category: data?.category,
        })
      );
      reset();
    } catch (error) {
      console.log(error);
      toast("Terjadi kesalahan jaringan", { type: "error" });
    }
  };


  return (
    <Container page px={16}>
      <TopBar title="Tambahkan Inovasi" onBack={() => navigate(-1)} />
      <form onSubmit={handleSubmit(onAddInnovation)}>
        {forms?.map(({ label, type, name, placeholder, options }, idx) => {
          if (!!options)
            return (
              <React.Fragment key={idx}>
                <Label mt={12}>{label} </Label>
                <Dropdown
                  options={options}
                  form={form}
                  name={name}
                  placeholder={placeholder}
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
        })}

        <Button size="m" fullWidth mt={12} type="submit">
          Tambah Inovasi{" "}
        </Button>
      </form>
    </Container>
  );
}

export default AddInnovation;