import axios from "axios";

const API_URL = import.meta.env.VITE_BACKEND_URL;
const API_BASE_URL = `${API_URL}/api/certificates`;

export interface ICertificateInput {
  studentWallet: string;
  studentId: string;
  studentName: string;
  degree: string;
  major: string;
  graduationDate: string;
  issuedBy: string;
}

export const createCertificate = async (data: ICertificateInput) => {
  const response = await axios.post(`${API_BASE_URL}/`, data);
  return response.data;
};

export const uploadToIPFS = async (id: string, ipfsHash: string) => {
  const response = await axios.put(`${API_BASE_URL}/upload/${id}`, {
    ipfsHash,
  });
  return response.data;
};

export const mintCertificateOnChain = async (id: string) => {
  const response = await axios.post(`${API_BASE_URL}/mint/${id}`);
  return response.data;
};

export const fetchAllCertificates = async () => {
  const response = await axios.get(`${API_BASE_URL}/`);
  return response.data;
};
