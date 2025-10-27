import React from 'react';
import FinancialOverview from './FinancialOverview';
import RecentActivities from './RecentActivities';
import SidebarWidgets from './SidebarWidgets';

const DashboardMain = ({
  activeView,
  financialData,
  recentActivities,
  setShowMessages,
  setShowNotifications,
  messageThreads,
  notifications
}) => {
  if (activeView !== 'dashboard') {
    return <OtherView activeView={activeView} />;
  }

  return (
    <main className="flex-1 overflow-y-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <FinancialOverview financialData={financialData} />
          <RecentActivities recentActivities={recentActivities} />
        </div>
        <SidebarWidgets
          setShowMessages={setShowMessages}
          setShowNotifications={setShowNotifications}
          messageThreads={messageThreads}
          notifications={notifications}
        />
      </div>
    </main>
  );
};

const OtherView = ({ activeView }) => (
  <main className="flex-1 overflow-y-auto p-6">
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">
        {activeView.charAt(0).toUpperCase() + activeView.slice(1)} View
      </h2>
      <p className="text-gray-600">
        This section is under development. Please check back later.
      </p>
    </div>
  </main>
);

export default DashboardMain;