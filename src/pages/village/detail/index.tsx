// DetailVillage.tsx
import { useQuery } from "react-query";
import React, { useEffect, useState } from "react";
import TopBar from "Components/topBar";
import Container from "Components/container";
import { useNavigate, useParams } from "react-router";
import Button from "Components/button";
import Location from "Assets/icons/location.svg";
import {
  Title,
  ActionContainer,
  Icon,
  Text,
  Logo,
  Label,
  Description,
  ContentContainer,
  ChipContainer,
  Background,
} from "./_detailStyle";
import { paths } from "Consts/path";
import { getUserById } from "Services/userServices"; // Gunakan getUserById dari userServices
import { getNamaProvinsi, getNamaKabupaten, getNamaKecamatan } from "Services/locationServices"; // Gunakan fungsi getNamaProvinsi, getNamaKabupaten, dan getNamaKecamatan dari locationServices

function DetailVillage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [locationName, setLocationName] = useState("");// State untuk menyimpan nama lokasi

  const { data, isLoading } = useQuery<any>("villageById", () =>
  id ? getUserById(id) : null // Memastikan id tidak undefined sebelum memanggil getUserById
);

  const {
    header,
    logo,
    nameVillage,
    province,
    district,
    subDistrict,
    description,
    benefit,
    whatsApp,
  } = data || {};

  useEffect(() => {
    // Memanggil fungsi getNamaProvinsi, getNamaKabupaten, dan getNamaKecamatan untuk mendapatkan nama lokasi
    if (province && district && subDistrict) {
      getNamaProvinsi(province).then((namaProvinsi) => {
        getNamaKabupaten(district).then((namaKabupaten) => {
          getNamaKecamatan(subDistrict).then((namaKecamatan) => {
            const location = `${namaProvinsi}, ${namaKabupaten}, ${namaKecamatan}`;
            setLocationName(location);
          });
        });
      });
    }
  }, [province, district, subDistrict]);

  const onClickHere = () => {
    window.open(`https://wa.me/+${whatsApp}`, "_blank");
  };

  if (isLoading) return <p>Sedang memuat data...</p>;

  return (
    <Container>
      <div style={{ position: "relative" }}>
        <Background src={header} alt="background" />
        <Logo mx={16} my={-40} src={logo} alt="logo" />
      </div>
      <ContentContainer>
        <Title> {nameVillage} </Title>
        <ActionContainer>
          <Description>
            <Icon src={Location} alt="loc" />
            {locationName} {/* Menampilkan nama lokasi */}
          </Description>
        </ActionContainer>
        <div>
          <Text mb={16}>Tentang</Text>
          <Description>{description}</Description>
        </div>
        <Text>Potensi Desa</Text>
        <ChipContainer>
          <Label>{benefit}</Label>
        </ChipContainer>
      </ContentContainer>
      <Button size="m" fullWidth mt={12} type="submit" onClick={onClickHere}>
        Kontak Desa
      </Button>{" "}
    </Container>
  );
}

export default DetailVillage;