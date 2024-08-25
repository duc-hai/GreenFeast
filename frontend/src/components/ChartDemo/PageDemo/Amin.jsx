import { useState } from "react";
import AreaChart from "./AreaChart"
import { Select } from "antd";
import HeaderAdminChart from "../ChartItem/HeaderAdminChart";
import RevenueChart from "./RevenueChart";
import CustomerChart from "./CustomerChar";
import MenuChart from "./MenuChart";
import '../style/AdminStyle.css'
import PaymentChart from "./PaymentChart";
import CustomerMethodChart from "./CustomerMethodChart";
const AdminDemo =() => {
    const [choseOption, setChoseOption] = useState(1);
    const handleSelect = (value) => {
      setChoseOption(value);
    };
    return (
      <div className="bg-[#ffffff] md:ml-6 md:p-4 max-md:p-1 rounded-md  flex flex-col gap-2 ">
        <Select
          defaultValue={1}
          style={{ width: 200 }}
          onChange={(e) => handleSelect(e)}
          options={[
            { value: 1, label: "Doanh thu" },
            { value: 2, label: "Lượt khách" },
            { value: 3, label: "Khu vực" },
            { value: 4, label: "Món ăn" },
            { value: 5, label: "Phương thức thanh toán" },
            { value: 6, label: "Khách hàng" },
          ]}
        />
        <div className="flex  justify-center items-center">
          {/* <div className="container-admin-header">
            <HeaderAdminChart title="Cao nhất" content="" quality={123} />
            <HeaderAdminChart title="Thấp nhất" content="" quality={82} />
            <HeaderAdminChart title="Trung bình" content="" quality={100} />
          </div> */}
          <div >
            {choseOption === 1 && <RevenueChart />}
            {choseOption === 2 && <CustomerChart />}
            {choseOption === 3 && <AreaChart />}
            {choseOption === 4 && <MenuChart />}
            {choseOption === 5 && <PaymentChart />}
            {choseOption === 6 && <CustomerMethodChart/>}
          </div>
        </div>
      </div>
    );
}

export default AdminDemo