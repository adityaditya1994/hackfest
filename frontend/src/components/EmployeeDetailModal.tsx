import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Employee } from '../services/api';

interface EmployeeDetailModalProps {
  employee: Employee | null;
  isOpen: boolean;
  onClose: () => void;
}

const EmployeeDetailModal: React.FC<EmployeeDetailModalProps> = ({
  employee,
  isOpen,
  onClose,
}) => {
  if (!employee) return null;

  const getRiskColor = (risk: string) => {
    switch (risk?.toLowerCase()) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getPerformanceColor = (rating: string) => {
    switch (rating) {
      case 'Exceeds Expectations': return 'text-green-600 bg-green-50';
      case 'Meets Expectations': return 'text-blue-600 bg-blue-50';
      case 'Needs Improvement': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                      {employee.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </div>
                    <div>
                      <Dialog.Title className="text-2xl font-bold text-gray-900">
                        {employee.name}
                      </Dialog.Title>
                      <p className="text-gray-600">{employee.designation}</p>
                      <p className="text-sm text-gray-500">ID: {employee.manager_id}</p>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                {/* Content */}
                <div className="p-6 max-h-[80vh] overflow-y-auto">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    
                    {/* Basic Info */}
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Name:</span>
                          <span className="font-medium">{employee.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Employee ID:</span>
                          <span className="font-medium">{employee.manager_id}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Gender:</span>
                          <span className="font-medium">{employee.gender}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Education:</span>
                          <span className="font-medium">{employee.highest_qualification || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Location:</span>
                          <span className="font-medium">{employee.location}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Status:</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            employee.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {employee.status}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Career Details */}
                    <div className="bg-blue-50 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Career Details</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Designation:</span>
                          <span className="font-medium">{employee.designation}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Level:</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800`}>
                            {employee.level.toUpperCase()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Manager:</span>
                          <span className="font-medium">{employee.manager_name || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Joining Date:</span>
                          <span className="font-medium">{employee.doj || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total Experience:</span>
                          <span className="font-medium">{employee.total_experience} years</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Tenure:</span>
                          <span className="font-medium">{employee.tenure} years</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Salary Band:</span>
                          <span className="font-medium">{employee.salary || 'Confidential'}</span>
                        </div>
                      </div>
                    </div>

                    {/* HRBP Feedback */}
                    <div className="bg-orange-50 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">HRBP Feedback</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Current Status:</span>
                          {employee.hrbp_tagging ? (
                            <div className="flex items-center space-x-2">
                              <span className="text-lg">
                                {employee.hrbp_tagging.toLowerCase() === 'green' && '✅'}
                                {employee.hrbp_tagging.toLowerCase() === 'amber' && '⚠️'}
                                {employee.hrbp_tagging.toLowerCase() === 'red' && '🚨'}
                              </span>
                              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                employee.hrbp_tagging.toLowerCase() === 'green' ? 'bg-green-100 text-green-800' :
                                employee.hrbp_tagging.toLowerCase() === 'amber' ? 'bg-yellow-100 text-yellow-800' :
                                employee.hrbp_tagging.toLowerCase() === 'red' ? 'bg-red-100 text-red-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {employee.hrbp_tagging.charAt(0).toUpperCase() + employee.hrbp_tagging.slice(1)} Status
                              </span>
                            </div>
                          ) : (
                            <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                              No HRBP Assessment
                            </span>
                          )}
                        </div>
                        
                        <div className="flex justify-between">
                          <span className="text-gray-600">Engagement Score:</span>
                          <span className="font-medium">
                            {employee.engagement_score ? `${employee.engagement_score}/100` : 'Not Available'}
                          </span>
                        </div>

                        {employee.hrbp_tagging && (
                          <div className="mt-4 p-3 rounded-lg border-l-4 border-orange-400 bg-orange-50">
                            <h4 className="font-medium text-orange-900 mb-2">HRBP Recommendations:</h4>
                            <div className="text-sm text-orange-800">
                              {employee.hrbp_tagging.toLowerCase() === 'green' && (
                                <div>
                                  <p>• Continue current performance trajectory</p>
                                  <p>• Consider for stretch assignments and leadership opportunities</p>
                                  <p>• Potential mentor for junior team members</p>
                                </div>
                              )}
                              {employee.hrbp_tagging.toLowerCase() === 'amber' && (
                                <div>
                                  <p>• Schedule regular 1:1 check-ins with manager</p>
                                  <p>• Identify specific areas for improvement</p>
                                  <p>• Consider training or development programs</p>
                                  <p>• Monitor engagement levels closely</p>
                                </div>
                              )}
                              {employee.hrbp_tagging.toLowerCase() === 'red' && (
                                <div>
                                  <p>• Immediate intervention required</p>
                                  <p>• Develop performance improvement plan</p>
                                  <p>• Weekly check-ins with HR and manager</p>
                                  <p>• Consider role reassignment or additional support</p>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Performance */}
                    <div className="bg-green-50 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Performance Rating:</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            getPerformanceColor(employee.performance_rating || 'N/A')
                          }`}>
                            {employee.performance_rating || 'Not Available'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Engagement Score:</span>
                          <span className="font-medium">
                            {employee.engagement_score ? `${employee.engagement_score}/100` : 'N/A'}
                          </span>
                        </div>
                        <div className="space-y-2">
                          <span className="text-gray-600">OKRs & Goals:</span>
                          <div className="bg-white p-3 rounded border">
                            <p className="text-sm text-gray-700">Q4 goals and objectives tracking</p>
                            <div className="mt-2 flex space-x-2">
                              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">Goal 1: Complete</span>
                              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">Goal 2: In Progress</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Skills & Learning */}
                    <div className="bg-purple-50 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Skills & Learning</h3>
                      <div className="space-y-3">
                        <div>
                          <span className="text-gray-600 block mb-2">Primary Skills:</span>
                          <div className="flex flex-wrap gap-2">
                            {['React', 'TypeScript', 'Node.js', 'Python'].map((skill) => (
                              <span key={skill} className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <span className="text-gray-600 block mb-2">Learning Trends:</span>
                          <div className="bg-white p-3 rounded border">
                            <p className="text-sm text-gray-700">Recently completed: Advanced React Patterns</p>
                            <p className="text-sm text-gray-700">In Progress: Cloud Architecture Certification</p>
                          </div>
                        </div>
                        <div>
                          <span className="text-gray-600 block mb-2">Aspirations:</span>
                          <p className="text-sm text-gray-700 bg-white p-3 rounded border">
                            Interested in technical leadership and mentoring junior developers
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Risk Assessment */}
                    <div className="bg-red-50 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Assessment</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Attrition Risk:</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor('Low')}`}>
                            Low
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Burnout Risk:</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor('Medium')}`}>
                            Medium
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Performance Risk:</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor('Low')}`}>
                            Low
                          </span>
                        </div>
                        <div className="mt-4 p-3 bg-yellow-100 rounded-lg">
                          <h4 className="font-medium text-yellow-800 mb-2">Risk Indicators:</h4>
                          <ul className="text-sm text-yellow-700 space-y-1">
                            <li>• Workload has increased by 25% in last quarter</li>
                            <li>• No salary revision in 18 months</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* Leave Information */}
                    <div className="bg-indigo-50 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Leave Information</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Annual Leave Balance:</span>
                          <span className="font-medium">18 days</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Sick Leave Balance:</span>
                          <span className="font-medium">5 days</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Utilization (Last 6 months):</span>
                          <span className="font-medium">12 days</span>
                        </div>
                        <div className="mt-4">
                          <span className="text-gray-600 block mb-2">Recent Leave Pattern:</span>
                          <div className="bg-white p-3 rounded border">
                            <div className="flex justify-between text-sm">
                              <span>Dec 2024: 3 days</span>
                              <span>Nov 2024: 2 days</span>
                              <span>Oct 2024: 5 days</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Recommendations */}
                  <div className="mt-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">💡 Team Recommendations</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-white p-4 rounded-lg border-l-4 border-blue-500">
                        <h4 className="font-medium text-blue-900 mb-2">Development Opportunity</h4>
                        <p className="text-sm text-blue-700">
                          Consider assigning leadership role in upcoming project - shows high potential
                        </p>
                      </div>
                      <div className="bg-white p-4 rounded-lg border-l-4 border-green-500">
                        <h4 className="font-medium text-green-900 mb-2">Retention Action</h4>
                        <p className="text-sm text-green-700">
                          Schedule career development discussion - eligible for next level promotion
                        </p>
                      </div>
                      <div className="bg-white p-4 rounded-lg border-l-4 border-yellow-500">
                        <h4 className="font-medium text-yellow-900 mb-2">Workload Balance</h4>
                        <p className="text-sm text-yellow-700">
                          Monitor workload - recent increase may affect work-life balance
                        </p>
                      </div>
                      <div className="bg-white p-4 rounded-lg border-l-4 border-purple-500">
                        <h4 className="font-medium text-purple-900 mb-2">Succession Planning</h4>
                        <p className="text-sm text-purple-700">
                          Ideal mentor for junior developers - create mentorship opportunities
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
                  <button
                    onClick={onClose}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Close
                  </button>
                  <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    Edit Profile
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default EmployeeDetailModal; 