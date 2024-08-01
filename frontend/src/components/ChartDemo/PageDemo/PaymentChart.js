import React, { useEffect, useState } from "react";
import DatePickerDemo, {
  currentDate,
  dateFormat,
  previousMonthDate,
} from "../ChartItem/DatePickerDemo";
import BarChartDemo from "../ChartItem/BarChartDemo";
import { getStatisticPayment } from "../../../Services/StatisticApi";
import { message, Spin } from "antd";
import { Bar } from "react-chartjs-2";

const PaymentChart = () => {
  const [dataChart, setDataChart] = useState([]);
  const [dataSearch, setDataSearch] = useState([
    previousMonthDate.format(dateFormat),
    currentDate.format(dateFormat),
  ]);
  const [loading, setLoading] = useState(false);

  const onChangeDate = (date, dateString) => {
    setDataSearch(dateString);
  };

  const fetchDataChart = async (from, to) => {
    setLoading(true);
    try {
      const res = await getStatisticPayment(
        `${from}T00%3A00%3A00`,
        `${to}T00%3A00%3A00`
      );
      setDataChart(res?.data || []);
    } catch (error) {
      message.error("Error");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDataChart(dataSearch[0], dataSearch[1]);
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
        <p>Chọn thời gian</p>
        <DatePickerDemo onChange={onChangeDate} />
      </div>
      {loading ? (
        <Spin />
      ) : (
        <BarChartDemo
          color="#ea2e3c"
          label="Tổng tiền"
          dataChart={dataChart?.map((item) => item.totalAmount)}
          xLabel={dataChart?.map((item) => item.name)}
          text="Thống kê phương thức thanh toán"
        />
      )}
    </div>
  );
};

export default PaymentChart;
