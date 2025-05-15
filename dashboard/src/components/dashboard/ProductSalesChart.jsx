import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const ProductSalesChart = ({ labels, grossMargin, revenue }) => {
  const data = {
    labels,
    datasets: [
      {
        label: "Gross margin",
        backgroundColor: "#36A2EB",
        data: grossMargin,
      },
      {
        label: "Revenue",
        backgroundColor: "#FF9F40",
        data: revenue,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 10000,
        },
      },
    },
  };

  return (
    <div style={{ width: "100%", maxWidth: 600, height: 300 }}>
      <Bar data={data} options={options} />
    </div>
  );
};

export default ProductSalesChart;
