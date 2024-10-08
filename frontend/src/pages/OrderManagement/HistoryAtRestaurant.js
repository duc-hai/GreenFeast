import { useEffect, useState } from "react";
import { getOrderHistoryListAtRestaurant } from "../../Services/OrderAPI";
import { Spin, Table } from "antd";
import { EditFilled } from "@ant-design/icons";
import dayjs from "dayjs";
import DetailHistory from "./DetailHistory";
import RatingMenu from "../OrderOnline/RatingMenu";

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
      dataIndex: "order_person",
      align: "center",
      render: (text) => <span>{text?.name}</span>,
      responsive: ["sm"],
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
      render: (text) => <span>{text?.toLocaleString()} VNĐ</span>,
      responsive: ["sm"],
    },
    {
      title: "Tổng tiền",
      dataIndex: "subtotal",
      align: "center",
      render: (text, record) => (
        <span>
          {(record?.subtotal - record?.discount)?.toLocaleString()} VNĐ
        </span>
      ),
    },
    {
      title: "Thời gian",
      dataIndex: "checkin",
      render: (text) => (
        <span>{dayjs(text).format("YYYY-MM-DD HH:mm:ss")}</span>
      ),
      align: "center",
      responsive: ["sm"],
    },
    {
      title: "Hoạt động ",
      dataIndex: "_id",
      align: "center",
      render: (text, record) => (
        <div className="flex justify-center items-center gap-3">
          {!record?.is_rating && (
            <RatingMenu
              id={text}
              disabled={record?.is_rating}
              refetch={fetchHistoryOderList}
            />
          )}
          <DetailHistory id={text} />
        </div>
      ),
    },
  ];
  return (
    <div>
      {loading ? (
        <Spin />
      ) : (
        <Table
          dataSource={dataTable}
          columns={columns}
          scroll={{ y: "calc(100vh - 300px)" }}
        />
      )}
    </div>
  );
};
export default HistoryAtRestaurant;
