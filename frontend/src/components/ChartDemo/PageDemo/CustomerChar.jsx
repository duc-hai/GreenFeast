import React, { useEffect, useState } from "react";
import DatePickerDemo, { currentDate, dateFormat, previousMonthDate } from "../ChartItem/DatePickerDemo";
import BarChartDemo from "../ChartItem/BarChartDemo";
import { getStatisticCustomer } from "../../../Services/StatisticApi";
import { message } from "antd";


const CustomerChart = () => {
  const [dataChart,setDataChart] = useState([])
  const [dataSearch, setDataSearch] = useState([previousMonthDate.format(dateFormat),currentDate.format(dateFormat)])

  const onChangeDate =(date, dateString) => {
    setDataSearch(dateString)
  }

  const fetchDataChart =async(from, to) => {
    try {

      const res = await getStatisticCustomer(`${from}T05:00:00`,`${to}T23:59:59`);
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
        color="#f4a853"
        label="Khách hàng"
        dataChart={dataChart.map(item => item.count)}
        xLabel={dataChart.map(item => item._id)}
        text={'Thống kê khách hàng'}
      />
    </div>
  );
};

export default CustomerChart;
