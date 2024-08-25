import { useEffect, useState } from "react";
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
  BorderOuterOutlined,
  BorderTopOutlined,
  HistoryOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";
import "./index.css";
import BillKitchen from "../Print/BillKitchen/BillKitchen";
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
  const user = sessionStorage.getItem("user");
  const [us, setUs] = useState();
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
    getItem("Quản lý order", "/order-management", <BorderOuterOutlined />),
    getItem("Quản lý doanh thu", "/revenue-management", <BorderTopOutlined />),
    getItem("Quản lý phiếu in bếp", "/bill-kitchen", <PrinterOutlined />),
    getItem("Quản lý phiếu in pha chế", "/bill-bar", <PrinterOutlined />),
    getItem("Lịch sử order", "/history-order-management", <HistoryOutlined />),
  ];
  const navigate = useNavigate();
  useEffect(() => {
    setUs(JSON.parse(user));
    if (!user) {
      navigate("/");
    }
  }, [user]);

  useEffect(() => {
    if (us) {
      if (us.role === "customer") {
        navigate("/order");
      }
    }
  }, [us]);

  const showContentMenu = (routes) => {
    let result = null;
    if (routes) {
      result = routes.map((item, index) => {
        return (
          <Route
            key={index}
            path={item.path}
            element={
              <div style={{ minHeight: "100vh" }}>{item.Conponent()}</div>
            }
          />
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
    <div>
      <Header />
      <div
        className="flex max-sm:flex max-sm:flex-col  h-full mt-24"
        style={{ backgroundColor: "#E4E4D0" }}
      >
        <Menu
          className="min-w-48 max-md:hidden fixed top-24 overflow-auto  "
          onClick={onClick}
          style={{
            backgroundColor: "#d7e2d4",
            height: "calc(100vh - 100px)",
          }}
          defaultSelectedKeys={["1"]}
          defaultOpenKeys={["sub1"]}
          mode="vertical"
          items={items}
        />
        <Menu
          className=" sm:hidden max-sm:flex max-sm:flex-wrap "
          onClick={onClick}
          style={{
            backgroundColor: "#d7e2d4",
          }}
          defaultSelectedKeys={["1"]}
          defaultOpenKeys={["sub1"]}
          mode="horizontal"
          items={items}
        />
        <div className=" bg-[#E4E4D0]  md:ml-48 flex-1 p-4">
          <Routes>{showContentMenu(routers)}</Routes>
        </div>
        {/* <div
          class="card-footer text-center fixed -z-1 bottom-0 md:ml-52 p-10 left-0  "
          style={{
            backgroundColor: "#5C9F67",
            color: "#fff",
            width: "100%",
          }}
        >
          @Copyright
        </div> */}
      </div>
    </div>
  );
};

export default DefaultLayout;
