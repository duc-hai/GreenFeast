import getInstanceAxios from "./AxiosClient";

const baseDomain =
  process.env.REACT_APP_MANAGEMENTSERVICE || "http://localhost:4000/";
const baseURL = `${baseDomain}`;

export default getInstanceAxios(baseURL);
