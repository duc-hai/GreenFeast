import { useEffect, useState } from "react";
import { Button, Space, Table } from "antd";

import { getBillHistory, getHistoryOrder } from "../../Services/OrderAPI";

const HistoryOrder = () => {
  const [listData, setListData] = useState([]);
  const [idBill, setIdBill] = useState("");
  const fetchData = async () => {
    try {
      const res = await getHistoryOrder();
      setListData(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const exportBillHistory = async (id) => {
    try {
      const res = await getBillHistory(id);
      if (res.status === "success") {
        window.open(res.data, "_blank");
      } else {
        console.log("Error:", res.message);
      }
    } catch (error) {
      console.log(error);
    }
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
      render: (total) => (
        <span className="font-semibold">{total ? total : "Không có"}</span>
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
    <div className="content-component">
      <div className="flex justify-between bg-[#5c9f67] p-2 rounded-sm">
        <div className="text-xl font-semibold pl-2 text-white">
          Lịch sử order
        </div>
      </div>

      <br />
      <br />
      <Table
        columns={columns}
        dataSource={listData?.map((item, index) => {
          return { ...item, key: index };
        })}
        pagination={false}
        scroll={{ x: "max-content" }}
      />
    </div>
  );
};

export default HistoryOrder;
