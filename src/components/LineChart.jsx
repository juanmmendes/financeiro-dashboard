import React, { useRef } from 'react';
import styled from 'styled-components';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { formatCurrency } from '../utils/formatters';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

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
  height: 400px;
`;

const LineChart = ({ data, title }) => {
  const chartRef = useRef(null);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
            family: "'Inter', sans-serif"
          },
          color: 'var(--text-primary)'
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.dataset.label || '';
            return `${label}: ${formatCurrency(context.parsed.y)}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: 'var(--border)'
        },
        ticks: {
          color: 'var(--text-secondary)'
        }
      },
      y: {
        grid: {
          color: 'var(--border)'
        },
        ticks: {
          color: 'var(--text-secondary)',
          callback: function(value) {
            return formatCurrency(value);
          }
        }
      }
    }
  };

  return (
    <ChartContainer>
      <ChartTitle>{title}</ChartTitle>
      <ChartWrapper>
        <Line ref={chartRef} data={data} options={options} />
      </ChartWrapper>
    </ChartContainer>
  );
};

export default LineChart;
