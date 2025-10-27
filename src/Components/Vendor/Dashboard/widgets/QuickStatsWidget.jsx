import React from 'react';

const QuickStatsWidget = () => {
  const stats = [
    { label: 'Products Listed', value: '0' },
    { label: 'Orders Today', value: '0' },
    { label: 'Customer Reviews', value: '0' }
  ];

  return (
    <div className="bg-purple-50 rounded-xl shadow p-6">
      <h3 className="text-lg font-semibold text-purple-800 mb-4">Quick Stats</h3>
      <div className="space-y-3">
        {stats.map((stat, index) => (
          <StatItem key={index} label={stat.label} value={stat.value} />
        ))}
      </div>
    </div>
  );
};

const StatItem = ({ label, value }) => (
  <div className="flex justify-between items-center">
    <span className="text-sm text-gray-600">{label}</span>
    <span className="font-semibold text-purple-700">{value}</span>
  </div>
);

export default QuickStatsWidget;