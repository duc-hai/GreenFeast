import { checkRoleAdmin } from "../DefaultLatout";
import ProtectedRoute from "./ProtectedRoute";

const RoleAdmin = ({ children }) => {
  const user = JSON.parse(sessionStorage.getItem("user"));

  return (
    <ProtectedRoute to="/" isAuth={checkRoleAdmin(user)}>
      {children}
    </ProtectedRoute>
  );
};

export default RoleAdmin;
