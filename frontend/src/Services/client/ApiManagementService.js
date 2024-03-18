import getInstanceAxios from "./AxiosClient";

const baseDomain = `${process.env.REACT_APP_API}/api/admin`;
const baseURL = `${baseDomain}`;

export default getInstanceAxios(baseURL);
