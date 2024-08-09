import { Button, message } from "antd";
import HistoryAtRestaurant from "../OrderManagement/HistoryAtRestaurant";
import OrderHistory from ".";
import { useEffect, useState } from "react";
import Header from "../../components/Header";
import { getReturnPayment } from "../../Services/OrderAPI";
import RatingMenu from "../OrderOnline/RatingMenu";

const HistoryUserTab = () => {
  const [tab, setTab] = useState(false);
  const [isRating, setIsRating] = useState({ isOpen: false, data: null });
  const payment = JSON.parse(localStorage?.getItem("payment"));
  const dataRating = JSON.parse(localStorage?.getItem("rating"));

  const fetchReturnPayment = async (data) => {
    try {
      const res = await getReturnPayment(data);
      console.log(res);
      if (res?.status === "success") {
        message.success(res?.message);
        console.log(dataRating);
        setIsRating((pre) => ({ ...pre, isOpen: true, data: dataRating }));
      } else {
        message.error(res?.message);
      }
      console.log(res);
    } catch (err) {
      console.log(err);
    }
  };
  // useEffect(() => {
  //   if (payment) {
  //     fetchReturnPayment(payment);
  //   }
  // }, []);
  const onChangeRating = () => {
    console.log(isRating);
    setIsRating((pre) => ({ ...pre, isOpen: true, data: dataRating }));
  };
  return (
    <div className="flex flex-column gap-2">
      <Header />
      <Button onClick={() => onChangeRating()}>Rating</Button>
      {isRating.data?.order.length > 0 && (
        <RatingMenu isOpen={isRating.isOpen} data={isRating.data} />
      )}
      <div className="flex  gap-2">
        <Button
          onClick={() => setTab(false)}
          type={!tab ? "primary" : "dashed"}
        >
          Nhà hàng
        </Button>
        <Button onClick={() => setTab(true)} type={tab ? "primary" : "dashed"}>
          Online
        </Button>
      </div>
      <span className="font-medium text-lg">Lịch sử đặt món</span>
      {tab ? <OrderHistory /> : <HistoryAtRestaurant />}
    </div>
  );
};

export default HistoryUserTab;
