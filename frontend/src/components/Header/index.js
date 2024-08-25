import {
  Button,
  Col,
  DatePicker,
  Dropdown,
  Form,
  Input,
  Menu,
  Modal,
  Row,
  Select,
  Space,
  message,
} from "antd";
import { Link, NavLink } from "react-router-dom";
import { BellOutlined, MenuOutlined, UserOutlined } from "@ant-design/icons";
import "./styles.css";
import { useEffect, useState } from "react";
import { deleteCookie } from "./../../utils/Cookie";
import { editUserCustomer, updateStaff } from "../../Services/AuthAPI";
import dayjs from "dayjs";
import { getAllArea } from "../../Services/ManagementServiceAPI";
import { fetchTableCategory, getQR } from "../../Services/OrderAPI";
import { verifyMail, verifyOtp } from "../../Services/Notification";
import NotifyHeader from "./NotifyHeader";
import Cookies from "js-cookie";
const Header = () => {
  const [us, setUs] = useState({});
  const user = sessionStorage.getItem("user");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenEmail, setIsModalOpenEmail] = useState(false);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
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

    // đăng xuất
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
    !us?.email && {
      label: (
        <p
          onClick={() => {
            setIsModalOpenEmail(true);
          }}
        >
          Xác thực email
        </p>
      ),
      key: "1",
    },
    {
      label: <p onClick={handleLogout}>Đăng xuất</p>,
      key: "2",
    },
  ];

  const itemUser = [
    {
      label: (
        <Link to="/order/at-restaurant" style={{ fontSize: 18 }}>
          Đặt món
        </Link>
      ),
      key: "scan_qr",
    },
    {
      label: (
        <Link to="/order-online" style={{ fontSize: 18 }}>
          Đặt món trực tuyến
        </Link>
      ),
      key: "order-online",
    },
    {
      label: (
        <Link to="/order-history" style={{ fontSize: 18 }}>
          Lịch sử đặt món
        </Link>
      ),
      key: "/order-history",
    },
  ];

  const itemAdmin = [
    {
      label: (
        <Link to="/menu-management" style={{ fontSize: 18 }}>
          Quản lý
        </Link>
      ),
      key: "menu-management",
    },
    {
      label: (
        <Link to="/order/at-restaurant" style={{ fontSize: 18 }}>
          Đặt món
        </Link>
      ),
      key: "scan_qr",
    },
    {
      label: (
        <Link to="/order-online" style={{ fontSize: 18 }}>
          Đặt món trực tuyến
        </Link>
      ),
      key: "order-online",
    },
    {
      label: (
        <Link to="/admin-chart" style={{ fontSize: 18 }}>
          Báo cáo kinh doanh
        </Link>
      ),
      key: "admin-chart",
    },
  ];

  const fetchEditUserCustomer = async (value) => {
    try {
      const res = await editUserCustomer(value);
      if (res?.status === "success") {
        message.success("Cập nhật thông tin thành công");
        handleCancel();
        handleLogout();
      } else {
        message.error("Cập nhật thông tin thất bại");
      }
    } catch (error) {
      console.log(error);
      message.error(error.response.data.message);
    }
  };
  const fetchUpdateStaff = async (value) => {
    try {
      const res = await updateStaff(value);
      if (res?.status === "success") {
        message.success("Cập nhật thông tin thành công");
        handleCancel();
        handleLogout();
      } else {
        message.error("Cập nhật thông tin thất bại");
      }
    } catch (error) {
      console.log(error);
      message.error(error.response.data.message);
    }
  };
  const onFinish = () => {
    const values = form.getFieldsValue();
    if (us.role === "customer") {
      fetchEditUserCustomer({
        ...values,
        birthday: dayjs(values.birthday).format("YYYY-MM-DD"),
      });
    } else {
      fetchUpdateStaff({
        ...values,
        birthday: dayjs(values.birthday).format("YYYY-MM-DD"),
      });
    }
  };
  // const onFinish = async () => {
  //   const values = form.getFieldsValue();

  //   try {
  //     if (us.role === "customer") {
  //       await editUserCustomer({
  //         ...values,
  //         birthday: dayjs(values.birthday).format("YYYY-MM-DD"),
  //       });
  //       message.success("Cập nhật thông tin thành công");
  //     } else {
  //       await updateStaff({
  //         ...values,
  //         birthday: dayjs(values.birthday).format("YYYY-MM-DD"),
  //       });
  //       message.success("Cập nhật thông tin thành công");
  //     }
  //     handleCancel();
  //   } catch (error) {
  //     console.log(error);
  //     message.error(error.response.data.message);
  //   }
  // };

  const checkRole = (value, role) => {
    if (role === "customer") return itemUser;
    if (value) return itemAdmin;
    return itemUser?.filter((item, index) => index !== 2);
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
        title="Xác thực mail"
        open={isModalOpenEmail}
        onCancel={() => {
          setIsModalOpenEmail(false);
        }}
        footer={[
          <Button
            key="back"
            danger
            onClick={() => {
              setIsModalOpenEmail(false);
            }}
          >
            ĐÓNG
          </Button>,
          // <Button
          //   type="primary"
          //   // loading={loading}
          //   form="form"
          //   name="form"
          //   onClick={() => {
          //     setIsModalOpenEmail(false);
          //   }}
          // >
          //   Xác nhận
          // </Button>,
        ]}
        bodyStyle={{ height: "1280" }}
      >
        <div className="ant_body">
          <Form layout="vertical">
            <Row>
              <div className="grid grid-cols-5 items-center gap-3 w-full">
                <div className="col-span-4">
                  <Form.Item label="Email" name="email">
                    <Input
                      placeholder="Nhập địa chỉ email"
                      onChange={(e) => {
                        setEmail(e.target.value);
                      }}
                    />
                  </Form.Item>
                </div>

                <div className="translate-y-[3px]">
                  <Button
                    type="text"
                    onClick={async () => {
                      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

                      try {
                        if (!email) {
                          message.error("Vui lòng nhập email");
                          return;
                        }

                        if (!emailRegex.test(email)) {
                          message.error("Email không đúng định dạng");
                          return;
                        }
                        await verifyMail({ email: email });
                        message.success("Đã gửi mã xác nhận");
                      } catch (e) {
                        console.log(e);
                        message.error("Đã có lỗi xảy ra");
                      }
                    }}
                  >
                    Gửi mã
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-5 items-center gap-3 w-full">
                <div className="col-span-4">
                  <Form.Item label="Nhập mã xác nhận" name="otpcode">
                    <Input
                      placeholder="Nhập mã xác nhận gửi về mail"
                      onChange={(e) => {
                        setCode(e.target.value);
                      }}
                    />
                  </Form.Item>
                </div>

                <div className="translate-y-[3px]">
                  <Button
                    type="text"
                    onClick={async () => {
                      try {
                        if (!code) {
                          message.error("Vui lòng nhập code");
                          return;
                        }
                        await verifyOtp({ otp: code, userId: us?._id });
                        message.success("Xác thực thành công");
                        setUs({ ...us, email: email });
                        localStorage.setItem(
                          "user",
                          JSON.stringify({ ...us, email: email })
                        );
                        setIsModalOpenEmail(false);
                      } catch (e) {
                        console.log(e);
                        message.error("Mã xác thực không đúng");
                      }
                    }}
                  >
                    Xác nhận
                  </Button>
                </div>
              </div>
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
              <span className="font">Chọn bàn </span>
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
      <nav className=" fixed top-0 left-0 w-full z-10 h-24 navbar navbar-expand-lg navbar-light bg-memu custom flex items-center justify-between  ">
        <div className="flex items-center max-lg:hidden">
          <Link to="/">
            <img className="img-hd" alt="logo" src={"../logo.png"} />
          </Link>
          <div className="flex gap-6 ml-5">
            <Link to="/" style={{ fontSize: 18 }}>
              Trang chủ
            </Link>

            {us?.role === "customer" ? (
              <div className="flex items-center gap-8">
                <Link to="/order/at-restaurant" style={{ fontSize: 18 }}>
                  Đặt món
                </Link>

                <Link to="/order-online" style={{ fontSize: 18 }}>
                  Đặt món trực tuyến
                </Link>
                <Link to="/order-history" style={{ fontSize: 18 }}>
                  Lịch sử đặt món
                </Link>
              </div>
            ) : (
              <div className="flex gap-6">
                {us && (
                  <Link to="/menu-management" style={{ fontSize: 18 }}>
                    Quản lý
                  </Link>
                )}
                <Link to="/order/at-restaurant" style={{ fontSize: 18 }}>
                  Đặt món
                </Link>

                <Link to="/order-online" style={{ fontSize: 18 }}>
                  Đặt món trực tuyến
                </Link>

                {us?.role === "admin" && (
                  <Link to="/admin-chart" style={{ fontSize: 18 }}>
                    Báo cáo kinh doanh
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="lg:hidden">
          <Dropdown
            trigger={["click"]}
            menu={{
              items: checkRole(us, us?.role),
            }}
          >
            <MenuOutlined />
          </Dropdown>
        </div>

        <div className="flex gap-6 ">
          {us?.full_name ? (
            <>
              <div className="flex items-center gap-4">
                <NotifyHeader />
              </div>
              <div className="flex items-center gap-4">
                <div>Xin chào, {us?.full_name || "Khách"}</div>
                <Dropdown menu={{ items }} trigger={["click"]}>
                  <p className="p-2 bg-white rounded-full">
                    <UserOutlined style={{ color: "black" }} />
                  </p>
                </Dropdown>
              </div>
            </>
          ) : (
            <NavLink to="/login" style={{ fontSize: 18 }}>
              <Button type="primary">Đăng nhập</Button>
            </NavLink>
          )}
          {us && us?.role !== "customer" && (
            <Button
              type="primary"
              onClick={() => {
                setIsModalOpenQR(true);
              }}
            >
              Tạo QR
            </Button>
          )}
        </div>
      </nav>
    </div>
  );
};
export default Header;
