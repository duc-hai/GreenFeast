import { useEffect, useState } from "react";
import { getOrderHistoryListAtRestaurant } from "../../Services/OrderAPI";
import { Spin, Table } from "antd";
import { EditFilled } from "@ant-design/icons";
import dayjs from "dayjs";
import DetailHistory from "./DetailHistory";

const HistoryAtRestaurant = () => {
  const [loading, setLoading] = useState(false);
  const [dataTable, setDataTable] = useState([]);
  const fetchHistoryOderList = async () => {
    setLoading(true);
    try {
      const res = await getOrderHistoryListAtRestaurant();
      console.log(res);
      setDataTable(res?.data);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };
  useEffect(() => {
    fetchHistoryOderList();
  }, []);
  const columns = [
    {
      title: "Tài khoản",
      dataIndex: "user_id",
      align: "center",
    },
    {
      title: "Bàn",
      dataIndex: "table",
      align: "center",
    },
    {
      title: "Giảm giá",
      dataIndex: "discount",
      align: "center",
    },
    {
      title: "Tổng tiền",
      dataIndex: "subtotal",
      align: "center",
    },
    {
      title: "Thời gian",
      dataIndex: "checkin",
      render: (text) => (
        <span>{dayjs(text).format("YYYY-MM-DD hh:mm:ss")}</span>
      ),
      align: "center",
    },
    {
      title: "Hoạt động",
      dataIndex: "_id",
      align: "center",
      render: (text) => <DetailHistory id={text} />,
    },
  ];
  return (
    <div>
      {loading ? <Spin /> : <Table dataSource={dataTable} columns={columns} />}
    </div>
  );
};
export default HistoryAtRestaurant;