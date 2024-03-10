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
  Checkbox,
  message,
  notification,
  Popconfirm,
} from "antd";

import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { DatePicker } from "antd";
import {
  createPromotion,
  deletePromotion,
  fetchFormPromotion,
  getPromotion,
  updatePromotion,
} from "../../Services/ManagementServiceAPI";

const { RangePicker } = DatePicker;
const SaleManagement = () => {
  const [formPromotion, setFormPromotion] = useState("");
  const [listData, setListData] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const fechData = async () => {
    try {
      const res = await getPromotion();
      setListData(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fechData();
  }, []);

  useEffect(() => {
    const fetchDataPromotion = async () => {
      try {
        const res = await fetchFormPromotion();
        setFormPromotion(Object.entries(res?.data));
      } catch (error) {
        console.log(error);
      }
    };
    fetchDataPromotion();
  }, []);
  const editMenu = (record) => {};
  const deleteMenu = async (record) => {
    try {
      await deletePromotion(record.id);
      message.success("Xóa danh mục món thành công");
    } catch (error) {
      console.log(error);
      message.error("Xóa danh mục món thất bại");
    }
    fechData();
  };
  const columns = [
    {
      title: "Mã Khuyến mãi",
      dataIndex: "id",
      key: "id",
      render: (saleId) => <span className="font-semibold">{saleId}</span>,
    },
    {
      title: "Tên khuyến mãi",
      dataIndex: "name",
      key: "name ",
      render: (code) => <span className="font-semibold">{code}</span>,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <span className="font-semibold">
          {status ? "Đang hoạt động" : "Dừng hoạt động"}
        </span>
      ),
    },

    {
      title: "Giảm giá",
      dataIndex: "promotion_value",
      key: "promotion_value",
      render: (sale) => <span className="font-semibold">{sale}</span>,
    },

    {
      title: "Hoạt động",
      render: (_, record) => (
        <Space size="middle">
          <button>
            <EditOutlined
              className="text-[#263a29] text-2xl"
              onClick={() => {
                setIsEdit(true);
                showModal(record);
              }}
            />
          </button>
          <Popconfirm
            title="Delete the task"
            description="Are you sure to delete this task?"
            onConfirm={() => {
              deleteMenu(record);
            }}
            onCancel={() => {}}
            okText="Yes"
            cancelText="No"
          >
            <DeleteOutlined style={{ fontSize: "22px", color: "red" }} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = (value) => {
    if (value) {
      form.setFieldsValue({
        id: value.id,
        name: value.name,
        status: value.status,
        form_promotion: value.form_promotion,
        condition_apply: value.condition_apply,
        promotion_value: value.promotion_value,
        note: value.note,
        auto_apply: value.auto_apply,
      });
    }
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const onFinish = async (values) => {
    if (
      values.name === undefined ||
      values.status === undefined ||
      values.form_promotion === undefined ||
      values.condition_apply === undefined ||
      values.promotion_value === undefined ||
      values.note === undefined
    ) {
      notification.error({
        message: "Vui lòng nhập đầy đủ thông tin",
      });
      return;
    }
    console.log({
      name: values.name,
      status: values.status,
      form_promotion: parseInt(values.form_promotion),
      condition_apply: parseInt(values.condition_apply),
      promotion_value: values.promotion_value,
      note: values.note,
      auto_apply: values.auto_apply,
      end_at: values?.time_apply
        ? values.time_apply[1].format("YYYY-MM-DD")
        : "",
      start_at: values?.time_apply
        ? values.time_apply[0].format("YYYY-MM-DD")
        : "",
    });
    try {
      if (isEdit) {
        updatePromotion(values.id, {
          name: values.name,
          status: values.status,
          form_promotion: parseInt(values.form_promotion),
          condition_apply: parseInt(values.condition_apply),
          promotion_value: values.promotion_value,
          note: values.note,
          auto_apply: values.auto_apply,
          end_at: values?.time_apply
            ? values.time_apply[1].format("YYYY-MM-DD")
            : "",
          start_at: values?.time_apply
            ? values.time_apply[0].format("YYYY-MM-DD")
            : "",
        });
        notification.success({
          message: "Cập nhật thành công",
        });
        setIsModalOpen(false);
      } else {
        await createPromotion({
          name: values.name,
          status: values.status,
          form_promotion: parseInt(values.form_promotion),
          condition_apply: parseInt(values.condition_apply),
          promotion_value: values.promotion_value,
          note: values.note,
          auto_apply: values.auto_apply,
          end_at: values?.time_apply
            ? values.time_apply[1].format("YYYY-MM-DD")
            : "",
          start_at: values?.time_apply
            ? values.time_apply[0].format("YYYY-MM-DD")
            : "",
        });
        notification.success({
          message: "Tạo mới thành công",
        });
        setIsModalOpen(false);
      }
    } catch (error) {
      console.log(error);
    }
    fechData();
  };
  const [form] = Form.useForm();
  console.log(formPromotion);
  return (
    <>
      <div className="content-component">
        <div className="flex justify-between bg-[#5c9f67] p-2 rounded-sm">
          <div className="text-xl font-semibold pl-2 text-white">
            Quản lý khuyến mãi
          </div>
          <div className="pr-2">
            <Button
              type="primary"
              className="bg-[#263a29]"
              onClick={() => {
                setIsEdit(false);
                showModal();
              }}
            >
              Thêm mới khuyến mãi
            </Button>
          </div>
        </div>
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
            title="Tạo mới mã khuyến mãi"
            open={isModalOpen}
            onOk={onFinish}
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
                    <Form.Item label="Tên mã khuyến mãi" name="name">
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    <Form.Item label="Trạng thái mã khuyến mãi" name="status">
                      <Select
                        name="status"
                        placeholder="Chọn trạng thái mã khuyến mãi"
                        allowClear
                      >
                        <Select.Option value={true}>Hoạt động</Select.Option>
                        <Select.Option value={false}>
                          Không hoạt động
                        </Select.Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    <Form.Item label="Hình thức áp dụng" name="form_promotion">
                      <Select
                        name="form_promotion"
                        placeholder="Chọn Hình thức áp dụng"
                        // onChange={onGenderChange}
                        allowClear
                      >
                        {formPromotion?.length > 0 &&
                          formPromotion?.map((value, index) => {
                            return (
                              <Select.Option key={index} value={value[0]}>
                                {value[1]}
                              </Select.Option>
                            );
                          })}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    <Form.Item label="Điều kiện áp dụng" name="condition_apply">
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    <Form.Item
                      label="Giá trị khuyến mãi"
                      name="promotion_value"
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    <Form.Item label="Ghi chú" name="note">
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    <Form.Item label="Thời gian áp dụng" name="time_apply">
                      <RangePicker size={"middle"} format={"DD/MM/YYYY"} />
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    <Form.Item name="auto_apply" valuePropName="checked">
                      <Checkbox>Tự động áp dụng </Checkbox>
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

export default SaleManagement;
