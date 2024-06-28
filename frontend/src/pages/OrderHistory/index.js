import { Table } from "antd";
import Header from "../../components/Header";

const OrderHistory = () => {
  const dataSource = [
    {
      key: "1",
      name: "Mike",
      age: 32,
      address: "10 Downing Street",
    },
    {
      key: "2",
      name: "John",
      age: 42,
      address: "10 Downing Street",
    },
  ];

  const columns = [
    {
      title: "Ngày đặt món",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Giá tiền",
      dataIndex: "age",
      key: "age",
    },
    {
      title: "Trạng thái",
      dataIndex: "age",
      key: "age",
    },
    {
      title: "Thao tác",
      dataIndex: "address",
      key: "address",
      render: (text, record) => <a href="javascript:;">Xem chi tiết</a>,
    },
  ];

  return (
    <>
      <Header />
      <div className="m-3">
        <span className="font-medium text-lg">Lịch sử đặt món</span>
        <Table dataSource={dataSource} columns={columns} />;
      </div>
    </>
  );
};
export default OrderHistory;
