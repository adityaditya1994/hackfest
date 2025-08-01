import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  UserGroupIcon,
  BriefcaseIcon,
  ExclamationTriangleIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';
import { dashboardService, DashboardMetrics, AgeMixData, SeniorityMixData } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

// Color palettes for charts
const AGE_COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1', '#d084d0'];
const SENIORITY_COLORS = ['#0088fe', '#00c49f', '#ffbb28', '#ff8042', '#8884d8'];

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
          <span className={`text-sm ${trend.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
            {trend}
          </span>
        </div>
      )}
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  
  const isHRView = user?.role === 'hr';
  const isLeaderView = user?.role === 'leader';
  const isManagerView = user?.role === 'manager';

  // Fetch dashboard metrics
  const { data: metrics, isLoading, error, refetch } = useQuery({
    queryKey: ['dashboard', user?.role, user?.department, user?.empId],
    queryFn: () => dashboardService.getMetrics(user?.role, user?.department, user?.empId),
    enabled: !!user,
  });

  // Fetch age mix data
  const { data: ageMixData, isLoading: ageMixLoading } = useQuery({
    queryKey: ['ageMix', user?.role, user?.department, user?.empId],
    queryFn: () => dashboardService.getAgeMix(user?.role, user?.department, user?.empId),
    enabled: !!user,
  });

  // Fetch seniority mix data
  const { data: seniorityMixData, isLoading: seniorityMixLoading } = useQuery({
    queryKey: ['seniorityMix', user?.role, user?.department, user?.empId],
    queryFn: () => dashboardService.getSeniorityMix(user?.role, user?.department, user?.empId),
    enabled: !!user,
  });

  console.log('Dashboard query state:', { metrics, isLoading, error });

  // Manual test function
  const testAPI = async () => {
    try {
      console.log('Manual API test starting...');
      const data = await dashboardService.getMetrics();
      console.log('Manual API test successful:', data);
      alert('API test successful! Check console for data.');
    } catch (err) {
      console.error('Manual API test failed:', err);
      alert('API test failed! Check console for errors.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading dashboard data...</div>
      </div>
    );
  }

  if (error) {
    console.error('Dashboard error:', error);
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="text-lg text-red-600">
          Error loading dashboard data: {error instanceof Error ? error.message : 'Unknown error'}
        </div>
        <div className="space-x-4">
          <button 
            onClick={() => refetch()} 
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
          <button 
            onClick={testAPI} 
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Test API Manually
          </button>
        </div>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="text-lg">No data available</div>
        <button 
          onClick={testAPI} 
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Test API Manually
        </button>
      </div>
    );
  }

  const formatPercentage = (value: number) => `${value.toFixed(1)}%`;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded shadow-lg">
          <p className="font-medium">{`${label}: ${payload[0].value}`}</p>
          <p className="text-sm text-gray-600">{`${((payload[0].value / payload[0].payload.total) * 100).toFixed(1)}%`}</p>
        </div>
      );
    }
    return null;
  };

  // Calculate totals for percentage calculation
  const ageMixTotal = ageMixData?.reduce((sum, item) => sum + item.count, 0) || 0;
  const seniorityMixTotal = seniorityMixData?.reduce((sum, item) => sum + item.count, 0) || 0;

  // Add total to each data point for tooltip calculation
  const ageMixWithTotal = ageMixData?.map(item => ({ ...item, total: ageMixTotal })) || [];
  const seniorityMixWithTotal = seniorityMixData?.map(item => ({ ...item, total: seniorityMixTotal })) || [];

  return (
    <div className="space-y-6">
      {/* Header with role-specific messaging */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isHRView ? 'HR Analytics Dashboard' : isLeaderView ? 'Leadership Dashboard' : 'Manager Dashboard'}
            </h1>
            <p className="text-gray-600">
              {isHRView 
                ? 'Company-wide people analytics and HR insights'
                : isLeaderView 
                ? 'Strategic people insights for organizational leadership'
                : 'Team performance and engagement metrics'
              }
            </p>
          </div>
          <div className="text-sm text-gray-500">
            {user?.department && <span>Department: {user.department}</span>}
          </div>
        </div>
      </div>

      {/* Today's Pulse */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-base font-semibold leading-6 text-gray-900">
            {isHRView ? "Today's HR Pulse" : "Today's Team Pulse"}
          </h3>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="bg-red-50 rounded-lg p-4">
              <div className="flex items-center">
                <div className="h-6 w-6 text-red-600">⚠️</div>
                <span className="ml-2 text-red-700">
                  {metrics.riskMetrics.atRiskEmployees} employees at high attrition risk
                </span>
              </div>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4">
              <div className="flex items-center">
                <div className="h-6 w-6 text-yellow-600">💼</div>
                <span className="ml-2 text-yellow-700">
                  {metrics.hiringOverview.openPositions} open positions
                </span>
              </div>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center">
                <div className="h-6 w-6 text-green-600">📈</div>
                <span className="ml-2 text-green-700">
                  {metrics.performanceMetrics.highPerformers} high performers
                </span>
              </div>
            </div>
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center">
                <div className="h-6 w-6 text-blue-600">👥</div>
                <span className="ml-2 text-blue-700">
                  {metrics.teamComposition.totalEmployees} total employees
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Age Mix and Seniority Mix Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Age Mix Pie Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">👥 Age Distribution</h3>
          {ageMixLoading ? (
            <div className="h-64 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
            </div>
          ) : ageMixData && ageMixData.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={ageMixWithTotal}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="count"
                    nameKey="age_group"
                    label={({ age_group, percent }: any) => `${age_group} (${(percent * 100).toFixed(0)}%)`}
                    labelLine={false}
                  >
                    {ageMixData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={AGE_COLORS[index % AGE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500">
              No age distribution data available
            </div>
          )}
        </div>

        {/* Seniority Mix Pie Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">🎯 Seniority Distribution</h3>
          {seniorityMixLoading ? (
            <div className="h-64 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
            </div>
          ) : seniorityMixData && seniorityMixData.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={seniorityMixWithTotal}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="count"
                    nameKey="level"
                    label={({ level, percent }: any) => `${level} (${(percent * 100).toFixed(0)}%)`}
                    labelLine={false}
                  >
                    {seniorityMixData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={SENIORITY_COLORS[index % SENIORITY_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500">
              No seniority distribution data available
            </div>
          )}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Team Composition */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-base font-semibold leading-6 text-gray-900">
              {isHRView ? 'Company Composition' : 'Team Composition'}
            </h3>
            <dl className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">Total Employees</dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">
                  {metrics.teamComposition.totalEmployees}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Gender Ratio</dt>
                <dd className="mt-1 text-lg text-gray-900">
                  {Math.round(metrics.teamComposition.genderRatio.male)}% M | {Math.round(metrics.teamComposition.genderRatio.female)}% F
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Avg Experience</dt>
                <dd className="mt-1 text-lg text-gray-900">
                  {metrics.teamComposition.averageExperience.toFixed(1)} years
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Avg Tenure</dt>
                <dd className="mt-1 text-lg text-gray-900">
                  {metrics.teamComposition.averageTenure.toFixed(1)} years
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Hiring Overview */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-base font-semibold leading-6 text-gray-900">
              {isHRView ? 'Hiring Pipeline' : 'Hiring Overview'}
            </h3>
            <dl className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">Open Positions</dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">
                  {metrics.hiringOverview.openPositions}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">In Progress</dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">
                  {metrics.hiringOverview.inProgress}
                </dd>
              </div>
            </dl>
            {isHRView && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-700">
                  <strong>HR Insight:</strong> Focus on high-priority roles and candidate experience optimization.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Risk Signals */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-base font-semibold leading-6 text-gray-900">
              {isHRView ? 'People Risk Analytics' : 'Risk Signals'}
            </h3>
            <dl className="mt-4 grid grid-cols-1 gap-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Employees at Risk</dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">
                  {metrics.riskMetrics.atRiskEmployees}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Low Engagement</dt>
                <dd className="mt-1">
                  <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
                    <li>{metrics.riskMetrics.lowEngagement} employees showing low engagement</li>
                  </ul>
                </dd>
              </div>
            </dl>
            {isHRView && (
              <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
                <p className="text-sm text-yellow-700">
                  <strong>HR Action:</strong> Schedule retention conversations with at-risk employees.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Performance Overview */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-base font-semibold leading-6 text-gray-900">
              {isHRView ? 'Performance Analytics' : 'Performance Overview'}
            </h3>
            <dl className="mt-4 grid grid-cols-1 gap-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">High Performers</dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">
                  {metrics.performanceMetrics.highPerformers}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Needs Improvement</dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">
                  {metrics.performanceMetrics.needsImprovement}
                </dd>
              </div>
            </dl>
            {isLeaderView && (
              <div className="mt-4 p-3 bg-green-50 rounded-lg">
                <p className="text-sm text-green-700">
                  <strong>Leadership Insight:</strong> Consider promoting high performers and providing development support.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Role-specific additional insights */}
      {isHRView && (
        <div className="bg-white rounded-lg shadow">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-base font-semibold leading-6 text-gray-900">HR Strategic Actions</h3>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border-l-4 border-blue-500 bg-blue-50">
                <h4 className="font-medium text-blue-900">Talent Acquisition</h4>
                <p className="text-sm text-blue-700 mt-1">Review job descriptions and hiring process efficiency</p>
              </div>
              <div className="p-4 border-l-4 border-green-500 bg-green-50">
                <h4 className="font-medium text-green-900">Employee Development</h4>
                <p className="text-sm text-green-700 mt-1">Plan L&D programs for skill enhancement</p>
              </div>
              <div className="p-4 border-l-4 border-yellow-500 bg-yellow-50">
                <h4 className="font-medium text-yellow-900">Retention Strategy</h4>
                <p className="text-sm text-yellow-700 mt-1">Address engagement gaps and career progression</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {isLeaderView && (
        <div className="bg-white rounded-lg shadow">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-base font-semibold leading-6 text-gray-900">Leadership Priorities</h3>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border-l-4 border-purple-500 bg-purple-50">
                <h4 className="font-medium text-purple-900">Strategic Planning</h4>
                <p className="text-sm text-purple-700 mt-1">Align team capabilities with business objectives</p>
              </div>
              <div className="p-4 border-l-4 border-indigo-500 bg-indigo-50">
                <h4 className="font-medium text-indigo-900">Culture & Engagement</h4>
                <p className="text-sm text-indigo-700 mt-1">Foster innovation and collaborative culture</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 