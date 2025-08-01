import { useState } from 'react';
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
    l1: 'bg-green-100 text-green-800',
    l2: 'bg-blue-100 text-blue-800',
    l3: 'bg-yellow-100 text-yellow-800',
    l4: 'bg-orange-100 text-orange-800',
    l5: 'bg-red-100 text-red-800',
  };

  const getHRBPFeedbackColor = (tagging: string) => {
    switch (tagging?.toLowerCase()) {
      case 'green': return 'bg-green-100 text-green-800 border-green-300';
      case 'amber': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
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
        p-4 border rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md
        ${isSelected 
          ? 'border-primary-500 bg-primary-50 shadow-md' 
          : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
        }
      `}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
            {employee.name.split(' ').map(n => n[0]).join('').toUpperCase()}
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-900">{employee.name}</h3>
            <p className="text-xs text-gray-500">{employee.designation}</p>
            <p className="text-xs text-gray-400">{employee.location}</p>
          </div>
        </div>
        <div className="text-right space-y-1">
          <div className="flex flex-col items-end space-y-1">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              levelColors[employee.level as keyof typeof levelColors] || 'bg-gray-100 text-gray-800'
            }`}>
              {employee.level.toUpperCase()}
            </span>
            
            {/* HRBP Feedback Badge */}
            {employee.hrbp_tagging && (
              <div className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border ${
                getHRBPFeedbackColor(employee.hrbp_tagging)
              }`}>
                <span className="mr-1">{getHRBPFeedbackIcon(employee.hrbp_tagging)}</span>
                <span>{getHRBPFeedbackText(employee.hrbp_tagging)}</span>
              </div>
            )}
            
            {/* Engagement Score */}
            {employee.engagement_score && (
              <div className="text-xs text-gray-500">
                Engagement: {employee.engagement_score}/100
              </div>
            )}
          </div>
          
          {employee.directReports && employee.directReports.length > 0 && (
            <p className="text-xs text-gray-500 mt-1">
              {employee.directReports.length} reports
            </p>
          )}
          {showDetailButton && (
            <button
              onClick={handleCardClick}
              className="mt-2 text-xs text-primary-600 hover:text-primary-800 font-medium"
            >
              View Details →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

interface HierarchyNodeProps {
  node: TeamHierarchy;
  onEmployeeSelect: (employee: Employee) => void;
  selectedEmployeeId?: string;
}

function HierarchyNode({ node, onEmployeeSelect, selectedEmployeeId }: HierarchyNodeProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const hasChildren = node.children && node.children.length > 0;

  const handleNodeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEmployeeSelect(node);
  };

  return (
    <div className="space-y-2">
      <div
        className={`flex items-center space-x-2 p-3 rounded-lg border cursor-pointer transition-all hover:shadow-sm
          ${selectedEmployeeId === node.manager_id 
            ? 'border-primary-500 bg-primary-50' 
            : 'border-gray-200 hover:border-gray-300'
          }
        `}
        style={{ marginLeft: `${node.depth * 20}px` }}
        onClick={handleNodeClick}
      >
        {hasChildren && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            className="p-1 hover:bg-gray-100 rounded"
          >
            {isExpanded ? (
              <div className="h-4 w-4 text-gray-500">▼</div>
            ) : (
              <div className="h-4 w-4 text-gray-500">▶</div>
            )}
          </button>
        )}
        
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
          {node.name.split(' ').map(n => n[0]).join('').toUpperCase()}
        </div>
        
        <div className="flex-1">
          <h4 className="text-sm font-medium text-gray-900">{node.name}</h4>
          <p className="text-xs text-gray-500">{node.designation}</p>
        </div>
        
        <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">
          {node.level.toUpperCase()}
        </span>
      </div>

      {hasChildren && isExpanded && (
        <div className="space-y-2">
          {node.children.map((child) => (
            <HierarchyNode
              key={child.manager_id}
              node={child}
              onEmployeeSelect={onEmployeeSelect}
              selectedEmployeeId={selectedEmployeeId}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function Team() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState('all');
  const [hrbpFilter, setHRBPFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'list' | 'hierarchy'>('list');
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

  // Get team hierarchy for selected employee
  const { data: hierarchy, isLoading: hierarchyLoading } = useQuery({
    queryKey: ['hierarchy', selectedEmployee?.manager_id],
    queryFn: () => selectedEmployee ? employeeService.getTeamHierarchy(selectedEmployee.manager_id) : null,
    enabled: !!selectedEmployee && viewMode === 'hierarchy',
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Team Overview</h1>
          <p className="text-gray-600">Manage and monitor your team's performance and well-being</p>
        </div>
        
        {/* View Toggle */}
        <div className="flex space-x-2">
          <button
            onClick={() => setViewMode('list')}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              viewMode === 'list'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            List View
          </button>
          <button
            onClick={() => setViewMode('hierarchy')}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              viewMode === 'hierarchy'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Hierarchy View
          </button>
        </div>
      </div>

      {/* Quick Access - L4 Employees */}
      {l4Employees && l4Employees.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Access - L4 Team Leaders</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Employee List/Search */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">All Employees</h2>
              
              {/* Search */}
              <div className="mt-4 relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400">🔍</div>
                <input
                  type="text"
                  placeholder="Search employees..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              {/* Level Filter */}
              <select
                value={levelFilter}
                onChange={(e) => setLevelFilter(e.target.value)}
                className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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
                className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">All HRBP Statuses</option>
                <option value="green">Green</option>
                <option value="amber">Amber</option>
                <option value="red">Red</option>
              </select>
            </div>

            <div className="p-6 max-h-96 overflow-y-auto">
              <div className="space-y-3">
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
                <div className="mt-4 text-center text-sm text-gray-500">
                  Showing 20 of {filteredEmployees.length} employees
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-2">
          {!selectedEmployee ? (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <div className="mx-auto h-12 w-12 text-gray-400">👥</div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Select an Employee</h3>
              <p className="mt-2 text-gray-500">
                Choose an employee from the list to view their details and team hierarchy.
              </p>
              <p className="mt-2 text-sm text-gray-400">
                Click on any employee card to see their complete profile.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Selected Employee Details */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">{selectedEmployee.name}</h2>
                  <div className="flex space-x-2">
                    <span className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm font-medium">
                      {selectedEmployee.level.toUpperCase()}
                    </span>
                    <button
                      onClick={() => handleEmployeeDetailClick(selectedEmployee)}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium hover:bg-blue-200"
                    >
                      View Full Profile
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Designation:</span>
                    <p className="font-medium">{selectedEmployee.designation}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Location:</span>
                    <p className="font-medium">{selectedEmployee.location}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Experience:</span>
                    <p className="font-medium">{selectedEmployee.total_experience} years</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Tenure:</span>
                    <p className="font-medium">{selectedEmployee.tenure} years</p>
                  </div>
                </div>
              </div>

              {/* Team Hierarchy or Direct Reports */}
              {viewMode === 'hierarchy' ? (
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Team Hierarchy</h3>
                  {hierarchyLoading ? (
                    <div className="text-center py-8">Loading hierarchy...</div>
                  ) : hierarchy ? (
                    <div className="space-y-2">
                      <HierarchyNode
                        node={hierarchy}
                        onEmployeeSelect={handleEmployeeDetailClick}
                        selectedEmployeeId={selectedEmployee.manager_id}
                      />
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      No hierarchy data available
                    </div>
                  )}
                </div>
              ) : (
                selectedEmployee.directReports && selectedEmployee.directReports.length > 0 && (
                  <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Direct Reports ({selectedEmployee.directReports.length})
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                )
              )}
            </div>
          )}
        </div>
      </div>

      {/* Employee Detail Modal */}
      <EmployeeDetailModal
        employee={selectedEmployeeForDetail}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
      />
    </div>
  );
} 