import { Link, useNavigate } from "react-router-dom";
import { Button, Checkbox, Form, Input, notification, Spin } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { requestLoginService } from "../../Services/loginService";
import { useState } from "react";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import "./index.css";
const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const onFinish = async (values) => {
    setIsLoading(true);
    const response = await requestLoginService(values);
    if (response.status === 200) {
      localStorage.setItem("username", values.username);
      notification.success({ message: "Đăng nhập thành công" });
      localStorage.setItem("token", response.data.data.access_token);
      localStorage.setItem("refresh_token", response.data.data.refresh_token);
      navigate("/order");
    } else {
      openNotification("Sai tên đăng nhập hoặc mật khẩu");
    }
    setIsLoading(false);
  };

  const openNotification = (title) => {
    notification.open({
      message: "ĐĂNG NHẬP",
      description: title,
      icon: (
        <CloseOutlined
          style={{
            color: "red",
          }}
        />
      ),
    });
  };
  return (
    <>
      <Spin tip="Loading..." spinning={isLoading}>
        <div className="min-h-[100vh] max-h-[100vh] flex items-center justify-center bg-[#d4e3d3]">
          <Form
            name="normal_login"
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
            <div className="mt-3">
              <Checkbox>Nhớ tài khoản</Checkbox>
              <a className="float-right text-white" href="">
                Quên mật khẩu
              </a>
            </div>
            <Form.Item>
              <Button
                style={{ backgroundColor: " #263A29", color: "#fff" }}
                htmlType="submit"
                className="login-form-button"
              >
                Đăng nhập
              </Button>
            </Form.Item>
            <span>
              Bạn chưa có tài khoản?{" "}
              <a
                className=""
                style={{ paddingLeft: 0, color: "#fff" }}
                href="/register"
              >
                Đăng ký
              </a>{" "}
              tại đây
            </span>
          </Form>
        </div>
      </Spin>
    </>
  );
};

export default Login;
