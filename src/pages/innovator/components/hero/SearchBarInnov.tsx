import { SearchIcon } from "@chakra-ui/icons";
import {
    Flex,
    Input,
    InputGroup,
    InputLeftElement
} from "@chakra-ui/react";
import React from "react";

type SearchBarInnovProps = {
  placeholder?: string; // Tambahkan tipe placeholder sebagai props
};

const SearchBarinnov: React.FC<SearchBarInnovProps> = ({ placeholder }) => {
  return (
    <Flex justify="center" maxW="360px" width="100%">
        <InputGroup>
          <InputLeftElement
            pointerEvents="none"
            children={<SearchIcon color="gray.300" />}
          />
          <Input
            type="text"
            placeholder={placeholder}
            fontSize="10pt"
            _placeholder={{ color: "gray.500" }}
            _hover={{
              bg: "white",
              border: "1px solid",
              borderColor: "brand.100",
            }}
            _focus={{
              bg: "white",
              border: "1px solid",
              borderColor: "#9CA3AF",
            }}
            borderRadius={100}
            maxW="329px"
            width="100%"
          />
        </InputGroup>
      </Flex>
  );
};
export default SearchBarinnov;