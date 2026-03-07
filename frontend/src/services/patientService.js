import API from "../api/axios";

export const getPatients = async () => {
  const res = await API.get("/patients");
  return res.data?.value || res.data || [];
};

export const addPatient = async (patientData) => {
  const res = await API.post("/patients", patientData);
  return res.data;
};