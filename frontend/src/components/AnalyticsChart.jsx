import React from 'react';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

// Register Chart.js features
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const AnalyticsChart = ({ analytics }) => {
  if (!analytics) return null;

  const { timeline, byOS, byBrowser, byDevice } = analytics;

  // 1. Line Chart Data (Scans Over Time)
  const timelineLabels = timeline?.map(item => item.date) || [];
  const timelineValues = timeline?.map(item => item.count) || [];

  const lineChartData = {
    labels: timelineLabels.length > 0 ? timelineLabels : ['No Scan History'],
    datasets: [
      {
        label: 'Scans',
        data: timelineValues.length > 0 ? timelineValues : [0],
        fill: true,
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99, 102, 241, 0.15)',
        tension: 0.4,
        pointBackgroundColor: '#d946ef',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#6366f1',
      },
    ],
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        padding: 12,
        cornerRadius: 8,
        backgroundColor: '#1b1d28',
        titleColor: '#fff',
        bodyColor: '#9ca3af',
        borderColor: 'rgba(255, 255, 255, 0.08)',
        borderWidth: 1,
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.04)',
        },
        ticks: {
          color: '#9ca3af',
          font: { family: 'Outfit' }
        }
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.04)',
        },
        ticks: {
          color: '#9ca3af',
          font: { family: 'Outfit' },
          stepSize: 1,
          precision: 0
        }
      }
    }
  };

  // 2. OS Doughnut Data
  const osLabels = byOS?.map(item => item.name) || [];
  const osValues = byOS?.map(item => item.value) || [];

  const doughnutData = {
    labels: osLabels.length > 0 ? osLabels : ['None'],
    datasets: [
      {
        data: osValues.length > 0 ? osValues : [1],
        backgroundColor: [
          '#6366f1', // Indigo
          '#d946ef', // Magenta
          '#10b981', // Emerald
          '#f59e0b', // Amber
          '#ef4444', // Red
          '#3b82f6', // Blue
        ],
        borderWidth: 1,
        borderColor: '#12131a',
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom', // Move legends to bottom on mobile for space, right on desktop
        labels: {
          color: '#9ca3af',
          font: { family: 'Outfit', size: 11 },
          padding: 10
        }
      },
      tooltip: {
        padding: 10,
        backgroundColor: '#1b1d28',
        borderColor: 'rgba(255, 255, 255, 0.08)',
        borderWidth: 1,
      }
    }
  };

  // 3. Browser Distribution (Bar Chart)
  const browserLabels = byBrowser?.map(item => item.name) || [];
  const browserValues = byBrowser?.map(item => item.value) || [];

  const barChartData = {
    labels: browserLabels.length > 0 ? browserLabels : ['None'],
    datasets: [
      {
        label: 'Scans',
        data: browserValues.length > 0 ? browserValues : [0],
        backgroundColor: 'rgba(217, 70, 239, 0.7)',
        hoverBackgroundColor: '#d946ef',
        borderRadius: 6,
        borderWidth: 0,
      }
    ]
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        padding: 10,
        backgroundColor: '#1b1d28',
      }
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#9ca3af',
          font: { family: 'Outfit' }
        }
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.04)',
        },
        ticks: {
          color: '#9ca3af',
          font: { family: 'Outfit' },
          stepSize: 1,
          precision: 0
        }
      }
    }
  };

  return (
    <div className="analytics-charts-grid">
      {/* Timeline Chart */}
      <div className="glass-card chart-container large-chart">
        <h4 className="chart-title">Scans Over Time (Last 30 Days)</h4>
        <div className="chart-wrapper">
          <Line data={lineChartData} options={lineChartOptions} />
        </div>
      </div>

      {/* OS Distribution */}
      <div className="glass-card chart-container">
        <h4 className="chart-title">Operating Systems</h4>
        <div className="chart-wrapper">
          <Doughnut data={doughnutData} options={doughnutOptions} />
        </div>
      </div>

      {/* Browser Distribution */}
      <div className="glass-card chart-container">
        <h4 className="chart-title">Browsers</h4>
        <div className="chart-wrapper">
          <Bar data={barChartData} options={barChartOptions} />
        </div>
      </div>

      {/* Device Stats summary */}
      <div className="glass-card devices-card">
        <h4 className="chart-title">Devices Breakdown</h4>
        <div className="device-list">
          {byDevice && byDevice.length > 0 ? (
            byDevice.map((device, idx) => (
              <div className="device-item" key={idx}>
                <div className="device-info">
                  <span className="device-name">{device.name}</span>
                  <span className="device-percentage">
                    {analytics.totalScans > 0 
                      ? Math.round((device.value / analytics.totalScans) * 100) 
                      : 0}%
                  </span>
                </div>
                <div className="progress-bar-bg">
                  <div 
                    className="progress-bar-fill" 
                    style={{ 
                      width: `${analytics.totalScans > 0 ? (device.value / analytics.totalScans) * 100 : 0}%`,
                      background: idx % 2 === 0 ? 'var(--accent-primary)' : 'var(--accent-secondary)'
                    }}
                  />
                </div>
                <span className="device-count">{device.value} scans</span>
              </div>
            ))
          ) : (
            <div className="no-data">No device logs available</div>
          )}
        </div>
      </div>

      <style>{`
        /* Mobile-First Default layouts */
        .analytics-charts-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.25rem;
          margin-top: 1.25rem;
        }
        
        .large-chart {
          grid-column: span 1;
        }
        
        .chart-container {
          display: flex;
          flex-direction: column;
        }
        .chart-title {
          font-size: 0.9rem;
          color: white;
          margin-bottom: 1rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-weight: 600;
        }
        .chart-wrapper {
          position: relative;
          height: 220px;
          width: 100%;
        }
        
        .devices-card {
          display: flex;
          flex-direction: column;
        }
        .device-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-top: 0.25rem;
          justify-content: center;
          flex: 1;
        }
        .device-item {
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
        }
        .device-info {
          display: flex;
          justify-content: space-between;
          font-size: 0.85rem;
          font-weight: 500;
        }
        .device-name {
          color: white;
        }
        .device-percentage {
          color: var(--text-secondary);
        }
        .progress-bar-bg {
          width: 100%;
          height: 6px;
          background: var(--bg-tertiary);
          border-radius: 999px;
          overflow: hidden;
        }
        .progress-bar-fill {
          height: 100%;
          border-radius: 999px;
          transition: width 1s ease-out;
        }
        .device-count {
          font-size: 0.75rem;
          color: var(--text-muted);
          text-align: right;
        }
        .no-data {
          color: var(--text-muted);
          text-align: center;
          padding: 1.5rem 0;
          font-style: italic;
          font-size: 0.9rem;
        }
        
        /* Desktops and Tablets (min-width: 900px) */
        @media (min-width: 900px) {
          .analytics-charts-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 1.5rem;
            margin-top: 1.5rem;
          }
          
          .large-chart {
            grid-column: span 2;
          }
          
          .chart-title {
            font-size: 1.05rem;
            margin-bottom: 1.25rem;
          }
          
          .chart-wrapper {
            height: 250px;
          }
          
          .device-list {
            gap: 1.25rem;
            margin-top: 0.5rem;
          }
          .device-info {
            font-size: 0.95rem;
          }
          .progress-bar-bg {
            height: 8px;
          }
          .device-count {
            font-size: 0.8rem;
          }
          .no-data {
            padding: 2rem 0;
          }
        }
      `}</style>
    </div>
  );
};

export default AnalyticsChart;
