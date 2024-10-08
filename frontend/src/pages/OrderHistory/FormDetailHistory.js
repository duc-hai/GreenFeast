import { Descriptions, Table } from "antd";
import dayjs from "dayjs";
import { useEffect } from "react";

const FormDetailHistory = ({ detailData }) => {
  const columns = [
    {
      title: "STT",
      dataIndex: "_id",
      render: (text, record, index) => <p>{index + 1}</p>,
      responsive: ["sm"],
    },
    {
      title: "Món ăn",
      dataIndex: "name",
    },
    {
      title: "Giá",
      dataIndex: "price",
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
    },
  ];
  // useEffect(() => {
  //   console.log(detailData);
  // }, []);
  return (
    <div className="flex flex-col gap-5 max-h-96 overflow-auto">
      <Descriptions
        title="Thông tin giao hàng"
        bordered
        column={{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}
      >
        <Descriptions.Item label="Địa chỉ" span={2}>
          <span>{detailData?.delivery_information?.address}</span>,
          <span> {detailData?.delivery_information?.ward}</span>,
          <span> {detailData?.delivery_information?.district}</span>,
          <span> {detailData?.delivery_information?.province}</span>
        </Descriptions.Item>
        <Descriptions.Item label="Người đặt hàng">
          {detailData?.order_person?.name}
        </Descriptions.Item>
        <Descriptions.Item label="Số điện thoại">
          {detailData?.delivery_information?.phone_number}
        </Descriptions.Item>
        <Descriptions.Item label="Phương thức thanh toán">
          {detailData?.payment_method === "cod"
            ? "Thanh toán khi nhận hàng"
            : "Thanh toán online"}
        </Descriptions.Item>
        <Descriptions.Item label="Trạng thái">
          {detailData?.status}
        </Descriptions.Item>
        <Descriptions.Item label="Phí ship">
          {detailData?.shippingfee}
        </Descriptions.Item>
        <Descriptions.Item label="Tiền đơn hàng">
          {detailData?.subtotal}
        </Descriptions.Item>
        <Descriptions.Item label="Người vận chuyển">
          {`${detailData?.delivery_person?.name || ""} ${
            detailData?.delivery_person?.phone || ""
          }`}
        </Descriptions.Item>
        <Descriptions.Item label="Thời gian">
          {dayjs(detailData?.time).format("YYYY-MM-DD HH:mm:ss")}
        </Descriptions.Item>
      </Descriptions>

      <div>
        <p className="font-semibold">Danh sách món ăn</p>
        <Table
          columns={columns}
          dataSource={detailData?.menu_detail}
          pagination={false}
          bordered
        ></Table>
      </div>
      <div>
        <p className="font-semibold">
          Tổng tiền:{" "}
          <span className="text-rose-600">
            {detailData?.total?.toLocaleString()} VNĐ
          </span>
        </p>
      </div>
    </div>
  );
};
export default FormDetailHistory;
