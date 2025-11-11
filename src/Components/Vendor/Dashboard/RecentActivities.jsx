import React from 'react';

const RecentActivities = ({ recentActivities }) => {
  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
      <div className="space-y-4">
        {recentActivities.length > 0 ? (
          recentActivities.map((activity, idx) => (
            <ActivityItem key={idx} activity={activity} />
          ))
        ) : (
          <EmptyActivities />
        )}
      </div>
    </div>
  );
};

const ActivityItem = ({ activity }) => (
  <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
    <div className="w-2 h-2 bg-[#586330]/50 rounded-full mt-2 flex-shrink-0"></div>
    <div className="flex-1">
      <p className="text-sm font-medium text-gray-800">{activity.type}</p>
      <p className="text-sm text-gray-600">{activity.description}</p>
      <p className="text-xs text-gray-400 mt-1">{activity.date}</p>
    </div>
  </div>
);

const EmptyActivities = () => (
  <div className="text-center py-8 text-gray-500">
    No recent activities
  </div>
);

export default RecentActivities;