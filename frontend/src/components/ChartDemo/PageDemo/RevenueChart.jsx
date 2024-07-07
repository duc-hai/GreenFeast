import React, { useEffect, useState } from "react";
import DatePickerDemo, { currentDate, dateFormat, previousMonthDate } from "../ChartItem/DatePickerDemo";
import BarChartDemo from "../ChartItem/BarChartDemo";
import { getStatisticRevenue } from "../../../Services/StatisticApi";
import { message } from "antd";


const RevenueChart = () => {

  const [dataChart,setDataChart] = useState([])
  const [dataSearch, setDataSearch] = useState([previousMonthDate.format(dateFormat),currentDate.format(dateFormat)])

  const onChangeDate =(date, dateString) => {
    setDataSearch(dateString)
  }

  const fetchDataChart =async(from, to) => {
    try {

      const res = await getStatisticRevenue(`${from}T00%3A00%3A00`,`${to}T00%3A00%3A00`);
      setDataChart(res?.data || [])
    }
    catch(error){
      message.error('Error')
    }
  }

  useEffect(() => {
    fetchDataChart(dataSearch[0],dataSearch[1])
  },[dataSearch])

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
        <DatePickerDemo onChange={onChangeDate}/>
      </div>
      <BarChartDemo
        color="#ea2e3c"
        label="Doanh thu"
        dataChart={dataChart.map(item => item.totalAmount)}
        xLabel={dataChart.map(item => item._id)}
        text='Thống kê doanh thu'
      />
    </div>
  );
};

export default RevenueChart;
