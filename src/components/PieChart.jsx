import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const ChartContainer = styled.div`
  background: var(--surface);
  padding: 2rem;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  border: 1px solid var(--border);
  margin-top: 2rem;
`;

const ChartTitle = styled.h3`
  color: var(--text-primary);
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
`;

const ChartWrapper = styled.div`
  position: relative;
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  canvas {
    max-height: 400px;
  }
`;

const PieChart = ({ data, title }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    const chart = chartRef.current;
    
    if (chart) {
      chart.options.plugins.legend.labels.color = getComputedStyle(document.documentElement)
        .getPropertyValue('--text-primary')
        .trim();
    }
  }, []);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          font: {
            size: 12,
            family: "'Inter', sans-serif"
          }
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.formattedValue;
            const percentage = ((context.raw / context.dataset.data.reduce((a, b) => a + b, 0)) * 100).toFixed(1);
            return `${label}: R$ ${value} (${percentage}%)`;
          }
        }
      }
    }
  };

  return (
    <ChartContainer>
      <ChartTitle>{title}</ChartTitle>
      <ChartWrapper>
        <Pie ref={chartRef} data={data} options={options} />
      </ChartWrapper>
    </ChartContainer>
  );
};

export default PieChart;
