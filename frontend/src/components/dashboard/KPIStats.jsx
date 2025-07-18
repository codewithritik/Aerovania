import React from "react";
import Card from "../ui/Card";

const KPIStats = ({ stats }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
    {/* {stats && stats.length > 0 && stats.map(({ title, value, icon, trend, color }, idx) => ( */}
    <Card className="flex items-center justify-between">
      <div>
        <p className="text-3xl font-bold text-gray-900">{stats?.total}</p>
        <p className="text-sm font-medium text-gray-600">Total violations </p>
        {/* {trend && <p className="text-sm text-green-600">↗ {"trend"}</p>} */}
      </div>
    </Card>
    <Card className="flex items-center justify-between">
      <div>
        <p className="text-3xl font-bold text-gray-900">
          {stats?.byType?.length}
        </p>
        <p className="text-sm font-medium text-gray-600">Violations by type</p>
        {/* {trend && <p className="text-sm text-green-600">↗ {"trend"}</p>} */}
      </div>
    </Card>
    <Card className="flex items-center justify-between">
      <div>
        <p className="text-3xl font-bold text-gray-900">
          {stats?.byDrone?.length}
        </p>
        <p className="text-sm font-medium text-gray-600">Drone ID</p>
        {/* {trend && <p className="text-sm text-green-600">↗ {"trend"}</p>} */}
      </div>
    </Card>
    <Card className="flex items-center justify-between">
      <div>
        <p className="text-3xl font-bold text-gray-900">
          {stats?.byLocation?.length}
        </p>
        <p className="text-sm font-medium text-gray-600">Location</p>
        {/* {trend && <p className="text-sm text-green-600">↗ {"trend"}</p>} */}
      </div>
    </Card>
    {/* ))} */}
  </div>
);

export default KPIStats;
