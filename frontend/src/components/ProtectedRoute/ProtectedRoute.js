import { Navigate } from "react-router-dom";
const ProtectedRoute = ({ isAuth, children, to = "/login" }) => {
  if (!isAuth) {
    return <Navigate to={to} replace />;
  }

  return children;
};

export default ProtectedRoute;
