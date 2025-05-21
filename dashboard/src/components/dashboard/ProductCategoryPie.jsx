import React, { useContext, useRef, useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { ThemeProviderContext } from "../../contexts/theme-context";

ChartJS.register(ArcElement, Tooltip, Legend);

const ProductCategoryPie = ({ labels, values, colors }) => {
  const { theme } = useContext(ThemeProviderContext);
  const chartRef = useRef();
  const [legendItems, setLegendItems] = useState([]);

  const data = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: colors,
      },
    ],
  };

  const options = {
    cutout: "60%",
    plugins: {
      legend: { display: false }, // Hide default legend
      tooltip: {
        enabled: true,
        backgroundColor: theme.startsWith('dark') ? '#222' : '#fff',
        titleColor: theme.startsWith('dark') ? '#fff' : '#222',
        bodyColor: theme.startsWith('dark') ? '#fff' : '#222',
      },
    },
  };

  // Extract legend items after chart is rendered
  useEffect(() => {
    if (chartRef.current && chartRef.current.legend && chartRef.current.legend.legendItems) {
      setLegendItems(chartRef.current.legend.legendItems);
    }
  }, [labels, values, colors, theme]);

  // Group legend items into columns of 3 (vertical columns)
  const columns = [[], [], []];
  legendItems.forEach((item, idx) => {
    columns[idx % 3].push(item);
  });

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, width: '100%', justifyContent: 'flex-start' }}>
      <div style={{ flex: '0 0 auto' }}>
        <Doughnut ref={chartRef} data={data} options={options} style={{ maxWidth: 120, maxHeight: 120, margin: '0 auto' }} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'row', gap: 24, justifyContent: 'flex-start', alignItems: 'flex-start', flex: 1, marginLeft: 0 }}>
        {columns.map((col, colIdx) => (
          <div key={colIdx} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {col.map((item, rowIdx) => (
              <div key={rowIdx} style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 90 }}>
                <span style={{ display: 'inline-block', width: 18, height: 18, background: item.fillStyle, borderRadius: 4, marginRight: 4 }}></span>
                <span style={{ color: theme.startsWith('dark') ? '#fff' : '#222', fontSize: 14, whiteSpace: 'nowrap' }}>{item.text}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductCategoryPie;
