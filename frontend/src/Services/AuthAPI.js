import ApiAuth from "./client/ApiAuth";

export const createUser = (body) => {
  return ApiAuth.post("/auth/signup", body);
};
export const loginUser = (body) => {
  return ApiAuth.post("/auth/signin", body);
};
export const loginAdmin = (body) => {
  return ApiAuth.post("/admin/auth/signin", body);
};
export const getResource = () => {
  return ApiAuth.get("/admin/get-resource-rbac");
};
