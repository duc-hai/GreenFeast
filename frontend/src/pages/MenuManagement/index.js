import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
  Button,
  Space,
  Table,
  Modal,
  Form,
  Input,
  Select,
  Col,
  Radio,
  Row,
  InputNumber,
  DatePicker,
  Card,
  Popconfirm,
} from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { RECEIVE_TYPE } from "../../utils/constants";
import "./index.css";
const { Option } = Select;
const TableManagement = () => {
  const dispatch = useDispatch();
  const [pagination, setPagination] = useState({ pageIndex: 1, pageSize: 10 });

  useEffect(() => {}, [pagination]);
  const editMenu = (record) => {};
  const deleteMenu = (record) => {};
  const columns = [
    {
      title: "Mã món",
      dataIndex: "itemId",
      key: "itemId",
      render: (itemId) => <span className="font-semibold">{itemId}</span>,
    },
    {
      title: "Tên món",
      dataIndex: "code",
      key: "code ",
      render: (code) => <span className="font-semibold">{code}</span>,
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      render: (price) => <span className="font-semibold">{price}</span>,
    },

    {
      title: "Hình ảnh",
      dataIndex: "image",
      key: "image",
      render: (img) => (
        <img
          className="w-full w-[80px] h-[50px] object-cover rounded-md"
          src={img}
          alt=""
        />
      ),
    },

    {
      title: "Hoạt động",
      render: (_, record) => (
        <Space size="middle">
          <button onClick={() => editMenu(record)}>
            <EditOutlined className="text-[#263a29] text-2xl" />
          </button>
          <button onClick={() => deleteMenu(record)}>
            <DeleteOutlined className="text-red-500 text-2xl" />
          </button>
        </Space>
      ),
    },
  ];

  const dataSource = [
    {
      key: 1,
      itemId: "1",
      code: "Sashimi",
      price: "620.000",
      image: "/item1.jpg",
    },
    {
      key: 2,
      itemId: "2",
      code: "Cơm tấm Sài Gòn",
      price: "120.000",
      image: "/item2.jpg",
    },
  ];

  const EditProduct = (record) => {
    console.log(record);
  };

  const onTableChange = async (paginations) => {
    const { current, pageSize } = paginations;
    const paging = { ...pagination, pageIndex: current, pageSize };
    setPagination(paging);
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const onFinish = (values) => {
    console.log(values);
  };
  const [form] = Form.useForm();
  const [dataTblProduct, setDataTblProduct] = useState([]);
  const deleteProduct = (record) => {
    const newListDataProduct = dataTblProduct.filter(
      (item) => item.id !== record.id
    );
    setDataTblProduct(newListDataProduct);
  };
  return (
    <>
      <div className="content-component">
        <div className="flex justify-between bg-[#5c9f67] p-2 rounded-sm">
          <div className="text-xl font-semibold pl-2 text-white">
            Quản lý thực đơn
          </div>
          <div className="pr-2">
            <Button type="primary" className="bg-[#263a29]" onClick={showModal}>
              Tạo mới món ăn
            </Button>
          </div>
        </div>
        <br />
        <br />
        <Table
          columns={columns}
          dataSource={dataSource}
          pageIndex={pagination.pageIndex}
          pagination={{
            current: pagination.pageIndex,
            // total: listData?.result?.total,
            pageSize: pagination.pageSize,
          }}
          onChange={onTableChange}
          scroll={{ x: "max-content" }}
        />

        <div className="modal">
          <Modal
            className="headerModal"
            title="Tạo mới đơn"
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
            footer={[
              <Button key="back" onClick={handleCancel}>
                ĐÓNG
              </Button>,
              <Button
                htmlType="submit"
                type="primary"
                // loading={loading}
                form="form"
                name="form"
              >
                GỬI
              </Button>,
            ]}
            bodyStyle={{ height: "1280" }}
          >
            <div className="ant_body">
              <Form
                layout="vertical"
                form={form}
                name="form"
                onFinish={onFinish}
              >
                <Row>
                  <Col span={24}>
                    <Form.Item name="id" hidden>
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    <Form.Item
                      label="Tên món"
                      name="name"
                      rules={[
                        { required: true, message: "Vui lòng nhập tên món" },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    <Form.Item
                      label="Hình ảnh"
                      name="image"
                      rules={[
                        { required: true, message: "Vui lòng chọn hình ảnh" },
                      ]}
                    >
                      <Input type={"file"} />
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    <Form.Item
                      label="Giá"
                      name="additionalAmount"
                      rules={[{ required: true, message: "Vui lòng nhập giá" }]}
                    >
                      <InputNumber style={{ width: "100%" }} />
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    <Form.Item
                      label="Thông tin chi tiết"
                      name="shipperPhone"
                      rules={[{ required: true }]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    <Form.Item
                      label="Danh mục món ăn"
                      name="receiveType"
                      rules={[
                        {
                          required: true,
                          message: " Vui lòng chọn danh múc món ăn",
                        },
                      ]}
                    >
                      <Select
                        name="sendType"
                        placeholder="chọn hình thức nhận hàng"
                        // onChange={onGenderChange}
                        allowClear
                      >
                        {RECEIVE_TYPE.map((receiveType, index) => {
                          return (
                            <Select.Option
                              key={index}
                              value={receiveType.value}
                            >
                              {receiveType.title}
                            </Select.Option>
                          );
                        })}
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </div>
          </Modal>
        </div>
      </div>
    </>
  );
};

export default TableManagement;
