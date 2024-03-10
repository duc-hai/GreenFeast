import getInstanceAxios from "./AxiosClient";

const baseDomain = "http://localhost:5000";
const baseURL = `${baseDomain}`;

export default getInstanceAxios(baseURL);
