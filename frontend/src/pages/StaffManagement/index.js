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
import "./index.css";
import { getResource } from "../../Services/AuthAPI";
const { Option } = Select;
const AreaManagement = () => {
  const dispatch = useDispatch();
  const [pagination, setPagination] = useState({ pageIndex: 1, pageSize: 10 });
  const [resource, setResource] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getResource();
        setResource(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);
  console.log(resource);
  useEffect(() => {}, [pagination]);
  const editMenu = (record) => {};
  const deleteMenu = (record) => {};
  const columns = [
    {
      title: "Mã nhân viên",
      dataIndex: "staffId",
      key: "staffId",
    },
    {
      title: "Tên nhân viên",
      dataIndex: "code",
      key: "code ",
    },
    {
      title: "Vị trí",
      dataIndex: "position",
      key: "position ",
    },

    {
      title: "Thao tác",
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

  const data = [
    {
      key: 1,
      staffId: "12345",
      code: "Trần Văn A",
      position: "Nhân viên bán hàng",
    },
    {
      key: 2,
      staffId: "54664",
      code: "Nguyen Van B",
      position: "Quản lý",
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
  const [checkStrictly, setCheckStrictly] = useState(false);
  return (
    <div className="content-component">
      <div className="flex justify-between bg-[#5c9f67] p-2 rounded-sm">
        <div className="text-xl font-semibold pl-2 text-white">
          Quản nhân viên
        </div>
        <div>
          <Button type="primary" className="bg-[#263a29]" onClick={showModal}>
            Thêm mới
          </Button>
          <button className="bg-red-600 mx-4 border-none outline-none text-white hover:bg-red-400 py-1 px-3 rounded-md">
            Xóa
          </button>
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
        dataSource={data}
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
            <Button key="back" danger onClick={handleCancel}>
              ĐÓNG
            </Button>,
            <Button
              htmlType="submit"
              type="primary"
              // loading={loading}
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
                  <Form.Item name="id" hidden>
                    <Input hidden />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item
                    label="Tên bàn"
                    name="name"
                    rules={[
                      { required: true, message: "Vui lòng nhập tên bàn" },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item
                    label="Vị trí (tầng)"
                    name="image"
                    rules={[
                      { required: true, message: "Vui lòng nhập vị trí" },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item
                    label="Chi tiết bàn"
                    name="additionalAmount"
                    rules={[
                      { required: true, message: "Vui lòng nhập chi tiết bàn" },
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
