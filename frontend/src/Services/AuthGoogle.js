import ApiOrderService from "./client/ApiOrderService";

export const getAuthGoogle = () => {
  return ApiOrderService.get(`/auth/google`);
};
