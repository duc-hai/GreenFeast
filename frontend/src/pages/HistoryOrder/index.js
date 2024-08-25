import { useEffect, useState } from "react";
import { Button, Space, Table } from "antd";
import { getBillHistory, getHistoryOrder } from "../../Services/OrderAPI";
import dayjs from "dayjs";

const HistoryOrder = () => {
  const [listData, setListData] = useState([]);
  const [idBill, setIdBill] = useState("");
  const [loading, setLoading] = useState(false);
  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await getHistoryOrder();
      setListData(res.data);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };
  useEffect(() => {
    fetchData();
  }, []);

  const exportBillHistory = async (id) => {
    try {
      setLoading(true);
      const res = await getBillHistory(id);
      if (res.status === "success") {
        window.open(res.data, "_blank");
      } else {
        console.log("Error:", res.message);
      }
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };
  useEffect(() => {
    if (idBill) {
      exportBillHistory(idBill);
    }
  }, [idBill]);
  const columns = [
    {
      title: "Tên",
      dataIndex: "table",
      key: "table",
      width: 100,
      render: (name) => <span className="font-semibold">{name}</span>,
    },
    {
      title: "Tổng giá",
      dataIndex: "total",
      key: "total ",
      render: (total) => <span className="font-semibold">{total}</span>,
    },
    {
      title: "Ghi chú",
      dataIndex: "note",
      key: "note ",
      responsive: ["md"],
      render: (total) => (
        <span className="font-semibold">{total ? total : "Không có"}</span>
      ),
    },
    {
      title: "Checkout",
      dataIndex: "checkout",
      responsive: ["sm"],
      key: "checkout ",
      render: (checkout) => (
        <span className="font-semibold">
          {dayjs(checkout).format("DD/MM/YYYY - HH:mm:ss")}
        </span>
      ),
    },
    {
      title: "Thao tác",
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="primary"
            onClick={() => {
              setIdBill(record._id);
            }}
          >
            Xuất hóa đơn
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="content-component flex-1">
      <div className="flex justify-between bg-[#5c9f67] p-2 rounded-sm">
        <div className="text-xl font-semibold pl-2 text-white">
          Lịch sử order
        </div>
      </div>

      <br />
      <br />
      <Table
        columns={columns}
        loading={loading}
        dataSource={listData?.map((item, index) => {
          return { ...item, key: index };
        })}
        pagination={false}
        scroll={{ y: "calc(100vh - 320px)" }}
      />
    </div>
  );
};

export default HistoryOrder;
