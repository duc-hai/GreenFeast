import { useEffect, useState } from "react";
import {
  getOrderHistoryListAdmin,
  getOrderHistoryListAtRestaurant,
} from "../../Services/OrderAPI";
import { Select, Spin, Table } from "antd";
import { EditFilled } from "@ant-design/icons";
import dayjs from "dayjs";
import DetailHistory from "./DetailHistory";
import DetailHistoryAdmin from "./DetailHistoryAdmin";

const optionStatus = [
  { value: 1, label: "Đang chờ xác nhận" },
  { value: 2, label: "Đang chế biến" },
  { value: 3, label: "Đơn hàng đã sẵn sàng" },
  { value: 4, label: "Đơn hàng đã sẵn sàng" },
  { value: 5, label: "Đã giao hàng" },
  { value: 6, label: "Đã hủy" },
  { value: 7, label: "Trả món/Hoàn tiền" },
];
const HistoryOrderAdmin = () => {
  const [loading, setLoading] = useState(false);
  const [dataTable, setDataTable] = useState([]);
  const [search, setSearch] = useState({ status: null, page: 1 });
  const fetchHistoryOderList = async () => {
    setLoading(true);
    try {
      let param = `page=${search.page}`;
      if (search.status) param = `status=${search.status}&${param}`;
      const res = await getOrderHistoryListAdmin(param);
      console.log(res);
      setDataTable(res?.data);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };
  useEffect(() => {
    fetchHistoryOderList();
  }, [search]);
  const columns = [
    {
      title: "STT",
      dataIndex: "_id",
      align: "center",
      render: (text, record, index) => <span>{index + 1}</span>,
    },
    {
      title: "Thời gian",
      dataIndex: "time",
      render: (text) => (
        <span>{dayjs(text).format("YYYY-MM-DD hh:mm:ss")}</span>
      ),
      align: "center",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      align: "center",
    },
    {
      title: "Tổng tiền",
      dataIndex: "total",
      align: "center",
    },
    {
      title: "Đánh giá",
      dataIndex: "is_rating",
      align: "center",
      render: (text) => <span>{text ? "Có" : "Không"}</span>,
    },

    {
      title: "Hoạt động",
      dataIndex: "_id",
      align: "center",
      render: (text) => <DetailHistoryAdmin id={text} />,
    },
  ];
  return (
    <div>
      <div className="flex gap-2">
        <span>Trạng thái :</span>
        <Select
          allowClear
          options={[...optionStatus]}
          className="w-40"
          onChange={(e) => setSearch((pre) => ({ ...pre, status: e }))}
        />
      </div>
      {loading ? <Spin /> : <Table dataSource={dataTable} columns={columns} />}
    </div>
  );
};
export default HistoryOrderAdmin;
