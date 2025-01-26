import { ArrowBackIcon } from "@chakra-ui/icons";
import { Box, Button, Flex, Text } from "@chakra-ui/react";
import { paths } from "Consts/path";
import { useAuthState } from "react-firebase-hooks/auth";
import { useLocation, useNavigate, useParams } from "react-router";
import { auth } from "../../firebase/clientApp";
import UserMenu from "./RightContent/UserMenu";

type TopBarProps = {
  title: string | undefined;
  onBack?: () => void;
};

function TopBar(props: TopBarProps) {
  const { title, onBack } = props;
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams<{ id: string }>();
  const [user] = useAuthState(auth);

  const allowedPaths = [paths.LANDING_PAGE, paths.ADMIN_PAGE];
  const isUserMenuVisible = allowedPaths.includes(location.pathname);

  const isClaimButtonVisible =
    location.pathname.includes("/innovation/detail/") && id;

  return (
    <Box
      padding="0 16px"
      backgroundColor="#347357"
      position="fixed"
      top="0"
      maxW="360px"
      width="100%"
      height="56px"
      zIndex="999"
      alignContent="center"
    >
      <Flex
        justify={
          isClaimButtonVisible || isUserMenuVisible
            ? "space-between"
            : "flex-start"
        }
        align="center"
      >
        {!!onBack && (
          <ArrowBackIcon
            color="white"
            fontSize="14pt"
            cursor="pointer"
            onClick={onBack}
            mt="2px"
          />
        )}
        <Text
          fontSize={title && title.split(" ").length > 3 ? "14px" : "16px"}
          fontWeight="700"
          color="white"
          ml={onBack ? "8px" : "0"}
          lineHeight="56px"
          flex={1}
          textAlign='left'
        >
          {title}
        </Text>
        {isClaimButtonVisible && (
          <Button
            fontSize="12px"
            fontWeight="500"
            variant="inverted"
            height="32px"
            _hover={{ bg: "gray.200" }}
            onClick={() => navigate(`/village/klaimInovasi/${id}`)}
          >
            Klaim Inovasi
          </Button>
        )}
        {!isClaimButtonVisible &&
          isUserMenuVisible &&
          (user ? (
            <UserMenu user={user} />
          ) : (
            <Button
              fontSize="14px"
              fontWeight="700"
              color="white"
              cursor="pointer"
              onClick={() => navigate(paths.LOGIN_PAGE)}
              variant="link"
              mt="2px"
            >
              Login
            </Button>
          ))}
      </Flex>
    </Box>
  );
}

export default TopBar;
