import API from "../api/axios";

export const getTrials = async () => {
  const res = await API.get("/trials");
  return res.data?.value || res.data || [];
};

export const createTrial = async (trialData) => {
  const res = await API.post("/trials", trialData);
  return res.data;
};

export const getTrialMatches = async (trialId) => {
  const res = await API.get(`/trials/${trialId}/matches`);
  return res.data?.value || res.data || [];
};