import ApiAuth from "./client/ApiAuth";

export const createUser = (body) => {
  return ApiAuth.post("/auth/signup", body);
};
export const loginUser = (body) => {
  return ApiAuth.post("/auth/signin", body);
};
