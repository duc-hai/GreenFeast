import { Button, Checkbox, message, Select, Spin, Table } from "antd";
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

const ListMeal = ({
  id,
  data,
  orderId,
  orderDetailId,
  total,
  setTriggerData,
}) => {
  const [loading, setLoading] = useState(false);
  const [dataTable, setDataTable] = useState(data);
  const [status, setStatus] = useState(null);
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
        setTriggerData((pre) => ({
          ...pre,
          id: id,
          open: !pre.open,
        }));
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
        setTriggerData((pre) => ({
          ...pre,
          id: id,
          open: !pre.open,
        }));
        message.success("Cập nhật trạng thái thành công");
        // setTriggerData((pre) => !pre);
      }
    } catch (err) {
      console.log(err);
      message.error("Cập nhật trạng thái thất bại");
    }
    setLoading(false);
  };

  const handleUpdateAll = (data) => {
    fetchUpdateProcessStatus(data);
  };

  const checkStatus = (value, idStatus) => {
    if (value) {
      setStatus(idStatus);
    } else {
      setStatus(null);
    }
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
      title: "Tổng tiền",
      dataIndex: "quantity",
      key: "quantity",
      render: (text, record) => (
        <span>{(record.price * record.quantity).toLocaleString()}đ</span>
      ),
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
                  // disabled={!(total >= 500000 || total * -1 >= 500000)}
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
    <div>
      {data.length > 0 && (
        <div>
          <div className="flex items-center gap-6">
            <Button
              type="text"
              onClick={() =>
                handleUpdateAll({
                  orderId: orderId,
                  orderDetailId: orderDetailId,
                  status: status,
                })
              }
            >
              Cập nhật tất cả{" "}
            </Button>
            <div className="flex gap-4">
              <div className="flex flex-col justify-center items-center">
                <p>Đang chế biến</p>
                <Checkbox
                  checked={!!(status === 0)}
                  onChange={(e) => checkStatus(e.target.checked, 0)}
                />
              </div>
              <div className="flex flex-col justify-center items-center">
                <p>Đã lên món</p>
                <Checkbox
                  checked={!!(status === 1)}
                  onChange={(e) => checkStatus(e.target.checked, 1)}
                />
              </div>
            </div>
          </div>
          <Table
            columns={columnOrder}
            pagination={false}
            dataSource={data}
            scroll={{ x: "max-content" }}
            // bordered
          />
        </div>
      )}
    </div>
  );
};

export default ListMeal;
