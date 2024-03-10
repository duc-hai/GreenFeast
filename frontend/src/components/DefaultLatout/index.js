import { useEffect } from "react";
import { Link, Route, Routes, useNavigate } from "react-router-dom";
import routers from "../../routers";
import Header from "../Header";
import {
  AppstoreOutlined,
  PrinterOutlined,
  SettingOutlined,
  CalculatorFilled,
  PercentageOutlined,
  ProductOutlined,
  UsergroupDeleteOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";
import "./index.css";
function getItem(label, key, icon, children, type) {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
}
const DefaultLayout = () => {
  const items = [
    getItem("Quản lý thực đơn", "/menu-management", <AppstoreOutlined />),
    getItem(
      "Quản lý danh mục món",
      "/categories-management",
      <SettingOutlined />
    ),
    getItem("Quản lý bàn", "/table-management", <CalculatorFilled />),
    getItem("Quản khu vực", "/area-management", <ProductOutlined />),
    getItem("Quản lý khuyến mãi", "/sale-management", <PercentageOutlined />),
    getItem(
      "Quản lý nhân viên",
      "/staff-management",
      <UsergroupDeleteOutlined />
    ),
    getItem("Quản lý máy in", "/printf-management", <PrinterOutlined />),
  ];
  const navigate = useNavigate();
  useEffect(() => {
    const user = sessionStorage.getItem("user");
    console.log(JSON.parse(user));
    if (!user) {
      navigate("/");
    }
  }, []);
  const showContentMenu = (routes) => {
    let result = null;
    if (routes) {
      result = routes.map((item, index) => {
        return (
          <Route key={index} path={item.path} element={item.Conponent()} />
        );
      });
    }
    return result;
  };
  const onClick = (e) => {
    console.log("click ", e);
    navigate(e.key);
  };
  return (
    <>
      <Header />
      <div className="content-body">
        <Menu
          className="ant-menu-custom-2 display-menu-1"
          onClick={onClick}
          style={{
            width: 256,
          }}
          defaultSelectedKeys={["1"]}
          defaultOpenKeys={["sub1"]}
          mode="inline"
          items={items}
        />

        <Routes>{showContentMenu(routers)}</Routes>
      </div>
      <div
        class="card-footer text-center"
        style={{ backgroundColor: "#5C9F67", color: "#fff" }}
      >
        @Copyright
      </div>
    </>
  );
};

export default DefaultLayout;
