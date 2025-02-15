import React, { useRef, useEffect, useState } from 'react';
import Chart from 'chart.js/auto';

function DoughnutChart({ data }) {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    if (data) {
      setChartData(data);
    }
  }, [data]);


  useEffect(() => {
      if (chartRef.current && chartData) {
        const ctx = chartRef.current.getContext('2d');

        if (chartInstance.current) {
          chartInstance.current.destroy();
        }

        chartInstance.current = new Chart(ctx, {
          type: 'doughnut',
          data: {
            labels: Object.keys(chartData),
            datasets: [{
              data: Object.values(chartData),
              backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
              ],
              borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
              ],
              borderWidth: 1
            }]
          },
          options: {
            cutout: '50%',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: true,
                position: 'right'
              }
            }
          }
        });
      }

      return () => {
        if (chartInstance.current) {
          chartInstance.current.destroy();
        }
      };
    }, [chartData]); // This is the corrected dependency array

  return (
    <canvas ref={chartRef} width="400" height="300" />
  );
}

export default DoughnutChart;