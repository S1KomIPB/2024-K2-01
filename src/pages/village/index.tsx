import React from "react";
import TopBar from "Components/topBar";
import Hero from "./components/hero";
import Container from "Components/container";
import { useQuery } from "react-query";
import { getVillages } from "Services/userServices"; // Ubah import dari userServices
import { useNavigate, generatePath } from "react-router-dom";
import { GridContainer } from "./_villageStyle";
import CardVillage from "Components/card/village";
import { paths } from "Consts/path";

function Village() {
  const navigate = useNavigate();
  const { data: villages, isFetched } = useQuery<any>("villages", getVillages);

  return (
    <Container page>
      <TopBar title="Desa Digital" />
      <Hero />
      <GridContainer>
        {isFetched &&
          villages?.map((item: any, idx: number) => (
            <CardVillage
              key={idx}
              {...item}
              onClick={() =>
                navigate(
                  generatePath(paths.DETAIL_VILLAGE_PAGE, { id: item.id })
                )
              }
            />
          ))}
      </GridContainer>
    </Container>
  );
}

export default Village;