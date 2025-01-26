import { ChevronRightIcon } from "@chakra-ui/icons";
import {
  Box,
  Flex,
  Icon,
  Image,
  Stack,
  Text,
  useDisclosure
} from "@chakra-ui/react";
import Button from "Components/button";
import RejectionModal from "Components/confirmModal/RejectionModal";
import Container from "Components/container";
import ActionDrawer from "Components/drawer/ActionDrawer";
import TopBar from "Components/topBar/index";
import { paths } from "Consts/path";
import {
  DocumentData,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { FaWandMagicSparkles } from "react-icons/fa6";
import { LuDot } from "react-icons/lu";
import { TbPlant2 } from "react-icons/tb";
import { generatePath, useNavigate, useParams } from "react-router-dom";
import { auth, firestore } from "../../../firebase/clientApp";
import ButtonPengajuan from "../components/hero/ButtonPengajuan"; // Impor tombol
import InnovationPreview from "../components/hero/innovations";
import {
  Background,
  ContentContainer,
  Label,
  Logo,
  Title,
} from "./_detailStyle";

const DetailInnovator: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams(); // Ensure TypeScript knows id is a string
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [innovatorData, setInnovatorData] = useState<DocumentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [innovations, setInnovations] = useState<DocumentData[]>([]);
  const [villages, setVillages] = useState<DocumentData[]>([]); // Add state for villages
  const [admin, setAdmin] = useState(false);
  const [userLogin] = useAuthState(auth);
  const [openModal, setOpenModal] = useState(false);
  const [modalInput, setModalInput] = useState("");

  const handleVerify = async () => {
    setLoading(true);
    try {
      if (!id) {
        setError("Invalid innovator ID.");
        setLoading(false);
        return;
      }
      const docRef = doc(firestore, "innovators", id);
      await updateDoc(docRef, {
        status: "Terverifikasi",
      });
      setInnovatorData((prev) => ({ ...prev, status: "Terverifikasi" }));
    } catch (error) {
      console.error("Error verifying innovator:", error);
      setError("Error verifying innovator.");
    }
    setLoading(false);
    onClose();
  };

  const handleReject = async () => {
    try {
      if (!id) {
        setError("Invalid innovator ID.");
        setLoading(false);
        return;
      }
      const docRef = doc(firestore, "innovators", id);
      await updateDoc(docRef, {
        status: "Ditolak",
        catatanAdmin: modalInput,
      });
      setInnovatorData((prev) => ({
        ...prev,
        status: "Ditolak",
        catatanAdmin: modalInput,
      }));
    } catch (error) {
      console.error("Error rejecting innovator:", error);
      setError("Error rejecting innovator.");
    }
    setLoading(false);
    setOpenModal(false);
  };

  useEffect(() => {
    const fetchUser = async () => {
      if (userLogin?.uid) {
        const userRef = doc(firestore, "users", userLogin.uid);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          setAdmin(userDoc.data().role === "admin");
        }
      }
    }
    fetchUser();
  })
  // Fetch innovator data
  useEffect(() => {
    if (!id) {
      setError("Invalid innovator ID.");
      setLoading(false);
      return;
    }

    const fetchInnovatorData = async () => {
      try {
        const innovatorRef = doc(firestore, "innovators", id);
        const innovatorDoc = await getDoc(innovatorRef);
        if (innovatorDoc.exists()) {
          setInnovatorData(innovatorDoc.data());
        } else {
          console.log("Innovator not found");
          setError("Innovator not found.");
        }
      } catch (error) {
        console.error("Error fetching innovator data:", error);
        setError("Error fetching innovator data.");
      } finally {
        setLoading(false);
      }
    };

    fetchInnovatorData();
  }, [id]);
  console.log("data: ", innovatorData);

  // Fetch innovations data
  useEffect(() => {
    const fetchInnovations = async () => {
      try {
        const innovationsRef = collection(firestore, "innovations");
        const q = query(innovationsRef, where("innovatorId", "==", id));
        const innovationsDocs = await getDocs(q);
        const innovationsData = innovationsDocs.docs.map((doc) => ({
          id: doc.id, // Ensure the ID is included
          ...doc.data(),
        }));
        setInnovations(innovationsData);
      } catch (error) {
        console.error("Error fetching innovations data:", error);
        setError("Error fetching innovations data.");
      }
    };

    if (id) {
      fetchInnovations();
    }
  }, [id]);

  // Dummy data untuk Desa Dampingan, nantinya ini akan diganti dengan data dari Firestore
  useEffect(() => {
    const dummyVillages = [
      {
        id: "village1",
        namaDesa: "Desa Puntang",
        inovasiDiterapkan: [
          "Pakan Otomatis (eFeeder)",
          "Lapak Ikan (eFisheryFeed)",
        ],
        logo: "https://via.placeholder.com/50",
      },
    ];
    setVillages(dummyVillages);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!innovatorData) {
    return <div>No data available</div>;
  }

  const truncateText = (text: string, wordLimit: number) => {
    const words = text.split(" ");
    return words.length > wordLimit
      ? words.slice(0, wordLimit).join(" ") + "..."
      : text;
  };

  return (
    <Container page>
      <TopBar title="Profil Inovator" onBack={() => navigate(-1)} />
      <Flex position="relative">
        <Background src={innovatorData.header} alt="header" />
        <Logo src={innovatorData.logo} alt="logo" mx={16} my={-40} />
        <Box
          position="absolute"
          top="130%"
          right="16px"
          transform="translateY(-50%)"
        >
          <ButtonPengajuan
            label="Pengajuan Inovasi" // Teks tombol
            to="/innovator/profile/pengajuanInovasi"
          />
        </Box>
      </Flex>
      <ContentContainer>
        <Stack gap={3} mt={4}>
          <Title>{innovatorData.namaInovator}</Title>
          <Label>{innovatorData.kategori}</Label>
          <Flex direction="row" gap={3} mt={0} alignItems="center">
            <Icon as={FaWandMagicSparkles} color="#4B5563" />
            <Text fontSize="12px" fontWeight="400" color="#4B5563">
              {innovatorData.jumlahInovasi} Inovasi
            </Text>
            <Icon as={LuDot} color="#4B5563" />
            <Icon as={TbPlant2} color="#4B5563" />
            <Text fontSize="12px" fontWeight="400" color="#4B5563">
              {innovatorData.jumlahDesaDampingan} Desa Dampingan
            </Text>
          </Flex>
        </Stack>
        <Flex>
          <Stack direction="column">
            <Text fontSize="16px" fontWeight="700">
              Tentang
            </Text>
            <Flex direction="column" alignItems="flex-start">
              <Flex
                width="100%"
                flexDirection="row"
                alignItems="flex-start"
                paddingBottom="12px"
              >
                <Box color="#4B5563" fontSize="12px" minWidth="110px">
                  Nomor WhatsApp
                </Box>
                <Text
                  maxW="200px"
                  whiteSpace="normal"
                  overflowWrap="break-word"
                  fontSize="12px"
                >
                  08126489023
                </Text>
              </Flex>
              <Flex
                width="100%"
                flexDirection="row"
                alignItems="flex-start"
                paddingBottom="12px"
              >
                <Box color="#4B5563" fontSize="12px" minWidth="110px">
                  Link Instagram
                </Box>
                <Text
                  maxW="222px"
                  whiteSpace="normal"
                  overflowWrap="break-word"
                  fontSize="12px"
                >
                  https://www.instagram.com/desasoge/
                </Text>
              </Flex>
              <Flex
                width="100%"
                flexDirection="row"
                alignItems="flex-start"
                paddingBottom="12px"
              >
                <Box color="#4B5563" fontSize="12px" minWidth="110px">
                  Link Website
                </Box>
                <Text
                  maxW="222px"
                  whiteSpace="normal"
                  overflowWrap="break-word"
                  fontSize="12px"
                >
                  https://www.instagram.com/desasoge/
                </Text>
              </Flex>
            </Flex>

            <Flex direction="row" alignItems="center">
              <Text fontSize="12px" fontWeight="700" color="#4B5563" mr={2}>
                Model bisnis digital:
              </Text>
              <Text fontSize="12px" fontWeight="400" color="#4B5563" flex="1">
                {innovatorData.modelBisnis}
              </Text>
            </Flex>

            <Box fontSize="12px" fontWeight="400" color="#4B5563">
              {isExpanded ? (
                // Tampilkan teks lengkap jika `isExpanded` true
                <>
                  {innovatorData.deskripsi}
                  {innovatorData.deskripsi.split(" ").length > 20 && ( // Tampilkan "Lebih Sedikit" jika lebih dari 20 kata
                    <Text
                      as="span"
                      fontSize="12px"
                      fontWeight="700"
                      color="#347357"
                      cursor="pointer"
                      textDecoration="underline"
                      onClick={() => setIsExpanded(!isExpanded)} // Toggle state
                    >
                      Lebih Sedikit
                    </Text>
                  )}
                </>
              ) : (
                // Tampilkan teks terpotong jika `isExpanded` false
                <>
                  {truncateText(innovatorData.deskripsi, 20)}
                  {innovatorData.deskripsi.split(" ").length > 20 && ( // Tampilkan "Selengkapnya" jika lebih dari 20 kata
                    <Text
                      as="span"
                      fontSize="12px"
                      fontWeight="700"
                      color="#347357"
                      cursor="pointer"
                      textDecoration="underline"
                      onClick={() => setIsExpanded(!isExpanded)} // Toggle state
                    >
                      {" "}
                      Selengkapnya
                    </Text>
                  )}
                </>
              )}
            </Box>
          </Stack>
        </Flex>
        <Flex direction="column">
          {/* Komponen Produk Inovasi */}
          <InnovationPreview innovations={innovations} innovatorId={id} />
        </Flex>
        <Flex direction="column">
          <Text fontSize="16px" fontWeight="700" mb={3}>
            Desa Dampingan
          </Text>
          {villages.map((village) => (
            <Box
              key={village.id}
              borderWidth="1px"
              borderRadius="lg"
              overflow="hidden"
              p={2}
              mb={4}
              cursor="pointer"
              backgroundColor="white"
              borderColor="gray.200"
              onClick={() =>
                navigate(
                  generatePath(paths.DETAIL_VILLAGE_PAGE, { id: village.id })
                )
              }
            >
              <Flex alignItems="center" mb={3}>
                <Image
                  src={village.logo}
                  alt={`${village.namaDesa} Logo`}
                  boxSize="40px"
                  borderRadius="full"
                  mr={4}
                />
                <Text fontSize="12px" fontWeight="600">
                  {village.namaDesa}
                </Text>
                <ChevronRightIcon color="gray.500" ml="auto" />
              </Flex>
              {/* Menambahkan Border Pembatas Di Atas "Inovasi Diterapkan" */}
              <Box borderTop="1px" borderColor="gray.300" pt={3} mt={3}></Box>
              <Text fontSize="12px" fontWeight="400" mb={2} color="#9CA3AF">
                Inovasi diterapkan
              </Text>
              <Flex direction="row" gap={2} flexWrap="wrap">
                {Array.isArray(village.inovasiDiterapkan) &&
                  village.inovasiDiterapkan.map((inovasi, index) => (
                    <Box
                      key={index}
                      px={0}
                      py={0}
                      backgroundColor="gray.100"
                      borderRadius="full"
                      fontSize="12px"
                      display="inline-flex"
                    >
                      {inovasi}
                    </Box>
                  ))}
              </Flex>
            </Box>
          ))}
        </Flex>
        <Button mt={-3} size="m" fullWidth type="submit" onClick={onOpen}>
          Kontak Inovator
        </Button>
        <RejectionModal
          isOpen={openModal}
          onClose={() => setOpenModal(false)}
          onConfirm={handleReject}
          message={modalInput}
          setMessage={setModalInput}
          loading={loading}
        />
      </ContentContainer>
      <ActionDrawer
        isOpen={isOpen}
        onClose={onClose}
        isAdmin={admin}
        onVerify={handleVerify}
        setOpenModal={setOpenModal}
        loading={loading}
        role="inovator"
      />
    </Container>
  );
};

export default DetailInnovator;
