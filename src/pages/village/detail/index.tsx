import DigitalLit from "Assets/icons/digital-literacy.svg";
import DigitalRead from "Assets/icons/digital-readiness.svg";
import Geography from "Assets/icons/geography.svg";
import GoodService from "Assets/icons/good-service.svg";
import Infrastructure from "Assets/icons/infrastructure.svg";
import Instagram from "Assets/icons/instagram.svg";
import Location from "Assets/icons/location.svg";
import Resource from "Assets/icons/resource-village.svg";
import SocCul from "Assets/icons/socio-cultural.svg";
import Web from "Assets/icons/web.svg";
import Whatsapp from "Assets/icons/whatsapp.svg";
import CardInnovation from "Components/card/innovation";
import TopBar from "Components/topBar";
import { paths } from "Consts/path";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import EnlargedImage from "../components/Image";

import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import StatusCard from "Components/card/status/StatusCard";
import {
  DocumentData,
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { generatePath, useNavigate } from "react-router-dom";
import { auth, firestore } from "../../../firebase/clientApp";
import {
  ActionContainer,
  Background,
  ButtonKontak,
  CardContainer,
  ChipContainer,
  ContPotensiDesa,
  ContentContainer,
  Description,
  Horizontal,
  Icon,
  Label,
  Logo,
  SubText,
  Title,
} from "./_detailStyle";
import RejectionModal from "Components/confirmModal/RejectionModal";

export default function DetailVillage() {
  const navigate = useNavigate();
  const [userLogin] = useAuthState(auth);
  const innovationRef = collection(firestore, "innovations");
  const [innovations, setInnovations] = useState<DocumentData[]>([]);
  const [village, setVillage] = useState<DocumentData | undefined>();
  const [user, setUser] = useState<DocumentData | undefined>();
  const { id } = useParams();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [admin, setAdmin] = useState(false);
  const [owner, setOwner] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [modalInput, setModalInput] = useState(""); // Catatan admin

  const formatLocation = (lokasi: any) => {
    if (!lokasi) return "No Location";
    const kecamatan = lokasi.kecamatan?.label || "Unknown Subdistrict";
    const kabupaten = lokasi.kabupatenKota?.label || "Unknown City";
    const provinsi = lokasi.provinsi?.label || "Unknown Province";

    return `KECAMATAN ${kecamatan}, ${kabupaten}, ${provinsi}`;
  };

  const handleVerify = async () => {
    setLoading(true);
    try {
      if (id) {
        const docRef = doc(firestore, "villages", id);
        await updateDoc(docRef, {
          status: "Terverifikasi",
        });
        setVillage((prev) => ({
          ...prev,
          status: "Terverifikasi",
        }));
      } else {
        throw new Error("Village ID is undefined");
      }
    } catch (error) {
      // setError(error.message);
    }
    setLoading(false);
    onClose();
  };

  const handleReject = async () => {
    setLoading(true);
    try {
      if (id) {
        const docRef = doc(firestore, "villages", id);
        await updateDoc(docRef, {
          status: "Ditolak",
          catatanAdmin: modalInput, // Simpan alasan penolakan ke Firestore
        });
        setVillage((prev) => ({
          ...prev,
          status: "Ditolak",
          catatanAdmin: modalInput,
        }));
      } else {
        throw new Error("Village ID is undefined");
      }
    } catch (error) {
      console.error("Error during rejection:", error);
    }
    setLoading(false);
    setOpenModal(false); // Tutup modal setelah menyimpan
  };

  useEffect(() => {
    const fetchUser = async () => {
      if (userLogin?.uid) {
        const userRef = doc(firestore, "users", userLogin.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setAdmin(userSnap.data()?.role === "admin");
          if (userSnap.data()?.id === id) {
            setOwner(true);
          }
        }
      }
    };
    fetchUser();
    // console.log("User:", user);
  }, [userLogin, id]);

  useEffect(() => {
    const fetchInnovations = async () => {
      const innovationsSnapshot = await getDocs(innovationRef);
      const innovationsData = innovationsSnapshot.docs.map((doc) => doc.data());
      setInnovations(innovationsData);
    };
    fetchInnovations();
  }, [innovationRef]);

  useEffect(() => {
    const fetchVillageData = async () => {
      if (id) {
        try {
          const docRef = doc(firestore, "villages", id);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            // console.log("Village Data:", docSnap.data());
            setVillage(docSnap.data());
          } else {
            console.error("No such document!");
          }
        } catch (error) {
          console.error("Error fetching village data:", error);
        }
      } else {
        console.error("Village ID is undefined");
      }
    };

    fetchVillageData();
  }, [id]); // Tambahkan id sebagai dependensi

  return (
    <Box>
      <TopBar title="Detail Desa" onBack={() => navigate(-1)} />
      <div style={{ position: "relative", width: "100%" }}>
        <Background src={village?.header} alt="background" />
        <Logo mx={16} my={-40} src={village?.logo} alt="logo" />
      </div>
      <div>
        <ContentContainer>
          <Title> {village?.namaDesa} </Title>
          <ActionContainer>
            <Icon src={Location} alt="loc" />
            <Description>{formatLocation(village?.lokasi)}</Description>
          </ActionContainer>
          <div>
            <SubText margin-bottom={16}>Tentang</SubText>
            <Description>{village?.deskripsi}</Description>
          </div>
          <div>
            <SubText>Potensi Desa</SubText>
            <ContPotensiDesa>
              {village?.potensiDesa?.map((potensi: string, index: number) => (
                <ChipContainer key={index}>
                  <Label>{potensi}</Label>
                </ChipContainer>
              ))}
            </ContPotensiDesa>
          </div>
          <div>
            <SubText>Karakteristik Desa</SubText>
            <Accordion defaultIndex={[0]} allowMultiple>
              <AccordionItem>
                <h2>
                  <AccordionButton paddingLeft="4px" paddingRight="4px">
                    <Flex
                      as="span"
                      flex="1"
                      textAlign="left"
                      fontSize="12px"
                      fontWeight="700"
                      gap={2}
                    >
                      <Icon src={Geography} alt="geo" /> Geografis
                    </Flex>
                    <AccordionIcon color="#347357" />
                  </AccordionButton>
                </h2>
                <AccordionPanel
                  pb={4}
                  fontSize={12}
                  paddingLeft="4px"
                  paddingRight="4px"
                >
                  {village?.geografisDesa}
                </AccordionPanel>
              </AccordionItem>
              <AccordionItem>
                <h2>
                  <AccordionButton paddingLeft="4px" paddingRight="4px">
                    <Flex
                      as="span"
                      flex="1"
                      textAlign="left"
                      fontSize="12px"
                      fontWeight="700"
                      gap={2}
                    >
                      <Icon src={Infrastructure} alt="Infrastrusture" />{" "}
                      Infrastruktur
                    </Flex>
                    <AccordionIcon color="#347357" />
                  </AccordionButton>
                </h2>
                <AccordionPanel
                  pb={4}
                  fontSize={12}
                  paddingLeft="4px"
                  paddingRight="4px"
                >
                  {village?.infrastrukturDesa}
                </AccordionPanel>
              </AccordionItem>
              <AccordionItem>
                <h2>
                  <AccordionButton paddingLeft="4px" paddingRight="4px">
                    <Flex
                      as="span"
                      flex="1"
                      textAlign="left"
                      fontSize="12px"
                      fontWeight="700"
                      gap={2}
                    >
                      <Icon src={DigitalRead} alt="DigR" /> Kesiapan Digital
                    </Flex>
                    <AccordionIcon color="#347357" />
                  </AccordionButton>
                </h2>
                <AccordionPanel
                  pb={4}
                  fontSize={12}
                  paddingLeft="4px"
                  paddingRight="4px"
                >
                  {village?.kesiapanDigital}
                </AccordionPanel>
              </AccordionItem>
              <AccordionItem>
                <h2>
                  <AccordionButton paddingLeft="4px" paddingRight="4px">
                    <Flex
                      as="span"
                      flex="1"
                      textAlign="left"
                      fontSize="12px"
                      fontWeight="700"
                      gap={2}
                    >
                      <Icon src={DigitalLit} alt="DigL" /> Literasi Digital
                    </Flex>
                    <AccordionIcon color="#347357" />
                  </AccordionButton>
                </h2>
                <AccordionPanel
                  pb={4}
                  fontSize={12}
                  paddingLeft="4px"
                  paddingRight="4px"
                >
                  {village?.kesiapanTeknologi}
                </AccordionPanel>
              </AccordionItem>
              <AccordionItem>
                <h2>
                  <AccordionButton paddingLeft="4px" paddingRight="4px">
                    <Flex
                      as="span"
                      flex="1"
                      textAlign="left"
                      fontSize="12px"
                      fontWeight="700"
                      gap={2}
                    >
                      <Icon src={GoodService} alt="GoodService" /> Pemantapan
                      Pelayanan
                    </Flex>
                    <AccordionIcon color="#347357" />
                  </AccordionButton>
                </h2>
                <AccordionPanel
                  pb={4}
                  fontSize={12}
                  paddingLeft="4px"
                  paddingRight="4px"
                >
                  {village?.pemantapanPelayanan}
                </AccordionPanel>
              </AccordionItem>
              <AccordionItem>
                <h2>
                  <AccordionButton paddingLeft="4px" paddingRight="4px">
                    <Flex
                      as="span"
                      flex="1"
                      textAlign="left"
                      fontSize="12px"
                      fontWeight="700"
                      gap={2}
                    >
                      <Icon src={SocCul} alt="SocCul" /> Sosial dan Budaya
                    </Flex>
                    <AccordionIcon color="#347357" />
                  </AccordionButton>
                </h2>
                <AccordionPanel
                  pb={4}
                  fontSize={12}
                  paddingLeft="4px"
                  paddingRight="4px"
                >
                  {village?.sosialBudaya}
                </AccordionPanel>
              </AccordionItem>
              <AccordionItem>
                <h2>
                  <AccordionButton paddingLeft="4px" paddingRight="4px">
                    <Flex
                      as="span"
                      flex="1"
                      textAlign="left"
                      fontSize="12px"
                      fontWeight="700"
                      gap={2}
                    >
                      <Icon src={Resource} alt="Resource" /> Sumber Daya Alam
                    </Flex>
                    <AccordionIcon color="#347357" />
                  </AccordionButton>
                </h2>
                <AccordionPanel
                  pb={4}
                  fontSize={12}
                  paddingLeft="4px"
                  paddingRight="4px"
                >
                  {village?.sumberDaya}
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
          </div>
          <div>
            <SubText>Galeri Desa</SubText>
            <CardContainer>
              <Horizontal>
                {village?.images &&
                  (Object.values(village.images) as string[]).map(
                    (image: string, index: number) => (
                      <EnlargedImage key={index} src={image} />
                    )
                  )}
              </Horizontal>
            </CardContainer>
          </div>
          <div>
            <Flex
              justifyContent="space-between"
              alignItems="flex-end"
              align-self="stretch"
            >
              <SubText>Inovasi yang Diterapkan</SubText>
              <Text
                onClick={() => navigate("/target-page")} // Ganti "/target-page" dengan rute yang sesuai
                cursor="pointer"
                color="var(--Primary, #347357)"
                fontSize="12px"
                fontWeight="500"
                textDecorationLine="underline"
                paddingBottom="12px"
              >
                {" "}
                Lihat Semua{" "}
              </Text>
            </Flex>
            <CardContainer>
              <Horizontal>
                {innovations.map((innovation, idx) => (
                  <CardInnovation
                    key={idx}
                    images={innovation.images}
                    namaInovasi={innovation.namaInovasi}
                    kategori={innovation.kategori}
                    deskripsi={innovation.deskripsi}
                    tahunDibuat={innovation.tahunDibuat}
                    innovatorLogo={innovation.innovatorImgURL}
                    innovatorName={innovation.namaInnovator}
                    onClick={() =>
                      navigate(
                        generatePath(paths.DETAIL_INNOVATION_PAGE, {
                          id: innovation.id,
                        })
                      )
                    }
                  />
                ))}
              </Horizontal>
            </CardContainer>
          </div>
          <Box>
            {/* Logika untuk Admin */}
            {admin ? (
              village?.status === "Terverifikasi" ||
              village?.status === "Ditolak" ? (
                // Tampilkan StatusCard jika status Terverifikasi atau Ditolak
                <StatusCard
                  message={village?.catatanAdmin}
                  status={village?.status}
                />
              ) : (
                // Tampilkan tombol Verifikasi jika status belum Terverifikasi/Ditolak
                <Button width="100%" fontSize="14px" mb={8} onClick={onOpen}>
                  Verifikasi Permohonan Akun
                </Button>
              )
            ) : (
              // Logika untuk Non-Admin
              <Button width="100%" fontSize="14px" mb={8} onClick={onOpen}>
                Kontak Desa
              </Button>
            )}
          </Box>
          <RejectionModal
            isOpen={openModal}
            onClose={() => setOpenModal(false)}
            onConfirm={handleReject}
            message={modalInput}
            setMessage={setModalInput}
            loading={loading}
          />
        </ContentContainer>
      </div>
      <Drawer
        isOpen={isOpen}
        placement="bottom"
        onClose={onClose}
        variant="purple"
      >
        <DrawerOverlay />
        <DrawerContent
          sx={{
            borderRadius: "lg",
            width: "360px",
            my: "auto",
            mx: "auto",
          }}
        >
          {admin ? (
            <>
              <DrawerHeader
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  color: "#1F2937",
                  fontSize: "16px",
                }}
              >
                Apakah Anda ingin memverifikasi atau menolak permohonan ini?
              </DrawerHeader>
              <DrawerBody fontSize={12} color="#374151" paddingX={4} gap={4}>
                <Button
                  colorScheme="green"
                  width="100%"
                  mb={4}
                  onClick={handleVerify}
                  isLoading={loading}
                >
                  Verifikasi
                </Button>
                <Button
                  variant="outline"
                  colorScheme="green"
                  width="100%"
                  onClick={() => setOpenModal(true)} // Buka modal penolakan
                  _hover={{ bg: "red.500", color: "white", border: "none" }}
                >
                  Tolak
                </Button>
              </DrawerBody>
            </>
          ) : (
            <>
              <DrawerHeader
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  color: "#1F2937",
                  fontSize: "16px",
                }}
              >
                Kontak Inovator
              </DrawerHeader>
              <DrawerBody fontSize={12} color="#374151" paddingX={4} gap={4}>
                Terapkan produk inovasi desa digital dengan cara menghubungi
                inovator melalui saluran di bawah ini:
                <ButtonKontak>
                  <Icon src={Whatsapp} alt="WA" />
                  WhatsApp
                </ButtonKontak>
                <ButtonKontak>
                  <Icon src={Instagram} alt="IG" />
                  Instagram
                </ButtonKontak>
                <ButtonKontak>
                  <Icon src={Web} alt="Web" />
                  Website
                </ButtonKontak>
              </DrawerBody>
            </>
          )}
          <DrawerFooter></DrawerFooter>
        </DrawerContent>
      </Drawer>
    </Box>
  );
}
