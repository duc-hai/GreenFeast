import ApiOrderService from "./client/ApiOrderService";

export const getQuantityNotifi = () => {
  return ApiOrderService.get("/notification/num-notification");
};
export const fetchDataNotifi = () => {
  return ApiOrderService.get("/notification/get-notifications");
};
export const verifyMail = (body) => {
  return ApiOrderService.post("user/verify-email", body);
};

export const verifyOtp = (body) => {
  return ApiOrderService.post("user/verify-otp-email", body);
};
