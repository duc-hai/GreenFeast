import { useEffect, useState } from "react";
import {
  getOrderHistoryListAdmin,
  getOrderHistoryListAtRestaurant,
  postUpdateStatus,
} from "../../Services/OrderAPI";
import { Button, message, Popconfirm, Select, Spin, Steps, Table } from "antd";
import { EditFilled } from "@ant-design/icons";
import dayjs from "dayjs";
import DetailHistory from "./DetailHistory";
import DetailHistoryAdmin from "./DetailHistoryAdmin";

const optionStatus = [
  { value: 1, label: "Đang chờ xác nhận" },
  { value: 2, label: "Đang chế biến" },
  { value: 3, label: "Đơn hàng đã sẵn sàng" },
  { value: 4, label: "Đang giao hàng" },
  { value: 5, label: "Đã giao hàng" },
  { value: 6, label: "Đã hủy" },
  { value: 7, label: "Trả món/Hoàn tiền" },
];
const HistoryOrderAdmin = () => {
  const [loading, setLoading] = useState(false);
  const [dataTable, setDataTable] = useState([]);
  const [search, setSearch] = useState({ status: null, page: 1 });
  const [updateStatus, setUpdateStatus] = useState({
    orderId: null,
    status: null,
  });
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

  const fetchUpdateStatus = async () => {
    setLoading(true);
    try {
      console.log(updateStatus);
      if (updateStatus.status < 7) {
        let body = { ...updateStatus, status: updateStatus.status + 1 };
        const res = await postUpdateStatus(body);
        if (res?.status === "success") {
          message.success(res?.message);
          fetchHistoryOderList();
          setUpdateStatus((pre) => ({ ...pre, orderId: null, status: null }));
        } else {
          message.error(res?.message);
        }
      } else {
        message.error("Không thể cập nhật trạng thái");
      }
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };
  useEffect(() => {
    fetchHistoryOderList();
  }, [search]);

  const handleChoseItem = (record) => {
    let tempStatus = [...optionStatus].find(
      (item) => item.label === record.status
    );
    console.log(tempStatus);
    setUpdateStatus((pre) => ({
      ...pre,
      orderId: record?._id,
      status: tempStatus?.value,
    }));
  };

  const handleUpdateStatus = () => {
    fetchUpdateStatus();
  };

  const statusNext = (record) => {
    let tempStatus = [...optionStatus].find(
      (item) => item.label === record.status
    );

    if (tempStatus) {
      if (tempStatus.value < optionStatus.length)
        return `Trạng thái kế tiếp : ${optionStatus[tempStatus.value].label}`;
      return `Đây là trạng thái cuối`;
    }
    return "";
  };
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
      render: (text, record) => (
        <div className="flex items-center gap-2 justify-center">
          <span>{text}</span>
          <Popconfirm
            title="Cập nhật trạng thái kế tiếp ?"
            okText="Cập nhật"
            cancelText="Đóng"
            onConfirm={handleUpdateStatus}
            description={statusNext(record)}
          >
            <EditFilled
              className="text-green-600"
              onClick={() => handleChoseItem(record)}
            />
          </Popconfirm>
        </div>
      ),
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
    <div className="flex gap-2 flex-col">
      <div className="flex gap-2 mt-2">
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
