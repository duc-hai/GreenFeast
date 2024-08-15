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
import RatingMenu from "../OrderOnline/RatingMenu";
import RatingOnline from "../OrderOnline/RatingOnline";

const OrderHistory = () => {
  const [listHistory, setListHistory] = useState([]);
  const [detailHistory, setDetailHistory] = useState({});
  const [detailLoading, setDetailLoading] = useState(false);
  const [isOpenDetail, setIsOpenDetail] = useState(false);
  const [loading, setLoading] = useState(false);
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
      dataIndex: "_id",
      render: (text, record) => (
        <div className="flex justify-center items-center gap-3">
          {!record?.is_rating && record?.status === "Đã giao hàng" && (
            <RatingOnline id={text} disabled={record?.is_rating} />
          )}
          <ProfileOutlined onClick={() => handleOpenDetail(record?._id)} />
        </div>
      ),
    },
  ];

  const fetchHistoryList = async () => {
    setLoading(true);
    try {
      const res = await getHistoryList();
      console.log(res);
      setListHistory(res?.data);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
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
    <div className="m-3">
      {loading ? (
        <Spin />
      ) : (
        <div>
          <Table
            dataSource={listHistory}
            columns={columns}
            scroll={{ y: "calc(100vh - 300px)" }}
          />
        </div>
      )}
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
    </div>
  );
};
export default OrderHistory;
