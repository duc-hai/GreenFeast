import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { Button, Space, Table, Modal, Form, Input, Col, Row } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

const TableManagement = () => {
  const dispatch = useDispatch();
  const [pagination, setPagination] = useState({ pageIndex: 1, pageSize: 10 });

  useEffect(() => {}, [pagination]);
  const editMenu = (record) => {};
  const deleteMenu = (record) => {};
  const columns = [
    {
      title: "Mã danh mục",
      dataIndex: "createdId",
      key: "createdId",
      render: (createdId) => <span className="font-semibold">{createdId}</span>,
    },
    {
      title: "Tên Danh mục",
      dataIndex: "code",
      key: "code ",
      render: (code) => <span className="font-semibold">{code}</span>,
    },

    {
      title: "Thao tác",
      render: (_, record) => (
        <Space size="middle">
          <button onClick={() => editMenu(record)}>
            <EditOutlined className="text-[#263a29] text-2xl" />
          </button>
          <button onClick={() => deleteMenu(record)}>
            {" "}
            <DeleteOutlined className="text-red-500 text-2xl" />
          </button>
        </Space>
      ),
    },
  ];

  const dataSource = [
    {
      key: 1,
      createdId: "1",
      code: "Sashimi",
    },
    {
      key: 2,
      createdId: "2",
      code: "Cơm tấm Sài Gòn",
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
            <Button onClick={handleCancel} className="border text-[#5c9f67]">
              ĐÓNG
            </Button>,
            <Button type="primary" className="bg-[#5c9f67]">
              Tạo mới
            </Button>,
          ]}
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
                    label="Tên danh mục"
                    name="name"
                    rules={[
                      { required: true, message: "Vui lòng nhập tên danh mục" },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item label="Thông tin chi tiết" name="additionalAmount">
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
