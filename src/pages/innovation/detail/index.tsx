import TopBar from "Components/topBar";
import Dot from "Assets/icons/dot.svg";
import Check from "Assets/icons/check-circle.svg";
import Container from "Components/container";
import { generatePath, useNavigate, useParams } from "react-router-dom";
import { paths } from "Consts/path.ts";
import {
  Img,
  Label,
  Title,
  ActionContainer,
  Icon,
  Text,
  Logo,
  Description,
  ChipContainer,
  ContentContainer,
  BenefitContainer,
} from "./_detailStyle.ts";
import { useQuery } from "react-query";
import { getInnovationById } from "Services/innovationServices.ts";
import { getUserById } from "Services/userServices.ts";

function DetailInnovation() {
  const navigate = useNavigate();
  const { id } = useParams();

  const { data: innovation } = useQuery<any>(
    ["innovationById", id],
    () => {
      if (id) {
        return getInnovationById(id);
      } else {
        throw new Error("ID is undefined");
      }
    },
    {
      enabled: !!id,
    }
  );

  const { background, benefit, category, description, name, requirement, date, user_id, desa_id } =
    innovation || {};

  const { data: innovator } = useQuery<any>(
    ["innovatorById", user_id],
    () => getUserById(user_id),
    {
      enabled: !!user_id,
    }
  );

  const { innovatorName, logo } = innovator || {};
  const year = new Date(date).getFullYear();

  // Fetch village data for each village ID in the desa_id array
  const { data: villages } = useQuery<any[]>(
    ["villagesByIds", desa_id],
    async () => {
      if (desa_id && Array.isArray(desa_id)) {
        const villagePromises = desa_id.map((id: string) => getUserById(id));
        return await Promise.all(villagePromises);
      } else {
        throw new Error("desa_id is undefined or not an array");
      }
    },
    {
      enabled: Array.isArray(desa_id) && desa_id.length > 0,
    }
  );

  return (
    <Container page>
      <TopBar title="Detail Inovasi" onBack={() => navigate(-1)} />
      <Img src={background} alt="background" />
      <ContentContainer>
        <div>
          <Title>{name}</Title>
          <ChipContainer>
            <Label
              onClick={() =>
                navigate(
                  generatePath(paths.INNOVATION_CATEGORY_PAGE, {
                    category: category,
                  })
                )
              }
            >
              {category}
            </Label>
            <Description>Dibuat tahun {year}</Description>
          </ChipContainer>
        </div>
        <ActionContainer
          onClick={() =>
            navigate(
              generatePath(paths.DETAIL_INNOVATOR_PAGE, { id: user_id })
            )
          }
        >
          <Logo src={logo} alt="logo" />
          <Text>{innovatorName}</Text>
        </ActionContainer>
        <div>
          <Text mb={16}>Deskripsi</Text>
          <Description>{description}</Description>
        </div>

        <div>
          <Text mb={16}>Keuntungan</Text>
          <BenefitContainer>
            <Icon mr={4} src={Dot} alt="dot" />
            <Description>{benefit}</Description>
          </BenefitContainer>
        </div>

        <div>
          <Text mb={16}>Perlu Disiapkan</Text>
          <BenefitContainer>
            <Icon src={Check} alt="check" />
            <Description>{requirement}</Description>
          </BenefitContainer>
        </div>

        <div>
          <Text mb={16}>Desa yang Menerapkan</Text>
          {villages ? (
            villages.map((village) => (
              <ActionContainer key={village.id} onClick={() => navigate(generatePath(paths.DETAIL_VILLAGE_PAGE, { id: village.id }))}>
                <Logo src={village.logo || Dot} alt={village.nameVillage} />
                <Text>{village.nameVillage}</Text>
              </ActionContainer>
            ))
          ) : (
            <Description>Belum ada desa yang menerapkan</Description>
          )}
        </div>
      </ContentContainer>
    </Container>
  );
}

export default DetailInnovation;