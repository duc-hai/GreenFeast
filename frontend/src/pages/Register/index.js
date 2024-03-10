import { Link, useNavigate } from "react-router-dom";
import { Button, Checkbox, Form, Input, notification, Spin } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { useState } from "react";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { createUser } from "./../../Services/AuthAPI";

const Register = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const onFinish = async (values) => {
    if (
      !values.username ||
      !values.password ||
      !values.rePassword ||
      !values.full_name
    ) {
      notification.open({
        message: "Vui lòng nhập đầy đủ thông tin",
        description: "Vui lòng nhập đầy đủ thông tin",
        icon: <CloseOutlined style={{ color: "red" }} />,
      });
      return;
    }
    if (values.password !== values.rePassword) {
      notification.open({
        message: "Mật khẩu không khớp",
        description: "Vui lòng nhập lại mật khẩu",
        icon: <CloseOutlined style={{ color: "red" }} />,
      });
      return;
    }
    setIsLoading(true);
    try {
      const res = await createUser(values);
      notification.open({
        message: "Đăng ký thành công",
        description: "Đăng ký thành công",
        icon: <CloseOutlined style={{ color: "green" }} />,
      });
      navigate("/login");
    } catch (error) {
      notification.open({
        message: "Đăng ký thất bại",
        description: "Đăng ký thất bại",
        icon: <CloseOutlined style={{ color: "red" }} />,
      });
    }

    setIsLoading(false);
  };

  return (
    <>
      <Spin tip="Loading..." spinning={isLoading}>
        <div className="min-h-[100vh] max-h-[100vh] flex items-center justify-center bg-[#d4e3d3]">
          <Form
            className="bg-[#5C9F67] w-[600px] p-5 rounded-xl shadow-2xl"
            onFinish={onFinish}
          >
            <div className="flex items-center justify-center mb-3">
              <Link to="/">
                <img className="center-image" alt="logo" src={"../logo.png"} />
              </Link>
            </div>

            <Form.Item
              name="username"
              rules={[
                {
                  required: true,
                  message: "Please input your Số điện thoại!",
                },
              ]}
            >
              <Input prefix={<UserOutlined />} placeholder="Số điện thoại" />
            </Form.Item>
            <Form.Item
              name="full_name"
              rules={[
                {
                  required: true,
                  message: "Please input your Fullname!",
                },
              ]}
            >
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                type="text"
                placeholder="Họ và tên"
              />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  message: "Please input your Password!",
                },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                placeholder="Mật khẩu"
              />
            </Form.Item>
            <Form.Item
              name="rePassword"
              rules={[
                {
                  required: true,
                  message: "Please input your Password!",
                },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                placeholder="Nhập lại mật khẩu"
              />
            </Form.Item>

            <Form.Item>
              <Button
                style={{ backgroundColor: " #263A29", color: "#fff" }}
                className="w-full"
                type="primary"
                htmlType="submit"
              >
                Đăng ký
              </Button>
            </Form.Item>
            <span>
              Bạn đã có tài khoản?{" "}
              <a
                className=""
                style={{ paddingLeft: 0, color: "#fff" }}
                href="/login"
              >
                Đăng nhập
              </a>{" "}
              tại đây
            </span>
          </Form>
        </div>
      </Spin>
    </>
  );
};

export default Register;
