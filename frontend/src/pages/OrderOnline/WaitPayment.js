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
              subTitle="Kính chúc quý khác có bữa ăn ngon miệng!"
              extra={[
                <Button
                  type="primary"
                  key="consoleSuccess"
                  onClick={handleNext}
                >
                  Chuyển tới lịch sử đặt hàng
                </Button>,
              ]}
            />
          ) : (
            <Result
              status="error"
              title="Giao dịch thất bai"
              subTitle="Vui lòng kiểm tra lại thanh toán!"
              extra={[
                <Button type="primary" key="consoleError" onClick={handleNext}>
                  Chuyển tới lịch sử đặt hàng
                </Button>,
              ]}
            />
          )}
        </div>
      )}
    </p>
  );
};

export default WaitPayment;
