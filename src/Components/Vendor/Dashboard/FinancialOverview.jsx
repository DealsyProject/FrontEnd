import React from 'react';

const FinancialOverview = ({ financialData }) => {
  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Financial Overview</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {financialData.map((item, idx) => (
          <FinancialCard key={idx} item={item} />
        ))}
      </div>
    </div>
  );
};

const FinancialCard = ({ item }) => (
  <div className="text-center p-4 bg-[#586330]/20 rounded-lg hover:shadow-md transition-shadow duration-200">
    
    <h4 className="text-xl font-bold text-gray-800 mb-1">{item.title}</h4>
    <p className="text-2xl font-bold text-gray-600 mb-1">{item.value}</p>
    <p className="text-sm text-gray-500">{item.subtitle}</p>
  </div>
);

export default FinancialOverview;