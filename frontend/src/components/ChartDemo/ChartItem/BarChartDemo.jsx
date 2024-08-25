import React from "react";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar  } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);
const BarChartDemo = ({ color, label, dataChart, xLabel, text }) => {
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
      <Bar options={options} data={data} />
    </div>
  );
};

export default BarChartDemo;
