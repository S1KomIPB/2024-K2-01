import React from "react";
import TopBar from "Components/topBar";
import Button from "Components/button";
import { generatePath, useNavigate, useParams } from "react-router-dom";
import Container from "Components/container";
import { useQuery } from "react-query";
import { getUserById } from "Services/userServices"; // Gunakan getUserById dari userServices
import { getInnovationByInnovators } from "Services/innovationServices"; // Impor fungsi baru
import { paths } from "Consts/path";
import {
  ContentContainer,
  Background,
  Title,
  ActionContainer,
  Text,
  Logo,
  Description,
  GridContainer,
} from "./_detailStyle";
import CardInnovation from "Components/card/innovation"; // Impor komponen CardInnovation

function Detail() {
  const navigate = useNavigate();
  const { id } = useParams();
  if (!id) {
    // Handle the case where id is undefined
    return <p>User not found!</p>;
  }

  const { data: userData, isLoading: isLoadingUser } = useQuery(["innovatorById", id], () => getUserById(id)); // Perbarui penggunaan useQuery dengan id sebagai dependensi
  const { data: innovationsData, isLoading: isLoadingInnovations } = useQuery(["innovationsByInnovator", id], () => getInnovationByInnovators(id));

  const { background, logo, innovatorName, category, description, modelBusiness, targetUser, instagram } = userData || {};

  const grid = [
    {
      label: "Target pengguna",
      value: targetUser,
    },
    {
      label: "Kategori Inovator",
      value: category,
    },
    {
      label: "Model bisnis digital",
      value: modelBusiness,
    },
  ];

  const onClickHere = () => {
    window.open(instagram, "_blank");
  };

  if (isLoadingUser || isLoadingInnovations) return <p>Sedang memuat data...</p>;

  return (
    <Container page>
      <TopBar title="Detail Inovator" onBack={() => navigate(-1)} />
      <div style={{ position: "relative" }}>
        <Background src={background} alt="background" />
        <Logo mx={16} my={-40} src={logo} alt="logo" />
      </div>

      <ContentContainer>
        <Title> {innovatorName} </Title>
        <div>
          <Text>Tentang</Text>
          <GridContainer>
            {grid?.map((item: any, idx: number) => (
              <React.Fragment key={idx}>
                <Description mb={16} mt={idx === 0 ? 16 : 0}>
                  {item?.label}
                </Description>
                <Description mb={16} mt={idx === 0 ? 16 : 0}>
                  {item?.value}
                </Description>
              </React.Fragment>
            ))}
          </GridContainer>
          <Description>{description}</Description>
          <Text>Inovasi yang Dihasilkan</Text>
          <GridContainer>
            {innovationsData?.map((item: any, idx: number) => (
              <CardInnovation
                key={idx}
                {...item}
                onClick={() =>
                  navigate(
                    generatePath(paths.DETAIL_INNOVATION_PAGE, { id: item?.idUnik })
                  )
                }
              />
            ))}
          </GridContainer>
        </div>
        <Button size="m" fullWidth mt={12} type="submit" onClick={onClickHere}>
          Kontak Inovator
        </Button>
      </ContentContainer>
    </Container>
  );
}

export default Detail;