import getInstanceAxios from "./AxiosClient";

const baseDomain = "http://localhost:3000/api";
const baseURL = `${baseDomain}`;

export default getInstanceAxios(baseURL);
