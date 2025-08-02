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
import { Dialog } from '@headlessui/react';

interface MetricCardProps {
  title: string;
  value: string | number;
  trend?: string;
  icon: any;
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
  const [modalOpen, setModalOpen] = useState(false);
  const [modalSegment, setModalSegment] = useState<string | null>(null);
  const [modalEmployees, setModalEmployees] = useState<any[]>([]);

  // Helper to normalize segment names
  const normalizeSegment = (name: string) => name.toLowerCase().replace(/\s+/g, ' ').trim();

  // Mock employee data for each segment (keys normalized)
  const segmentEmployeeData: Record<string, any[]> = {
    [normalizeSegment('At Risk')]: [
      { name: 'Sunita Ghosh', designation: 'Senior Director', department: 'Product', context: 'At risk due to recent org changes.' },
      { name: 'Ananya Jain', designation: 'Principal Engineer', department: 'OneMind', context: 'Low engagement in last quarter.' },
      { name: 'Rohan Yadav', designation: 'Manager', department: 'OneAI', context: 'Performance flagged by HRBP.' },
      { name: 'Meera Singh', designation: 'Software Engineer', department: 'OneAI', context: 'High attrition risk flagged by survey.' },
      { name: 'Rahul Gupta', designation: 'Business Analyst', department: 'Commerce', context: 'Multiple warnings for disengagement.' },
    ],
    [normalizeSegment('Low Engagement')]: [
      { name: 'Priya Sharma', designation: 'Lead Designer', department: 'Design', context: 'Consistently low engagement scores.' },
      { name: 'Amit Verma', designation: 'QA Lead', department: 'QA', context: 'Reported low motivation in survey.' },
    ],
    [normalizeSegment('High Performers')]: [
      { name: 'Sashi', designation: 'Director', department: 'OneMind', context: 'Recognized for outstanding delivery.' },
      { name: 'Arjun Joshi', designation: 'Lead Data Scientist', department: 'Analytics', context: 'Exceeded all OKRs.' },
    ],
    [normalizeSegment('Needs Improvement')]: [
      { name: 'Meera Singh', designation: 'Software Engineer', department: 'OneAI', context: 'Needs improvement in technical skills.' },
      { name: 'Rahul Gupta', designation: 'Business Analyst', department: 'Commerce', context: 'Below target for last 2 quarters.' },
    ],
    [normalizeSegment('Moderate Engagement Issue')]: [
      { name: 'Vikram Patel', designation: 'Frontend Developer', department: 'Web', context: 'Engagement fluctuates, needs mentoring.' },
      { name: 'Neha Kapoor', designation: 'UX Designer', department: 'Design', context: 'Moderate engagement, recently changed teams.' },
      { name: 'Saurabh Mehta', designation: 'Backend Engineer', department: 'Platform', context: 'Engagement dropped after project change.' },
      { name: 'Ritika Sinha', designation: 'QA Engineer', department: 'QA', context: 'Moderate engagement, new to team.' },
      { name: 'Aman Singh', designation: 'DevOps Engineer', department: 'Infra', context: 'Needs more recognition for work.' },
      { name: 'Kavita Rao', designation: 'Business Analyst', department: 'Commerce', context: 'Engagement varies by project.' },
      { name: 'Deepak Kumar', designation: 'Support Engineer', department: 'Support', context: 'Moderate engagement, needs upskilling.' },
      { name: 'Sneha Das', designation: 'Product Manager', department: 'Product', context: 'Recently joined, engagement building.' },
      { name: 'Ramesh Iyer', designation: 'Data Engineer', department: 'Analytics', context: 'Engagement moderate, needs challenge.' },
      { name: 'Priyanka Nair', designation: 'HRBP', department: 'HR', context: 'Moderate engagement, new HRBP.' },
      { name: 'Siddharth Jain', designation: 'Full Stack Developer', department: 'Web', context: 'Engagement moderate, needs feedback.' },
      { name: 'Aarti Joshi', designation: 'Scrum Master', department: 'Agile', context: 'Moderate engagement, new to agile.' },
    ],
    [normalizeSegment('New Joiner Support')]: [
      { name: 'Ritesh Kumar', designation: 'Trainee Engineer', department: 'Product', context: 'New joiner, needs onboarding support.' },
      { name: 'Ayesha Khan', designation: 'Associate Analyst', department: 'Analytics', context: 'Recently joined, seeking mentorship.' },
      { name: 'Manoj Pillai', designation: 'Junior Developer', department: 'Web', context: 'New joiner, learning stack.' },
      { name: 'Shalini Gupta', designation: 'Support Analyst', department: 'Support', context: 'Recently joined, needs process training.' },
      { name: 'Nikhil Sharma', designation: 'QA Intern', department: 'QA', context: 'New joiner, needs QA best practices.' },
      { name: 'Pooja Reddy', designation: 'HR Trainee', department: 'HR', context: 'Recently joined, learning HR systems.' },
      { name: 'Tarun Bansal', designation: 'Data Intern', department: 'Analytics', context: 'New joiner, needs data onboarding.' },
      { name: 'Megha Singh', designation: 'Product Intern', department: 'Product', context: 'Recently joined, needs product training.' },
    ],
  };

  // Alias map for segment names to canonical keys
  const aliasMap: Record<string, string> = {
    'high attrition risk': 'at risk',
    'attrition risk': 'at risk',
    'at risk': 'at risk',
    'low engagement': 'low engagement',
    'high performers': 'high performers',
    'needs improvement': 'needs improvement',
    'moderate engagement issue': 'moderate engagement issue',
    'moderate engagement': 'moderate engagement issue',
    'engagement issue': 'moderate engagement issue',
    'new joiner support': 'new joiner support',
    'new joiner': 'new joiner support',
    'onboarding support': 'new joiner support',
    // Add more aliases as needed
  };

  // Handler to open modal for a segment (alias + fuzzy match)
  const openSegmentModal = (segment: string) => {
    const key = normalizeSegment(segment);
    // Try alias map first
    const aliasKey = Object.keys(aliasMap).find(alias => key.includes(alias));
    const canonicalKey = aliasKey ? aliasMap[aliasKey] : undefined;
    // If no alias, fallback to fuzzy match
    const foundKey = canonicalKey || Object.keys(segmentEmployeeData).find(k => key.includes(k));
    setModalSegment(segment);
    setModalEmployees(foundKey ? segmentEmployeeData[foundKey] : []);
    setModalOpen(true);
  };

  // Handler to close modal
  const closeModal = () => {
    setModalOpen(false);
    setModalSegment(null);
    setModalEmployees([]);
  };

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
                    onClick={() => openSegmentModal(segment.name)}
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
      {/* Modal for segment employees */}
      <Dialog open={modalOpen} onClose={closeModal} className="fixed z-50 inset-0 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen px-4">
          <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-7xl mx-auto p-6">
            <button onClick={closeModal} className="absolute top-3 right-4 text-2xl text-gray-400 hover:text-primary-600 font-bold">&times;</button>
            <Dialog.Title className="text-xl font-bold text-primary-700 mb-2">
              {modalSegment} ({modalEmployees.length} employee{modalEmployees.length !== 1 ? 's' : ''})
            </Dialog.Title>
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[0.75rem]">
                {modalEmployees.map((emp, idx) => (
                  <div key={idx} className="rounded-xl border border-primary-100 p-4 bg-primary-25 flex flex-col gap-1 min-w-[280px]">
                    <div className="font-semibold text-black">{emp.name}</div>
                    <div className="text-sm text-gray-600">{emp.designation} &mdash; {emp.department}</div>
                    <div className="text-xs text-gray-500 mt-1">{emp.context}</div>
                  </div>
                ))}
                {modalEmployees.length === 0 && <div className="text-gray-400 text-center col-span-4">No employees in this segment.</div>}
              </div>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
} 