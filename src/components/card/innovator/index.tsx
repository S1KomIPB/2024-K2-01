import {
  Container,
  Background,
  CardContent,
  Title,
  Description,
  Logo,
} from "./_cardInnovatorStyle";

type CardInnovatorProps = {
  background?: string;
  logo?: string;
  innovatorName?: string;
  category?: string;
  targetUser?: string;
  product?: string;
  modelBusiness?: string;
  whatsApp?: string;
  instagram?: string;
  website?: string;
  id?: string; //Dalam Firebase id bisa berupa kombinasi huruf dan angka
  description?: string;

  onClick: () => void;
};

function CardInnovator(props: CardInnovatorProps) {
  const {
    background,
    logo,
    innovatorName,
    category,
    targetUser,
    product,
    modelBusiness,
    whatsApp,
    instagram,
    website,
    description,
    onClick,
  } = props;
  
  return (
    <Container onClick={onClick}>
      <Background src={background} alt={innovatorName} />
      <CardContent>
        <Logo src={logo} alt={logo} />
        <Title>{innovatorName}</Title>
        <Description>{category}</Description>
      </CardContent>
    </Container>
  );
}

export default CardInnovator;
