import axios from "axios";
const url = {
    baseURL: "https://61d6f33735f71e0017c2e91a.mockapi.io",
    reactjs07: "/blogData1",
    reactjs08: "/reactJS08",
}
const instance = axios.create({
    baseURL: url.baseURL,
    headers: {
        "Content-Type": "application/json; charset=UTF-8",
        "Accept": "application/json"
    },
})

const api = {
    url,
    instance,
    get: instance.get,
    post: instance.post,
    put: instance.put,
    delete: instance.delete
}
export default api;