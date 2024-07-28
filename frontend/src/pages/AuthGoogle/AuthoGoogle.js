import { GoogleOutlined } from "@ant-design/icons";
import { Button } from "antd";

const AuthGoogle = () => {
  const handleLogin = () => {
    window.location.href = "https://greenfeast.space/api/auth/google";
  };
  return (
    <Button onClick={handleLogin}>
      <GoogleOutlined style={{ fontSize: "24px" }} />
    </Button>
  );
};
export default AuthGoogle;
