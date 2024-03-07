import { Space } from "antd";
import { Link, NavLink } from "react-router-dom";
import { UserOutlined } from "@ant-design/icons";
import "./styles.css";
const Header = () => {
  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("username");
  };
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-memu custom flex items-center justify-between">
      <div className="flex items-center">
        <Link to="/">
          <img className="img-hd" alt="logo" src={"../logo.png"} />
        </Link>
        <div className="flex gap-6 ml-5">
          <Link to="/" style={{ fontSize: 18 }} onClick={logout}>
            Trang chủ
          </Link>
          <Link to="/" style={{ fontSize: 18 }} onClick={logout}>
            Giới thiệu
          </Link>
          <Link to="/order" style={{ fontSize: 18 }} onClick={logout}>
            Đặt món
          </Link>
          <Link to="/login" style={{ fontSize: 18 }} onClick={logout}>
            Đặt bàn
          </Link>
        </div>
      </div>
      <div>name</div>
    </nav>
  );
};
export default Header;
