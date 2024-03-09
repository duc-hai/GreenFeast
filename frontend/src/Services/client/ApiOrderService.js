import getInstanceAxios from "./AxiosClient";

const baseDomain =
  process.env.REACT_APP_ORDERSERVICE || "http://localhost:5000/api";
const baseURL = `${baseDomain}`;

export default getInstanceAxios(baseURL);
