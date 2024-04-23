import { paths } from "Consts/path";
import { useQuery } from "react-query";
import Container from "Components/container";
import { getInnovators } from "Services/userServices"; //Memanggil get Innovator dari UserServices
import CardInovator from "Components/card/innovator";
import { generatePath, useNavigate } from "react-router-dom";
import { CardContainer, Title, Horizontal } from "./_innovatorStyle";

function Innovator() {
  const navigate = useNavigate();

  const { data: innovators, isFetched } = useQuery("innovators", getInnovators);

  return (
    <Container>
      <Title>Inovator Unggulan</Title>
      <CardContainer>
        <Horizontal>
          {innovators && innovators.map((innovator) => (
            <CardInovator
              key={innovator.id}
              {...innovator}
              onClick={() =>
                navigate(
                  generatePath(paths.DETAIL_INNOVATOR_PAGE, { id: innovator.id })
                )
              }
            />
          ))}
        </Horizontal>
      </CardContainer>
    </Container>
  );
}

export default Innovator;
