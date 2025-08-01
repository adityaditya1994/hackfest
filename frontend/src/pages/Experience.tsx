import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  ChartBarIcon,
  ExclamationTriangleIcon,
  HeartIcon,
} from '@heroicons/react/24/outline';
import type { ForwardRefExoticComponent, SVGProps, RefAttributes } from 'react';
import { experienceService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

type IconType = ForwardRefExoticComponent<
  Omit<SVGProps<SVGSVGElement>, "ref"> & {
    title?: string | undefined;
    titleId?: string | undefined;
  } & RefAttributes<SVGSVGElement>
>;

interface MetricCardProps {
  title: string;
  value: string | number;
  trend?: string;
  icon: IconType;
  trendColor?: string;
}

function MetricCard({
  title,
  value,
  trend,
  icon: Icon,
  trendColor = 'text-green-600',
}: MetricCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="mt-2 text-3xl font-semibold text-gray-900">{value}</p>
        </div>
        <div className={`rounded-md bg-${trendColor.split('-')[1]}-50 p-2`}>
          <Icon className={`h-6 w-6 ${trendColor}`} />
        </div>
      </div>
      {trend && (
        <div className="mt-4 flex items-center">
          <span className={`text-sm ${trend.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
            {trend}
          </span>
        </div>
      )}
    </div>
  );
}

export default function Experience() {
  const { user } = useAuth();
  const [expandedSegment, setExpandedSegment] = useState<number | null>(null);
  const [expandedIssue, setExpandedIssue] = useState<number | null>(null);

  // Fetch engagement metrics
  const { data: apiMetrics, isLoading: metricsLoading } = useQuery({
    queryKey: ['experienceMetrics', user?.role, user?.department, user?.empId],
    queryFn: () => {
      if (user?.role === 'leader' || user?.role === 'manager') {
        return experienceService.getEngagementMetrics(user.role, user.department, user.empId);
      }
      return experienceService.getEngagementMetrics(user?.role, user?.department);
    },
    enabled: !!user,
  });

  // Default values for when data is loading
  const defaultMetrics = {
    npsScore: 8.2,
    npsTrend: '+0.5',
    engagement: 87,
    engagementTrend: '+2%',
    attritionRate: 5.2,
    averageTenure: '2.8 years',
  };

  const experienceMetrics = apiMetrics || defaultMetrics;

  if (metricsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading experience data...</div>
      </div>
    );
  }

  // Placeholder data for now
  const topIssues = [
    { id: 1, issue: 'Work-life balance concerns in Team A', severity: 'high' },
    { id: 2, issue: 'Limited growth opportunities in Design', severity: 'medium' },
    { id: 3, issue: 'Tool access delays for new joiners', severity: 'low' },
  ];

  const riskSegments = [
    {
      id: 1,
      name: 'High Attrition Risk',
      count: 5,
      details: 'Multiple factors including compensation and growth',
    },
    {
      id: 2,
      name: 'Moderate Engagement Issues',
      count: 12,
      details: 'Work-life balance and development concerns',
    },
    {
      id: 3,
      name: 'New Joiner Support',
      count: 8,
      details: 'Onboarding and integration challenges',
    },
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Employee Experience</h1>
          <p className="mt-2 text-sm text-gray-700">
            Monitor employee satisfaction, engagement, and experience metrics
          </p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="NPS Score"
          value={experienceMetrics.npsScore}
          trend={experienceMetrics.npsTrend}
          icon={ChartBarIcon}
        />
        <MetricCard
          title="Engagement"
          value={`${experienceMetrics.engagement}%`}
          trend={experienceMetrics.engagementTrend}
          icon={HeartIcon}
        />
        <MetricCard
          title="Attrition Rate"
          value={`${experienceMetrics.attritionRate}%`}
          icon={ExclamationTriangleIcon}
          trendColor="text-yellow-600"
        />
        <MetricCard
          title="Average Tenure"
          value={experienceMetrics.averageTenure}
          icon={ChartBarIcon}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Issues */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Top Issues</h3>
          </div>
          <div className="px-6 py-4">
            <div className="space-y-4">
              {topIssues.map((issue) => (
                <div key={issue.id} className="border rounded-lg p-4">
                  <div
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => setExpandedIssue(expandedIssue === issue.id ? null : issue.id)}
                  >
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900">{issue.issue}</p>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(issue.severity)}`}>
                          {issue.severity}
                        </span>
                      </div>
                    </div>
                    {expandedIssue === issue.id ? (
                      <span className="text-xl">▲</span>
                    ) : (
                      <span className="text-xl">▼</span>
                    )}
                  </div>
                  {expandedIssue === issue.id && (
                    <div className="mt-4 pt-4 border-t">
                      <p className="text-sm text-gray-600">
                        Detailed analysis and action items would be displayed here.
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Risk Segments */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Employee Risk Segments</h3>
          </div>
          <div className="px-6 py-4">
            <div className="space-y-4">
              {riskSegments.map((segment) => (
                <div key={segment.id} className="border rounded-lg p-4">
                  <div
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => setExpandedSegment(expandedSegment === segment.id ? null : segment.id)}
                  >
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900">{segment.name}</p>
                        <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-medium">
                          {segment.count} employees
                        </span>
                      </div>
                    </div>
                    {expandedSegment === segment.id ? (
                      <span className="text-xl">▲</span>
                    ) : (
                      <span className="text-xl">▼</span>
                    )}
                  </div>
                  {expandedSegment === segment.id && (
                    <div className="mt-4 pt-4 border-t">
                      <p className="text-sm text-gray-600">{segment.details}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 