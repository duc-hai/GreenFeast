import { Form, Input, message, Modal, Rate } from "antd";
import { useState } from "react";
import { postOrderRating } from "../../Services/OrderAPI";

const RatingMenu = ({ data, isOpen }) => {
  const [loading, setLoading] = useState(false);
  const [dataRating, setDataRating] = useState(data);
  console.log("dataRating", dataRating);
  const handleClose = () => {
    localStorage.setItem("rating", false);
    localStorage.setItem("payment", false);
    window.location.reload();
  };
  const onChangeRating = (menuId, field, value) => {
    const newRating = dataRating?.order.map((item) => {
      if (item.menuId === menuId) return { ...item, [field]: value };
      return item;
    });
    setDataRating((pre) => ({ ...pre, order: newRating }));
  };

  const fetchOrderRating = async (data) => {
    setLoading(true);
    try {
      const res = await postOrderRating(data);
      if (res?.status === "success") {
        message.success("Đánh giá đơn hàng thành công");
      }
    } catch (err) {
      console.log(err);
      message.success("Đánh giá đơn hàng thành công");
    }
    setLoading(false);
  };

  const handleRating = () => {
    console.log(dataRating);
    fetchOrderRating(dataRating);
    handleClose();
  };

  return (
    <Modal
      open={isOpen}
      okText="Đánh giá"
      cancelText="Để lần sau"
      onOk={handleRating}
      onCancel={handleClose}
    >
      {dataRating?.order?.map((item) => (
        <div>
          <Rate
            value={data.rating}
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
  );
};
export default RatingMenu;
