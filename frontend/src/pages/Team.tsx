import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  UserGroupIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';
import { employeeService, Employee, TeamHierarchy } from '../services/api';
import EmployeeDetailModal from '../components/EmployeeDetailModal';
import { useAuth } from '../contexts/AuthContext';

interface EmployeeCardProps {
  employee: Employee;
  onClick: (employee: Employee) => void;
  isSelected: boolean;
  showDetailButton?: boolean;
}

function EmployeeCard({ employee, onClick, isSelected, showDetailButton = false }: EmployeeCardProps) {
  const levelColors = {
    l1: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    l2: 'bg-blue-100 text-blue-800 border-blue-200',
    l3: 'bg-purple-100 text-purple-800 border-purple-200',
    l4: 'bg-primary-100 text-primary-800 border-primary-200',
    l5: 'bg-orange-100 text-orange-800 border-orange-200',
  };

  const getHRBPFeedbackColor = (tagging: string) => {
    switch (tagging?.toLowerCase()) {
      case 'green': return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'amber': return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'red': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getHRBPFeedbackIcon = (tagging: string) => {
    switch (tagging?.toLowerCase()) {
      case 'green': return '✅';
      case 'amber': return '⚠️';
      case 'red': return '🚨';
      default: return '❓';
    }
  };

  const getHRBPFeedbackText = (tagging: string) => {
    switch (tagging?.toLowerCase()) {
      case 'green': return 'Good Performance';
      case 'amber': return 'Needs Attention';
      case 'red': return 'High Risk';
      default: return 'No Feedback';
    }
  };

  const handleCardClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClick(employee);
  };

  return (
    <div
      onClick={handleCardClick}
      className={`
        bg-white rounded-2xl shadow-card border transition-all duration-200 hover:shadow-soft cursor-pointer p-6
        ${isSelected 
          ? 'border-primary-500 bg-primary-50 shadow-soft ring-2 ring-primary-200' 
          : 'border-gray-100 hover:border-primary-200 hover:shadow-soft'
        }
      `}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center text-white font-bold shadow-soft">
            {employee.name.split(' ').map(n => n[0]).join('').toUpperCase()}
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900">{employee.name}</h3>
            <p className="text-sm text-gray-600">{employee.designation}</p>
            <p className="text-xs text-gray-500 flex items-center">
              <span className="mr-1">📍</span>
              {employee.location}
            </p>
          </div>
        </div>
        <div className="text-right space-y-2">
          <div className="flex flex-col items-end space-y-2">
            <span className={`inline-flex items-center px-3 py-1 rounded-xl text-xs font-semibold border ${
              levelColors[employee.level as keyof typeof levelColors] || 'bg-gray-100 text-gray-800 border-gray-200'
            }`}>
              {employee.level.toUpperCase()}
            </span>
            
            {/* HRBP Feedback Badge */}
            {employee.hrbp_tagging && (
              <div className={`inline-flex items-center px-3 py-1 rounded-xl text-xs font-medium border ${
                getHRBPFeedbackColor(employee.hrbp_tagging)
              }`}>
                <span className="mr-1">{getHRBPFeedbackIcon(employee.hrbp_tagging)}</span>
                <span>{getHRBPFeedbackText(employee.hrbp_tagging)}</span>
              </div>
            )}
            
            {/* Engagement Score */}
            {employee.engagement_score && (
              <div className="bg-gray-50 px-3 py-1 rounded-xl">
                <div className="text-xs text-gray-600">
                  <span className="font-medium">Engagement:</span> {employee.engagement_score}/100
                </div>
              </div>
            )}
          </div>
          
          {employee.directReports && employee.directReports.length > 0 && (
            <div className="bg-primary-50 px-3 py-1 rounded-xl">
              <p className="text-xs text-primary-700 font-medium">
                👥 {employee.directReports.length} reports
              </p>
            </div>
          )}
          {showDetailButton && (
            <button
              onClick={handleCardClick}
              className="mt-2 text-xs text-primary-600 hover:text-primary-800 font-medium px-3 py-1 rounded-lg hover:bg-primary-50 transition-colors"
            >
              View Details →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// Level-based Tree View Component
interface LevelSectionProps {
  level: string;
  employees: Employee[];
  onEmployeeClick: (employee: Employee) => void;
  selectedEmployeeId?: string;
}

function LevelSection({ level, employees, onEmployeeClick, selectedEmployeeId }: LevelSectionProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  
  const levelConfig = {
    l5: { 
      name: 'L5 - Executive Leadership', 
      color: 'bg-primary-500', 
      bgColor: 'bg-primary-25', 
      borderColor: 'border-primary-100',
      textColor: 'text-primary-800'
    },
    l4: { 
      name: 'L4 - Senior Management', 
      color: 'bg-primary-600', 
      bgColor: 'bg-primary-25', 
      borderColor: 'border-primary-100',
      textColor: 'text-primary-800'
    },
    l3: { 
      name: 'L3 - Middle Management', 
      color: 'bg-primary-400', 
      bgColor: 'bg-primary-25', 
      borderColor: 'border-primary-100',
      textColor: 'text-primary-700'
    },
    l2: { 
      name: 'L2 - Junior Management', 
      color: 'bg-primary-300', 
      bgColor: 'bg-primary-25', 
      borderColor: 'border-primary-100',
      textColor: 'text-primary-700'
    },
    l1: { 
      name: 'L1 - Individual Contributors', 
      color: 'bg-primary-200', 
      bgColor: 'bg-primary-25', 
      borderColor: 'border-primary-100',
      textColor: 'text-primary-600'
    },
  };

  const config = levelConfig[level as keyof typeof levelConfig] || levelConfig.l1;

  if (employees.length === 0) return null;

  return (
    <div className="mb-8">
      {/* Level Header */}
      <div 
        className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all hover:shadow-soft ${config.bgColor} ${config.borderColor}`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-3">
          <div className={`w-4 h-4 ${config.color} rounded-full shadow-sm`}></div>
          <h3 className={`font-bold text-lg ${config.textColor}`}>{config.name}</h3>
          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${config.color} text-white shadow-sm`}>
            {employees.length} employee{employees.length !== 1 ? 's' : ''}
          </span>
        </div>
        <div className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
          <span className={`${config.textColor} font-bold`}>▼</span>
        </div>
      </div>

      {/* Level Employees */}
      {isExpanded && (
        <div className="mt-4 space-y-3">
          {employees.map((employee, index) => (
            <EmployeeLevelCard
              key={employee.manager_id}
              employee={employee}
              onEmployeeClick={onEmployeeClick}
              selectedEmployeeId={selectedEmployeeId}
              isLast={index === employees.length - 1}
              levelConfig={config}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Employee card within level section
interface EmployeeLevelCardProps {
  employee: Employee;
  onEmployeeClick: (employee: Employee) => void;
  selectedEmployeeId?: string;
  isLast: boolean;
  levelConfig: any;
}

function EmployeeLevelCard({ employee, onEmployeeClick, selectedEmployeeId, isLast, levelConfig }: EmployeeLevelCardProps) {
  const directReports = employee.directReports || [];

  return (
    <div className="ml-8">
      {/* Employee Card */}
      <div
        onClick={() => onEmployeeClick(employee)}
        className={`
          flex items-center space-x-4 p-4 rounded-2xl border transition-all duration-200 hover:shadow-soft cursor-pointer
          ${selectedEmployeeId === employee.manager_id 
            ? 'border-primary-400 bg-primary-50 shadow-soft ring-2 ring-primary-200' 
            : `border-primary-100 hover:border-primary-200 bg-white hover:bg-primary-25`
          }
        `}
      >
        {/* Avatar */}
        <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center text-white font-bold shadow-soft">
          {employee.name.split(' ').map(n => n[0]).join('').toUpperCase()}
        </div>
        
        {/* Employee Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-3 mb-2">
            <h3 className="text-lg font-bold text-gray-900 truncate">{employee.name}</h3>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${levelConfig.color} text-white shadow-sm`}>
              {employee.level.toUpperCase()}
            </span>
          </div>
          
          <p className="text-sm text-gray-600 mb-2 truncate">{employee.designation}</p>
          
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <span className="flex items-center">
              <span className="mr-1">📍</span>
              {employee.location}
            </span>
            {employee.total_experience && (
              <span className="flex items-center">
                <span className="mr-1">⏱️</span>
                {employee.total_experience} years
              </span>
            )}
            {directReports.length > 0 && (
              <span className="flex items-center text-primary-600 font-medium">
                <span className="mr-1">👥</span>
                {directReports.length} report{directReports.length !== 1 ? 's' : ''}
              </span>
            )}
            {employee.manager_name && (
              <span className="flex items-center text-gray-400">
                <span className="mr-1">⬆️</span>
                Reports to: {employee.manager_name}
              </span>
            )}
          </div>
        </div>

        {/* Status Indicators */}
        <div className="flex items-center space-x-3 flex-shrink-0">
          {/* HRBP Status */}
          {employee.hrbp_tagging && (
            <div className="flex-shrink-0">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${
                employee.hrbp_tagging.toLowerCase() === 'green' ? 'bg-emerald-100 text-emerald-800 border-emerald-300' :
                employee.hrbp_tagging.toLowerCase() === 'amber' ? 'bg-amber-100 text-amber-800 border-amber-300' :
                'bg-red-100 text-red-800 border-red-300'
              }`}>
                {employee.hrbp_tagging.toLowerCase() === 'green' ? '✅' : 
                 employee.hrbp_tagging.toLowerCase() === 'amber' ? '⚠️' : '🚨'}
                <span className="ml-1">{employee.hrbp_tagging.toUpperCase()}</span>
              </span>
            </div>
          )}

          {/* Engagement Score */}
          {employee.engagement_score && (
            <div className="flex-shrink-0 bg-primary-50 border border-primary-100 px-3 py-2 rounded-full">
              <div className="text-xs text-primary-700 font-medium">
                Engagement: {employee.engagement_score}/100
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Team() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState('all');
  const [hrbpFilter, setHRBPFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'list' | 'orgchart'>('orgchart');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [selectedEmployeeForDetail, setSelectedEmployeeForDetail] = useState<Employee | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Get all employees - include hierarchy filtering if user is a leader/manager
  const shouldIncludeHierarchy = user?.role === 'leader' || user?.role === 'manager';
  const { data: employees, isLoading: employeesLoading } = useQuery({
    queryKey: ['employees', user?.empId, shouldIncludeHierarchy],
    queryFn: () => {
      if (shouldIncludeHierarchy && user?.empId) {
        return employeeService.getAllEmployees(user.empId, true);
      }
      return employeeService.getAllEmployees();
    },
    enabled: !!user,
  });

  // Get L4 employees for quick access
  const { data: l4Employees } = useQuery({
    queryKey: ['employees', 'l4'],
    queryFn: () => employeeService.getEmployeesByLevel('l4'),
  });

  // Get organizational chart data
  const { data: orgChartData, isLoading: orgChartLoading } = useQuery({
    queryKey: ['employees', 'orgchart'],
    queryFn: () => employeeService.getOrganizationalChart(),
    enabled: viewMode === 'orgchart',
  });

  // Filter employees based on search, level, and HRBP feedback
  const filteredEmployees = employees?.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         emp.designation.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLevel = levelFilter === 'all' || emp.level === levelFilter;
    const matchesHRBP = hrbpFilter === 'all' || emp.hrbp_tagging?.toLowerCase() === hrbpFilter;
    return matchesSearch && matchesLevel && matchesHRBP;
  }) || [];

  const handleEmployeeClick = (employee: Employee) => {
    setSelectedEmployee(employee);
  };

  const handleEmployeeDetailClick = (employee: Employee) => {
    setSelectedEmployeeForDetail(employee);
    setIsDetailModalOpen(true);
  };

  // Count total employees in org chart and group by levels
  const { totalEmployeesInChart, employeesByLevel } = useMemo(() => {
    if (!orgChartData) return { totalEmployeesInChart: 0, employeesByLevel: {} };
    
    // Flatten all employees from the org chart
    const flattenEmployees = (employees: Employee[]): Employee[] => {
      let flattened: Employee[] = [];
      employees.forEach(emp => {
        flattened.push(emp);
        if (emp.directReports) {
          flattened.push(...flattenEmployees(emp.directReports));
        }
      });
      return flattened;
    };
    
    const allEmployees = flattenEmployees(orgChartData);
    
    // Group employees by level
    const groupedByLevel: Record<string, Employee[]> = {
      l5: [],
      l4: [],
      l3: [],
      l2: [],
      l1: []
    };
    
    allEmployees.forEach(emp => {
      const level = emp.level.toLowerCase();
      if (groupedByLevel[level]) {
        groupedByLevel[level].push(emp);
      }
    });
    
    // Sort employees within each level by name
    Object.keys(groupedByLevel).forEach(level => {
      groupedByLevel[level].sort((a, b) => a.name.localeCompare(b.name));
    });
    
    return {
      totalEmployeesInChart: allEmployees.length,
      employeesByLevel: groupedByLevel
    };
  }, [orgChartData]);

  if (employeesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading team data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-primary-500 rounded-2xl flex items-center justify-center shadow-soft">
              <span className="text-white font-bold text-xl">👥</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Team Overview</h1>
              <p className="text-gray-600">Manage and monitor your team's performance and well-being</p>
              {employees && (
                <p className="text-sm text-gray-500 mt-1">
                  {employees.length} total employees • {totalEmployeesInChart} in org chart
                </p>
              )}
            </div>
          </div>
          
          {/* View Toggle */}
          <div className="flex space-x-2 bg-gray-100 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('orgchart')}
              className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all ${
                viewMode === 'orgchart'
                  ? 'bg-primary-500 text-white shadow-soft'
                  : 'text-gray-600 hover:text-primary-600 hover:bg-white'
              }`}
            >
              🌳 Organization Tree
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all ${
                viewMode === 'list'
                  ? 'bg-primary-500 text-white shadow-soft'
                  : 'text-gray-600 hover:text-primary-600 hover:bg-white'
              }`}
            >
              📋 List View
            </button>
          </div>
        </div>
      </div>

      {/* Organization Tree View */}
      {viewMode === 'orgchart' && (
        <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary-100 rounded-xl flex items-center justify-center">
                <span className="text-primary-600 font-bold">🌳</span>
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">Organization Tree</h2>
                <div className="text-sm text-gray-500">
                  {orgChartLoading ? 'Loading...' : `${orgChartData?.length || 0} top-level executives • ${totalEmployeesInChart} total employees`}
                </div>
              </div>
            </div>
            
            {/* Level Legend */}
            <div className="flex items-center space-x-4 text-xs">
              <div className="flex items-center space-x-1">
                <div className="w-4 h-4 border-l-4 border-red-500 bg-red-50 rounded"></div>
                <span className="text-gray-600 font-medium">L5 Executive</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-4 h-4 border-l-4 border-primary-500 bg-primary-50 rounded"></div>
                <span className="text-gray-600 font-medium">L4 Senior</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-4 h-4 border-l-4 border-purple-500 bg-purple-50 rounded"></div>
                <span className="text-gray-600 font-medium">L3 Mid</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-4 h-4 border-l-4 border-blue-500 bg-blue-50 rounded"></div>
                <span className="text-gray-600 font-medium">L2 Junior</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-4 h-4 border-l-4 border-emerald-500 bg-emerald-50 rounded"></div>
                <span className="text-gray-600 font-medium">L1 Entry</span>
              </div>
            </div>
          </div>
          
          {orgChartLoading ? (
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Building organizational tree...</p>
            </div>
          ) : orgChartData && orgChartData.length > 0 ? (
            <div className="max-h-[800px] overflow-y-auto pr-4">
              {/* Level-based Organization Structure */}
              <div className="space-y-4">
                {/* L5 - Executive Level */}
                {employeesByLevel.l5 && employeesByLevel.l5.length > 0 && (
                  <LevelSection
                    level="l5"
                    employees={employeesByLevel.l5}
                    onEmployeeClick={handleEmployeeDetailClick}
                    selectedEmployeeId={selectedEmployee?.manager_id}
                  />
                )}
                
                {/* L4 - Senior Management */}
                {employeesByLevel.l4 && employeesByLevel.l4.length > 0 && (
                  <LevelSection
                    level="l4"
                    employees={employeesByLevel.l4}
                    onEmployeeClick={handleEmployeeDetailClick}
                    selectedEmployeeId={selectedEmployee?.manager_id}
                  />
                )}
                
                {/* L3 - Middle Management */}
                {employeesByLevel.l3 && employeesByLevel.l3.length > 0 && (
                  <LevelSection
                    level="l3"
                    employees={employeesByLevel.l3}
                    onEmployeeClick={handleEmployeeDetailClick}
                    selectedEmployeeId={selectedEmployee?.manager_id}
                  />
                )}
                
                {/* L2 - Junior Management */}
                {employeesByLevel.l2 && employeesByLevel.l2.length > 0 && (
                  <LevelSection
                    level="l2"
                    employees={employeesByLevel.l2}
                    onEmployeeClick={handleEmployeeDetailClick}
                    selectedEmployeeId={selectedEmployee?.manager_id}
                  />
                )}
                
                {/* L1 - Individual Contributors */}
                {employeesByLevel.l1 && employeesByLevel.l1.length > 0 && (
                  <LevelSection
                    level="l1"
                    employees={employeesByLevel.l1}
                    onEmployeeClick={handleEmployeeDetailClick}
                    selectedEmployeeId={selectedEmployee?.manager_id}
                  />
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-16 text-gray-500 bg-gray-50 rounded-xl">
              <div className="w-20 h-20 bg-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-gray-400 text-3xl">🌳</span>
              </div>
              <p className="text-lg font-medium mb-2">No organizational data available</p>
              <p className="text-sm">Employee hierarchy information is not available or needs to be configured.</p>
            </div>
          )}
        </div>
      )}

      {/* Quick Access - L4 Employees */}
      {viewMode !== 'orgchart' && l4Employees && l4Employees.length > 0 && (
        <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-8 h-8 bg-primary-100 rounded-xl flex items-center justify-center">
              <span className="text-primary-600 font-bold">⚡</span>
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Quick Access - L4 Team Leaders</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {l4Employees.slice(0, 6).map((employee) => (
              <EmployeeCard
                key={employee.manager_id}
                employee={employee}
                onClick={handleEmployeeDetailClick}
                isSelected={selectedEmployee?.manager_id === employee.manager_id}
                showDetailButton={true}
              />
            ))}
          </div>
        </div>
      )}

      {viewMode !== 'orgchart' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Employee List/Search */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-card border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-8 h-8 bg-primary-100 rounded-xl flex items-center justify-center">
                    <span className="text-primary-600 font-bold">👤</span>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">All Employees</h2>
                </div>
                
                {/* Search */}
                <div className="mb-4 relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400">🔍</div>
                  <input
                    type="text"
                    placeholder="Search employees..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                  />
                </div>

                {/* Level Filter */}
                <select
                  value={levelFilter}
                  onChange={(e) => setLevelFilter(e.target.value)}
                  className="mb-3 w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                >
                  <option value="all">All Levels</option>
                  <option value="l1">L1</option>
                  <option value="l2">L2</option>
                  <option value="l3">L3</option>
                  <option value="l4">L4</option>
                  <option value="l5">L5</option>
                </select>

                {/* HRBP Filter */}
                <select
                  value={hrbpFilter}
                  onChange={(e) => setHRBPFilter(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                >
                  <option value="all">All HRBP Statuses</option>
                  <option value="green">Green</option>
                  <option value="amber">Amber</option>
                  <option value="red">Red</option>
                </select>
              </div>

              <div className="p-6 max-h-[600px] overflow-y-auto">
                <div className="space-y-4">
                  {filteredEmployees.slice(0, 20).map((employee) => (
                    <EmployeeCard
                      key={employee.manager_id}
                      employee={employee}
                      onClick={handleEmployeeDetailClick}
                      isSelected={selectedEmployee?.manager_id === employee.manager_id}
                      showDetailButton={false}
                    />
                  ))}
                </div>
                {filteredEmployees.length > 20 && (
                  <div className="mt-6 text-center">
                    <div className="text-sm text-gray-500 bg-gray-50 py-3 px-4 rounded-xl">
                      Showing 20 of {filteredEmployees.length} employees
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-2">
            {!selectedEmployee ? (
              <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-12 text-center">
                <div className="w-20 h-20 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <span className="text-primary-500 text-3xl">👥</span>
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Select an Employee</h3>
                <p className="text-gray-600 mb-2">
                  Choose an employee from the list to view their details and team information.
                </p>
                <p className="text-sm text-gray-500">
                  Click on any employee card to see their complete profile.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Selected Employee Details */}
                <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-soft">
                        {selectedEmployee.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">{selectedEmployee.name}</h2>
                        <p className="text-gray-600">{selectedEmployee.designation}</p>
                      </div>
                    </div>
                    <div className="flex space-x-3">
                      <span className="px-4 py-2 bg-primary-100 text-primary-800 rounded-xl text-sm font-semibold border border-primary-200">
                        {selectedEmployee.level.toUpperCase()}
                      </span>
                      <button
                        onClick={() => handleEmployeeDetailClick(selectedEmployee)}
                        className="px-4 py-2 bg-blue-100 text-blue-800 rounded-xl text-sm font-semibold hover:bg-blue-200 transition-colors border border-blue-200"
                      >
                        View Full Profile
                      </button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <span className="text-sm text-gray-500 font-medium">Designation:</span>
                      <p className="text-gray-900 font-semibold mt-1">{selectedEmployee.designation}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <span className="text-sm text-gray-500 font-medium">Location:</span>
                      <p className="text-gray-900 font-semibold mt-1">📍 {selectedEmployee.location}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <span className="text-sm text-gray-500 font-medium">Experience:</span>
                      <p className="text-gray-900 font-semibold mt-1">⏱️ {selectedEmployee.total_experience} years</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <span className="text-sm text-gray-500 font-medium">Tenure:</span>
                      <p className="text-gray-900 font-semibold mt-1">🏢 {selectedEmployee.tenure} years</p>
                    </div>
                  </div>
                </div>

                {/* Direct Reports */}
                {selectedEmployee.directReports && selectedEmployee.directReports.length > 0 && (
                  <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-6">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="w-8 h-8 bg-primary-100 rounded-xl flex items-center justify-center">
                        <span className="text-primary-600 font-bold">👥</span>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900">
                        Direct Reports ({selectedEmployee.directReports.length})
                      </h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {selectedEmployee.directReports.map((report) => (
                        <EmployeeCard
                          key={report.manager_id}
                          employee={report}
                          onClick={handleEmployeeDetailClick}
                          isSelected={false}
                          showDetailButton={true}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Employee Detail Modal */}
      <EmployeeDetailModal
        employee={selectedEmployeeForDetail}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
      />
    </div>
  );
} 