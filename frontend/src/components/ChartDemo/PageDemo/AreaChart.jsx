import React, { useEffect, useState } from "react";
import DatePickerDemo, { currentDate, dateFormat, previousMonthDate } from "../ChartItem/DatePickerDemo";
import LineChartDemo from "../ChartItem/LineChartDemo";
import { getStatisticArea } from "../../../Services/StatisticApi";
import { message } from "antd";


const AreaChart = () => {
  const data = [ 2570000, 3200000, 2840000, 3630000, 2670000, 2440000];
  const text = "Thống kê khu vực";
  const labels = [
   'Tầng 1',
   'Tầng 2',
    'Mua mang về',
     'Grab',
    'Shopee',
    'Nhân viên',
  ];
  const [dataChart,setDataChart] = useState([])
  const [dataSearch, setDataSearch] = useState([previousMonthDate.format(dateFormat),currentDate.format(dateFormat)])

  const onChangeDate =(date, dateString) => {
    setDataSearch(dateString)
  }

  const fetchDataChart =async(from, to) => {
    try {

      const res = await getStatisticArea(`${from}T05:00:00`,`${to}T23:59"59`);
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
           color="#6bd098"
        label="Menu"
        dataChart={data}
        xLabel={labels}
        text={text}
      />
      
    </div>
  );
};

export default AreaChart;
