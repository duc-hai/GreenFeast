import { Card, DatePicker, message } from "antd";
import "./index.css";
import { getRevenus, getStatisticsQueryReturn } from "../../Services/OrderAPI";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { dateFormat } from "../../components/ChartDemo/ChartItem/DatePickerDemo";
const { RangePicker } = DatePicker;
const RevenusManagement = () => {
  const [value, setValue] = useState();
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState(dayjs(dayjs(), dateFormat));
  const [dataReturn, setDataReturn] = useState({});
  const onChange = (date, dateString) => {
    handleFetchData(dateString[0], dateString[1]);
  };

  const fetchStatisticsQueryReturn = async (from) => {
    setLoading(true);
    try {
      const res = await getStatisticsQueryReturn(from);
      if (res?.status === "success") {
        message.success(
          "Lấy thông tin tiền thu hộ của đơn vị vận chuyển thành công"
        );
        setDataReturn(res?.data);
      } else {
        message.error(
          "Lấy thông tin tiền thu hộ của đơn vị vận chuyển thất bại"
        );
      }
    } catch (err) {
      message.error("Lấy thông tin tiền thu hộ của đơn vị vận chuyển thất bại");
      console.log(err);
    }
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
    // Nếu value là undefined, gọi handleFetchData để lấy dữ liệu cho ngày hiện tại
    const today = dayjs().format("YYYY-MM-DD");
    handleFetchData(today, today);
  }, []);
  useEffect(() => {
    fetchStatisticsQueryReturn(date);
  }, [date]);

  return (
    <div className="content-component flex-1">
      <div className="flex justify-between bg-[#5c9f67] p-2 rounded-sm">
        <div className="text-xl font-semibold pl-2 text-white">
          Xem doanh thu
        </div>
      </div>

      <br />
      <div className="flex gap-3">
        <Card title="Doanh thu" className="flex-1">
          <div className="bg-white p-3">
            <div className="flex gap-3">
              <span className="flex-1 min-w-14">Chọn ngày:</span>
              <div className="w-[500px]">
                <RangePicker
                  onChange={onChange}
                  defaultValue={[dayjs(), dayjs()]}
                />
              </div>
            </div>
            {value?.status === "success" ? (
              <div className="mt-3 flex flex-col gap-2">
                <p>
                  Doanh thu:
                  <span className="font-semibold">
                    {value?.data?.revenue?.toLocaleString("vi-VN", {}) || 0}
                  </span>
                </p>
                <p>
                  Số lượng người:
                  <span className="font-semibold">
                    {value?.data?.num_clients.toLocaleString("vi-VN", {}) || 0}
                  </span>
                </p>
                <p>
                  Giảm giá:
                  <span className="font-semibold">
                    {value?.data?.discount.toLocaleString("vi-VN", {}) || 0}
                  </span>
                </p>
                <p>
                  Phụ phí:
                  <span className="font-semibold">
                    {value?.data?.surcharge.toLocaleString("vi-VN", {}) || 0}
                  </span>
                </p>
                <p>
                  Tổng hóa đơn:
                  <span className="font-semibold">
                    {value?.data?.sum_menu.toLocaleString("vi-VN", {}) || 0}
                  </span>
                </p>
              </div>
            ) : (
              <p className="mt-3">{value?.message || "Không có data"}</p>
            )}
          </div>
        </Card>
        <Card
          className="flex-1 flex flex-col gap-3"
          title="Thu hộ và vận chuyển"
        >
          <div className="flex flex-col gap-3">
            <div className="flex gap-2 items-center">
              <span>Chọn ngày :</span>
              <DatePicker
                format={dateFormat}
                defaultValue={date}
                allowClear={false}
                onChange={(_, dateString) => setDate(dateString)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <p className="flex gap-2">
                <p className="min-w-28">Số lượng :</p>
                <p className="font-semibold">{dataReturn?.count}</p>
              </p>
              <p className="flex gap-2">
                <p className="min-w-28">Tổng tiền :</p>
                <p className="font-semibold">{dataReturn?.total}</p>
              </p>
              <p className="flex gap-2">
                <p className="min-w-28">Phí vận chuyển :</p>
                <p className="font-semibold">{dataReturn?.shippingfee}</p>
              </p>
              <p className="flex gap-2">
                <p className="min-w-28">Hoàn trả :</p>
                <p className="font-semibold">{dataReturn?.return}</p>
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default RevenusManagement;
