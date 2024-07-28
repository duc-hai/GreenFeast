import { Button, Modal, Spin, Table } from "antd";
import Header from "../../components/Header";
import {
  getHistoryDetail,
  getHistoryList,
} from "../../Services/ApiOrderHistory";
import { useEffect, useState } from "react";
import { ProfileOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import FormDetailHistory from "./FormDetailHistory";

const OrderHistory = () => {
  const [listHistory, setListHistory] = useState([]);
  const [detailHistory, setDetailHistory] = useState({});
  const [detailLoading, setDetailLoading] = useState(false);
  const [isOpenDetail, setIsOpenDetail] = useState(false);
  const columns = [
    {
      title: "STT",
      dataIndex: "time",
      render: (text, record, index) => <p>{index + 1}</p>,
    },
    {
      title: "Ngày đặt món",
      dataIndex: "time",
      render: (text, record, index) => (
        <p>{dayjs(text).format("YYYY-MM-DD")}</p>
      ),
    },
    {
      title: "Giá tiền",
      dataIndex: "total",
      render: (text, record, index) => <p>{text.toLocaleString()} VNĐ</p>,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
    },
    {
      title: "Thao tác",
      dataIndex: "menu",
      render: (text, record) => (
        <ProfileOutlined onClick={() => handleOpenDetail(record?._id)} />
      ),
    },
  ];

  const fetchHistoryList = async () => {
    try {
      const res = await getHistoryList();
      console.log(res);
      setListHistory(res?.data);
    } catch (err) {
      console.log(err);
    }
  };
  //detail
  const fetchHistoryDetail = async (id) => {
    setDetailLoading(true);
    try {
      const res = await getHistoryDetail(id);
      console.log(res);
      setDetailHistory(res?.data);
    } catch (err) {
      console.log(err);
    }
    setDetailLoading(false);
  };

  const handleOpenDetail = (id) => {
    setIsOpenDetail(true);
    fetchHistoryDetail(id);
  };
  const handleClose = () => {
    setIsOpenDetail(false);
    setDetailHistory({});
  };
  useEffect(() => {
    fetchHistoryList();
  }, []);
  return (
    <>
      <Header />
      <div className="m-3">
        <span className="font-medium text-lg">Lịch sử đặt món</span>
        <Table dataSource={listHistory} columns={columns} />;
      </div>
      <Modal
        open={isOpenDetail}
        width={"1000px"}
        onCancel={handleClose}
        footer={[
          <Button type="primary" onClick={handleClose}>
            Cancel
          </Button>,
        ]}
      >
        {detailLoading ? (
          <Spin />
        ) : (
          <FormDetailHistory detailData={detailHistory} />
        )}
      </Modal>
    </>
  );
};
export default OrderHistory;
