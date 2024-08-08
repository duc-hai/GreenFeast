import { EditFilled } from "@ant-design/icons";
import { Button, message, Modal, Rate, Spin, Table } from "antd";
import { useEffect, useState } from "react";
import { getListRatingId } from "../../Services/ApiOrderHistory";
import dayjs from "dayjs";

const ListRating = ({ id }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const [totalElement, setTotalElement] = useState(0);
  const [pagination, setPagination] = useState(1);
  const fetchListRatingId = async (idMeal, page) => {
    setIsLoading(true);
    try {
      const res = await getListRatingId(idMeal, page);
      if (res?.status === "success") {
        setData(res?.data);
        setTotalElement(Number(res?.pagination?.totalPage) * 10);
        message.success(
          res?.message || "Lấy danh sách đánh giá món ăn thành công"
        );
      } else {
        message.error(res?.message || "Lấy danh sách đánh giá món ăn thất bại");
      }
    } catch (err) {
      console.log(err);
    }
    setIsLoading(false);
  };
  const handleOpen = () => {
    fetchListRatingId(id, pagination);
    setIsOpen(true);
  };

  const handleCancel = () => {
    setIsOpen(false);
    setPagination(1);
  };

  const columns = [
    {
      title: "Họ tên",
      dataIndex: "user_name",
      key: "user_name",
    },
    {
      title: "Bình luận",
      dataIndex: "comment",
      key: "comment",
    },
    {
      title: "Chất lượng",
      dataIndex: "rating",
      key: "rating",
      render: (text) => <Rate value={text} />,
    },
    {
      title: "Thời gian",
      dataIndex: "timestamp",
      key: "timestamp",
      render: (text) => (
        <span>{dayjs(text).format("YYYY-MM-DD HH:mm:ss")}</span>
      ),
    },
  ];

  useEffect(() => {
    if (isOpen) fetchListRatingId(id, pagination);
  }, [pagination]);
  return (
    <div>
      <Button type="primary" onClick={handleOpen}>
        Xem chi tiết
      </Button>
      <Modal
        width={800}
        closeIcon={false}
        open={isOpen}
        footer={[
          <Button onClick={handleCancel} type="primary">
            Đóng
          </Button>,
        ]}
      >
        {isLoading ? (
          <Spin />
        ) : (
          <Table
            columns={columns}
            dataSource={data}
            pagination={{
              total: totalElement,
              current: pagination,
              onChange: (page) => setPagination(page),
            }}
          />
        )}
      </Modal>
    </div>
  );
};
export default ListRating;
