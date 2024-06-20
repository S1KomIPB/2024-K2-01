import { Flex, Text } from "@chakra-ui/react";
import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase/clientApp";
import UserMenu from "./RightContent/UserMenu";
import { Container } from "./_topBarStyle";



type TopBarProps = {
  title: string | undefined
};


const TopBar: React.FC<TopBarProps> = ({title}) => {
  const [user, loading, error] = useAuthState(auth);
  return (
    <Container>
      <Flex justify="space-between" align="center">
        <Text fontSize="16px" fontWeight="700" color="white">
          {title}
        </Text>
        <UserMenu user={user} />
      </Flex>
    </Container>
  );
};
export default TopBar;
