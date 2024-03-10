import { Space } from "antd";
import { Link, NavLink } from "react-router-dom";
import { UserOutlined } from "@ant-design/icons";
import "./styles.css";
import { useEffect, useState } from "react";
const Header = () => {
  const [us, setUs] = useState({});
  const user = sessionStorage.getItem("user");
  useEffect(() => {
    setUs(JSON.parse(user));
  }, [user]);

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-memu custom flex items-center justify-between">
      <div className="flex items-center">
        <Link to="/">
          <img className="img-hd" alt="logo" src={"../logo.png"} />
        </Link>
        <div className="flex gap-6 ml-5">
          <Link to="/" style={{ fontSize: 18 }}>
            Trang chủ
          </Link>
          <Link to="/" style={{ fontSize: 18 }}>
            Giới thiệu
          </Link>
          <Link to="/order" style={{ fontSize: 18 }}>
            Đặt món
          </Link>
          <Link to="/login" style={{ fontSize: 18 }}>
            Đặt bàn
          </Link>
        </div>
      </div>
      <div>{us?.full_name}</div>
    </nav>
  );
};
export default Header;
