import apiLocation from "./apiLocation";

interface dataLokasi {
  id: string;
  name: string;
  // include other properties as needed
}

const formatText = (text: string): string => {
  const words = text.split(" ");
  const formattedWords = words.map((word) => {
    if (word.toUpperCase() === "KABUPATEN") {
      return "Kabupaten";
    } else if (word.toUpperCase() === "KOTA") {
      return "Kota";
    } else {
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    }
  });
  return formattedWords.join(" ");
};

export const getProvinsi = async () => {
  try {
    const response = await apiLocation("/provinces.json");
    return response;
  } catch (error) {
    console.error("Error fetching provinces:", error);
    throw error;
  }
};

export const getKabupaten = async (idProvinsi: string) => {
  if (!idProvinsi) {
    console.error("Provinsi ID is undefined");
    return [];
  }
  return await apiLocation(`/regencies/${idProvinsi}.json`);
};

export const getKecamatan = async (idKota: string) => {
  if (!idKota) {
    console.error("Kota ID is undefined");
    return [];
  }
  return await apiLocation(`/districts/${idKota}.json`);
};

export const getKelurahan = async (idKecamatan: string) => {
  if (!idKecamatan) {
    console.error("Kecamatan ID is undefined");
    return [];
  }
  return await apiLocation(`/villages/${idKecamatan}.json`);
};

export const getNamaProvinsi = async (provinceId: string): Promise<string> => {
  if (!provinceId) {
    console.error("Province ID is undefined");
    return "Unknown Province";
  }
  try {
    const response = await apiLocation(`province/${provinceId}.json`);
    const responseData = 'data' in response ? response.data : response;
    return responseData && responseData.name ? formatText(responseData.name) : "Unknown Province";
  } catch (error) {
    console.error("Error fetching province name:", error);
    return "Unknown Province";
  }
};

export const getNamaKabupaten = async (districtId: string): Promise<string> => {
  if (!districtId) {
    console.error("District ID is undefined");
    return "Unknown District";
  }
  try {
    const response = await apiLocation(`regency/${districtId}.json`);
    const responseData = 'data' in response ? response.data : response;
    return responseData && responseData.name ? formatText(responseData.name) : "Unknown District";
  } catch (error) {
    console.error("Error fetching district name:", error);
    return "Unknown District";
  }
};

export const getNamaKecamatan = async (subDistrictId: string): Promise<string> => {
  if (!subDistrictId) {
    console.error("Sub-District ID is undefined");
    return "Unknown Sub-District";
  }
  try {
    const response = await apiLocation(`district/${subDistrictId}.json`);
    const responseData = 'data' in response ? response.data : response;
    return responseData && responseData.name ? formatText(responseData.name) : "Unknown Sub-District";
  } catch (error) {
    console.error("Error fetching sub-district name:", error);
    return "Unknown Sub-District";
  }
};

export const getNamaKelurahan = async (villageId: string): Promise<string> => {
  if (!villageId) {
    console.error("Village ID is undefined");
    return "Unknown Village";
  }
  try {
    const response = await apiLocation(`village/${villageId}.json`);
    const responseData = 'data' in response ? response.data : response;
    return responseData && responseData.name ? formatText(responseData.name) : "Unknown Village";
  } catch (error) {
    console.error("Error fetching village name:", error);
    return "Unknown Village";
  }
};