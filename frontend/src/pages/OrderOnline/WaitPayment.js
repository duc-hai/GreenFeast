import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const WaitPayment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryString = location.search;

  useEffect(() => {
    if (queryString) {
      console.log(queryString);
      localStorage.setItem("payment", JSON.stringify(queryString));
      navigate(`/order-history`);
    }
  }, [location]);
  return <p>Đang đợi thanh toán</p>;
};

export default WaitPayment;
