import React from 'react';
import Card from '../ui/Card';
import { Link } from 'react-router-dom';

const RecentActivityWidget = ({ title, items, emptyMessage = "No recent activity", viewAllLink }) => {
  return (
    <Card className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900">{title}</h3>
        {viewAllLink && (
          <Link 
            to={viewAllLink} 
            className="text-sm font-medium text-[#FF6900] hover:text-[#e05d00] transition-colors"
          >
            View All
          </Link>
        )}
      </div>
      
      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 -mr-2">
        {items && items.length > 0 ? (
          <div className="space-y-4">
            {items.map((item, index) => (
              <div key={index} className="flex items-start gap-3 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                {item.icon && (
                  <div className="mt-1 shrink-0">
                    {item.icon}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {item.title}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {item.description}
                  </p>
                  {item.timestamp && (
                    <p className="text-xs text-gray-400 mt-1">
                      {item.timestamp}
                    </p>
                  )}
                </div>
                {item.action && (
                  <div className="shrink-0">
                    {item.action}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center py-8">
            <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3">
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <p className="text-sm text-gray-500">{emptyMessage}</p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default RecentActivityWidget;
