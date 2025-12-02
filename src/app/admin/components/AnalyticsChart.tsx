'use client'

import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

interface AnalyticsChartProps {
  data: {
    registrationTrends: Array<{
      date: string
      count: number
    }>
  }
}

export function AnalyticsChart({ data }: AnalyticsChartProps) {
  const chartData = {
    labels: data?.registrationTrends?.map(item => 
      new Date(item.date).toLocaleDateString()
    ) || [],
    datasets: [
      {
        label: 'Team Registrations',
        data: data?.registrationTrends?.map(item => item.count) || [],
        borderColor: '#00CED1',
        backgroundColor: 'rgba(0, 206, 209, 0.1)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#FF4500',
        pointBorderColor: '#FF4500',
        pointHoverBackgroundColor: '#FF4500',
        pointHoverBorderColor: '#FF4500',
        borderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6
      }
    ]
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: 'rgba(255, 255, 255, 0.8)',
          font: {
            family: 'Orbitron'
          }
        }
      },
      title: {
        display: true,
        text: 'Registration Trends',
        color: 'rgba(255, 255, 255, 0.9)',
        font: {
          size: 16,
          family: 'Orbitron',
          weight: 'bold' as const
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleFont: {
          family: 'Orbitron'
        },
        bodyFont: {
          family: 'Orbitron'
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          color: 'rgba(255, 255, 255, 0.6)',
          font: {
            family: 'Orbitron'
          }
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        }
      },
      x: {
        ticks: {
          color: 'rgba(255, 255, 255, 0.6)',
          font: {
            family: 'Orbitron'
          }
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        }
      }
    }
  }

  return (
    <div className="bg-white/80 backdrop-blur-lg rounded-lg p-6 border border-gray-300">
      <Line data={chartData} options={options} />
    </div>
  )
} 