import TopBar from "Components/topBar";
import Hero from "./components/hero";
import CardInnovator from "Components/card/innovator";
import Container from "Components/container";
import { useQuery } from "react-query";
import { getInnovators } from "Services/userServices"; //Memanggil get Innovator dari UserServices
import { paths } from "Consts/path";
import { useNavigate, generatePath } from "react-router-dom";
import { GridContainer } from "./_innovatorStyle";


function Innovator() {
  const navigate = useNavigate();
  const { data: innovators, isFetched } = useQuery("innovators", getInnovators);

  return (
    <Container page>
      <TopBar title="Inovator" />
      <Hero />
      <GridContainer>
        {isFetched &&
          innovators?.map((item: any, idx: number) => (
            <CardInnovator
              key={idx}
              {...item}
              onClick={() =>
                navigate(
                  generatePath(paths.DETAIL_INNOVATOR_PAGE, { id: item.id })
                )
              }
            />
          ))}
      </GridContainer>
    </Container>
  );
}

export default Innovator;
