import { Button, message, Select, Spin, Table } from "antd";
import { useState } from "react";
import { patchUpdateProcessStatus } from "../../Services/ManagementServiceAPI";

const optionUpDateStatus = [
  {
    value: "1",
    label: "Đang chế biến",
  },
  {
    value: "2",
    label: "Đã lên món",
  },
  {
    value: "3",
    label: "Đã hủy",
  },
];

const ListMeal = ({ data, orderId, orderDetailId }) => {
  const [orderStatus, setOrderStatus] = useState({
    orderId: orderId,
    orderDetailId: orderDetailId,
    menuId: null,
    status: null,
  });
  const [loading, setLoading] = useState(false);
  const handleOnchangeStatus = (menuId, statusId) => {
    setOrderStatus((pre) => ({
      ...pre,
      menuId: menuId,
      status: Number(statusId),
    }));
  };

  const updateStatus = () => {
    fetchUpdateProcessStatus(orderStatus);
  };

  const fetchUpdateProcessStatus = async (data) => {
    setLoading(true);
    try {
      const res = await patchUpdateProcessStatus(data);
      console.log(res);
      setOrderStatus((pre) => ({ ...pre, status: null, menuId: null }));
      if (res?.status === "error") {
        message.error(res?.message);
      } else {
        message.success("Cập nhật trạng thái thành công");
      }
    } catch (err) {
      console.log(err);
      message.error("Cập nhật trạng thái thất bại");
    }
    setLoading(false);
  };

  const columnOrder = [
    {
      title: "Tên món",
      dataIndex: "name",
      key: "name",
      align: "center",
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      align: "center",
      render: (text, record) => {
        return record.price?.toLocaleString("vi-VN", {});
      },
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      align: "center",
    },
    {
      title: "Ghi chú",
      dataIndex: "note",
      key: "note",

      align: "center",
    },
    {
      title: <span className="flex justify-center">Trạng thái</span>,
      dataIndex: "processing_status",
      key: "processing_status",
      render: (text, record) => (
        <span className="flex items-center justify-center gap-2">
          <Select
            showSearch
            optionFilterProp="value"
            defaultValue={String(1)}
            className="w-full"
            options={optionUpDateStatus}
            onChange={(e) => handleOnchangeStatus(record._id, e)}
          />
          {orderStatus.menuId === record?._id && loading ? (
            <Spin />
          ) : (
            <Button
              type="primary"
              onClick={updateStatus}
              //   disabled={orderStatus.menuId !== record?._id}
            >
              Cập nhật
            </Button>
          )}
        </span>
      ),
      width: 250,
    },
  ];
  return (
    <Table
      columns={columnOrder}
      pagination={false}
      dataSource={data}
      scroll={{ x: "max-content" }}
    />
  );
};

export default ListMeal;
