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

const ProductSalesChart = ({ labels, privateEvents, publicEvents }) => {
  const data = {
    labels,
    datasets: [
      {
        label: "Private Events",
        backgroundColor: "#36A2EB",
        data: privateEvents,
      },
      {
        label: "Public Events",
        backgroundColor: "#FF9F40",
        data: publicEvents,
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
