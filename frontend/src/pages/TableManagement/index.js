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
  Row,
  Popconfirm,
  message,
} from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import "./index.css";
import {
  createTable,
  deleteTable,
  getAllArea,
  getTable,
} from "../../Services/ManagementServiceAPI";
const MenuManagement = () => {
  const [listData, setListData] = useState([]);
  const [valueArea, setValueArea] = useState({});
  const [dataDelete, setDataDelete] = useState([]);
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
    if (valueArea.length > 0) {
      fetchData(valueArea[0].id);
    }
  }, [valueArea]);

  const columns = [
    {
      title: "Mã bàn",
      dataIndex: "id",
      key: "id",
    },
    // {
    //   title: "Tên bàn",
    //   dataIndex: "code",
    //   key: "code ",
    // },
    {
      title: "Khu vực (tầng)",
      dataIndex: "area_id",
      key: "area_id",
    },

    {
      title: "Thao tác",
      render: (_, record) => (
        <Popconfirm
          title="Xóa"
          description="Bạn có chắc chắn muốn xóa?"
          onConfirm={async () => {
            try {
              await deleteTable({
                ids: [record.id],
              });
              fetchData(valueArea[0].id);
              message.success("Xóa thành công");
            } catch (error) {
              console.log(error);
              message.error("Xóa thất bại");
            }
          }}
          onCancel={() => {}}
          okText="Đồng ý"
          cancelText="Hủy bỏ"
        >
          <DeleteOutlined style={{ fontSize: "22px", color: "red" }} />
        </Popconfirm>
      ),
    },
  ];

  const rowSelection = {
    onChange: (_, selectedRows) => {
      console.log("selectedRows: ", selectedRows);
      setDataDelete(selectedRows?.map((item) => item.id));
    },
    onSelect: (record, selected, selectedRows) => {
      console.log(record, selected, selectedRows);
    },
    onSelectAll: (selected, selectedRows, changeRows) => {
      console.log(selected, selectedRows, changeRows);
    },
  };

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
    setIsModalOpen(false);
  };
  const onFinish = async () => {
    const values = form.getFieldsValue();
    try {
      await createTable(values);
      message.success("Tạo mới danh mục món thành công");
    } catch (error) {
      console.log(error);
      message.error("Tạo mới danh mục món thất bại");
    }
    fetchData(valueArea[0].id);
    handleCancel();
  };
  const [form] = Form.useForm();
  console.log(dataDelete);
  return (
    <div className="content-component">
      <div className="flex justify-between bg-[#5c9f67] p-2 rounded-sm">
        <div className="text-xl font-semibold pl-2 text-white">Quản lý bàn</div>
        <div>
          <Button type="primary" className="bg-[#263a29]" onClick={showModal}>
            Tạo mới bàn ăn
          </Button>

          <Popconfirm
            title="Delete the task"
            description="Are you sure to delete this task?"
            onConfirm={async () => {
              try {
                if (dataDelete.length > 0) {
                  await deleteTable({
                    ids: dataDelete,
                  });
                  fetchData(valueArea[0].id);
                  message.success("Xóa thành công");
                } else {
                  message.error("Vui lòng chọn bàn cần xóa");
                }
              } catch (error) {
                console.log(error);
                message.error("Xóa thất bại");
              }
            }}
            onCancel={() => {}}
            okText="Yes"
            cancelText="No"
          >
            <Button className="bg-red-600 mx-4 border-none outline-none text-white hover:!bg-red-900 py-1 px-3 rounded-md">
              Xóa
            </Button>
          </Popconfirm>
        </div>
      </div>
      <div className="mt-4">
        <span className="text-lg px-4 font-medium">Chọn khu vực hiển thị</span>
        <select
          className="bg-[#263a29] text-white outline-none px-2 py-1 rounded-md"
          defaultValue={valueArea?.length > 0 && valueArea[0]?.id}
          onChange={(e) => {
            fetchData(e.target.value);
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
        rowSelection={{
          ...rowSelection,
        }}
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
                    label="Mã bàn"
                    name="id"
                    rules={[
                      { required: true, message: "Vui lòng nhập khu vực" },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item
                    label="Khu vực"
                    name="area_id"
                    rules={[
                      { required: true, message: "Vui lòng nhập khu vực" },
                    ]}
                  >
                    <Select
                      // style={{ width: 120 }}
                      options={
                        valueArea?.length > 0 &&
                        valueArea?.map((item) => {
                          return { value: item.id, label: item.name };
                        })
                      }
                    />
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

export default MenuManagement;
