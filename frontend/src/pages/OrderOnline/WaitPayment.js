import { Button, message, Result, Spin } from "antd";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getReturnPayment } from "../../Services/OrderAPI";

const WaitPayment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryString = location.search;
  const [loading, setLoading] = useState(false);
  const [check, setCheck] = useState(false);

  const fetchPaymentReturn = async (url) => {
    setLoading(true);
    try {
      const res = await getReturnPayment(url);
      if (res?.status === "success") {
        message.success("Giao dịch thành công ");
        setCheck(true);
      } else {
        message.error("Giao dịch thất bại ");
      }
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPaymentReturn(queryString);
  }, []);

  const handleNext = () => {
    navigate(`/order-history`);
  };

  const handleLogin = () => {
    navigate(`/login`);
  };
  const handleCheckLogin = () => {
    let user = JSON.parse(sessionStorage.getItem("user"));
    if (user?._id) {
      return (
        <Button type="primary" key="consoleSuccess" onClick={handleNext}>
          Chuyển tới lịch sử đặt hàng
        </Button>
      );
    }
    return (
      <Button type="primary" key="co2" onClick={handleLogin}>
        Vui lòng đăng nhập để xem lịch sử đặt hàng
      </Button>
    );
  };
  return (
    <p>
      {loading ? (
        <Spin></Spin>
      ) : (
        <div>
          {check ? (
            <Result
              status="success"
              title="Giao dịch thành công"
              subTitle="Cảm ơn quý khách đã ủng hộ nhà hàng!"
              extra={[handleCheckLogin()]}
            />
          ) : (
            <Result
              status="error"
              title="Giao dịch thất bai"
              subTitle="Vui lòng kiểm tra lại thanh toán!"
              extra={[handleCheckLogin()]}
            />
          )}
        </div>
      )}
    </p>
  );
};

export default WaitPayment;
