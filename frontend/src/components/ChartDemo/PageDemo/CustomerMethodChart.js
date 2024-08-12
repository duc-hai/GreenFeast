import React, { useEffect, useState } from "react";
import DatePickerDemo, {
  currentDate,
  dateFormat,
  previousMonthDate,
} from "../ChartItem/DatePickerDemo";
import BarChartDemo from "../ChartItem/BarChartDemo";
import {
  getStatisticCustomerMethod,
  getStatisticPayment,
} from "../../../Services/StatisticApi";
import { message, Select, Spin } from "antd";

const CustomerMethodChart = () => {
  const [dataChart, setDataChart] = useState([]);
  const [dataSearch, setDataSearch] = useState("online");
  const [loading, setLoading] = useState(false);

  const onChangeDate = (date, dateString) => {
    setDataSearch(dateString);
  };

  const fetchDataChart = async (form) => {
    setLoading(true);
    try {
      const res = await getStatisticCustomerMethod(form);
      setDataChart(res?.data || []);
    } catch (error) {
      message.error("Error");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDataChart(dataSearch);
  }, [dataSearch]);

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "end",
          padding: "10px",
          alignItems: "center",
          gap: "16px",
        }}
      >
        <p>Phương thức đặt hàng</p>
        <Select
          style={{ width: "200px" }}
          onChange={(e) => setDataSearch(e)}
          value={dataSearch}
          options={[
            { value: "online", label: "Online" },
            { value: "offline", label: "Nhà hàng" },
          ]}
        />
      </div>
      {loading ? (
        <Spin />
      ) : (
        <BarChartDemo
          color="#2a9d8f"
          label="Tổng tiền"
          dataChart={dataChart?.map((item) => item.totalAmount)}
          xLabel={dataChart?.map((item) => item.name)}
          text="Thống kê cách thức đặt hàng"
        />
      )}
    </div>
  );
};

export default CustomerMethodChart;
