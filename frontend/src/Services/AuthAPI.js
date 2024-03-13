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
export const loginGoogle = () => {
  return ApiAuth.post("/auth/google");
};

export const createStaff = (body) => {
  return ApiAuth.post("/admin/create-employee", body);
};

export const getEmployee = () => {
  return ApiAuth.get("/admin/get-employees");
};
export const editUserCustomer = (body) => {
  return ApiAuth.patch("/user/update", body);
};

export const updateStaff = (body) => {
  return ApiAuth.patch("/admin/user/update", body);
};
