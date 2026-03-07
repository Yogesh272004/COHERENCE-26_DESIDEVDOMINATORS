import API from "../api/axios";

export const getReports = async () => {
  const res = await API.get("/reports");
  return res.data?.value || res.data || [];
};

export const createReport = async (reportData) => {
  const res = await API.post("/reports", reportData);
  return res.data;
};