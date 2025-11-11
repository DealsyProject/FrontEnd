import React from 'react';

const FinancialOverview = ({ financialData }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Financial Overview</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {financialData.map((item, idx) => (
          <FinancialCard key={idx} item={item} />
        ))}
      </div>
    </div>
  );
};

const FinancialCard = ({ item }) => {
  // Icon and color configuration based on card type
  const getCardConfig = (title) => {
    const config = {
      'Total Revenue': { icon: '💰', bgColor: 'bg-green-100', iconColor: 'text-green-600' },
      'Total Payments': { icon: '📊', bgColor: 'bg-blue-100', iconColor: 'text-blue-600' },
      'Total Refunded': { icon: '↩️', bgColor: 'bg-orange-100', iconColor: 'text-orange-600' },
      'Net Revenue': { icon: '💳', bgColor: 'bg-purple-100', iconColor: 'text-purple-600' },
      'Monthly Revenue': { icon: '📈', bgColor: 'bg-teal-100', iconColor: 'text-teal-600' },
      'Pending Payments': { icon: '⏳', bgColor: 'bg-yellow-100', iconColor: 'text-yellow-600' },
      'Failed Payments': { icon: '❌', bgColor: 'bg-red-100', iconColor: 'text-red-600' },
      'Successful Payments': { icon: '✅', bgColor: 'bg-green-100', iconColor: 'text-green-600' }
    };
    
    return config[title] || { icon: '💼', bgColor: 'bg-gray-100', iconColor: 'text-gray-600' };
  };

  const config = getCardConfig(item.title);

  return (
    <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300 border border-gray-100">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{item.title}</p>
          <p className="text-2xl font-bold text-gray-800 mb-1">{item.value}</p>
          {item.subtitle && (
            <p className={`text-xs mt-1 ${
              item.title.includes('Refunded') || item.title.includes('Failed') 
                ? 'text-red-600' 
                : item.title.includes('Pending')
                ? 'text-yellow-600'
                : 'text-green-600'
            }`}>
              {item.subtitle}
            </p>
          )}
          {item.trend && (
            <p className={`text-xs font-medium ${
              item.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'
            }`}>
              {item.trend}
            </p>
          )}
        </div>
        <div className={`w-12 h-12 ${config.bgColor} rounded-full flex items-center justify-center`}>
          <span className={`text-xl ${config.iconColor}`}>{config.icon}</span>
        </div>
      </div>
    </div>
  );
};

export default FinancialOverview;