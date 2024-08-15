import { FileSearchOutlined } from "@ant-design/icons";
import { useState } from "react";
import { getOrderHistoryDetailAdmin } from "../../Services/OrderAPI";
import { Button, Descriptions, Modal, Spin, Table } from "antd";
import dayjs from "dayjs";

const DetailHistoryAdmin = ({ id }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dataDetail, setDataDetail] = useState(null);

  const fetchDetailHistory = async (idDetail) => {
    setLoading(true);
    try {
      const res = await getOrderHistoryDetailAdmin(idDetail);
      console.log(res);
      setDataDetail(res?.data);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  const handleClose = () => {
    setIsOpen(false);
  };
  const handleOpen = () => {
    setIsOpen(true);
    fetchDetailHistory(id);
  };
  const columns = [
    {
      title: "STT",
      dataIndex: "_id",
      align: "center",
      width: 50,
      render: (text, _, index) => <span>{index + 1}</span>,
    },
    {
      title: "Món ăn",
      dataIndex: "name",
      align: "center",
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      align: "center",
      width: 100,
    },
    {
      title: "Giá tiền",
      dataIndex: "price",
      align: "center",
      width: 100,
    },
    {
      title: "Ghi chú",
      dataIndex: "note",
      width: 140,
      align: "center",
    },
  ];
  return (
    <div>
      <span onClick={handleOpen}>
        <FileSearchOutlined />
      </span>
      <Modal
        closeIcon={false}
        open={isOpen}
        width={1000}
        onCancel={handleClose}
        footer={[
          <Button onClick={handleClose} type="primary">
            Đóng
          </Button>,
        ]}
      >
        {loading ? (
          <Spin />
        ) : (
          <div className="flex flex-column gap-1 max-h-96 overflow-auto">
            <p className="font-semibold bg-lime-700 text-white p-1">
              Chi tiết lịch sử đặt hàng
            </p>
            <Descriptions bordered>
              <Descriptions.Item label="Tên" span={2}>
                {dataDetail?.delivery_information?.name}
              </Descriptions.Item>
              <Descriptions.Item label="số điện thoại">
                {dataDetail?.delivery_information?.phone_number}
              </Descriptions.Item>
              <Descriptions.Item label="Địa chỉ" span={3}>
                {`${dataDetail?.delivery_information?.address}, ${dataDetail?.delivery_information?.ward},  ${dataDetail?.delivery_information?.district},  ${dataDetail?.delivery_information?.province}`}
              </Descriptions.Item>
              <Descriptions.Item label="Người vận chuyển" span={3}>
                {dataDetail?.delivery_person?.name}
              </Descriptions.Item>
              <Descriptions.Item label="Người đặt">
                {dataDetail?.order_person?.name}
              </Descriptions.Item>
              <Descriptions.Item label="Tổng tiền">
                {dataDetail?.total}
              </Descriptions.Item>
              <Descriptions.Item label="Phí ship">
                {dataDetail?.shippingfee}
              </Descriptions.Item>
              <Descriptions.Item label="Ghi chú ">
                {dataDetail?.note}
              </Descriptions.Item>
              <Descriptions.Item label="Thời gian">
                {dayjs(dataDetail?.time).format("YYYY-MM-DD HH:mm:ss")}
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái ">
                {dataDetail?.status}
              </Descriptions.Item>
            </Descriptions>
            <div>
              <p className="font-semibold">Chi tiết món ăn</p>
              <Table
                columns={columns}
                dataSource={dataDetail?.menu_detail}
                pagination={false}
              />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
export default DetailHistoryAdmin;
