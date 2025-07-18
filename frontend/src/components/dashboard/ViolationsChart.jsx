import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";

// Function to generate a random hex color
function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

// Ensure COLORS array matches pieData length
const getColorsArray = (dataLength) => {
  const baseColors = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
  const colors = [...baseColors];
  while (colors.length < dataLength) {
    colors.push(getRandomColor());
  }
  return colors;
};

// Mock data for BarChart (Violations Over Time)
const barData = [
  { date: "2024-06-01", violations: 2 },
  { date: "2024-06-02", violations: 4 },
  { date: "2024-06-03", violations: 3 },
  { date: "2024-06-04", violations: 5 },
  { date: "2024-06-05", violations: 4 },
];

const ViolationsChart = ({ kpis }) => {
  // Aggregate by type and sum counts
  const aggregated = (kpis || []).reduce((acc, item) => {
    const type = item.type;
    const count = Number(1);
    if (acc[type]) {
      acc[type].count += count;
    } else {
      acc[type] = { name: type, type, count, timeStamp: item.timestamp };
    }
    return acc;
  }, {});
  const pieData = Object.values(aggregated);
  // console.log(pieData);
  const colors = getColorsArray(pieData.length);
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <div className="bg-white rounded-2xl shadow-lg p-6">
        {/* Pie Chart: Violation Types */}
        <div className="font-semibold mb-2">Violation Types</div>
        <PieChart width={500} height={250}>
          <Pie
            data={pieData}
            cx={120}
            cy={120}
            innerRadius={50}
            outerRadius={80}
            fill="#8884d8"
            paddingAngle={3}
            dataKey="count"
            label
          >
            {pieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index]} />
            ))}
          </Pie>
          {/* <br/> */}
          <RechartsTooltip />
          <Legend layout="vertical" align="right" verticalAlign="middle" />
        </PieChart>
      </div>
      <div className="bg-white rounded-2xl shadow-lg p-6">
        {/* Bar Chart: Violations Over Time */}
        <div className="font-semibold mb-2">Violations Over Time</div>
        <BarChart
          width={350}
          height={250}
          data={pieData}
          margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="timeStamp" />
          <YAxis />
          <RechartsTooltip />
          <Legend />
          <Bar dataKey="count" fill="#8884d8" />
        </BarChart>
      </div>
    </div>
  );
};

export default ViolationsChart;
