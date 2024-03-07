import { Link, NavLink } from "react-router-dom";
import "./index.css";
import { UserOutlined } from "@ant-design/icons";
import { Menu, Space } from "antd";
import { Header } from "antd/es/layout/layout";
const Homepage = () => {
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
  };
  const items = new Array(15).fill(null).map((_, index) => ({
    key: index + 1,
    label: `nav ${index + 1}`,
  }));
  return (
    <>
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
      <div className="container pt-2">
        <div
          id="carouselExampleControls"
          class="carousel slide"
          data-ride="carousel"
        >
          <div class="carousel-inner">
            <div class="carousel-item active">
              <img
                class="d-block w-100"
                src="https://chaygarden.com/wp-content/uploads/2023/05/slide-banner-7-min.jpg"
                alt="First slide"
              />
            </div>
            <div class="carousel-item">
              <img
                class="d-block w-100"
                src="https://chaygarden.com/wp-content/uploads/2023/05/slide-banner-4-min.jpg"
                alt="Second slide"
              />
            </div>
            <div class="carousel-item">
              <img
                class="d-block w-100"
                src="https://chaygarden.com/wp-content/uploads/2023/05/slide-banner-5-min.jpg"
                alt="Third slide"
              />
            </div>
            <div class="carousel-item">
              <img
                class="d-block w-100"
                src="https://chaygarden.com/wp-content/uploads/2023/05/slide-banner-5-min.jpg"
                alt="forr slide"
              />
            </div>
          </div>
          <a
            class="carousel-control-prev"
            href="#carouselExampleControls"
            role="button"
            data-slide="prev"
          >
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
            <span class="sr-only">Previous</span>
          </a>
          <a
            class="carousel-control-next"
            href="#carouselExampleControls"
            role="button"
            data-slide="next"
          >
            <span class="carousel-control-next-icon" aria-hidden="true"></span>
            <span class="sr-only">Next</span>
          </a>
        </div>
        <div className="row pt-3" style={{ alignItems: "center" }}>
          <div className="col-md-4 col-sm-12">
            <img
              class="d-block w-100"
              src="https://chaygarden.com/wp-content/uploads/2020/08/tAbaCXM.png"
              alt="First slide"
            />
          </div>
          <div className="col-md-8 col-sm-12">
            Nhân tố cơ bản của thực đơn ở Green Feast là san sẻ mối quan tâm về
            nhu cầu sinh hoạt và sức khỏe của mỗi thực khách nhằm tạo nên không
            gian ẩm thực nuôi dưỡng một tâm hồn và cơ thể khỏe mạnh. Ẩm thực
            Green Feast không chỉ chú trọng đến đặc tính nguyên liệu, cầu kỳ chế
            biến mà còn được phục vụ bằng cung cách tận tụy, kết nối và sự sáng
            tạo, tỉ mỉ trong từng khâu trình bày để mang đến trải nghiệm “Ẩm
            thực chay đầy tinh tế” Green Feast mang đến thực khách hương vị mộc
            mạc, nhuần nhuyễn, thanh khiết mà vẫn linh hoạt, đậm đà, giữ được sự
            cân bằng đủ đầy cho một nhịp sống hiện đại “Đắng – Chua – Ngọt – Cay
            – Mặn” và hành trình trải nghiệm ẩm thực đa giác quan. Để cuối cùng
            khám phá dư âm của hương vị thanh nhẹ ẩn dấu trong mỗi món ăn, như
            những bản tính thiện lành ẩn chứa trong mỗi con người.
          </div>
        </div>
        <div className="row pt-3" style={{ alignItems: "center" }}>
          <div className="col-md-8 col-sm-12">
            Sự kết hợp giữa hạt hồ đào đa dinh dưỡng với cà chua chín mọng, củ
            cải đỏ tươi giòn, những lát đào thanh ngọt và những cọng xà lách mơn
            mởn cùng sốt chanh dây chua nhẹ, món ăn như một bản phối đầy sắc màu
            sẽ khai vị cho bữa chay thêm phần tuyệt hảo. Món ăn chay chính là
            món ăn theo đuổi cái đẹp thuần khiết. Green Feast luôn nỗ lực, dụng
            công để tạo ra món ngon bộc lộ hương vị và mỹ cảm chân thực nhất. Sự
            kết hợp, bày biện dung dị cũng đủ làm thỏa mãn tâm hồn thực khách
            bởi nét quyến rũ của thiên nhiên hài hòa trong mỗi món ngon.”
          </div>
          <div className="col-md-4 col-sm-12">
            <img
              class="d-block w-100"
              src="https://chaygarden.com/wp-content/uploads/2021/05/monan.png"
              alt="First slide"
            />
          </div>
        </div>
        <div className="row pt-3" style={{ alignItems: "center" }}>
          <div className="col-md-4 col-sm-12">
            <img
              class="d-block w-100"
              src="https://hitavegan.com/wp-content/uploads/2019/11/ice-coffee-hita-fb-coffee1.jpg"
              alt="First slide"
            />
          </div>
          <div className="col-md-8 col-sm-12">
            Nhân tố cơ bản của thực đơn ở Green Feast là san sẻ mối quan tâm về
            nhu cầu sinh hoạt và sức khỏe của mỗi thực khách nhằm tạo nên không
            gian ẩm thực nuôi dưỡng một tâm hồn và cơ thể khỏe mạnh. Ẩm thực
            Green Feast không chỉ chú trọng đến đặc tính nguyên liệu, cầu kỳ chế
            biến mà còn được phục vụ bằng cung cách tận tụy, kết nối và sự sáng
            tạo, tỉ mỉ trong từng khâu trình bày để mang đến trải nghiệm “Ẩm
            thực chay đầy tinh tế” Green Feast mang đến thực khách hương vị mộc
            mạc, nhuần nhuyễn, thanh khiết mà vẫn linh hoạt, đậm đà, giữ được sự
            cân bằng đủ đầy cho một nhịp sống hiện đại “Đắng – Chua – Ngọt – Cay
            – Mặn” và hành trình trải nghiệm ẩm thực đa giác quan. Để cuối cùng
            khám phá dư âm của hương vị thanh nhẹ ẩn dấu trong mỗi món ăn, như
            những bản tính thiện lành ẩn chứa trong mỗi con người.
          </div>
        </div>
      </div>
      <br />
      <div class="card">
        <div class="card-body" style={{ backgroundColor: "#ABC4AA" }}>
          <div className="row">
            <div className="col-6"></div>
            <div className="col-6">
              <p>
                <strong>Địa chỉ:</strong> 3C Tôn Đức Thắng, Phường Bến Nghé,
                quận 1
              </p>
              <p>
                <strong>Số điện thoại:</strong> 0123456789
              </p>
              <p>
                <strong>email:</strong> chaygreen@gmail.com
              </p>
            </div>
          </div>
        </div>
        <div
          class="card-footer text-center"
          style={{ backgroundColor: "#5C9F67", color: "#fff" }}
        >
          @Copyright
        </div>
      </div>
    </>
  );
};
export default Homepage;
