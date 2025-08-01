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

export const dashboardService = {
  getMetrics: async (role?: string, department?: string, empId?: string): Promise<DashboardMetrics> => {
    try {
      console.log('Fetching dashboard metrics...');

      // Build query parameters based on role
      const params = new URLSearchParams();
      if (role) params.append('role', role);
      if (department) params.append('department', department);
      if (empId) params.append('empId', empId);

      const url = `/dashboard/metrics${params.toString() ? `?${params.toString()}` : ''}`;
      const response = await api.get<DashboardMetrics>(url);
      console.log('Dashboard metrics received:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard metrics:', error);
      throw error;
    }
  },

  getAgeMix: async (role?: string, department?: string, empId?: string): Promise<AgeMixData[]> => {
    try {
      const params = new URLSearchParams();
      if (role) params.append('role', role);
      if (department) params.append('department', department);
      if (empId) params.append('empId', empId);

      const url = `/dashboard/age-mix${params.toString() ? `?${params.toString()}` : ''}`;
      const response = await api.get<AgeMixData[]>(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching age mix data:', error);
      throw error;
    }
  },

  getSeniorityMix: async (role?: string, department?: string, empId?: string): Promise<SeniorityMixData[]> => {
    try {
      const params = new URLSearchParams();
      if (role) params.append('role', role);
      if (department) params.append('department', department);
      if (empId) params.append('empId', empId);

      const url = `/dashboard/seniority-mix${params.toString() ? `?${params.toString()}` : ''}`;
      const response = await api.get<SeniorityMixData[]>(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching seniority mix data:', error);
      throw error;
    }
  },
};

export const employeeService = {
  getAllEmployees: async (managerId?: string, includeHierarchy?: boolean): Promise<Employee[]> => {
    let url = '/employees';
    const params = new URLSearchParams();
    
    if (managerId && includeHierarchy) {
      params.append('managerId', managerId);
      params.append('includeHierarchy', 'true');
    }
    
    if (params.toString()) {
      url += `?${params.toString()}`;
    }
    
    const response = await api.get<Employee[]>(url);
    return response.data;
  },

  getEmployeeById: async (empId: string): Promise<Employee> => {
    const response = await api.get<Employee>(`/employees/${empId}`);
    return response.data;
  },

  getEmployeesByLevel: async (level: string): Promise<Employee[]> => {
    const response = await api.get<Employee[]>(`/employees/level/${level}`);
    return response.data;
  },

  getTeamHierarchy: async (empId: string): Promise<TeamHierarchy> => {
    const response = await api.get<TeamHierarchy>(`/employees/${empId}/hierarchy`);
    return response.data;
  },
};

export const hiringService = {
  getStats: async (): Promise<HiringStats> => {
    try {
      const response = await api.get<HiringStats>('/hiring/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching hiring stats:', error);
      throw error;
    }
  },

  getRequisitions: async (): Promise<HiringRequisition[]> => {
    try {
      const response = await api.get<HiringRequisition[]>('/hiring/requisitions');
      return response.data;
    } catch (error) {
      console.error('Error fetching hiring requisitions:', error);
      throw error;
    }
  },
};

export default api; 