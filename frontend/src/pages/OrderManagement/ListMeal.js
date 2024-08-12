import { Button, message, Select, Spin, Table } from "antd";
import { useState } from "react";
import {
  deleteUpdateProcessStatus,
  patchUpdateProcessStatus,
} from "../../Services/ManagementServiceAPI";

const optionUpDateStatus = [
  {
    value: 0,
    label: "Đang chế biến",
  },
  {
    value: 1,
    label: "Đã lên món",
  },
];

const ListMeal = ({ data, orderId, orderDetailId, total, setIsOpen }) => {
  const [loading, setLoading] = useState(false);

  const updateStatus = (orderStatus) => {
    fetchUpdateProcessStatus(orderStatus);
  };
  const deleteUpdateStatus = (record) => {
    let data = {
      orderId: orderId,
      orderDetailId: orderDetailId,
      menuId: record?._id,
    };
    fetchDeleteUpdateProcessStatus(data);
  };

  const fetchUpdateProcessStatus = async (data) => {
    setLoading(true);
    try {
      const res = await patchUpdateProcessStatus(data);

      if (res?.status === "error") {
        message.error(res?.message);
      } else {
        message.success("Cập nhật trạng thái thành công");
        setIsOpen((pre) => !pre);
      }
    } catch (err) {
      console.log(err);
      message.error("Cập nhật trạng thái thất bại");
    }
    setLoading(false);
  };
  const fetchDeleteUpdateProcessStatus = async (data) => {
    setLoading(true);
    try {
      const res = await deleteUpdateProcessStatus(data);

      // setOrderStatus((pre) => ({ ...pre, status: null, menuId: null }));
      if (res?.status === "error") {
        message.error(res?.message);
      } else {
        message.success("Cập nhật trạng thái thành công");
        setIsOpen((pre) => !pre);
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
      render: (text, record) => (
        <span onClick={() => console.log(record)}>{text}</span>
      ),
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
          {/* <Select
            showSearch
            optionFilterProp="value"
            defaultValue={String(1)}
            className="w-full"
            options={optionUpDateStatus}
            onChange={(e) => handleOnchangeStatus(record._id, e)}
          /> */}
          <p onClick={() => console.log(record)}>
            {optionUpDateStatus[text].label}
          </p>
          {loading ? (
            <Spin />
          ) : (
            <div className="flex gap-2">
              <Button
                type="primary"
                onClick={() =>
                  updateStatus({
                    orderId: orderId,
                    orderDetailId: orderDetailId,
                    menuId: record?._id,
                    status: text === 0 ? 1 : 0,
                  })
                }
                //   disabled={orderStatus.menuId !== record?._id}
              >
                Cập nhật
              </Button>
              {
                <Button
                  type="link"
                  onClick={() => deleteUpdateStatus(record)}
                  disabled={!(total >= 500000 || total * -1 >= 500000)}
                >
                  Hủy
                </Button>
              }
            </div>
          )}
        </span>
      ),
      width: 300,
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
