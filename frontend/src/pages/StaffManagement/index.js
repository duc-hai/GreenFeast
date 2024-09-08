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
  message,
} from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import "./index.css";
import { createStaff, getEmployee, getResource } from "../../Services/AuthAPI";
const AreaManagement = () => {
  const [resource, setResource] = useState([]);
  const [grants, setGrants] = useState([]);
  const [role, setRole] = useState("");
  // const [valueCate, setValueCate] = useState({});
  const [listDataEmployee, setListDataEmployee] = useState([]);
  const [gender, setGender] = useState(null);

  const fetchDataEmployee = async () => {
    try {
      const res = await getEmployee();
      setListDataEmployee(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchDataEmployee();
  }, []);

  console.log(listDataEmployee);
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

  const columns = [
    {
      title: "Họ tên",
      dataIndex: "full_name",
      key: "full_name",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone_number",
      key: "phone_number",
    },
    {
      title: "Giới tính",
      dataIndex: "gender",
      key: "gender ",
      render: (text) => <span>{text === "Male" ? "Nam" : "Nữ"}</span>,
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      key: "address",
    },

    // {
    //   title: "Thao tác",
    //   render: (_, record) => (
    //     <Space size="middle">
    //       <button
    //         onClick={() => {
    //           setValueCate(record);
    //           form.setFieldsValue(record);
    //           showModal();
    //         }}
    //       >
    //         <EditOutlined className="text-[#263a29] text-2xl" />
    //       </button>
    //       {/* <button onClick={() => deleteMenu(record)}>
    //         <DeleteOutlined className="text-red-500 text-2xl" />
    //       </button> */}
    //     </Space>
    //   ),
    // },
  ];

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

  const onFinish = async (values) => {
    if (role === "other" && !grants) {
      message.error("Chọn quyền");
      return;
    }

    console.log(grants);
    console.log({
      ...grants,
      actions:
        grants?.actions?.length > 0 &&
        grants?.actions?.map((item) => item.slug),
    });
    if (
      values.username === "" ||
      values.password === "" ||
      values.full_name === "" ||
      values.role === "" ||
      values.position === "" ||
      values.experience === "" ||
      !values?.gender
    ) {
      message.error("Nhập đầy đủ thông tin");
      return;
    }

    try {
      const res = await createStaff({
        username: values.username,
        password: values.password,
        full_name: values.full_name,
        address: values.address,
        role: values.role,
        position: values.position,
        experience: values.experience,
        gender: values?.gender,
        grants: grants?.map((item) => {
          return {
            ...item,
            actions:
              item?.actions?.length > 0 &&
              item?.actions?.map((item) => item.slug),
          };
        }),
      });
      if (res.status === "success") {
        message.success("Tạo nhân viên thành công");
        setIsModalOpen(false);
        form.resetFields();
      }
    } catch (error) {
      message.error("Tạo nhân viên thất bại");
      console.log(error);
    }
  };
  const [form] = Form.useForm();

  return (
    <div className="bg-[#E4E4D0] md:p-4 ">
      <div className="flex justify-between bg-[#5c9f67] p-2 rounded-sm">
        <div className="text-xl font-semibold pl-2 text-white">
          Quản lý nhân viên
        </div>
        <div>
          <Button type="primary" className="bg-[#263a29]" onClick={showModal}>
            Thêm mới
          </Button>
        </div>
      </div>

      <br />
      <br />
      <Table
        columns={columns}
        dataSource={listDataEmployee}
        pagination={false}
        scroll={{ y: "calc(100vh - 300px)" }}
      />

      <div className="modal">
        <Modal
          className="headerModal"
          title="Tạo tài khoản nhân viên"
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
          footer={[
            <Button danger onClick={handleCancel}>
              ĐÓNG
            </Button>,
            <Button
              htmlType="submit"
              type="primary"
              // loading={loading}
              form="form"
              name="form"
            >
              Tạo nhân viên
            </Button>,
          ]}
          bodyStyle={{ height: "1280" }}
        >
          <div className="ant_body overflow-auto max-h-[400px]">
            <Form layout="vertical" form={form} name="form" onFinish={onFinish}>
              <Row>
                <Col span={24}>
                  <Form.Item name="id" hidden>
                    <Input hidden />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item label="Số điện thoại" name="username">
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item label="Mật khẩu" name="password">
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item label="Họ và tên" name="full_name">
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item label="Địa chỉ" name="address">
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item label="Giới tính" name="gender">
                    <Select
                      name="role"
                      onChange={(e) => setGender(e)}
                      allowClear
                    >
                      <Select.Option value={"Male"}>Nam</Select.Option>
                      <Select.Option value={"Female"}>Nữ</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item label="Vai trò" name="role">
                    <Select
                      name="role"
                      onChange={(e) => {
                        if (e !== "other") setGrants([]);
                        setRole(e);
                      }}
                      allowClear
                    >
                      <Select.Option value={"cashier"}>
                        Nhân viên thu ngân
                      </Select.Option>
                      <Select.Option value={"waitstaff"}>
                        Nhân viên phục vụ{" "}
                      </Select.Option>
                      <Select.Option value={"expeditor"}>
                        Nhân viên tiếp thực
                      </Select.Option>
                      <Select.Option value={"other"}>Khác</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item label="Vị trí" name="position">
                    <Input />
                  </Form.Item>
                </Col>

                {role === "other" && (
                  <Col span={24}>
                    <Form.Item label="Cấp quyền">
                      <Select
                        name="category_id"
                        mode="multiple"
                        onChange={(_, select) => {
                          setGrants(
                            select?.map((item) => {
                              return item.data;
                            })
                          );
                        }}
                        allowClear
                      >
                        {resource?.length > 0 &&
                          resource.map((item, index) => {
                            return (
                              <Select.Option
                                key={index}
                                value={item.id}
                                data={item}
                              >
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

export default AreaManagement;
