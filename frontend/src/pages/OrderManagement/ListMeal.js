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
      responsive: ["sm"],
      render: (text, record) => {
        return record.price?.toLocaleString("vi-VN", {});
      },
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      // responsive: ["md"],
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
      responsive: ["md"],
      align: "center",
    },
    {
      title: <span className="flex justify-center">Trạng thái</span>,
      dataIndex: "processing_status",
      key: "processing_status",
      render: (text, record) => (
        <span className="flex items-center justify-end gap-2 flex-wrap">
          <p onClick={() => console.log(record)}>
            {optionUpDateStatus[text].label}
          </p>
          {loading ? (
            <Spin />
          ) : (
            <div className="flex gap-1 flex-wrap justify-center items-center">
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
                {text === 0
                  ? optionUpDateStatus[1].label
                  : optionUpDateStatus[0].label}
              </Button>

              <Button
                type="default"
                color="#263a29"
                className="border border-solid border-red-500"
                onClick={() => deleteUpdateStatus(record)}
                // disabled={!(total >= 500000 || total * -1 >= 500000)}
              >
                Hủy món
              </Button>
            </div>
          )}
        </span>
      ),
    },
  ];
  return (
    <div>
      {data.length > 0 && (
        <div>
          <div className="flex items-center gap-6 justify-end">
            <Button
              type="text"
              onClick={() =>
                handleUpdateAll({
                  orderId: orderId,
                  orderDetailId: orderDetailId,
                  status: 1,
                })
              }
            >
              Đã lên món
            </Button>
            {/* <div className="flex gap-4">
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
            </div> */}
          </div>
          <Table
            columns={columnOrder}
            pagination={false}
            dataSource={data}

            // bordered
          />
        </div>
      )}
    </div>
  );
};

export default ListMeal;
