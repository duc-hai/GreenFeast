import { Button, Form, Input, message, Modal, Rate } from "antd";
import { useState } from "react";
import {
  getOrderHistoryDetailAtRestaurant,
  postOrderRating,
} from "../../Services/OrderAPI";
import { EditFilled } from "@ant-design/icons";
import { getHistoryDetail } from "../../Services/ApiOrderHistory";

const RatingOnline = ({ id, disabled }) => {
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const [dataDetail, setDataDetail] = useState({
    orderId: null,
    order: [],
  });
  const fetchDetailHistory = async (idDetail) => {
    setLoading(true);
    try {
      const res = await getHistoryDetail(idDetail);
      console.log(res);
      let orderIdNew = res?.data?._id;
      let newOrder = res?.data?.menu_detail?.map((item) => ({
        menuId: item?._id,
        comment: "",
        rating: 5,
      }));
      setDataDetail((pre) => ({
        ...pre,
        orderId: orderIdNew,
        order: newOrder,
      }));
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };
  const handleClose = () => {
    // localStorage.setItem("rating", false);
    // localStorage.setItem("payment", false);
    // window.location.reload();
    setIsOpen(false);
  };
  const onChangeRating = (menuId, field, value) => {
    let orderNew = [...dataDetail?.order].map((item) => {
      if (item?.menuId === menuId) return { ...item, [field]: value };
      return item;
    });
    setDataDetail((pre) => ({ ...pre, order: orderNew }));
  };

  const fetchOrderRating = async (data) => {
    setLoading(true);
    try {
      const res = await postOrderRating(data);
      console.log(res);
      if (res?.status === "success") {
        message.success("Đánh giá đơn hàng thành công");
      } else {
        message.error("Đánh  giá đơn hàng thất bại");
      }
    } catch (err) {
      console.log(err);
      message.error("Đánh  giá đơn hàng thất bại");
    }
    setLoading(false);
  };

  const handleRating = () => {
    fetchOrderRating(dataDetail);
    handleClose();
  };
  const handleOpen = () => {
    setIsOpen(true);
    fetchDetailHistory(id);
  };
  return (
    <>
      <EditFilled
        className="text-yellow-500"
        disabled={disabled}
        onClick={handleOpen}
        size={24}
      />
      {/* <Button
        onClick={handleOpen}
        size="small"
        disabled={disabled}
        type="primary"
      >
        Danh gia
      </Button> */}
      <Modal
        open={isOpen}
        okText="Đánh giá"
        cancelText="Để lần sau"
        onOk={handleRating}
        onCancel={handleClose}
      >
        {dataDetail?.order?.map((item) => (
          <div key={item?.menuId}>
            <Rate
              value={item.rating}
              onChange={(e) => onChangeRating(item?.menuId, "rating", e)}
            />
            <Form>
              <Form.Item label="Đánh giá">
                <Input
                  onChange={(e) =>
                    onChangeRating(item?.menuId, "comment", e.target.value)
                  }
                />
              </Form.Item>
            </Form>
          </div>
        ))}
      </Modal>
    </>
  );
};
export default RatingOnline;
