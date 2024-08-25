import React from "react";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);
const LineChartDemo = ({ color, label, dataChart, xLabel, text }) => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: text,
      },
    },
  };

  const data = {
    labels: xLabel,
    datasets: [
      {
        label: label,
        data: dataChart,
        borderColor: color,
        backgroundColor: color,
      },
    ],
  };
  return (
    <div style={{ width: '100%', minHeight: '400px' }}>
      <Line options={options} data={data} />
    </div>
  );
};

export default LineChartDemo;
