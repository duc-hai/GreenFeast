import { useState } from "react";
import AreaChart from "./AreaChart"
import { Select } from "antd";
import HeaderAdminChart from "../ChartItem/HeaderAdminChart";
import RevenueChart from "./RevenueChart";
import CustomerChart from "./CustomerChar";
import MenuChart from "./MenuChart";
import '../style/AdminStyle.css'
const AdminDemo =() => {
    const [choseOption, setChoseOption] = useState(1);
    const handleSelect = (value) => {
      setChoseOption(value);
    };
    return (
      <div className="container-admin">
        <Select
          defaultValue={1}
          style={{ width: 120 }}
          onChange={(e) => handleSelect(e)}
          options={[
            { value: 1, label: "Doanh thu" },
            { value: 2, label: "Lượt khách" },
            { value: 3, label: "Khu vực" },
            { value: 4, label: "Món ăn" },
          ]}
        />
        <div className="box-admin">
          {/* <div className="container-admin-header">
            <HeaderAdminChart title="Cao nhất" content="" quality={123} />
            <HeaderAdminChart title="Thấp nhất" content="" quality={82} />
            <HeaderAdminChart title="Trung bình" content="" quality={100} />
          </div> */}
          <div className="container-admin-chart">
            {choseOption === 1 && <RevenueChart />}
            {choseOption === 2 && <CustomerChart />}
            {choseOption === 3 && <AreaChart />}
            {choseOption === 4 && <MenuChart />}
          </div>
        </div>
      </div>
    );
}

export default AdminDemo