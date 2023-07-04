"use client"

import {
  Chart as ChartJs, 
  CategoryScale, 
  LinearScale, 
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

import moment from 'moment';

import { Bar } from 'react-chartjs-2';

ChartJs.register(
  CategoryScale, 
  LinearScale, 
  BarElement,
  Title,
  Tooltip,
  Legend,
)

const weekStart = moment().startOf("week").format("MM/DD");
const weekEnd = moment().endOf("week").format("MM/DD");

export const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
      legend: {
      position: 'top' as const,
    },
    title: {
      display: true,
      text: weekStart + "~" + weekEnd
    }
  }
}

const labels = [ '日曜日','月曜日', '火曜日', '水曜日', '木曜日', '金曜日', '土曜日', ]

export const data = {
  labels,
  datasets: [
    {
      label: "出品数",
      data: [33, 125, 50, 130, 88, 75, 120],
      backgroundColor: "rgba(65, 105, 225, 0.5)",
    }
  ]
};

export const Chart = () => {
  return (
    <div className='relative bg-white rounded-lg shadow-lg p-8 w-full h-96 my-4 md:w-1/2'>
      <Bar options={options} data={data} />
    </div>
  );
}
