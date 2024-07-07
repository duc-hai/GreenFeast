import React from "react";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);
const { RangePicker } = DatePicker;
export const dateFormat = "YYYY-MM-DD";
export const currentDate = dayjs();

// Lấy ngày tháng năm trước 1 tháng
export const previousMonthDate = currentDate.subtract(6, 'month');
const DatePickerDemo = ({onChange}) => {
  return (
    <div>
      <RangePicker
        defaultValue={[
          dayjs(previousMonthDate, dateFormat),
          dayjs(currentDate, dateFormat),
        ]}
        format={dateFormat}
        onChange={(date,dateString) => onChange(date,dateString)}
        allowClear={false}
      />
    </div>
  );
};

export default DatePickerDemo;
