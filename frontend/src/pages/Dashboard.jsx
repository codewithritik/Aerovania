import React, { useEffect, useState, useRef } from 'react';
import Layout from '../components/layout/Layout';
import KPIStats from '../components/dashboard/KPIStats';
import ViolationsChart from '../components/dashboard/ViolationsChart';
import ViolationsMap from '../components/dashboard/ViolationsMap';
import ViolationsTable from '../components/dashboard/ViolationsTable';
import FilterControls from '../components/dashboard/FilterControls';


const Dashboard = () => {
  const [kpis, setKpis] = useState(null);
  const [violations, setViolations] = useState([]);
  // Removed filters state to fix linter error
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dashboardRef = useRef();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      const accessToken = localStorage.getItem('accessToken');
      const headers = {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      };
      try {
        const [kpisRes, violationsRes, filtersRes] = await Promise.all([
          fetch('/api/reports/kpis', { headers }),
          fetch('/api/reports/violations', { headers }),
          fetch('/api/reports/filters', { headers })
        ]);
        if (!kpisRes.ok || !violationsRes.ok || !filtersRes.ok) {
          throw new Error('Failed to fetch dashboard data');
        }
        const kpisData = await kpisRes.json();
        const violationsData = await violationsRes.json();
        await filtersRes.json(); // filtersData not used
        setKpis({...kpisData, violationsCount: violationsData.total});
        setViolations(violationsData.violations || []);
        // setFilters(filtersData); // This line was removed as per the edit hint
      } catch (err) {
        setError(err.message || 'Unknown error');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div>Loading dashboard...</div>;
  if (error) return <div>Error: {error}</div>;

  // Export handlers
  const handleExportCSV = () => {
    // Prepare CSV data
    let csv = '';
    // KPIs
    if (kpis) {
      csv += 'KPI,Value\n';
      Object.entries(kpis).forEach(([key, value]) => {
        csv += `${key},${value}\n`;
      });
      csv += '\n';
    }
    // Violations
    if (violations && violations.length > 0) {
      csv += 'Violations\n';
      const headers = Object.keys(violations[0]);
      csv += headers.join(',') + '\n';
      violations.forEach(v => {
        csv += headers.map(h => JSON.stringify(v[h] ?? '')).join(',') + '\n';
      });
    }
    // Download CSV
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'dashboard_export.csv';
    a.click();
    URL.revokeObjectURL(url);
  };


  return (
    <Layout>
      
      <div ref={dashboardRef}>
        <KPIStats stats={kpis} />
        <ViolationsChart kpis={violations} />
        <ViolationsMap violations={violations} />
        <ViolationsTable violations={violations} />
      </div>
    </Layout>
  );
};

export default Dashboard; 