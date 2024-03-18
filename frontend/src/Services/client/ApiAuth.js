import getInstanceAxios from "./AxiosClient";

const baseDomain = `${process.env.REACT_APP_API}/api`;
const baseURL = `${baseDomain}`;

export default getInstanceAxios(baseURL);
