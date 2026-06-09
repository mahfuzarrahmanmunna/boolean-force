"use client";

import { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function ManagePerformancePage() {
  const [chartData, setChartData] = useState(null);
  const [totalSubmissions, setTotalSubmissions] = useState(0);

  useEffect(() => {
    fetch("/api/tasks/submissions")
      .then((res) => res.json())
      .then((data) => {

        // ✅ Group submissions by worker
        const grouped = {};

        data.forEach((item) => {
          if (!grouped[item.workerName]) {
            grouped[item.workerName] = 0;
          }
          grouped[item.workerName]++;
        });

        // ✅ Convert to array
        const formatted = Object.keys(grouped).map((name) => ({
          workerName: name,
          totalSubmitted: grouped[name],
        }));

        const total = formatted.reduce(
          (sum, item) => sum + item.totalSubmitted,
          0
        );

        setTotalSubmissions(total);

        // ✅ Doughnut Chart Data
        setChartData({
          labels: formatted.map((item) => item.workerName),
          datasets: [
            {
              label: "Completed Tasks",
              data: formatted.map((item) => item.totalSubmitted),
              backgroundColor: [
                "#6366F1", // indigo
                "#22D3EE", // cyan
                "#34D399", // green
                "#F472B6", // pink
                "#FBBF24", // yellow
              ],
              borderWidth: 0,
              hoverOffset: 12,
            },
          ],
        });
      });
  }, []);

  if (!chartData) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white text-lg">
        Loading performance...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black p-10 text-white">

      {/* 🔥 HEADER */}
      <div className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
          Performance Dashboard
        </h1>
        <p className="text-gray-400 mt-3 max-w-xl mx-auto">
          Each worker demonstrates their performance by submitting completed work.
        </p>
      </div>

      {/* ⚡ STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-14">

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-7 rounded-2xl shadow-lg hover:scale-105 transition">
          <p className="text-gray-400">Total Workers</p>
          <h2 className="text-4xl font-bold mt-2 text-indigo-400">
            {chartData.labels.length}
          </h2>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-7 rounded-2xl shadow-lg hover:scale-105 transition">
          <p className="text-gray-400">Total Submissions</p>
          <h2 className="text-4xl font-bold mt-2 text-cyan-400">
            {totalSubmissions}
          </h2>
        </div>

      </div>

      {/* 🍩 DOUGHNUT CHART CARD */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-xl flex flex-col md:flex-row items-center gap-12">

        {/* Chart */}
        <div className="w-[260px] md:w-[320px]">
          <Doughnut
            data={chartData}
            options={{
              plugins: {
                legend: {
                  position: "bottom",
                  labels: {
                    color: "#E5E7EB",
                    padding: 20,
                  },
                },
              },
              cutout: "70%",
            }}
          />
        </div>

        {/* Side Info */}
        <div className="flex-1">
          <h2 className="text-2xl font-semibold text-indigo-300 mb-4">
            Performance Distribution
          </h2>

          <p className="text-gray-400 mb-6">
            Shows how much each worker contributes based on submitted tasks.
          </p>

          <div className="space-y-3">
            {chartData.labels.map((name, index) => (
              <div
                key={index}
                className="flex justify-between bg-white/5 px-4 py-2 rounded-lg"
              >
                <span>{name}</span>
                <span className="font-semibold text-cyan-400">
                  {chartData.datasets[0].data[index]}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
