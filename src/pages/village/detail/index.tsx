import { useQuery } from "react-query";
import React, { useEffect, useState } from "react";
import TopBar from "Components/topBar";
import Container from "Components/container";
import { useNavigate, useParams, generatePath } from "react-router";
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
import { getInnovationById } from "Services/innovationServices"; // Import getInnovationById untuk mendapatkan detail inovasi
import CardInnovation from "Components/card/innovation";

function DetailVillage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [locationName, setLocationName] = useState(""); // State untuk menyimpan nama lokasi
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
    inovasi_id, // Array ID inovasi
  } = data || {};

  useEffect(() => {
    // Menggabungkan nama provinsi, kabupaten, dan kecamatan menjadi satu string
    if (province && district && subDistrict) {
      const location = `${subDistrict}, ${district}, ${province}`;
      setLocationName(location);
    }
  }, [province, district, subDistrict]);

  const onClickHere = () => {
    window.open(`https://wa.me/+${whatsApp}`, "_blank");
  };

  // Fetch innovation data for each innovation ID in the inovasi_id array
  const { data: innovations } = useQuery<any[]>(
    ["innovationsByIds", inovasi_id],
    async () => {
      if (inovasi_id && Array.isArray(inovasi_id)) {
        const innovationPromises = inovasi_id.map((id: string) => getInnovationById(id));
        return await Promise.all(innovationPromises);
      } else {
        throw new Error("inovasi_id is undefined or not an array");
      }
    },
    {
      enabled: Array.isArray(inovasi_id) && inovasi_id.length > 0,
    }
  );

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
      <div>
        <Text mb={16}>Inovasi yang Diterapkan</Text>
        {innovations ? (
          innovations.map((innovation) => (
            <CardInnovation
              key={innovation.id}
              {...innovation}
              onClick={() =>
                navigate(
                  generatePath(paths.DETAIL_INNOVATION_PAGE, { id: innovation.id })
                )
              }
            />
          ))
        ) : (
          <Description>Belum ada inovasi yang diterapkan</Description>
        )}
      </div>
      <Button size="m" fullWidth mt={12} type="submit" onClick={onClickHere}>
        Kontak Desa
      </Button>{" "}
    </Container>
  );
}

export default DetailVillage;
