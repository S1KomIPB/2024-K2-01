import React, { useState, useEffect } from "react";
import {
  Container,
  Background,
  CardContent,
  Title,
  Description,
  Logo,
} from "./_cardVillageStyle";
import { getNamaProvinsi, getNamaKabupaten } from "Services/locationServices";

type CardVillageProps = {
  province?: string;
  district?: string;
  subdistrict?: string;
  village?: string;
  description?: string;
  logo?: string;
  header?: string;
  benefit?: string;
  whatsApp?: string;
  id?: string;
  nameVillage?: string;
  onClick: () => void;
};

function CardVillage(props: CardVillageProps) {
  const {
    province,
    district,
    subdistrict,
    village,
    description,
    logo,
    header,
    benefit,
    whatsApp,
    nameVillage,
    onClick,
  } = props;

  // State untuk menyimpan nama Kabupaten dan Provinsi
  const [kabupatenName, setKabupatenName] = useState("");
  const [provinsiName, setProvinsiName] = useState("");

  useEffect(() => {
    // Ambil nama Kabupaten menggunakan id Kabupaten dari props
    const fetchKabupatenName = async () => {
      try {
        if (district) {
          const kabupatenName = await getNamaKabupaten(district);
          setKabupatenName(kabupatenName);
        }
      } catch (error) {
        console.error("Error fetching kabupaten name:", error);
      }
    };

    // Ambil nama Provinsi menggunakan id Provinsi dari props
    const fetchProvinsiName = async () => {
      try {
        if (province) {
          const provinsiName = await getNamaProvinsi(province);
          setProvinsiName(provinsiName);
        }
      } catch (error) {
        console.error("Error fetching provinsi name:", error);
      }
    };

    fetchKabupatenName();
    fetchProvinsiName();
  }, [district, province]);

  return (
    <Container onClick={onClick}>
      <Background src={header} alt="background" />
      <CardContent>
        <Logo src={logo} alt={logo} />
        <Title>{nameVillage}</Title>
        <Description>{kabupatenName}</Description>
        <Description>{provinsiName}</Description>
      </CardContent>
    </Container>
  );
}

export default CardVillage;