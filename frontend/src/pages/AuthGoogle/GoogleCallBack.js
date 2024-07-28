import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const GoogleCallback = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const data = query.get("data");
    console.log(data);
    if (data) {
      const decodedData = JSON.parse(decodeURIComponent(data));
      navigate("/order-online");
      const userData = decodedData?.user;
      console.log(userData);
      sessionStorage.setItem("user", JSON.stringify(userData));
      // Thực hiện các xử lý cần thiết với access_token, refresh_token và user
      console.log(decodedData);
    }
  }, [location]);

  return <div>Đăng nhập thành công! Đang chuyển hướng...</div>;
};

export default GoogleCallback;
