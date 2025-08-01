import { useState } from 'react';
import {
  ChartBarIcon,
  ExclamationTriangleIcon,
  HeartIcon,
  ChevronUpIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline';
import type { ForwardRefExoticComponent, SVGProps, RefAttributes } from 'react';

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

// Placeholder data - replace with API calls
const experienceMetrics = {
  npsScore: 8.2,
  npsTrend: '+0.5',
  engagement: 87,
  engagementTrend: '+2%',
  attritionRate: 5.2,
  averageTenure: '2.8 years',
};

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
    name: 'Low Engagement',
    count: 8,
    details: 'Limited participation in team activities',
  },
  {
    id: 3,
    name: 'Performance Concerns',
    count: 3,
    details: 'Declining productivity trends',
  },
];

const satisfactionInsights = [
  {
    category: 'Work Environment',
    score: 4.2,
    trend: 'up',
    details: 'Positive feedback on remote work policy',
  },
  {
    category: 'Career Growth',
    score: 3.8,
    trend: 'down',
    details: 'Concerns about promotion clarity',
  },
  {
    category: 'Team Collaboration',
    score: 4.5,
    trend: 'up',
    details: 'Strong team bonding and support',
  },
];

function MetricCard({
  title,
  value,
  trend,
  icon: Icon,
  trendColor = 'text-green-600',
}: {
  title: string;
  value: string | number;
  trend?: string;
  icon: any;
  trendColor?: string;
}) {
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
          {trend.startsWith('+') ? (
            <ChevronUpIcon className="h-4 w-4 mr-1 text-green-600" />
          ) : (
            <ChevronDownIcon className="h-4 w-4 mr-1 text-red-600" />
          )}
          <span
            className={`text-sm ${
              trend.startsWith('+') ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {trend}
          </span>
        </div>
      )}
    </div>
  );
}

export default function Experience() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Team Experience</h1>
        <p className="mt-2 text-sm text-gray-700">
          Monitor team satisfaction and identify areas for improvement
        </p>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
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

      {/* Top Issues */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <h2 className="text-lg font-medium text-gray-900">Top Reported Issues</h2>
          <div className="mt-4 space-y-4">
            {topIssues.map((issue) => (
              <div
                key={issue.id}
                className={`
                  flex items-center justify-between p-4 rounded-lg
                  ${
                    issue.severity === 'high'
                      ? 'bg-red-50'
                      : issue.severity === 'medium'
                      ? 'bg-yellow-50'
                      : 'bg-blue-50'
                  }
                `}
              >
                <span
                  className={`
                    text-sm font-medium
                    ${
                      issue.severity === 'high'
                        ? 'text-red-800'
                        : issue.severity === 'medium'
                        ? 'text-yellow-800'
                        : 'text-blue-800'
                    }
                  `}
                >
                  {issue.issue}
                </span>
                <span
                  className={`
                    text-xs font-medium px-2.5 py-0.5 rounded-full
                    ${
                      issue.severity === 'high'
                        ? 'bg-red-100 text-red-800'
                        : issue.severity === 'medium'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-blue-100 text-blue-800'
                    }
                  `}
                >
                  {issue.severity}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Risk Segments and Satisfaction Insights */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Risk Segments */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900">Risk Segments</h2>
            <div className="mt-4 space-y-4">
              {riskSegments.map((segment) => (
                <div key={segment.id} className="border-b border-gray-200 pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">
                        {segment.name}
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">{segment.details}</p>
                    </div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      {segment.count} employees
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Satisfaction Insights */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900">
              Satisfaction Insights
            </h2>
            <div className="mt-4 space-y-4">
              {satisfactionInsights.map((insight) => (
                <div
                  key={insight.category}
                  className="border-b border-gray-200 pb-4"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">
                        {insight.category}
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">{insight.details}</p>
                    </div>
                    <div className="flex items-center">
                      <span className="text-lg font-medium text-gray-900 mr-2">
                        {insight.score}/5
                      </span>
                      <ChevronUpIcon
                        className={`h-5 w-5 ${
                          insight.trend === 'up'
                            ? 'text-green-600'
                            : 'text-red-600'
                        }`}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 