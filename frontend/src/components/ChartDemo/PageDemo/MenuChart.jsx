import React, { useEffect, useState } from "react";
import DatePickerDemo, { currentDate, dateFormat, previousMonthDate } from "../ChartItem/DatePickerDemo";
import LineChartDemo from "../ChartItem/LineChartDemo";
import { getStatisticMenu } from "../../../Services/StatisticApi";
import { message } from "antd";


const MenuChart = () => {

  const [dataChart,setDataChart] = useState([])
  const [dataSearch, setDataSearch] = useState([previousMonthDate.format(dateFormat),currentDate.format(dateFormat)])

  const onChangeDate =(date, dateString) => {
    setDataSearch(dateString)
  }

  const fetchDataChart =async(from, to) => {
    try {

      const res = await getStatisticMenu(`${from}T05:00:00`,`${to}T23:59:59`);
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
      <LineChartDemo
        color="#ef8156"
        label="Món ăn"
        dataChart={dataChart.map(item => item.totalPrice)}
        xLabel={dataChart.map(item => item.name)}
        text={'Thống kê món ăn'}
      />
    </div>
  );
};

export default MenuChart;
