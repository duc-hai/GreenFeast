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
  Spin,
} from "antd";
import {
  ArrowRightOutlined,
  EyeOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import "./index.css";
import { getAllArea, getTable } from "../../Services/ManagementServiceAPI";
import {
  applyPromotion,
  closeTable,
  getPromotion,
  getTableByArea,
  moveTable,
  printBill,
  viewDetailOrder,
} from "../../Services/OrderAPI";
import dayjs from "dayjs";
import HistoryOrderAdmin from "./HistoryOrderAdmin";
import ListMeal from "./ListMeal";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const OrderManagement = () => {
  const navigate = useNavigate();
  const [listData, setListData] = useState([]);
  const [valueArea, setValueArea] = useState({});
  const [area, setArea] = useState("");
  const [orderDetail, setOrderDetail] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalMoveTable, setIsModalMoveTable] = useState(false);
  const [tableId, setTableId] = useState("");
  const [isModalCloseTable, setIsModalCloseTable] = useState(false);
  const [tableSlug, setTableSlug] = useState("");

  const [loading, setLoading] = useState(false);
  const [dataPromotion, setDataPromotion] = useState([{}]);
  const [triggerData, setTriggerData] = useState({ id: null, open: false });
  const [tab, setTab] = useState(false);

  const fetchPromotion = async () => {
    try {
      const res = await getPromotion();
      setDataPromotion(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (triggerData.id) fetchDataOrderDetail(triggerData.id);
  }, [triggerData.open]);
  useEffect(() => {
    fetchPromotion();
  }, []);

  const checkStatus = (value) => {
    if (value === 0) return "Trống";
    if (value === 1) return "Có người";
    return "Đặt trước";
  };
  const fetchDataOrderDetail = async (id) => {
    setLoading(true);
    try {
      const res = await viewDetailOrder(id);
      // const resBill = await printBill(id);
      // setExportBuill(resBill.data);
      setOrderDetail(res.data);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  const fetchBillDetail = async (id) => {
    setLoading(true);
    try {
      const resBill = await printBill(id);
      if (resBill?.status === "success") {
        // setExportBuill(resBill.data);

        window.open(resBill.data, "_blank");

        message.success("In hóa đơn thành công");
      } else {
        message.error("In hóa đơn thất bại");
      }
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };
  const hanlePrintBill = (id) => {
    fetchBillDetail(id);
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
      const res = await getTable(id);
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

  const handleOrderEmployee = (slugId) => {
    Cookies.set("tableSlug", slugId);
    navigate("/order/at-restaurant");
  };
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
        return checkStatus(text);
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
                  setTableSlug(record.slug);
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
                  fetchDataOrderDetail(record.slug);
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
              <Button
                type="primary"
                onClick={() => handleOrderEmployee(record?.slug)}
              >
                Nhân viên
              </Button>
            </p>
          );
        }
      },
      align: "center",
    },
  ];

  const columnorder = [
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
      render: (text, record) => (
        <span>{record?.price?.toLocaleString()} đ</span>
      ),
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
        <span>{(record.price * record.quantity).toLocaleString()} đ</span>
      ),
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
      message.success("Đóng bàn thành công");
      await closeTable(tableSlug, values);
      await fetchData(area);
    } catch (error) {
      console.log(error);
      message.error("Đóng bàn thất bại");
    }
    fetchData(area);
    setIsModalCloseTable(false);
  };
  const [form] = Form.useForm();
  const [form1] = Form.useForm();
  const checkOrderMenu = (data) => {
    let check = data.find((item) => item.menu.length > 0);
    return !!check;
  };

  const handleSum = (dataPrice) => {
    const sum = dataPrice.reduce((accumulator, currentValue) => {
      return accumulator + currentValue.price * currentValue.quantity;
    }, 0);
    return sum;
  };
  return (
    <div className="content-component  flex-1">
      <div className="flex justify-between bg-[#5c9f67] p-2 rounded-sm">
        <div className="text-xl font-semibold pl-2 text-white">
          Quản lý order
        </div>
      </div>
      <div className="flex gap-1 mt-1">
        <Button
          type={!tab ? "primary" : "dashed"}
          onClick={() => setTab(false)}
        >
          Nhà hàng
        </Button>
        <Button type={tab ? "primary" : "dashed"} onClick={() => setTab(true)}>
          Online
        </Button>
      </div>
      {tab ? (
        <HistoryOrderAdmin />
      ) : (
        <div>
          <div className="mt-2">
            <span className="text-lg px-4 font-medium">
              Chọn khu vực hiển thị
            </span>
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

          <Table
            columns={columns}
            dataSource={
              listData?.length > 0 &&
              listData?.map((item, index) => {
                return { ...item, key: index };
              })
            }
            scroll={{ y: "calc(100vh - 400px)" }}
          />
        </div>
      )}

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
          className="headerModal "
          width={800}
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
              Thanh toán
            </Button>,
          ]}
          bodyStyle={{ height: "1280" }}
        >
          <Form
            layout="vertical"
            form={form}
            name="form"
            className="max-h-96 overflow-auto"
          >
            {orderDetail?.order_detail?.length > 0 ? (
              orderDetail?.order_detail.map((item) => (
                <div className="ant_body">
                  <div className="flex flex-col gap-1">
                    <span>
                      Thời gian đặt:{"  "}
                      <span className="font-semibold">
                        {dayjs(orderDetail?.checkin).format("DD-MM-YYYY")}
                      </span>
                    </span>

                    <span>
                      Người đặt:{" "}
                      <span className="font-semibold">
                        {" "}
                        {orderDetail?.order_detail?.length > 0 &&
                          item?.order_person?.name}{" "}
                      </span>
                    </span>
                  </div>
                  <p
                    className="py-2 font-semibold"
                    onClick={() => console.log(orderDetail)}
                  >
                    Danh sách món
                  </p>

                  <Table
                    columns={columnorder}
                    pagination={false}
                    dataSource={
                      orderDetail?.order_detail?.length > 0 &&
                      item?.menu?.length > 0 &&
                      item.menu.map((item, index) => {
                        return { ...item, key: index };
                      })
                    }
                    scroll={{ x: "max-content" }}
                  />
                  <p className="justify-end flex gap-2 mt-3">
                    <span>Tổng giá 1:</span>
                    <span className="font-semibold text-green-700">
                      {handleSum([...item?.menu])?.toLocaleString("vi-VN", {})}{" "}
                      VNĐ
                    </span>
                  </p>
                </div>
              ))
            ) : (
              <div>Bàn trống</div>
            )}
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
              <Col span={24}>
                <Form.Item label="Khuyến mãi" name="promotion">
                  <Select
                    style={{ width: 220 }}
                    onChange={async (value) => {
                      if (!value) message.error("Vui lòng chọn khuyến mãi");
                      try {
                        const res = await applyPromotion({
                          promotionId: value,
                          tableId: orderDetail?.table,
                        });
                        if (res.status === "success") {
                          message.success(res.message);
                          fetchDataOrderDetail(tableSlug);
                        }
                      } catch (error) {
                        console.log(error);
                        message.error("Áp dụng khuyến mãi thất bại");
                      }
                    }}
                    placeholder="Chọn khuyến mãi"
                    options={
                      dataPromotion?.length > 0 &&
                      dataPromotion.map((item) => {
                        return {
                          value: item._id,
                          label: item.name,
                        };
                      })
                    }
                  />
                </Form.Item>
              </Col>
            </Row>
            <p className="justify-end flex gap-2 mb-3">
              <span>Số tiền được giảm giá:</span>
              <span className="font-semibold text-red-700">
                {orderDetail?.discount?.toLocaleString("vi-VN", {}) || 0} VNĐ
              </span>
            </p>
            <p className="justify-end flex gap-2 mb-3">
              <span>Số tiền phải thanh toán:</span>
              <span className="font-semibold text-green-700">
                {orderDetail?.total?.toLocaleString("vi-VN", {}) ||
                  orderDetail?.subtotal?.toLocaleString("vi-VN", {})}{" "}
                VNĐ
              </span>
            </p>
          </Form>
        </Modal>
      </div>

      <div className="modal">
        <Modal
          className="headerModal"
          width={1000}
          title={`${
            orderDetail?.table ? `Mã bàn ${orderDetail?.table}` : "Bàn trống"
          } `}
          open={isModalOpen}
          onCancel={handleCancel}
          footer={[
            <Button
              // onClick={() => {
              //   handleCancel();
              // }}
              onClick={() => hanlePrintBill(tableSlug)}
              type="text"
            >
              Xuất khóa đơn
              {/* <a href={exportBuill} target="_blank" className="no-underline">
                Xuất khóa đơn
              </a> */}
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
          {loading ? (
            <Spin />
          ) : orderDetail?.order_detail?.length ? (
            <div
              className="flex flex-col gap-4"
              style={{ maxHeight: "60vh", overflowY: "auto" }}
            >
              {orderDetail?.order_detail.map(
                (item) =>
                  item?.menu?.length > 0 && (
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
                              ? `${orderDetail?.discount.toLocaleString()} VNĐ`
                              : "Không giảm giá"}
                          </span>
                        </span>
                        <span>
                          Người đặt:{" "}
                          <span className="font-semibold">
                            {" "}
                            {orderDetail?.order_detail?.length > 0 &&
                              item?.order_person?.name}{" "}
                          </span>
                        </span>
                      </div>
                      <p className="py-2 font-semibold">Danh sách món </p>
                      {/* <Table
                    columns={columnorder}
                    pagination={false}
                    dataSource={
                      orderDetail?.order_detail?.length > 0 &&
                      item?.menu?.length > 0 &&
                      item.menu.map((item, index) => {
                        return { ...item, key: index };
                      })
                    }
                    scroll={{ x: "max-content" }}
                  /> */}
                      <ListMeal
                        id={tableSlug}
                        setTriggerData={setTriggerData}
                        total={orderDetail?.total}
                        orderId={orderDetail?._id}
                        orderDetailId={item?._id}
                        data={
                          orderDetail?.order_detail?.length > 0 &&
                          item?.menu?.length > 0 &&
                          item.menu.map((item, index) => {
                            return { ...item, key: index };
                          })
                        }
                      />
                    </div>
                  )
              )}
              {!checkOrderMenu(orderDetail?.order_detail) && (
                <p>Bàn này chưa được đặt món!</p>
              )}
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
