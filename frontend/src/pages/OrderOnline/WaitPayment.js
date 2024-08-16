import { Button, Card, message, Modal, Result, Spin } from "antd";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getReturnPayment } from "../../Services/OrderAPI";
import { CheckCircleOutlined, CloseCircleFilled } from "@ant-design/icons";

const WaitPayment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryString = location.search;
  const [loading, setLoading] = useState(false);
  const { isError, setIsError } = useState(1);

  const fetchPaymentReturn = async () => {
    setLoading(true);
    try {
      const res = await getReturnPayment(queryString);
      if (res?.status === "success") {
        message.success(res?.message || "Giao dịch thành công");
        setIsError(2);
      } else {
        message.error(res?.message || "Giao dịch thất bại");
        setIsError(3);
      }
      console.log(res);
    } catch (err) {
      message.error("Giao dịch thất bại");
    }
    setLoading(false);
  };
  const handleClick = () => {
    fetchPaymentReturn();
  };
  // useEffect(() => {
  //   if (queryString) {
  //     handleClick();
  //   }
  // }, []);
  const handleNext = () => {
    navigate(`/order-history`);
  };
  return (
    <p>
      <div className="flex justify-center items-center p-40 bg-slate-200 w-screen h-screen">
        <Button onClick={handleClick} type="primary">
          Kiểm tra thanh toán
        </Button>
      </div>

      <div>
        {isError === 2 && (
          <Result
            status="success"
            title="Giao dịch thành công"
            subTitle="Kính chúc quý khác có bữa ăn ngon miệng!"
            extra={[
              <Button type="primary" key="consoleSuccess" onClick={handleNext}>
                Chuyển tới lịch sử đặt hàng
              </Button>,
            ]}
          />
        )}
        {isError === 3 && (
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
    </p>
  );
};

export default WaitPayment;
