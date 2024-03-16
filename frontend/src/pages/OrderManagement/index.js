import { useEffect, useState } from "react";
import {
  Button,
  Table,
  Modal,
  Form,
  message,
  Row,
  Col,
  Input,
  Select,
} from "antd";
import {
  ArrowRightOutlined,
  EyeOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import "./index.css";
import { getAllArea } from "../../Services/ManagementServiceAPI";
import {
  closeTable,
  getTableByArea,
  moveTable,
  printBill,
  viewDetailOrder,
} from "../../Services/OrderAPI";
import dayjs from "dayjs";
const OrderManagement = () => {
  const [listData, setListData] = useState([]);
  const [valueArea, setValueArea] = useState({});
  const [area, setArea] = useState("");
  const [orderDetail, setOrderDetail] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalMoveTable, setIsModalMoveTable] = useState(false);
  const [tableId, setTableId] = useState("");
  const [isModalCloseTable, setIsModalCloseTable] = useState(false);
  const [tableSlug, setTableSlug] = useState("");
  const [exportBuill, setExportBuill] = useState("");

  const fetchDataOrderDetail = async (id) => {
    try {
      const res = await viewDetailOrder(id);
      const resBill = await printBill(id);
      setExportBuill(resBill.data);
      setOrderDetail(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    const fetchArea = async () => {
      try {
        const res = await getAllArea();
        setValueArea(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchArea();
  }, []);
  const fetchData = async (id) => {
    try {
      const res = await getTableByArea(id);
      setListData(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (area) {
      fetchData(area);
    } else {
      if (valueArea.length > 0) {
        fetchData(valueArea[0].id);
      }
    }
  }, [area, valueArea]);

  const columns = [
    {
      title: "Mã bàn",
      dataIndex: "_id",
      key: "_id",
      align: "center",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (text, record) => {
        return record.status === 0 ? "Trống" : "Có người";
      },
      align: "center",
    },

    {
      title: "Thao tác",
      render: (_, record) => {
        if (record.status === 0) {
          return "Trống";
        } else {
          return (
            <p className="flex justify-center gap-5">
              <span
                onClick={() => {
                  showModal();
                  fetchDataOrderDetail(record.slug);
                }}
              >
                <EyeOutlined style={{ fontSize: "20px" }} />
              </span>
              <span
                onClick={() => {
                  setIsModalCloseTable(true);
                  setTableSlug(record.slug);
                }}
              >
                <CloseCircleOutlined
                  style={{ fontSize: "18px", color: "red" }}
                />
              </span>
              <span
                onClick={() => {
                  setIsModalMoveTable(true);
                  setTableId(record._id);
                }}
              >
                <ArrowRightOutlined style={{ fontSize: "18px" }} />
              </span>
            </p>
          );
        }
      },
      align: "center",
    },
  ];

  const columnorder = [
    {
      title: "Id món",
      dataIndex: "_id",
      key: "_id",
      align: "center",
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      align: "center",
      render: (text, record) => {
        return record.price.toLocaleString("vi-VN", {});
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
  ];

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleCancel = () => {
    form.resetFields();
    setIsModalOpen(false);
  };
  const onFinish = async () => {
    const values = form.getFieldsValue();

    try {
      if (values.payment_method === undefined) {
        message.error("Vui lòng chọn loại thanh toán");
        return;
      }
      await closeTable(tableSlug, values);
      message.success("Đóng bàn thành công");
    } catch (error) {
      console.log(error);
      message.error("Đóng bàn thất bại");
    }
    fetchData(area);
    setIsModalCloseTable(false);
  };
  const [form] = Form.useForm();
  const [form1] = Form.useForm();

  return (
    <div className="content-component">
      <div className="flex justify-between bg-[#5c9f67] p-2 rounded-sm">
        <div className="text-xl font-semibold pl-2 text-white">
          Quản lý order
        </div>
      </div>
      <div className="mt-4">
        <span className="text-lg px-4 font-medium">Chọn khu vực hiển thị</span>
        <select
          className="bg-[#263a29] text-white outline-none px-2 py-1 rounded-md"
          onChange={(e) => {
            fetchData(e.target.value);
            setArea(e.target.value);
          }}
        >
          {valueArea?.length > 0 &&
            valueArea?.map((item) => (
              <option value={item.id}>{item.name}</option>
            ))}
        </select>
      </div>
      <br />
      <br />
      <Table
        columns={columns}
        dataSource={
          listData?.length > 0 &&
          listData?.map((item, index) => {
            return { ...item, key: index };
          })
        }
        scroll={{ x: "max-content" }}
      />

      <div className="modal">
        <Modal
          className="headerModal"
          title={`Chuyển bàn`}
          open={isModalMoveTable}
          onOk={() => {
            setIsModalMoveTable(false);
            // setTableId("");
          }}
          onCancel={() => {
            setIsModalMoveTable(false);
            // setTableId("");
          }}
          footer={[
            <Button
              type="primary"
              onClick={async () => {
                const values = form1.getFieldsValue();
                try {
                  await moveTable(tableId, values.to);
                  message.success("Chuyển bàn thành công");
                  fetchData(area);
                } catch (error) {
                  console.log(error);
                  message.error("Chuyển bàn thất bại");
                }
                setIsModalMoveTable(false);
              }}
            >
              Chuyển bàn
            </Button>,
          ]}
          bodyStyle={{ height: "1280" }}
        >
          <Form layout="vertical" form={form1} name="form">
            <Row>
              <Col span={24} className="mb-3">
                <p className="mb-2">Bàn hiện tại</p>
                <Input value={tableId} disabled />
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Form.Item label="Sang bàn" name="to">
                  <Select
                    name="to"
                    placeholder="Chọn bàn"
                    // onChange={onGenderChange}
                    allowClear
                  >
                    {listData?.length > 0 &&
                      listData?.map((item, index) => {
                        if (item.status === 0) {
                          return (
                            <Select.Option key={index} value={item._id}>
                              {item._id}
                            </Select.Option>
                          );
                        }
                      })}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Modal>
      </div>

      <div className="modal">
        <Modal
          className="headerModal"
          title={`${
            orderDetail?.table ? `Mã bàn ${orderDetail?.table}` : "Bàn trống"
          } `}
          open={isModalCloseTable}
          onOk={() => {
            setIsModalCloseTable(false);
            setTableSlug("");
          }}
          onCancel={() => {
            setIsModalCloseTable(false);
            setTableSlug("");
          }}
          footer={[
            <Button
              htmlType="submit"
              type="primary"
              // loading={loading}
              form="form"
              name="form"
              onClick={onFinish}
            >
              Đóng bàn
            </Button>,
          ]}
          bodyStyle={{ height: "1280" }}
        >
          <Form layout="vertical" form={form} name="form">
            <Row>
              <Col span={24}>
                <Form.Item label="Loại thanh toán" name="payment_method">
                  <Select
                    name="payment_method"
                    placeholder="Chọn loại thanh toán"
                    // onChange={onGenderChange}
                    allowClear
                  >
                    <Select.Option key={1} value={"Tiền mặt"}>
                      Tiền mặt
                    </Select.Option>
                    <Select.Option key={2} value={"Bank"}>
                      Bank
                    </Select.Option>
                  </Select>
                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.Item label="Ghi chú" name="note">
                  <Input placeholder="Nhập note (Nếu có)" />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Modal>
      </div>

      <div className="modal">
        <Modal
          className="headerModal"
          title={`${
            orderDetail?.table ? `Mã bàn ${orderDetail?.table}` : "Bàn trống"
          } `}
          open={isModalOpen}
          onCancel={handleCancel}
          footer={[
            <Button
              onClick={() => {
                handleCancel();
              }}
              type="text"
            >
              <a href={exportBuill} target="_blank" className="no-underline">
                Xuất khóa đơn
              </a>
            </Button>,
            <Button
              onClick={() => {
                handleCancel();
              }}
              type="primary"
            >
              Close
            </Button>,
          ]}
          bodyStyle={{ height: "1280" }}
        >
          {orderDetail?.order_detail?.length ? (
            <div className="ant_body">
              <div className="flex flex-col gap-1">
                <span>
                  Thời gian đặt:{"  "}
                  <span className="font-semibold">
                    {dayjs(orderDetail?.checkin).format("DD-MM-YYYY")}
                  </span>
                </span>
                <span>
                  Giảm giá:{" "}
                  <span className="font-semibold">
                    {" "}
                    {orderDetail?.discount > 0
                      ? `${orderDetail?.discount} %`
                      : "Không giảm giá"}
                  </span>
                </span>
                <span>
                  Người đặt:{" "}
                  <span className="font-semibold">
                    {" "}
                    {orderDetail?.order_detail?.length > 0 &&
                      orderDetail?.order_detail[0]?.order_person?.name}{" "}
                  </span>
                </span>
              </div>
              <p className="py-2 font-semibold">Danh sách món</p>
              <Table
                columns={columnorder}
                pagination={false}
                dataSource={
                  orderDetail?.order_detail?.length > 0 &&
                  orderDetail?.order_detail[0]?.menu?.length > 0 &&
                  orderDetail?.order_detail[0].menu.map((item, index) => {
                    return { ...item, key: index };
                  })
                }
                scroll={{ x: "max-content" }}
              />
              <p className=" flex gap-2 mt-3">
                <span>Tổng giá:</span>
                <span className="font-semibold text-green-700">
                  {orderDetail?.subtotal.toLocaleString("vi-VN", {})} VNĐ
                </span>
              </p>
            </div>
          ) : (
            <div>Bàn trống</div>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default OrderManagement;
