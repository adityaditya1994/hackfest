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

// Magenta shades for charts - matching brand color
const AGE_COLORS = ['#460022', '#72003e', '#8a004a', '#a8005a', '#c8006a']; // Dark magenta shades
const SENIORITY_COLORS = ['#72003e', '#8a004a', '#a8005a', '#c8006a', '#E10075']; // Dark to light magenta

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
    queryFn: () => {
      if (user?.role === 'leader' || user?.role === 'manager') {
        return dashboardService.getMetrics(user.role, user.department, user.empId);
      }
      return dashboardService.getMetrics(user?.role, user?.department);
    },
    enabled: !!user,
  });

  // Fetch age mix data
  const { data: ageMixData, isLoading: ageMixLoading } = useQuery({
    queryKey: ['ageMix', user?.role, user?.department, user?.empId],
    queryFn: () => {
      if (user?.role === 'leader' || user?.role === 'manager') {
        return dashboardService.getAgeMix(user.role, user.department, user.empId);
      }
      return dashboardService.getAgeMix(user?.role, user?.department);
    },
    enabled: !!user,
  });

  // Fetch seniority mix data
  const { data: seniorityMixData, isLoading: seniorityMixLoading } = useQuery({
    queryKey: ['seniorityMix', user?.role, user?.department, user?.empId],
    queryFn: () => {
      if (user?.role === 'leader' || user?.role === 'manager') {
        return dashboardService.getSeniorityMix(user.role, user.department, user.empId);
      }
      return dashboardService.getSeniorityMix(user?.role, user?.department);
    },
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
      const data = payload[0];
      const value = data.value || 0;
      const total = data.payload?.total || 1;
      const percentage = ((value / total) * 100).toFixed(1);
      const displayLabel = data.payload?.age_group || data.payload?.level || label || 'Unknown';
      
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{`${displayLabel}: ${value}`}</p>
          <p className="text-sm text-gray-600">{`${percentage}%`}</p>
        </div>
      );
    }
    return null;
  };

  // Calculate totals for percentage calculation
  const ageMixTotal = ageMixData?.reduce((sum, item) => sum + (item.count || 0), 0) || 0;
  const seniorityMixTotal = seniorityMixData?.reduce((sum, item) => sum + (item.count || 0), 0) || 0;

  // Add total to each data point for tooltip calculation and ensure proper data structure
  const ageMixWithTotal = ageMixData?.map(item => ({ 
    ...item, 
    total: ageMixTotal,
    age_group: item.age_group || 'Unknown',
    count: item.count || 0
  })) || [];
  
  const seniorityMixWithTotal = seniorityMixData?.map(item => ({ 
    ...item, 
    total: seniorityMixTotal,
    level: item.level || 'Unknown',
    count: item.count || 0
  })) || [];



  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <div className="bg-white rounded-2xl p-8 shadow-card border border-gray-100">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 bg-primary-500 rounded-2xl flex items-center justify-center shadow-soft">
              <span className="text-white font-bold text-xl">PA</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Jarvis Analytics
              </h1>
              <p className="text-sm text-primary-500 font-medium">
                {user?.name || 'Sashi'}
              </p>
            </div>
          </div>
          <p className="text-gray-600 text-sm">
            {isHRView 
              ? `Company-wide insights across all ${metrics?.insights.totalEmployees || 0} employees` 
              : isLeaderView 
                ? `Strategic insights for ${user?.department || 'your department'} - ${metrics?.insights.totalEmployees || 0} team members`
                : `Team overview for your ${metrics?.insights.totalEmployees || 0} direct reports`
            }
          </p>
          {metrics?.metadata && (
            <div className="mt-4 bg-gray-50 rounded-xl p-4">
              <div className="text-sm text-gray-600">
                <span className="font-medium">Current Scope:</span> {metrics.metadata.scope} 
                {metrics.metadata.employeeCount && ` • ${metrics.metadata.employeeCount} employees`}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Today's Pulse */}
      <div className="bg-white rounded-2xl shadow-card border border-gray-100">
        <div className="px-6 py-6">
          <div className="flex items-center space-x-2 mb-6">
            <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></div>
            <h3 className="text-lg font-semibold text-gray-900">
              Today's Pulse
            </h3>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* High Attrition Risk Card */}
            <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl p-5 border border-primary-200 hover:shadow-lg transition-all duration-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center justify-center w-12 h-12 bg-red-500 rounded-xl shadow-soft">
                  <span className="text-white text-lg font-bold">⚠</span>
                </div>
                <div className="text-3xl font-bold text-primary-700">
                  {metrics.riskMetrics.atRiskEmployees}
                </div>
              </div>
              <div className="text-sm font-semibold text-primary-800 mb-1">High attrition risk</div>
              <div className="text-xs text-primary-600">Immediate attention needed</div>
            </div>

            {/* Burnout Signals Card */}
            <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl p-5 border border-primary-200 hover:shadow-lg transition-all duration-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center justify-center w-12 h-12 bg-orange-500 rounded-xl shadow-soft">
                  <span className="text-white text-lg font-bold">🔥</span>
                </div>
                <div className="text-3xl font-bold text-primary-700">
                  2
                </div>
              </div>
              <div className="text-sm font-semibold text-primary-800 mb-1">Burnout signals</div>
              <div className="text-xs text-primary-600">Monitor work patterns</div>
            </div>

            {/* Missing OKRs Card */}
            <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl p-5 border border-primary-200 hover:shadow-lg transition-all duration-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center justify-center w-12 h-12 bg-amber-500 rounded-xl shadow-soft">
                  <span className="text-white text-lg font-bold">🎯</span>
                </div>
                <div className="text-3xl font-bold text-primary-700">
                  5
                </div>
              </div>
              <div className="text-sm font-semibold text-primary-800 mb-1">Missing OKRs</div>
              <div className="text-xs text-primary-600">Q1 goals pending</div>
            </div>

            {/* Pending Approvals Card */}
            <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl p-5 border border-primary-200 hover:shadow-lg transition-all duration-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center justify-center w-12 h-12 bg-slate-500 rounded-xl shadow-soft">
                  <span className="text-white text-lg font-bold">⏱</span>
                </div>
                <div className="text-3xl font-bold text-primary-700">
                  8
                </div>
              </div>
              <div className="text-sm font-semibold text-primary-800 mb-1">Pending approvals</div>
              <div className="text-xs text-primary-600">Review required</div>
            </div>
          </div>
        </div>
      </div>

      {/* Age Mix and Seniority Mix Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Age Mix Chart */}
        <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-6">
          <div className="flex items-center space-x-2 mb-6">
            <div className="w-6 h-6 text-gray-600">👥</div>
            <h3 className="text-lg font-semibold text-gray-900">Age Distribution</h3>
          </div>
          {ageMixLoading ? (
            <div className="h-80 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
            </div>
          ) : ageMixData && ageMixData.length > 0 ? (
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <Pie
                    data={ageMixWithTotal}
                    cx="50%"
                    cy="50%"
                    outerRadius={60}
                    innerRadius={0}
                    dataKey="count"
                    nameKey="age_group"
                    label={({ age_group }: any) => age_group || ''}
                    labelLine={false}
                    fontSize={12}
                  >
                    {ageMixData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={AGE_COLORS[index % AGE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend 
                    wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
                    iconSize={8}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-80 flex items-center justify-center text-gray-500">
              No age distribution data available
            </div>
          )}
        </div>

        {/* Seniority Mix Chart */}
        <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-6">
          <div className="flex items-center space-x-2 mb-6">
            <div className="w-6 h-6 text-gray-600">🏅</div>
            <h3 className="text-lg font-semibold text-gray-900">Seniority Mix</h3>
          </div>
          {seniorityMixLoading ? (
            <div className="h-80 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
            </div>
          ) : seniorityMixData && seniorityMixData.length > 0 ? (
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <Pie
                    data={seniorityMixWithTotal}
                    cx="50%"
                    cy="50%"
                    outerRadius={60}
                    innerRadius={0}
                    dataKey="count"
                    nameKey="level"
                    label={({ level }: any) => level || ''}
                    labelLine={false}
                    fontSize={12}
                  >
                    {seniorityMixData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={SENIORITY_COLORS[index % SENIORITY_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend 
                    wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
                    iconSize={8}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-80 flex items-center justify-center text-gray-500">
              No seniority distribution data available
            </div>
          )}
        </div>

        {/* Office Presence Distribution */}
        <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Office Presence Distribution</h3>
              <p className="text-sm text-gray-500">Based on recent work patterns (500 employees)</p>
            </div>
          </div>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Total Employees</span>
                <span className="font-bold text-gray-900">{metrics.teamComposition.totalEmployees}</span>
              </div>
              <div className="text-sm text-gray-500">0 this month</div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Gender Ratio (F:M)</span>
                <span className="font-bold text-gray-900">
                  {Math.round(metrics.teamComposition.genderRatio.female)}:{Math.round(metrics.teamComposition.genderRatio.male)}
                </span>
              </div>
              <div className="text-sm text-gray-500">On par with company (leadership levels)</div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Avg. Time in Company</span>
                <span className="font-bold text-gray-900">{metrics.teamComposition.averageTenure.toFixed(1)} years</span>
              </div>
              <div className="text-sm text-gray-500">On par with company (leadership)</div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Avg. Experience</span>
                <span className="font-bold text-gray-900">{metrics.teamComposition.averageExperience.toFixed(1)} years</span>
              </div>
              <div className="text-sm text-gray-500">+0.2y vs company (leadership)</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Team Composition */}
        <div className="bg-white rounded-2xl shadow-card border border-gray-100">
          <div className="px-6 py-6">
            <h3 className="text-lg font-semibold text-gray-900">
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
        <div className="bg-white rounded-2xl shadow-card border border-gray-100">
          <div className="px-6 py-6">
            <h3 className="text-lg font-semibold text-gray-900">
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
              <div className="mt-4 p-3 bg-blue-50 rounded-xl">
                <p className="text-sm text-blue-700">
                  <strong>HR Insight:</strong> Focus on high-priority roles and candidate experience optimization.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Risk Signals */}
        <div className="bg-white rounded-2xl shadow-card border border-gray-100">
          <div className="px-6 py-6">
            <h3 className="text-lg font-semibold text-gray-900">
              {isHRView ? 'People Risk Analytics' : 'Risk Signals'}
            </h3>
            <dl className="mt-4 grid grid-cols-1 gap-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Employees at Risk</dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">
                  {metrics.riskMetrics.atRiskEmployees}
                </dd>
                <div className="mt-2 flex items-center space-x-2">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                    🤖 AI Generated
                  </span>
                  <span className="text-xs text-gray-500">Based on performance, engagement & tenure patterns</span>
                </div>
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
            
            {/* AI-Generated Risk Insights */}
            <div className="mt-6 space-y-3">
              <div className="p-3 bg-red-50 rounded-xl border-l-4 border-red-400">
                <div className="flex items-start space-x-2">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                    🤖 AI Generated
                  </span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-red-800">Flight Risk Alert</p>
                    <p className="text-xs text-red-700 mt-1">3 senior engineers show patterns indicating 78% probability of leaving within 6 months</p>
                  </div>
                </div>
              </div>
              
              <div className="p-3 bg-orange-50 rounded-xl border-l-4 border-orange-400">
                <div className="flex items-start space-x-2">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                    🤖 AI Generated
                  </span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-orange-800">Burnout Risk</p>
                    <p className="text-xs text-orange-700 mt-1">5 team members showing elevated stress indicators based on work patterns</p>
                  </div>
                </div>
              </div>
            </div>

            {isHRView && (
              <div className="mt-4 p-3 bg-yellow-50 rounded-xl">
                <p className="text-sm text-yellow-700">
                  <strong>HR Action:</strong> Schedule retention conversations with at-risk employees.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Performance Analytics */}
        <div className="bg-white rounded-2xl shadow-card border border-gray-100">
          <div className="px-6 py-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              {isHRView ? 'Performance Analytics' : 'Performance Overview'}
            </h3>
            
            {/* Performance Metrics Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-4 bg-green-50 rounded-xl">
                <div className="text-2xl font-bold text-green-700 mb-1">
                  {metrics.performanceMetrics.highPerformers}
                </div>
                <div className="text-xs text-green-600 font-medium">Exceeds Expectations</div>
                <div className="text-xs text-green-500">Rating 4.5+</div>
              </div>
              
              <div className="text-center p-4 bg-blue-50 rounded-xl">
                <div className="text-2xl font-bold text-blue-700 mb-1">
                  {Math.round(metrics.teamComposition.totalEmployees * 0.65)}
                </div>
                <div className="text-xs text-blue-600 font-medium">Meets Expectations</div>
                <div className="text-xs text-blue-500">Rating 3.5-4.4</div>
              </div>
              
              <div className="text-center p-4 bg-amber-50 rounded-xl">
                <div className="text-2xl font-bold text-amber-700 mb-1">
                  {metrics.performanceMetrics.needsImprovement}
                </div>
                <div className="text-xs text-amber-600 font-medium">Needs Development</div>
                <div className="text-xs text-amber-500">Rating 2.5-3.4</div>
              </div>
              
              <div className="text-center p-4 bg-red-50 rounded-xl">
                <div className="text-2xl font-bold text-red-700 mb-1">
                  {Math.max(0, Math.round(metrics.teamComposition.totalEmployees * 0.05))}
                </div>
                <div className="text-xs text-red-600 font-medium">Below Expectations</div>
                <div className="text-xs text-red-500">Rating &lt;2.5</div>
              </div>
            </div>

            {/* Performance Distribution Chart */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Performance Distribution</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Exceeds (4.5+)</span>
                  <div className="flex-1 mx-3 bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full w-[15%]"></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900">15%</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Meets (3.5-4.4)</span>
                  <div className="flex-1 mx-3 bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full w-[65%]"></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900">65%</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Developing (2.5-3.4)</span>
                  <div className="flex-1 mx-3 bg-gray-200 rounded-full h-2">
                    <div className="bg-amber-500 h-2 rounded-full w-[15%]"></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900">15%</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Below (Under 2.5)</span>
                  <div className="flex-1 mx-3 bg-gray-200 rounded-full h-2">
                    <div className="bg-red-500 h-2 rounded-full w-[5%]"></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900">5%</span>
                </div>
              </div>
            </div>

            {/* Performance Insights */}
            <div className="space-y-3">
              <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-xl">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-green-600 text-sm">📈</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-green-800">Top Performers Ready for Promotion</p>
                  <p className="text-xs text-green-700 mt-1">
                    {metrics.performanceMetrics.highPerformers} employees consistently exceed goals and show leadership potential
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 p-3 bg-amber-50 rounded-xl">
                <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                  <span className="text-amber-600 text-sm">🎯</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-amber-800">Development Opportunities</p>
                  <p className="text-xs text-amber-700 mt-1">
                    {metrics.performanceMetrics.needsImprovement} employees would benefit from targeted coaching and skill development programs
                  </p>
                </div>
              </div>
            </div>

            {/* AI-Generated Performance Insights */}
            <div className="mt-6 p-4 bg-primary-50 rounded-xl border border-primary-200">
              <div className="flex items-start space-x-2">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                  🤖 AI Generated
                </span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-primary-800">Performance Trend Analysis</p>
                  <p className="text-xs text-primary-700 mt-1">
                    Overall team performance has improved by 12% this quarter. Key drivers: increased training participation (+23%) and improved goal clarity (+18%).
                  </p>
                </div>
              </div>
            </div>

            {isLeaderView && (
              <div className="mt-4 p-3 bg-green-50 rounded-xl">
                <p className="text-sm text-green-700">
                  <strong>Leadership Insight:</strong> Consider promoting high performers and providing development support for emerging talent.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Budget View */}
        <div className="bg-white rounded-2xl shadow-card border border-gray-100">
          <div className="px-6 py-6">
            <h3 className="text-lg font-semibold text-gray-900">Budget Overview</h3>
            <dl className="mt-4 grid grid-cols-1 gap-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Total Budget</dt>
                <dd className="mt-1 text-2xl font-semibold text-gray-900">
                  $2.4M
                </dd>
                <div className="text-xs text-gray-500">Annual allocation</div>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Spent (YTD)</dt>
                <dd className="mt-1 text-lg text-gray-900">
                  $1.8M (75%)
                </dd>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Salaries:</span>
                  <div className="font-semibold">$1.5M</div>
                </div>
                <div>
                  <span className="text-gray-600">Training:</span>
                  <div className="font-semibold">$180K</div>
                </div>
                <div>
                  <span className="text-gray-600">Benefits:</span>
                  <div className="font-semibold">$120K</div>
                </div>
                <div>
                  <span className="text-gray-600">Available:</span>
                  <div className="font-semibold text-green-600">$600K</div>
                </div>
              </div>
            </dl>
          </div>
        </div>

        {/* Skills View */}
        <div className="bg-white rounded-2xl shadow-card border border-gray-100">
          <div className="px-6 py-6">
            <h3 className="text-lg font-semibold text-gray-900">Team Skills Overview</h3>
            <div className="mt-4 space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">JavaScript/TypeScript</span>
                  <span className="text-sm text-gray-500">85% proficiency</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Python</span>
                  <span className="text-sm text-gray-500">72% proficiency</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '72%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Data Analysis</span>
                  <span className="text-sm text-gray-500">68% proficiency</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-500 h-2 rounded-full" style={{ width: '68%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Cloud Technologies</span>
                  <span className="text-sm text-gray-500">59% proficiency</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-orange-500 h-2 rounded-full" style={{ width: '59%' }}></div>
                </div>
              </div>
              <div className="mt-4 p-3 bg-blue-50 rounded-xl">
                <p className="text-xs text-blue-700">
                  <strong>Skill Gap:</strong> Cloud Technologies training recommended for 12 team members
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Role-specific additional insights */}
      {isHRView && (
        <div className="bg-white rounded-2xl shadow-card border border-gray-100">
          <div className="px-6 py-6">
            <h3 className="text-lg font-semibold text-gray-900">HR Strategic Actions</h3>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border-l-4 border-blue-500 bg-blue-50 rounded-xl">
                <div className="flex items-center space-x-2 mb-2">
                  <h4 className="font-medium text-blue-900">Talent Acquisition</h4>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                    🤖 AI
                  </span>
                </div>
                <p className="text-sm text-blue-700 mt-1">Review job descriptions and hiring process efficiency</p>
              </div>
              <div className="p-4 border-l-4 border-green-500 bg-green-50 rounded-xl">
                <h4 className="font-medium text-green-900">Employee Development</h4>
                <p className="text-sm text-green-700 mt-1">Plan L&D programs for skill enhancement</p>
              </div>
              <div className="p-4 border-l-4 border-yellow-500 bg-yellow-50 rounded-xl">
                <div className="flex items-center space-x-2 mb-2">
                  <h4 className="font-medium text-yellow-900">Retention Strategy</h4>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                    🤖 AI
                  </span>
                </div>
                <p className="text-sm text-yellow-700 mt-1">Address engagement gaps and career progression</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {isLeaderView && (
        <div className="bg-white rounded-2xl shadow-card border border-gray-100">
          <div className="px-6 py-6">
            <h3 className="text-lg font-semibold text-gray-900">Leadership Priorities</h3>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border-l-4 border-purple-500 bg-purple-50 rounded-xl">
                <div className="flex items-center space-x-2 mb-2">
                  <h4 className="font-medium text-purple-900">Strategic Planning</h4>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                    🤖 AI
                  </span>
                </div>
                <p className="text-sm text-purple-700 mt-1">Align team capabilities with business objectives</p>
              </div>
              <div className="p-4 border-l-4 border-indigo-500 bg-indigo-50 rounded-xl">
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