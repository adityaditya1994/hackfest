import { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Employee, employeeService, EmployeePersonalData } from '../services/api';

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
  const [personalData, setPersonalData] = useState<EmployeePersonalData | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch personal data when employee changes
  useEffect(() => {
    if (employee && isOpen) {
      setLoading(true);
      employeeService.getEmployeePersonalData(employee.manager_id)
        .then(data => {
          setPersonalData(data);
        })
        .catch(error => {
          console.error('Failed to fetch employee personal data:', error);
          // Fallback to mock data if API fails
          setPersonalData({
            aspirations: {
              shortTerm: "Learning & Development",
              shortTermStatus: "In Progress",
              longTerm: "Leadership Role", 
              longTermStatus: "Planning"
            },
            potentials: {
              overall: "High Potential",
              rating: 3,
              strengths: ["Technical Leadership", "Team Management", "Strategic Thinking"],
              developmentAreas: ["Public Speaking", "Cross-functional Collaboration"]
            },
            wfhBalance: {
              totalWfhDays: 45,
              totalOfficeDays: 67,
              hybridRatio: "40:60",
              preference: "Hybrid",
              wfhUtilization: 82
            },
            suggestiveLearning: [
              {
                title: "Advanced React Patterns",
                type: "Technical",
                duration: "6 weeks",
                priority: "High",
                status: "Recommended"
              },
              {
                title: "Leadership Communication",
                type: "Soft Skills", 
                duration: "4 weeks",
                priority: "Medium",
                status: "Optional"
              },
              {
                title: "Cloud Architecture Certification",
                type: "Certification",
                duration: "8 weeks",
                priority: "High", 
                status: "Recommended"
              }
            ]
          });
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [employee, isOpen]);

  if (!employee) return null;

  const getRiskColor = (risk: string) => {
    switch (risk?.toLowerCase()) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'low': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getPerformanceColor = (rating: string) => {
    switch (rating) {
      case 'Exceeds Expectations': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case 'Meets Expectations': return 'text-primary-600 bg-primary-50 border-primary-200';
      case 'Needs Improvement': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
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
              <Dialog.Panel className="w-full max-w-6xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all border border-primary-100">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-primary-100 bg-gradient-to-r from-primary-50 to-primary-25">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center text-white text-xl font-bold shadow-soft">
                      {employee.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </div>
                    <div>
                      <Dialog.Title className="text-2xl font-bold text-gray-900">
                        {employee.name}
                      </Dialog.Title>
                      <p className="text-primary-700 font-medium">{employee.designation}</p>
                      <p className="text-sm text-gray-500">ID: {employee.manager_id}</p>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-primary-600 transition-colors p-2 hover:bg-primary-50 rounded-xl text-2xl font-bold"
                  >
                    ×
                  </button>
                </div>

                {/* Content */}
                <div className="p-6 max-h-[80vh] overflow-y-auto">
                  {loading ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
                      <span className="ml-3 text-gray-600">Loading employee data...</span>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                      
                      {/* Basic Info */}
                      <div className="bg-primary-25 border border-primary-100 rounded-2xl p-6">
                        <h3 className="text-lg font-semibold text-primary-800 mb-4 flex items-center">
                          <span className="mr-2">👤</span>
                          Basic Information
                        </h3>
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
                            <span className="font-medium flex items-center">
                              <span className="mr-1">📍</span>
                              {employee.location}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Status:</span>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                              employee.status === 'Active' 
                                ? 'bg-emerald-100 text-emerald-800 border-emerald-200' 
                                : 'bg-red-100 text-red-800 border-red-200'
                            }`}>
                              {employee.status}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Career Details */}
                      <div className="bg-primary-25 border border-primary-100 rounded-2xl p-6">
                        <h3 className="text-lg font-semibold text-primary-800 mb-4 flex items-center">
                          <span className="mr-2">💼</span>
                          Career Details
                        </h3>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Designation:</span>
                            <span className="font-medium">{employee.designation}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Level:</span>
                            <span className="px-3 py-1 rounded-full text-xs font-bold bg-primary-500 text-white">
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
                        </div>
                      </div>

                      {/* WFH Balance */}
                      {personalData && (
                        <div className="bg-blue-25 border border-blue-100 rounded-2xl p-6">
                          <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center">
                            <span className="mr-2">🏠</span>
                            WFH Balance
                          </h3>
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className="text-gray-600">WFH Days:</span>
                              <span className="font-medium">{personalData.wfhBalance.totalWfhDays} days</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Office Days:</span>
                              <span className="font-medium">{personalData.wfhBalance.totalOfficeDays} days</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Hybrid Ratio:</span>
                              <span className="font-medium">{personalData.wfhBalance.hybridRatio}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Preference:</span>
                              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                                {personalData.wfhBalance.preference}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Utilization:</span>
                              <span className="font-medium">{personalData.wfhBalance.wfhUtilization}%</span>
                            </div>
                            <div className="mt-4 bg-blue-50 p-3 rounded-xl">
                              <div className="flex justify-between text-sm mb-2">
                                <span className="text-blue-700">WFH Balance:</span>
                                <span className="font-medium text-blue-800">{personalData.wfhBalance.wfhUtilization}%</span>
                              </div>
                              <div className="w-full bg-blue-200 rounded-full h-2">
                                <div 
                                  className="bg-blue-500 h-2 rounded-full transition-all" 
                                  style={{ width: `${personalData.wfhBalance.wfhUtilization}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Aspirations */}
                      {personalData && (
                        <div className="bg-purple-25 border border-purple-100 rounded-2xl p-6">
                          <h3 className="text-lg font-semibold text-purple-800 mb-4 flex items-center">
                            <span className="mr-2">🎯</span>
                            Aspirations
                          </h3>
                          <div className="space-y-4">
                            <div>
                              <span className="text-gray-600 block mb-2">Short Term:</span>
                              <div className="bg-white p-3 rounded-xl border border-purple-100">
                                <p className="font-medium text-gray-900">{personalData.aspirations.shortTerm}</p>
                                <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium ${
                                  personalData.aspirations.shortTermStatus === 'In Progress' ? 'bg-amber-100 text-amber-800' :
                                  personalData.aspirations.shortTermStatus === 'Completed' ? 'bg-emerald-100 text-emerald-800' :
                                  'bg-gray-100 text-gray-800'
                                }`}>
                                  {personalData.aspirations.shortTermStatus}
                                </span>
                              </div>
                            </div>
                            <div>
                              <span className="text-gray-600 block mb-2">Long Term:</span>
                              <div className="bg-white p-3 rounded-xl border border-purple-100">
                                <p className="font-medium text-gray-900">{personalData.aspirations.longTerm}</p>
                                <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium ${
                                  personalData.aspirations.longTermStatus === 'Planning' ? 'bg-blue-100 text-blue-800' :
                                  personalData.aspirations.longTermStatus === 'In Progress' ? 'bg-amber-100 text-amber-800' :
                                  'bg-gray-100 text-gray-800'
                                }`}>
                                  {personalData.aspirations.longTermStatus}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Potentials */}
                      {personalData && (
                        <div className="bg-emerald-25 border border-emerald-100 rounded-2xl p-6">
                          <h3 className="text-lg font-semibold text-emerald-800 mb-4 flex items-center">
                            <span className="mr-2">⭐</span>
                            Potentials
                          </h3>
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Overall Rating:</span>
                              <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold">
                                {personalData.potentials.overall}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Rating Score:</span>
                              <div className="flex items-center space-x-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <span 
                                    key={star}
                                    className={`text-lg ${star <= personalData.potentials.rating ? 'text-emerald-500' : 'text-gray-300'}`}
                                  >
                                    ⭐
                                  </span>
                                ))}
                              </div>
                            </div>
                            <div>
                              <span className="text-gray-600 block mb-2">Strengths:</span>
                              <div className="flex flex-wrap gap-2">
                                {personalData.potentials.strengths.map((strength, index) => (
                                  <span key={index} className="px-2 py-1 bg-emerald-100 text-emerald-800 text-xs rounded-full">
                                    {strength}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <div>
                              <span className="text-gray-600 block mb-2">Development Areas:</span>
                              <div className="flex flex-wrap gap-2">
                                {personalData.potentials.developmentAreas.map((area, index) => (
                                  <span key={index} className="px-2 py-1 bg-amber-100 text-amber-800 text-xs rounded-full">
                                    {area}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Suggestive Learning */}
                      {personalData && (
                        <div className="bg-orange-25 border border-orange-100 rounded-2xl p-6">
                          <h3 className="text-lg font-semibold text-orange-800 mb-4 flex items-center">
                            <span className="mr-2">📚</span>
                            Suggestive Learning
                          </h3>
                          <div className="space-y-3">
                            {personalData.suggestiveLearning.map((course, index) => (
                              <div key={index} className="bg-white p-3 rounded-xl border border-orange-100">
                                <div className="flex justify-between items-start mb-2">
                                  <h4 className="font-medium text-gray-900 text-sm">{course.title}</h4>
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    course.priority === 'High' ? 'bg-red-100 text-red-800' :
                                    course.priority === 'Medium' ? 'bg-amber-100 text-amber-800' :
                                    'bg-gray-100 text-gray-800'
                                  }`}>
                                    {course.priority}
                                  </span>
                                </div>
                                <div className="flex items-center justify-between text-xs text-gray-600">
                                  <span className="bg-orange-50 px-2 py-1 rounded">{course.type}</span>
                                  <span>{course.duration}</span>
                                  <span className={`px-2 py-1 rounded ${
                                    course.status === 'Recommended' ? 'bg-emerald-100 text-emerald-800' :
                                    'bg-blue-100 text-blue-800'
                                  }`}>
                                    {course.status}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* HRBP Feedback */}
                      <div className="bg-primary-25 border border-primary-100 rounded-2xl p-6">
                        <h3 className="text-lg font-semibold text-primary-800 mb-4 flex items-center">
                          <span className="mr-2">💬</span>
                          HRBP Feedback
                        </h3>
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
                                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${
                                  employee.hrbp_tagging.toLowerCase() === 'green' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' :
                                  employee.hrbp_tagging.toLowerCase() === 'amber' ? 'bg-amber-100 text-amber-800 border-amber-200' :
                                  employee.hrbp_tagging.toLowerCase() === 'red' ? 'bg-red-100 text-red-800 border-red-200' :
                                  'bg-gray-100 text-gray-800 border-gray-200'
                                }`}>
                                  {employee.hrbp_tagging.charAt(0).toUpperCase() + employee.hrbp_tagging.slice(1)} Status
                                </span>
                              </div>
                            ) : (
                              <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm border border-gray-200">
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
                        </div>
                      </div>

                      {/* Performance */}
                      <div className="bg-emerald-25 border border-emerald-100 rounded-2xl p-6">
                        <h3 className="text-lg font-semibold text-emerald-800 mb-4 flex items-center">
                          <span className="mr-2">📊</span>
                          Performance
                        </h3>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Performance Rating:</span>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
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
                            <div className="bg-white p-3 rounded-xl border border-emerald-100">
                              <p className="text-sm text-gray-700">Q4 goals and objectives tracking</p>
                              <div className="mt-2 flex space-x-2">
                                <span className="px-2 py-1 bg-emerald-100 text-emerald-800 text-xs rounded-full">Goal 1: Complete</span>
                                <span className="px-2 py-1 bg-amber-100 text-amber-800 text-xs rounded-full">Goal 2: In Progress</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Risk Assessment */}
                      <div className="bg-red-25 border border-red-100 rounded-2xl p-6">
                        <h3 className="text-lg font-semibold text-red-800 mb-4 flex items-center">
                          <span className="mr-2">⚠️</span>
                          Risk Assessment
                        </h3>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Attrition Risk:</span>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getRiskColor('Low')}`}>
                              Low
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Burnout Risk:</span>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getRiskColor('Medium')}`}>
                              Medium
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Performance Risk:</span>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getRiskColor('Low')}`}>
                              Low
                            </span>
                          </div>
                          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl">
                            <h4 className="font-medium text-amber-800 mb-2">Risk Indicators:</h4>
                            <ul className="text-sm text-amber-700 space-y-1">
                              <li>• Workload has increased by 25% in last quarter</li>
                              <li>• No salary revision in 18 months</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Recommendations */}
                  <div className="mt-8 bg-gradient-to-r from-primary-50 to-primary-25 border border-primary-100 rounded-2xl p-6">
                    <h3 className="text-lg font-semibold text-primary-800 mb-4 flex items-center">
                      <span className="mr-2">💡</span>
                      Team Recommendations
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-white p-4 rounded-xl border-l-4 border-primary-500">
                        <h4 className="font-medium text-primary-900 mb-2">Development Opportunity</h4>
                        <p className="text-sm text-primary-700">
                          Consider assigning leadership role in upcoming project - shows high potential
                        </p>
                      </div>
                      <div className="bg-white p-4 rounded-xl border-l-4 border-emerald-500">
                        <h4 className="font-medium text-emerald-900 mb-2">Retention Action</h4>
                        <p className="text-sm text-emerald-700">
                          Schedule career development discussion - eligible for next level promotion
                        </p>
                      </div>
                      <div className="bg-white p-4 rounded-xl border-l-4 border-amber-500">
                        <h4 className="font-medium text-amber-900 mb-2">Workload Balance</h4>
                        <p className="text-sm text-amber-700">
                          Monitor workload - recent increase may affect work-life balance
                        </p>
                      </div>
                      <div className="bg-white p-4 rounded-xl border-l-4 border-purple-500">
                        <h4 className="font-medium text-purple-900 mb-2">Succession Planning</h4>
                        <p className="text-sm text-purple-700">
                          Ideal mentor for junior developers - create mentorship opportunities
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="bg-primary-25 border-t border-primary-100 px-6 py-4 flex justify-end space-x-3">
                  <button
                    onClick={onClose}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
                  >
                    Close
                  </button>
                  <button className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-xl hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors shadow-soft">
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