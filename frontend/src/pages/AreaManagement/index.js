import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
  Button,
  Space,
  Table,
  Modal,
  Form,
  Input,
  Col,
  Row,
  Popconfirm,
  message,
} from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import "./index.css";
import {
  createArea,
  deleteArea,
  getAllArea,
  updateArea,
} from "../../Services/ManagementServiceAPI";
const AreaManagement = () => {
  const [form] = Form.useForm();
  const [listData, setListData] = useState([]);
  const [valueCate, setValueCate] = useState({});
  const [loading, setLoading] = useState(false);
  const deleteA = async (record) => {
    try {
      await deleteArea(record.id);
      message.success("Xóa danh mục món thành công");
    } catch (error) {
      console.log(error);
      message.error("Xóa danh mục món thất bại");
    }
  };
  const fetchData = async () => {
    try {
      const res = await getAllArea();
      setListData(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const columns = [
    {
      title: "Mã khu vực",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Tên khu vực",
      dataIndex: "name",
      key: "name ",
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Giảm giá",
      dataIndex: "price_percentage",
      key: "price_percentage",
    },

    {
      title: "Thao tác",
      render: (_, record) => (
        <Space size="middle">
          <button
            onClick={() => {
              setValueCate(record);
              form.setFieldsValue(record);
              showModal();
            }}
          >
            <EditOutlined className="text-[#263a29] text-2xl" />
          </button>
          <button onClick={() => {}}>
            <Popconfirm
              title="Delete the task"
              description="Are you sure to delete this task?"
              onConfirm={() => {
                deleteA(record);
              }}
              onCancel={() => {}}
              okText="Yes"
              cancelText="No"
            >
              <DeleteOutlined style={{ fontSize: "20px" }} />
            </Popconfirm>
          </button>
        </Space>
      ),
    },
  ];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    onFinish();
    // setIsModalOpen(false);
  };

  const handleCancel = () => {
    form.resetFields();
    setValueCate({});
    setIsModalOpen(false);
  };

  const onFinish = async () => {
    const values = form.getFieldsValue();
    try {
      setLoading(true);
      if (valueCate.id) {
        await updateArea(valueCate.id, {
          name: values.name,
          description: values.description,
          price_percentage: parseInt(values.price_percentage),
        });
        message.success("Cập nhật khu vực thành công");
      } else {
        await createArea({
          name: values.name,
          description: values.description,
          price_percentage: parseInt(values.price_percentage),
        });
        message.success("Tạo mới khu vực thành công");
      }
    } catch (error) {
      console.log(error);
      message.error("Tạo mới khu vực thất bại");
    }
    fetchData();
    setLoading(false);
    handleCancel();
  };

  console.log(listData);
  return (
    <div className="content-component">
      <div className="flex justify-between bg-[#5c9f67] p-2 rounded-sm">
        <div className="text-xl font-semibold pl-2 text-white">
          Quản khu vực
        </div>
        <div>
          <Button type="primary" className="bg-[#263a29]" onClick={showModal}>
            Tạo mới khu vực
          </Button>
        </div>
      </div>
      {/* <div className="mt-4">
        <span className="text-lg px-4 font-medium">Chọn khu vực hiển thị</span>
        <select className="bg-[#263a29] text-white outline-none px-2 py-1 rounded-md">
          <option>Tầng 01</option>
          <option>Tầng 02</option>
          <option>Tầng 03</option>
          <option>Tầng 03</option>
        </select>
      </div> */}
      <br />
      <br />
      <Table
        columns={columns}
        dataSource={listData}
        pagination={false}
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
            <Button key="back" danger onClick={handleCancel}>
              ĐÓNG
            </Button>,
            <Button
              htmlType="submit"
              type="primary"
              loading={loading}
              form="form"
              name="form"
            >
              Tạo bàn
            </Button>,
          ]}
          bodyStyle={{ height: "1280" }}
        >
          <div className="ant_body">
            <Form layout="vertical" form={form} name="form" onFinish={onFinish}>
              <Row>
                <Col span={24}>
                  <Form.Item
                    label="Tên khu vực"
                    name="name"
                    rules={[
                      { required: true, message: "Vui lòng nhập khu vực" },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item
                    label="Mô tả"
                    name="description"
                    rules={[{ required: true, message: "Vui lòng nhập mô tả" }]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item
                    label="Giảm giá"
                    name="price_percentage"
                    rules={[
                      { required: true, message: "Vui lòng nhập % giảm giá" },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default AreaManagement;
