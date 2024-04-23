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

export const getProvinsi = async () => await apiLocation("/provinces.json");
export const getKabupaten = async (idProvinsi: string) =>
  await apiLocation(`/regencies/${idProvinsi}.json`);
export const getKecamatan = async (idKota: string) =>
  await apiLocation(`/districts/${idKota}.json`);
export const getKelurahan = async (idKecamatan: string) =>
  await apiLocation(`/villages/${idKecamatan}.json`);

export const getNamaProvinsi = async (provinceId: string): Promise<string> => {
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
  try {
    const response = await apiLocation(`village/${villageId}.json`);
    const responseData = 'data' in response ? response.data : response;
    return responseData && responseData.name ? formatText(responseData.name) : "Unknown Village";
  } catch (error) {
    console.error("Error fetching village name:", error);
    return "Unknown Village";
  }
};  