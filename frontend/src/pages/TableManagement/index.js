import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
  Button,
  Table,
  Modal,
  Form,
  Input,
  Select,
  Col,
  Row,
  Popconfirm,
  message,
  Checkbox,
} from "antd";
import { DeleteOutlined } from "@ant-design/icons";
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
  const [area, setArea] = useState(null);
  const [choseItem, setChoseItem] = useState(0);
  useEffect(() => {
    const fetchArea = async () => {
      try {
        const res = await getAllArea();
        setValueArea(res.data);
        setArea(res?.data[0]?.id);
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
      setChoseItem(id);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (area) {
      fetchData(area);
    }
  }, [area]);
  const handleChoseTable = (value, checked) => {
    if (checked) {
      setDataDelete((pre) => [...pre, value]);
    } else {
      setDataDelete((pre) => pre.filter((item) => item === value));
    }
  };
  const handleDeleteTable = async (dataTable) => {
    console.log(dataTable);
    const res = await deleteTable({ ids: dataTable });
    if (res?.status === "success") {
      await fetchData(area);
      message.success("Xóa bàn thành công");
    } else {
      message.error(res?.message || "Xóa bàn thất bại");
    }
  };

  const columns = [
    {
      title: "",
      dataIndex: "_id",
      key: "_id",
      render: (text) => (
        <Checkbox
          value={!!dataDelete.find((item) => item === text)}
          onChange={(e) => handleChoseTable(text, e.target.checked)}
        ></Checkbox>
      ),
    },
    {
      title: "Mã bàn",
      dataIndex: "_id",
      key: "_id",
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
      render: () => <p>{valueArea[choseItem - 1].name}</p>,
    },

    {
      title: "Thao tác",
      render: (_, record) => (
        <Popconfirm
          title="Xóa"
          description="Bạn có chắc chắn muốn xóa?"
          onConfirm={() => handleDeleteTable(dataDelete)}
          onCancel={() => {}}
          okText="Đồng ý"
          cancelText="Hủy bỏ"
        >
          <DeleteOutlined style={{ fontSize: "22px", color: "red" }} />
        </Popconfirm>
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
    fetchData(area);
    handleCancel();
  };
  const [form] = Form.useForm();

  return (
    <div className="bg-[#E4E4D0] md:p-3 ">
      <div className="flex justify-between flex-wrap gap-2 bg-[#5c9f67] p-2 rounded-sm ">
        <div className="text-xl font-semibold pl-2 text-white">Quản lý bàn</div>
        <div>
          <Button type="primary" className="bg-[#263a29]" onClick={showModal}>
            Tạo mới bàn ăn
          </Button>

          <Popconfirm
            title="Xóa "
            description="Bạn có chắc muốn xóa bàn?"
            onConfirm={() => handleDeleteTable(dataDelete)}
            onCancel={() => {}}
            okText="Xóa"
            cancelText="Hủy"
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
            setArea(e.target.value);
          }}
        >
          {valueArea?.length > 0 &&
            valueArea?.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
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
            return { ...item, key: `${item?.id}_${index}` };
          })
        }
        scroll={{ y: "calc(100vh - 400px)" }}
      />

      <div className="modal">
        <Modal
          className="headerModal"
          title="Tạo mới đơn "
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
