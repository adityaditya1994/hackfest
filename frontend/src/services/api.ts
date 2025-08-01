import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Add request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log('Making API request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log('API response received:', response.status, response.config.url);
    console.log('Response data:', response.data);
    return response;
  },
  (error) => {
    console.error('API response error:', error.response?.status, error.response?.data || error.message);
    if (error.code === 'ECONNREFUSED') {
      console.error('Connection refused - is the backend server running on port 5000?');
    }
    return Promise.reject(error);
  }
);

export interface DashboardMetrics {
  teamComposition: {
    totalEmployees: number;
    genderRatio: {
      male: number;
      female: number;
    };
    averageExperience: number;
    averageTenure: number;
  };
  hiringOverview: {
    openPositions: number;
    inProgress: number;
  };
  riskMetrics: {
    atRiskEmployees: number;
    lowEngagement: number;
  };
  performanceMetrics: {
    highPerformers: number;
    needsImprovement: number;
  };
  insights: {
    totalEmployees: number;
    avgEngagement: number;
    highPerformerRate: number;
    riskEmployeeRate: number;
  };
  metadata: {
    role: string;
    department: string | null;
    empId: string | null;
    scope: string;
    employeeCount?: number;
  };
}

export interface Employee {
  manager_id: string; // Using manager_id as the employee ID since emp_id is empty
  name: string;
  designation: string;
  level: string;
  manager_name: string;
  gender: string;
  status: string;
  doj: string;
  total_experience: string;
  tenure: string;
  location: string;
  highest_qualification: string;
  salary: string;
  engagement_score?: number;
  performance_rating?: string;
  hrbp_tagging?: string;
  directReports?: Employee[];
}

export interface EmployeePersonalData {
  aspirations: {
    shortTerm: string;
    shortTermStatus: string;
    longTerm: string;
    longTermStatus: string;
  };
  potentials: {
    overall: string;
    rating: number;
    strengths: string[];
    developmentAreas: string[];
  };
  wfhBalance: {
    totalWfhDays: number;
    totalOfficeDays: number;
    hybridRatio: string;
    preference: string;
    wfhUtilization: number;
  };
  suggestiveLearning: Array<{
    title: string;
    type: string;
    duration: string;
    priority: string;
    status: string;
  }>;
}

export interface TeamHierarchy extends Employee {
  depth: number;
  children: TeamHierarchy[];
}

export interface AgeMixData {
  age_group: string;
  count: number;
}

export interface SeniorityMixData {
  level: string;
  count: number;
}

export interface HiringStats {
  total_requisitions: number;
  open_positions: number;
  closed_positions: number;
  offers_made: number;
  offers_accepted: number;
  offers_pending: number;
}

export interface HiringRequisition {
  requisition_id: string;
  position_title: string;
  department: string;
  location: string;
  experience_required: string;
  status: string;
  created_date: string;
  hiring_manager_id: string;
  budget_range: string;
}

// API configuration
const API_BASE_URL = 'http://localhost:5000/api';

// Dashboard API
export const dashboardService = {
  getMetrics: async (role?: string, department?: string, empId?: string) => {
    let url = `${API_BASE_URL}/dashboard/metrics`;
    const params = new URLSearchParams();
    if (role) params.append('role', role);
    if (department) params.append('department', department);
    if (empId) params.append('empId', empId);
    
    if (params.toString()) {
      url += `?${params.toString()}`;
    }
    
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch dashboard metrics');
    return response.json();
  },
  getAgeMix: async (role?: string, department?: string, empId?: string) => {
    let url = `${API_BASE_URL}/dashboard/age-mix`;
    const params = new URLSearchParams();
    if (role) params.append('role', role);
    if (department) params.append('department', department);
    if (empId) params.append('empId', empId);
    
    if (params.toString()) {
      url += `?${params.toString()}`;
    }
    
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch age mix data');
    return response.json();
  },
  getSeniorityMix: async (role?: string, department?: string, empId?: string) => {
    let url = `${API_BASE_URL}/dashboard/seniority-mix`;
    const params = new URLSearchParams();
    if (role) params.append('role', role);
    if (department) params.append('department', department);
    if (empId) params.append('empId', empId);
    
    if (params.toString()) {
      url += `?${params.toString()}`;
    }
    
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch seniority mix data');
    return response.json();
  },
};

// Employee API
export const employeeService = {
  getAllEmployees: async (managerId?: string, includeHierarchy?: boolean) => {
    let url = `${API_BASE_URL}/employees`;
    const params = new URLSearchParams();
    
    if (managerId) params.append('managerId', managerId);
    if (includeHierarchy) params.append('includeHierarchy', 'true');
    
    if (params.toString()) {
      url += `?${params.toString()}`;
    }
    
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch employees');
    return response.json() as Promise<Employee[]>;
  },

  getEmployeeById: async (empId: string) => {
    const response = await fetch(`${API_BASE_URL}/employees/${empId}`);
    if (!response.ok) throw new Error('Failed to fetch employee');
    return response.json() as Promise<Employee>;
  },

  getEmployeePersonalData: async (empId: string) => {
    const response = await fetch(`${API_BASE_URL}/employees/${empId}/personal`);
    if (!response.ok) throw new Error('Failed to fetch employee personal data');
    return response.json() as Promise<EmployeePersonalData>;
  },

  getEmployeesByLevel: async (level: string) => {
    const response = await fetch(`${API_BASE_URL}/employees/level/${level}`);
    if (!response.ok) throw new Error('Failed to fetch employees by level');
    return response.json() as Promise<Employee[]>;
  },

  getTeamHierarchy: async (empId: string) => {
    const response = await fetch(`${API_BASE_URL}/employees/${empId}/hierarchy`);
    if (!response.ok) throw new Error('Failed to fetch team hierarchy');
    return response.json() as Promise<TeamHierarchy>;
  },

  getOrganizationalChart: async () => {
    const response = await fetch(`${API_BASE_URL}/employees/orgchart`);
    if (!response.ok) throw new Error('Failed to fetch organizational chart');
    return response.json() as Promise<Employee[]>;
  },
};

// Hiring API
export const hiringService = {
  getStats: async () => {
    const response = await fetch(`${API_BASE_URL}/hiring/stats`);
    if (!response.ok) throw new Error('Failed to fetch hiring stats');
    return response.json() as Promise<HiringStats>;
  },
  getRequisitions: async () => {
    const response = await fetch(`${API_BASE_URL}/hiring/requisitions`);
    if (!response.ok) throw new Error('Failed to fetch hiring requisitions');
    return response.json() as Promise<HiringRequisition[]>;
  },
  getOffers: async () => {
    const response = await fetch(`${API_BASE_URL}/hiring/offers`);
    if (!response.ok) throw new Error('Failed to fetch hiring offers');
    return response.json();
  },
};

// Experience/Engagement API
export const experienceService = {
  getEngagementMetrics: async (role?: string, department?: string, empId?: string) => {
    let url = `${API_BASE_URL}/dashboard/metrics`;
    const params = new URLSearchParams();
    if (role) params.append('role', role);
    if (department) params.append('department', department);
    if (empId) params.append('empId', empId);
    
    if (params.toString()) {
      url += `?${params.toString()}`;
    }
    
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch engagement metrics');
    const data = await response.json();
    
    // Transform dashboard metrics to experience metrics format
    return {
      npsScore: Math.round((data.insights.avgEngagement / 10) * 100) / 100, // Convert engagement to NPS-like score
      npsTrend: '+0.3',
      engagement: Math.round(data.insights.avgEngagement),
      engagementTrend: '+2%',
      attritionRate: data.insights.riskEmployeeRate,
      averageTenure: '2.8 years', // This would need to be calculated from tenure data
      lowEngagement: data.riskMetrics.lowEngagement,
      atRiskEmployees: data.riskMetrics.atRiskEmployees,
    };
  },
};

export default api; 