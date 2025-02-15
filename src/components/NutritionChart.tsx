import React, { useRef, useEffect } from 'react';
import Chart from 'chart.js/auto';

function DoughnutChart({ data }) {  // Expecting data as an object: { label1: value1, label2: value2, ... }
  const chartRef = useRef(null);

  useEffect(() => {
    if (chartRef.current && data) {
      const ctx = chartRef.current.getContext('2d');

      new Chart(ctx, {
        type: 'doughnut', // Use 'doughnut' chart type
        data: {
          labels: Object.keys(JSON.parse(data)), // Labels from the data object keys
          datasets: [{
            data: Object.values(JSON.parse(data)), // Data values from the data object values
            backgroundColor: [ // Customize colors (you can add more)
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
          cutout: '50%', // Adjust this value to control the donut hole size (50% is a common value)
          responsive: true,
          maintainAspectRatio: false,
          plugins: { // Add this for the legend
            legend: {
              display: true, // Show the legend
              position: 'right' // Position of the legend
            }
          }
        }
      });
    }
  }, [data]);

  return (
    <canvas ref={chartRef} width="400" height="300" />
  );
}

export default DoughnutChart;