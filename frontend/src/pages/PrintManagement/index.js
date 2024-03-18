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
  Select,
} from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import {
  createPrinter,
  deleteCategory,
  deletePrint,
  getAllArea,
  getCategory,
  getPrint,
  getTypePrint,
  updatePrint,
} from "../../Services/ManagementServiceAPI";

const TableManagement = () => {
  const [listData, setListData] = useState([]);
  const [valueCate, setValueCate] = useState({});
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [listCatePrin, setListCatePrint] = useState([]);
  const [listCateArea, setListCateArea] = useState([]);
  const [printType, setPrintType] = useState([]);

  const fetchCatePrint = async () => {
    try {
      const res = await getTypePrint();
      setListCatePrint(Object.entries(res?.data));
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchCatePrint();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getAllArea();
        setListCateArea(res.data);
        fetchCatePrint();
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  const deleteMenu = async (record) => {
    try {
      await deletePrint(record.id);
      message.success("Xóa máy in thành công");
      fetchCatePrint();
    } catch (error) {
      console.log(error);
      message.error("Xóa máy in thất bại");
    }
  };
  const fetchData = async () => {
    try {
      const res = await getPrint();
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
      title: "Tên",
      dataIndex: "name",
      key: "name",
      render: (name) => <span className="font-semibold">{name}</span>,
    },
    {
      title: "Địa chỉ IP",
      dataIndex: "ip_address",
      key: "ip_address ",
      render: (ip_address) => (
        <span className="font-semibold">{ip_address}</span>
      ),
    },
    {
      title: "Loại máy in",

      dataIndex: "printer_type",
      key: "printer_type ",
      render: (printer_type) => {
        const matchingCategory = listCatePrin?.find(
          (item) => parseInt(item[0]) === printer_type
        );
        return (
          <span className="font-semibold">
            {matchingCategory ? matchingCategory[1] : "Không xác định"}
          </span>
        );
      },
    },
    {
      title: "Khu vực",
      dataIndex: "area_id",
      key: "area_id ",
      render: (area_id) => {
        console.log(listCateArea);
        const matchingCategory = listCateArea?.find(
          (item) => item.id === area_id
        );

        console.log(matchingCategory);
        return (
          <span className="font-semibold">
            {matchingCategory ? matchingCategory?.name : "Không xác định"}
          </span>
        );
      },
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
    console.log(values);
    if (!values.name || !values.ip_address || !values.printer_type) {
      message.error("Vui lòng nhập đầy đủ thông tin");
      return;
    }
    let data = {
      name: values.name,
      ip_address: values.ip_address,
      printer_type: parseInt(values.printer_type),
      area_id: values.area_id || null,
    };

    try {
      setLoading(true);
      if (valueCate.id) {
        await updatePrint(valueCate.id, data);
        message.success("Cập nhật máy in thành công");
      } else {
        await createPrinter(data);
        message.success("Tạo mới máy in thành công");
      }
      fetchData();
      handleCancel();
    } catch (error) {
      console.log(error);
      message.error(error?.response?.data?.message || "Thao tác thất bại");
    }
    setLoading(false);
  };

  return (
    <div className="content-component">
      <div className="flex justify-between bg-[#5c9f67] p-2 rounded-sm">
        <div className="text-xl font-semibold pl-2 text-white">
          Quản lý máy in
        </div>
        <div className="pr-2">
          <Button type="primary" className="bg-[#263a29]" onClick={showModal}>
            Tạo mới máy in
          </Button>
        </div>
      </div>

      <br />
      <br />
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
          title={valueCate.id ? "Cập nhật máy in" : "Tạo mới máy in"}
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
              {valueCate.id ? "Cập nhật" : "Tạo mới"}
            </Button>,
          ]}
        >
          <div className="ant_body">
            <Form layout="vertical" form={form} name="form" onFinish={onFinish}>
              <Row>
                <Col span={24}>
                  <Form.Item label="Tên máy in" name="name">
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item label="Địa chỉ IP" name="ip_address">
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item label="Chọn loại máy in" name="printer_type">
                    <Select
                      name="printer_type"
                      allowClear
                      onChange={(e) => {
                        setPrintType(e);
                      }}
                    >
                      {listCatePrin?.length > 0 &&
                        listCatePrin.map((item, index) => {
                          return (
                            <Select.Option key={index} value={item[0]}>
                              {item[1]}
                            </Select.Option>
                          );
                        })}
                    </Select>
                  </Form.Item>
                </Col>
                {printType === "1" && (
                  <Col span={24}>
                    <Form.Item label="Chọn khu vực" name="area_id">
                      <Select name="area_id" allowClear>
                        {listCateArea?.length > 0 &&
                          listCateArea.map((item, index) => {
                            return (
                              <Select.Option key={index} value={item?.id}>
                                {item.name}
                              </Select.Option>
                            );
                          })}
                      </Select>
                    </Form.Item>
                  </Col>
                )}
              </Row>
            </Form>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default TableManagement;
