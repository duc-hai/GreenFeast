import {
  Button,
  Col,
  DatePicker,
  Dropdown,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Space,
  message,
} from "antd";
import { Link, NavLink } from "react-router-dom";
import { UserOutlined } from "@ant-design/icons";
import "./styles.css";
import { useEffect, useState } from "react";
import { deleteCookie } from "./../../utils/Cookie";
import { editUserCustomer, updateStaff } from "../../Services/AuthAPI";
import dayjs from "dayjs";
import { getAllArea } from "../../Services/ManagementServiceAPI";
import { fetchTableCategory, getQR } from "../../Services/OrderAPI";

const Header = () => {
  const [us, setUs] = useState({});
  const user = sessionStorage.getItem("user");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenQR, setIsModalOpenQR] = useState(false);
  const [form] = Form.useForm();
  const [getArea, setGetArea] = useState([]);
  const [area, setArea] = useState();
  const [tableList, setTableList] = useState([]);
  const [table, setTable] = useState();
  const [qr, setQR] = useState();

  const fetchQr = async (tableId) => {
    try {
      const res = await getQR(tableId);
      setQR(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (table) {
      fetchQr(table);
    }
  }, [table]);
  const fetchTable = async (id) => {
    try {
      const res = await fetchTableCategory(id);
      setTableList(
        res.data?.map((item) => {
          return {
            key: item.slug,
            label: item._id,
            status: item.status,
          };
        })
      );
    } catch (error) {
      console.log(error);
    }
  };
  console.log(qr);
  useEffect(() => {
    if (area) {
      fetchTable(area);
    }
  }, [area]);

  useEffect(() => {
    const fetchArea = async () => {
      try {
        const res = await getAllArea();
        setGetArea(
          res.data?.map((item) => {
            return {
              key: item.id,
              label: item.name,
            };
          })
        );
      } catch (error) {
        console.log(error);
      }
    };
    fetchArea();
  }, []);

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    onFinish();
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  useEffect(() => {
    setUs(JSON.parse(user));
  }, [user]);

  useEffect(() => {
    if (us) {
      form.setFieldsValue({
        full_name: us.full_name,
        birthday: dayjs(us.birthday),
        gender: us.gender,
        phone_number: us.phone_number,
        email: us.email,
        address: us.address,
      });
    }
  }, [us]);
  const handleLogout = () => {
    sessionStorage.removeItem("user");
    deleteCookie("access_token");
    deleteCookie("refreshToken");
    deleteCookie("connect.sid");
    window.location.href = "/login";
  };
  const items = [
    {
      label: <p onClick={showModal}>Sửa thông tin</p>,
      key: "0",
    },
    {
      label: <p onClick={handleLogout}>Đăng xuất</p>,
      key: "1",
    },
  ];
  const onFinish = async () => {
    const values = form.getFieldsValue();

    try {
      if (us.role === "customer") {
        await editUserCustomer({
          ...values,
          birthday: dayjs(values.birthday).format("YYYY-MM-DD"),
        });
        message.success("Cập nhật thông tin thành công");
      } else {
        await updateStaff({
          ...values,
          birthday: dayjs(values.birthday).format("YYYY-MM-DD"),
        });
        message.success("Cập nhật thông tin thành công");
      }
      handleCancel();
    } catch (error) {
      console.log(error);
      message.error(error.response.data.message);
    }
  };

  return (
    <div>
      <Modal
        className="headerModal"
        title="Cập nhật thông tin tài khoản"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={[
          <Button key="back" danger onClick={handleCancel}>
            ĐÓNG
          </Button>,
          <Button
            type="primary"
            // loading={loading}
            form="form"
            name="form"
            onClick={handleOk}
          >
            Cập nhật
          </Button>,
        ]}
        bodyStyle={{ height: "1280" }}
      >
        <div className="ant_body">
          <Form layout="vertical" form={form} name="form">
            <Row>
              <Col span={24}>
                <Form.Item label="Họ tên" name="full_name">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item label="Ngày sinh" name="birthday">
                  <DatePicker style={{ width: "100%" }} />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item label="Giới tính" name="gender">
                  <Select
                    name="gender"
                    placeholder="Chọn giới tính"
                    // onChange={onGenderChange}
                    allowClear
                  >
                    <Select.Option key={1} value={"nam"}>
                      Nam
                    </Select.Option>
                    <Select.Option key={2} value={"nữ"}>
                      Nữ
                    </Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item label="Số điện thoại" name="phone_number">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item label="Email" name="email">
                  <Input type="email" />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item label="Địa chỉ" name="address">
                  <Input />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>
      </Modal>
      <Modal
        className="headerModal"
        title="Tạo QR"
        open={isModalOpenQR}
        onCancel={() => {
          setIsModalOpenQR(false);
        }}
        footer={[
          <Button
            key="back"
            danger
            type="primary"
            onClick={() => {
              setIsModalOpenQR(false);
            }}
          >
            ĐÓNG
          </Button>,
        ]}
        bodyStyle={{ height: "1280" }}
      >
        <div className="ant_body">
          <div className="flex w-full justify-between py-3">
            <div className="flex flex-col w-[48%] gap-2">
              <span className="font">Chọn tầng</span>
              <Select
                name="gender"
                placeholder="Chọn tầng"
                allowClear
                onChange={(value) => {
                  setArea(value);
                }}
              >
                {getArea?.map((item) => (
                  <Select.Option key={item.key} value={item.key}>
                    {item.label}
                  </Select.Option>
                ))}
              </Select>
            </div>
            <div className="flex flex-col w-[48%] gap-2">
              <span className="font">Chọn bàn</span>
              <Select
                disabled={tableList?.length === 0}
                name="gender"
                placeholder="Chọn bàn"
                allowClear
                onChange={(value) => {
                  setTable(value);
                }}
              >
                {tableList?.map((item) => {
                  if (item.status === 0)
                    return (
                      <Select.Option key={item.key} value={item.label}>
                        {item.label}
                      </Select.Option>
                    );
                })}
              </Select>
            </div>
          </div>

          {qr && (
            <div className="flex items-center justify-center mt-2">
              <img src={qr} alt="" />
            </div>
          )}
        </div>
      </Modal>
      <nav className="navbar navbar-expand-lg navbar-light bg-memu custom flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/">
            <img className="img-hd" alt="logo" src={"../logo.png"} />
          </Link>
          <div className="flex gap-6 ml-5">
            <Link to="/" style={{ fontSize: 18 }}>
              Trang chủ
            </Link>

            {us?.role === "customer" ? (
              <Link to="/order" style={{ fontSize: 18 }}>
                Đặt món
              </Link>
            ) : (
              <div className="flex gap-6">
                {us && (
                  <Link to="/menu-management" style={{ fontSize: 18 }}>
                    Quản lý
                  </Link>
                )}
                <Link to="/order" style={{ fontSize: 18 }}>
                  Đặt món
                </Link>
              </div>
            )}
          </div>
        </div>
        <div className="flex gap-6">
          {us?.full_name ? (
            <div className="flex items-center gap-4">
              <div>Xin chào, {us?.full_name || "Khách"}</div>
              <Dropdown menu={{ items }} trigger={["click"]}>
                <p className="p-2 bg-white rounded-full">
                  <UserOutlined style={{ color: "black" }} />
                </p>
              </Dropdown>
            </div>
          ) : (
            <NavLink to="/login" style={{ fontSize: 18 }}>
              <Button type="primary">Đăng nhập</Button>
            </NavLink>
          )}
          <Button
            type="primary"
            onClick={() => {
              setIsModalOpenQR(true);
            }}
          >
            Tạo QR
          </Button>
        </div>
      </nav>
    </div>
  );
};
export default Header;
