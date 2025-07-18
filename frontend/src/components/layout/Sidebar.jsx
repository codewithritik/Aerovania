import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => (
  <aside className="h-full w-64 bg-gray-100 shadow-lg p-4 hidden md:block">
    <div className="font-semibold text-lg mb-6">Navigation</div>
    <ul className="space-y-4">
      <li><Link to="/dashboard" className="hover:text-blue-600">Dashboard</Link></li>
      <li><Link to="/upload" className="hover:text-blue-600">Upload Data</Link></li>
      {/* Add more links as needed */}
    </ul>
  </aside>
);

export default Sidebar; 