import { useEffect, useState } from "react";
import {
  getOrderHistoryListAdmin,
  getOrderHistoryListAtRestaurant,
  postSendTMS,
  postUpdateStatus,
} from "../../Services/OrderAPI";
import {
  Button,
  Menu,
  message,
  Popconfirm,
  Select,
  Spin,
  Steps,
  Table,
} from "antd";
import {
  CheckCircleFilled,
  CheckCircleOutlined,
  ClockCircleFilled,
  ClockCircleOutlined,
  CloseCircleFilled,
  CloseCircleOutlined,
  CloseOutlined,
  ContactsFilled,
  ContactsOutlined,
  DeleteFilled,
  EditFilled,
  IssuesCloseOutlined,
  MailOutlined,
  PauseCircleFilled,
  UndoOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import DetailHistory from "./DetailHistory";
import DetailHistoryAdmin from "./DetailHistoryAdmin";
import { icons } from "antd/es/image/PreviewGroup";
import RatingMenu from "../OrderOnline/RatingMenu";

const optionStatus = [
  { value: 1, label: "Đang chờ xác nhận" },
  { value: 2, label: "Đang chế biến" },
  { value: 3, label: "Đơn hàng đã sẵn sàng" },
  { value: 4, label: "Đang giao hàng" },
  { value: 5, label: "Đã giao hàng" },
  { value: 7, label: "Giao không thành công " },
  { value: 6, label: "Đã hủy" },
];
const HistoryOrderAdmin = () => {
  const [loading, setLoading] = useState(false);
  const [dataTable, setDataTable] = useState([]);
  const [search, setSearch] = useState({ status: null, page: null });
  const [totalElement, setTotalElement] = useState(0);
  const [updateStatus, setUpdateStatus] = useState({
    orderId: null,
    status: null,
  });
  const fetchHistoryOderList = async () => {
    setLoading(true);
    try {
      // let param = `page=${search.page}`;
      let param = "";
      if (search.page) param = `page=${search.page}`;
      if (search.status) param = `status=${search.status}&${param}`;
      const res = await getOrderHistoryListAdmin(param);
      console.log(res);
      setDataTable(res?.data);
      setTotalElement(res?.pagination?.totalItem);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  const fetchSendTms = async (data) => {
    setLoading(true);
    try {
      const res = await postSendTMS(data);
      if (res?.status === "success")
        message.success(
          res?.message || "Cập nhật trạng thái gửi hàng thành công"
        );
      else {
        message.error(res?.message || "Cập nhật trạng thái gửi hàng thất bại");
      }
    } catch (err) {
      message.error("Cập nhật trạng thái gửi hàng thất bại");
      console.log(err);
    }
    setLoading(false);
  };

  const fetchUpdateStatus = async () => {
    setLoading(true);
    try {
      console.log(updateStatus);
      if (updateStatus.status <= 7) {
        let body = { ...updateStatus, status: updateStatus.status };
        const res = await postUpdateStatus(body);
        if (res?.status === "success") {
          message.success(res?.message);
          await fetchHistoryOderList();

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

  const handleSendTms = (data) => {
    fetchSendTms(data);
  };
  const handleChoseItem = (record) => {
    let tempStatus = [...optionStatus].find(
      (item) => item.label === record.status
    );
    console.log(tempStatus);
    setUpdateStatus((pre) => ({
      ...pre,
      orderId: record?._id,
      status: tempStatus?.value + 1,
    }));
  };
  const handleCancelShipment = (record) => {
    setUpdateStatus((pre) => ({
      ...pre,
      orderId: record?._id,
      status: 6,
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
      key: "_id",
      align: "center",
      render: (text, record, index) => <span>{index + 1}</span>,
      width: 70,
    },
    {
      title: "Mã đơn hàng",
      dataIndex: "_id",
      key: "_id",
      align: "center",
    },
    {
      title: "Thời gian",
      key: "time",
      dataIndex: "time",
      render: (text) => (
        <span>{dayjs(text).format("YYYY-MM-DD HH:mm:ss")}</span>
      ),
      align: "center",
    },
    {
      title: "Trạng thái món ăn",
      key: "status",
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
          {text === optionStatus[0].label && (
            <Popconfirm
              title="Cập nhật trạng thái hủy đơn hàng?"
              okText="Cập nhật"
              cancelText="Đóng"
              onConfirm={handleUpdateStatus}
              description={"Đơn hàng sẽ bị hủy nếu bạn xác nhận"}
            >
              <CloseOutlined
                className="text-red-600"
                onClick={() => handleCancelShipment(record)}
              />
            </Popconfirm>
          )}
        </div>
      ),
    },
    {
      title: "Trạng thái gửi hàng",
      key: "send_tms",
      dataIndex: "send_tms",
      align: "center",
      render: (text, record) =>
        record?.status === optionStatus[2].label && (
          <div className="flex gap-2 items-center justify-center">
            {text ? (
              <span>Đã gửi</span>
            ) : (
              <div className="flex gap-2 items-center justify-center">
                <span className="text-red-600">Chưa gửi</span>
                <Button
                  type="primary"
                  size="small"
                  onClick={() => handleSendTms({ orderId: record?._id })}
                >
                  Gửi hàng
                </Button>
              </div>
            )}
          </div>
        ),
    },
    {
      title: "Tổng tiền",
      key: "total",
      dataIndex: "total",
      align: "center",
      render: (text) => <span>{text.toLocaleString()} đ</span>,
      width: 120,
    },

    {
      title: "Hoạt động",
      dataIndex: "_id",
      key: "_id",
      align: "center",
      width: 120,
      render: (text, record) => (
        <div className="flex justify-center items-center gap-3">
          <DetailHistoryAdmin id={text} />
        </div>
      ),
    },
  ];

  const items = [
    { key: "all", label: "Tất cả" },
    {
      key: 1,
      label: "Đang chờ xác nhận",
      icon: <ContactsFilled style={{ color: "#cccccc" }} />,
    },
    {
      key: 2,
      label: "Đang chế biến",
      icon: <PauseCircleFilled style={{ color: "#cccccc" }} />,
    },
    {
      key: 3,
      label: "Đơn hàng đã sẵn sàng",
      icon: <CheckCircleFilled style={{ color: "#cccccc" }} />,
    },
    {
      key: 4,
      label: "Đang giao hàng",
      icon: <ClockCircleFilled style={{ color: "#cccccc" }} />,
    },
    {
      key: 5,
      label: "Đã giao hàng",
      icon: <IssuesCloseOutlined style={{ color: "#cccccc" }} />,
    },
    {
      key: 7,
      label: "Giao không thành công ",
      icon: <UndoOutlined style={{ color: "#cccccc" }} />,
    },
    {
      key: 6,
      label: "Đã hủy",
      icon: <CloseCircleFilled style={{ color: "#cccccc" }} />,
    },
  ];

  const onClickMenu = (e) => {
    if (e === "all") {
      setSearch((pre) => ({ ...pre, status: null, page: 1 }));
    } else {
      setSearch((pre) => ({ ...pre, status: e, page: 1 }));
    }
  };
  return (
    <div className="flex gap-2 flex-col">
      <div className="flex gap-2 mt-2 flex-col ">
        {/* <span>Trạng thái :</span> */}
        <Menu
          onClick={(e) => onClickMenu(e?.key)}
          mode="horizontal"
          items={items}
          className="flex justify-between"
        />
      </div>
      {loading ? (
        <Spin />
      ) : (
        <Table
          dataSource={dataTable || []}
          loading={loading}
          columns={columns}
          scroll={{ y: "calc(100vh - 410px)" }}
          pagination={{
            total: totalElement,
            current: search.page,
            onChange: (page) =>
              setSearch((pre) => ({ ...pre, page: page, status: null })),
          }}
        />
      )}
    </div>
  );
};
export default HistoryOrderAdmin;
