import { DatePicker } from "antd";
import "./index.css";
import { getRevenus } from "../../Services/OrderAPI";
import { useEffect, useState } from "react";
const { RangePicker } = DatePicker;
const RevenusManagement = () => {
  const [value, setValue] = useState();
  const onChange = (date, dateString) => {
    handleFetchData(dateString[0], dateString[1]);
  };

  const handleFetchData = async (start, to) => {
    try {
      const res = await getRevenus(start, to);
      setValue(res);
    } catch (error) {
      setValue(error?.response?.data);
      console.log(error);
    }
  };

  useEffect(() => {
    handleFetchData();
  }, []);
  return (
    <div className="content-component">
      <div className="flex justify-between bg-[#5c9f67] p-2 rounded-sm">
        <div className="text-xl font-semibold pl-2 text-white">
          Xem doanh thu
        </div>
      </div>

      <br />
      <div className="bg-white p-3">
        <div className="flex flex-col gap-3">
          <span>Chọn ngày:</span>
          <div className="w-[500px]">
            <RangePicker onChange={onChange} />
          </div>
        </div>
        {value?.status === "success" ? (
          <div className="mt-3 flex flex-col gap-2">
            <p>
              Doanh thu:{" "}
              <span className="font-semibold">
                {" "}
                {value?.data?.revenue?.toLocaleString("vi-VN", {}) || 0}{" "}
              </span>
            </p>
            <p>
              Số lượng người:{" "}
              <span className="font-semibold">
                {" "}
                {value?.data?.num_clients.toLocaleString("vi-VN", {}) || 0}{" "}
              </span>
            </p>
            <p>
              Giảm giá:{" "}
              <span className="font-semibold">
                {" "}
                {value?.data?.discount.toLocaleString("vi-VN", {}) || 0}{" "}
              </span>
            </p>
            <p>
              Phụ phí:{" "}
              <span className="font-semibold">
                {" "}
                {value?.data?.surcharge.toLocaleString("vi-VN", {}) || 0}{" "}
              </span>
            </p>
            <p>
              Tổng hóa đơn:
              <span className="font-semibold">
                {" "}
                {value?.data?.sum_menu.toLocaleString("vi-VN", {}) || 0}{" "}
              </span>
            </p>
          </div>
        ) : (
          <p className="mt-3">{value?.message || "Không có data"}</p>
        )}
      </div>
    </div>
  );
};

export default RevenusManagement;
