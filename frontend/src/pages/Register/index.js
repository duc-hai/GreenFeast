import { Link, useNavigate } from "react-router-dom";
import { Button, Checkbox, Form, Input, notification, Spin } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { useState } from "react";
import { UserOutlined, LockOutlined } from "@ant-design/icons";

const Register = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const onFinish = async (values) => {
    setIsLoading(true);

    setIsLoading(false);
  };

  return (
    <>
      <Spin tip="Loading..." spinning={isLoading}>
        <div className="min-h-[100vh] max-h-[100vh] flex items-center justify-center bg-[#d4e3d3]">
          <Form
            name="normal_Register"
            className="bg-[#5C9F67] w-[600px] p-5 rounded-xl shadow-2xl"
            initialValues={{
              remember: true,
            }}
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
                  message: "Please input your Username!",
                },
              ]}
            >
              <Input prefix={<UserOutlined />} placeholder="Tên tài khoản" />
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
              <Input
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
              <Input
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                placeholder="Nhập lại mật khẩu"
              />
            </Form.Item>

            <Form.Item>
              <Button
                style={{ backgroundColor: " #263A29", color: "#fff" }}
                htmlType="submit"
                className="w-full"
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
