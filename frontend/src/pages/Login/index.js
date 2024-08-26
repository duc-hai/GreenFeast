import { Link, useNavigate } from "react-router-dom";
import { Button, Checkbox, Form, Input, Modal, notification, Spin } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import "./index.css";
import { loginAdmin, loginUser } from "../../Services/AuthAPI";
import { setCookie } from "../../utils/Cookie";

import AuthGoogle from "../AuthGoogle/AuthoGoogle";

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const navigate = useNavigate();
  const onFinish = async (values) => {
    setIsLoading(true);
    try {
      let response;
      if (isAdmin) {
        response = await loginAdmin(values);

        console.log(response);
        navigate("/menu-management");
      } else {
        response = await loginUser(values);

        navigate("/");
      }
      setCookie(
        "refreshToken",
        response?.data?.refresh_token,
        values.remember ? 30 : 1
      );
      setCookie(
        "accessToken",
        response?.data?.access_token,
        values.remember ? 30 : 1
      );
      sessionStorage.setItem("user", JSON.stringify(response?.data?.data));
      notification.open({
        message: "Đăng nhập thành công",
        description: "Đăng nhập thành công",
        icon: <CloseOutlined style={{ color: "green" }} />,
      });
      if (!response?.data?.data?.isVerifyEmail) {
        notification.open({
          message: "Xác thực email",
          description:
            "Vui lòng xác thực email để bảo mật tài khoản và nhận các thông báo từ website",
        });
      }
    } catch (error) {
      notification.open({
        message: "Đăng nhập thất bại",
        description: "Vui lòng kiểm tra lại tài khoản và mật khẩu.",
        icon: <CloseOutlined style={{ color: "green" }} />,
      });
    }
    setIsLoading(false);
  };

  useEffect(() => {
    const user = sessionStorage.getItem("user");
    if (user) {
      navigate("/");
    }
  }, []);
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
              <Input prefix={<UserOutlined />} placeholder="Số điện thoại" />
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
            <div className="my-3">
              <Checkbox
                onChange={(e) => {
                  setIsAdmin(e.target.checked);
                }}
              >
                Đăng nhập admin
              </Checkbox>
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

            <div className="pb-2">
              Đăng ký bằng google:{" "}
              {/* <a href="http://localhost:3000/api/auth/google">
                <GoogleOutlined style={{ fontSize: "24px" }} />
              </a> */}
              <AuthGoogle />
            </div>

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
