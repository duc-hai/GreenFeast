import { Button, Space } from "antd";
import FoodComponent from "../../components/FoodCompoent";
import {
  AppstoreOutlined,
  MailOutlined,
  SettingOutlined,
  CalculatorFilled,
  HddOutlined,
  GatewayOutlined,
  LaptopOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";
import "./index.css";
import { Link } from "react-router-dom";
const dataTemp = [
  {
    id: 5,
    name: "Món chay 0",
    description: "Mô tả của món ăn",
    image:
      "https://photo.znews.vn/w860/Uploaded/ofh_cgkztmzt/2024_02_26/Tempeh.jpg",
    price: 95000,
    status: true,
    category_id: 0,
    created_at: "2024-02-16T16:08:08.000Z",
    updated_at: null,
    deleted_at: null,
    isDeleted: false,
  },
  {
    id: 6,
    name: "Gỏi ngó sen",
    description: "Gỏi và bánh phồng tôm",
    image:
      "https://photo.znews.vn/w1000/Uploaded/vpcvodbp/2024_02_22/1200x800.jpg",
    price: 100000,
    status: true,
    category_id: 0,
    created_at: "2024-02-16T16:08:08.000Z",
    updated_at: null,
    deleted_at: null,
    isDeleted: false,
  },
  {
    id: 7,
    name: "Món chay 0",
    description: "Mô tả của món ăn",
    image:
      "https://photo.znews.vn/w860/Uploaded/ofh_cgkztmzt/2024_02_26/Tempeh.jpg",
    price: 95000,
    status: true,
    category_id: 0,
    created_at: "2024-02-16T16:08:08.000Z",
    updated_at: null,
    deleted_at: null,
    isDeleted: false,
  },
  {
    id: 8,
    name: "Gỏi ngó sen",
    description: "Gỏi và bánh phồng tôm",
    image:
      "https://photo.znews.vn/w860/Uploaded/ofh_cgkztmzt/2024_02_26/Tempeh.jpg",
    price: 100000,
    status: true,
    category_id: 0,
    created_at: "2024-02-16T16:08:08.000Z",
    updated_at: null,
    deleted_at: null,
    isDeleted: false,
  },
  {
    id: 9,
    name: "Món chay 0",
    description: "Mô tả của món ăn",
    image:
      "https://photo.znews.vn/w860/Uploaded/ofh_cgkztmzt/2024_02_26/Tempeh.jpg",
    price: 95000,
    status: true,
    category_id: 0,
    created_at: "2024-02-16T16:08:08.000Z",
    updated_at: null,
    deleted_at: null,
    isDeleted: false,
  },
  {
    id: 10,
    name: "Gỏi ngó sen",
    description: "Gỏi và bánh phồng tôm",
    image:
      "https://photo.znews.vn/w860/Uploaded/ofh_cgkztmzt/2024_02_26/Tempeh.jpg",
    price: 100000,
    status: true,
    category_id: 0,
    created_at: "2024-02-16T16:08:08.000Z",
    updated_at: null,
    deleted_at: null,
    isDeleted: false,
  },
];
function getItem(label, key, icon, children, type) {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
}
const Order = () => {
  const items = [
    getItem("Món khai vị", "1", <MailOutlined />),
    getItem("Món đậu hũ", "2", <AppstoreOutlined />),
    getItem("Món lẩu", "3", <SettingOutlined />),
    getItem("Món gỏi", "4", <CalculatorFilled />),
    getItem("Món nấm", "5", <HddOutlined />),
    getItem("Món cơm", "6", <GatewayOutlined />),
    getItem("Món canh", "7", <LaptopOutlined />),
  ];
  const onClick = (e) => {
    console.log("click ", e);
  };
  return (
    <>
      <Menu
        onClick={onClick}
        className="ant-menu-custom display-menu-1"
        style={{
          width: 256,
        }}
        defaultSelectedKeys={["1"]}
        defaultOpenKeys={["sub1"]}
        mode="inline"
        items={items}
      />
      <div className="ant-menu-custom-2" style={{ display: "flex" }}>
        <nav class="navbar navbar-expand-lg navbar-light display-menu ant-menu-custom-2">
          <button
            class="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarNav1"
            aria-controls="navbarNav1"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarNav1">
            <ul class="navbar-nav">
              <Link to="/order">
                <li class="nav-item">Đặt món</li>
              </Link>
              <li class="nav-item">
                <Link class="nav-link" to="/menu-management">
                  Quản lý món ăn
                </Link>
              </li>
              <li class="nav-item">
                <Link class="nav-link" to="/categories-management">
                  Quản lý danh mục món ăn
                </Link>
              </li>
              <li class="nav-item">
                <Link class="nav-link" to="/table-management">
                  Quản lý bàn
                </Link>
              </li>
            </ul>
          </div>
        </nav>
        <nav
          class="navbar navbar-expand-lg navbar-light display-menu ant-menu-custom-2"
          style={{ marginLeft: "auto" }}
        >
          <button
            class="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarNav2"
            aria-controls="navbarNav2"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarNav2">
            <ul class="navbar-nav">
              <li class="nav-item active">
                <Link class="nav-link">Món khai vị</Link>
              </li>
              <li class="nav-item">
                <Link class="nav-link">Món đậu hũ</Link>
              </li>
              <li class="nav-item">
                <Link class="nav-link">Món lẩu</Link>
              </li>
              <li class="nav-item">
                <Link class="nav-link">Món gỏi</Link>
              </li>
              <li class="nav-item">
                <Link class="nav-link">Món nấm</Link>
              </li>
              <li class="nav-item">
                <Link class="nav-link">Món cơm</Link>
              </li>
            </ul>
          </div>
        </nav>
      </div>

      <div className="content">
        <div className="row">
          {dataTemp?.map((item) => (
            <div
              className="col-md-6 col-sm-12"
              style={{ padding: 8 }}
              key={item.id}
            >
              <FoodComponent
                description={item.description}
                id={item.id}
                name={item.name}
                price={item.price}
                image={item.image}
              />
            </div>
          ))}
        </div>
        <div className="buton">
          <Space>
            <Button type="primary">Tổng tiền</Button>
            <Button type="button" className="">
              Đặt món
            </Button>
          </Space>
        </div>
      </div>
    </>
  );
};
export default Order;
