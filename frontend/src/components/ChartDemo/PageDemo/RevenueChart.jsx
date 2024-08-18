import React, { useEffect, useState } from "react";
import DatePickerDemo, { currentDate, dateFormat, previousMonthDate } from "../ChartItem/DatePickerDemo";
import BarChartDemo from "../ChartItem/BarChartDemo";
import { getStatisticRevenue } from "../../../Services/StatisticApi";
import { message, Select } from "antd";


const RevenueChart = () => {

  const [dataChart,setDataChart] = useState([])
  // const [dataSearch, setDataSearch] = useState(
  //   [previousMonthDate.format(dateFormat),currentDate.format(dateFormat)])
  const [dataSearch, setDataSearch] = useState({
    form:"online",
    from:previousMonthDate.format(dateFormat),
    to:currentDate.format(dateFormat)
  })

  const onChangeDate =(date, dateString) => {
    setDataSearch(pre => ({...pre,from:dateString[0],to:dateString[1]}))
  }

  const fetchDataChart =async(from, to,form) => {
    try {

      const res = await getStatisticRevenue(`${from}T05:00:00`,`${to}T23:59:59`,form);
      setDataChart(res?.data || [])
    }
    catch(error){
      message.error('Error')
    }
  }

  useEffect(() => {
    fetchDataChart(dataSearch.from,dataSearch.to,dataSearch.form)
  },[dataSearch])

  return (
    <div>
      <div
       className="flex justify-end gap-6"
       
      >
        <div className="flex items-center gap-4">
        <p>Phương thức </p>
        <Select value={dataSearch.form} className="w-32" onChange={(e)=> setDataSearch(pre => ({...pre,form:e}))} options={[
         { value:"online", label:"Online"},
         { value:"offline", label:"Nhà hàng"}
        ]}/>
        </div>
        <div className="flex items-center gap-4">

        <p>Chọn thời gian </p>
        <DatePickerDemo onChange={onChangeDate}/>
        </div>
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
