import request from "../utils/request";
export const requestLoginService = (params) => {
    return request(`${process.env.REACT_APP_FOOD}/auth/signin`, {
        method: 'POST',
        data: params
    })
}
export const getUserProfileService = () => {
    return request(`${process.env.REACT_APP_USER_API}/Account/get-user-profile`, {
        method: 'GET',
    })
}