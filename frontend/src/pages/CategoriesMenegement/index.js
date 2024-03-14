import { useDispatch } from "react-redux";
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
  message,
  Popconfirm,
} from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import {
  createCategory,
  deleteCategory,
  getCategory,
  getMenuByKey,
  updateCategory,
} from "../../Services/ManagementServiceAPI";
import Search from "antd/es/transfer/search";

const TableManagement = () => {
  const [listData, setListData] = useState([]);
  const [valueCate, setValueCate] = useState({});
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const deleteMenu = async (record) => {
    try {
      await deleteCategory(record.id);
      message.success("Xóa danh mục món thành công");
    } catch (error) {
      console.log(error);
      message.error("Xóa danh mục món thất bại");
    }
  };

  const fetchData = async () => {
    try {
      const res = await getCategory();
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
      title: "Mã danh mục",
      dataIndex: "id",
      key: "id",
      render: (createdId) => <span className="font-semibold">{createdId}</span>,
    },
    {
      title: "Tên Danh mục",
      dataIndex: "name",
      key: "name ",
      render: (name) => <span className="font-semibold">{name}</span>,
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

          <Popconfirm
            title="Xóa"
            description="Bạn có chắc chắn muốn xóa?"
            onConfirm={() => {
              deleteMenu(record);
            }}
            onCancel={() => {}}
            okText="Đồng ý"
            cancelText="Hủy bỏ"
          >
            <DeleteOutlined style={{ fontSize: "22px", color: "red" }} />
          </Popconfirm>
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
        await updateCategory(valueCate.id, values);
        message.success("Cập nhật danh mục món thành công");
      } else {
        await createCategory(values);
        message.success("Tạo mới danh mục món thành công");
      }
    } catch (error) {
      console.log(error);
      message.error("Tạo mới danh mục món thất bại");
    }
    fetchData();
    setLoading(false);
    handleCancel();
  };

  return (
    <div className="content-component">
      <div className="flex justify-between bg-[#5c9f67] p-2 rounded-sm">
        <div className="text-xl font-semibold pl-2 text-white">
          Quản lý danh mục món
        </div>
        <div className="pr-2">
          <Button type="primary" className="bg-[#263a29]" onClick={showModal}>
            Tạo mới Danh mục món
          </Button>
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={listData?.map((item, index) => {
          return { ...item, key: index };
        })}
        pagination={false}
        scroll={{ x: "max-content" }}
      />

      <div className="modal">
        <Modal
          className="headerModal"
          title="Tạo mới đơn"
          open={isModalOpen}
          onCancel={handleCancel}
          footer={[
            <Button onClick={handleCancel} className="border text-[#5c9f67]">
              ĐÓNG
            </Button>,
            <Button
              type="primary"
              className="bg-[#5c9f67]"
              onClick={handleOk}
              loading={loading}
            >
              Tạo mới
            </Button>,
          ]}
        >
          <div className="ant_body">
            <Form layout="vertical" form={form} name="form" onFinish={onFinish}>
              <Row>
                <Col span={24}>
                  <Form.Item
                    label="Tên danh mục"
                    name="name"
                    rules={[
                      { required: true, message: "Vui lòng nhập tên danh mục" },
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

export default TableManagement;
