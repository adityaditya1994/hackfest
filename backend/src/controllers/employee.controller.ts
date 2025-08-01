import { Request, Response } from 'express';
import { runQuery, getOne } from '../database/db';

interface Employee {
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

interface EmployeeWithDetails extends Employee {
  engagement_score?: number;
  performance_rating?: string;
  hrbp_tagging?: string;
  directReports?: Employee[];
}

interface EmployeePersonalData {
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

interface OrgChartEmployee extends Employee {
  directReports: OrgChartEmployee[];
}

// Helper function to get all employees under a specific manager (including indirect reports)
const getAllEmployeesUnderManager = async (managerName: string): Promise<string[]> => {
  const getDirectAndIndirectReports = async (managerName: string): Promise<string[]> => {
    const directReports = await runQuery<{name: string}[]>(`
      SELECT name FROM employees 
      WHERE manager_name = ? AND status = 'Active' AND manager_id IS NOT NULL AND manager_id != ''
    `, [managerName]);

    const allEmployees = directReports.map(emp => emp.name);
    
    // Recursively get indirect reports
    for (const employee of directReports) {
      const indirectReports = await getDirectAndIndirectReports(employee.name);
      allEmployees.push(...indirectReports);
    }
    
    return allEmployees;
  };

  return await getDirectAndIndirectReports(managerName);
};

export const getAllEmployees = async (req: Request, res: Response) => {
  try {
    const { managerId, includeHierarchy } = req.query;
    
    let whereClause = "WHERE e.status = 'Active' AND e.manager_id IS NOT NULL AND e.manager_id != ''";
    let params: any[] = [];

    // If managerId is provided and includeHierarchy is true, get all employees under that manager
    if (managerId && includeHierarchy === 'true') {
      // First get the manager's name
      const manager = await getOne<{name: string}>(`
        SELECT DISTINCT name FROM employees WHERE manager_id = ?
      `, [managerId]);

      if (manager) {
        const allEmployeesUnderManager = await getAllEmployeesUnderManager(manager.name);
        
        if (allEmployeesUnderManager.length > 0) {
          const placeholders = allEmployeesUnderManager.map(() => '?').join(',');
          whereClause += ` AND e.name IN (${placeholders})`;
          params.push(...allEmployeesUnderManager);
        } else {
          // If no employees under this manager, return empty array
          return res.json([]);
        }
      }
    }

    const employees = await runQuery<Employee[]>(`
      SELECT DISTINCT e.manager_id, e.name, e.designation, e.level, e.manager_name, e.gender, e.status, 
             e.doj, e.total_experience, e.tenure, e.location, e.highest_qualification, e.salary,
             eng.engagement_score, eng.hrbp_tagging
      FROM employees e
      LEFT JOIN engagement eng ON e.name = eng.name
      ${whereClause}
      GROUP BY e.manager_id, e.name
      ORDER BY e.level DESC, e.name
    `, params);

    console.log(`Fetched ${employees.length} distinct employees`);
    res.json(employees);
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getEmployeeById = async (req: Request, res: Response) => {
  try {
    const { empId } = req.params;
    
    // Get employee basic details using manager_id as identifier
    const employee = await getOne<Employee>(`
      SELECT DISTINCT e.manager_id, e.name, e.designation, e.level, e.manager_name, e.gender, e.status, 
             e.doj, e.total_experience, e.tenure, e.location, e.highest_qualification, e.salary,
             eng.engagement_score, eng.hrbp_tagging
      FROM employees e
      LEFT JOIN engagement eng ON e.name = eng.name
      WHERE e.manager_id = ?
    `, [empId]);

    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    // Get performance data
    const performance = await getOne<{performance_rating: string}>(`
      SELECT performance_rating
      FROM performance 
      WHERE name = ?
    `, [employee.name]);

    // Get direct reports - find employees who report to this person
    const directReports = await runQuery<Employee[]>(`
      SELECT DISTINCT e.manager_id, e.name, e.designation, e.level, e.manager_name, e.gender, e.status,
             eng.engagement_score, eng.hrbp_tagging
      FROM employees e
      LEFT JOIN engagement eng ON e.name = eng.name
      WHERE e.manager_name = ? AND e.status = 'Active' AND e.manager_id IS NOT NULL AND e.manager_id != ''
      GROUP BY e.manager_id, e.name
      ORDER BY e.level DESC, e.name
    `, [employee.name]);

    const employeeWithDetails: EmployeeWithDetails = {
      ...employee,
      performance_rating: performance?.performance_rating,
      directReports
    };

    res.json(employeeWithDetails);
  } catch (error) {
    console.error('Error fetching employee details:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getEmployeesByLevel = async (req: Request, res: Response) => {
  try {
    const { level } = req.params;
    
    const employees = await runQuery<Employee[]>(`
      SELECT DISTINCT e.manager_id, e.name, e.designation, e.level, e.manager_name, e.gender, e.status, 
             e.doj, e.total_experience, e.tenure, e.location,
             eng.engagement_score, eng.hrbp_tagging
      FROM employees e
      LEFT JOIN engagement eng ON e.name = eng.name
      WHERE e.level = ? AND e.status = 'Active' AND e.manager_id IS NOT NULL AND e.manager_id != ''
      GROUP BY e.manager_id, e.name
      ORDER BY e.name
    `, [level]);

    res.json(employees);
  } catch (error) {
    console.error('Error fetching employees by level:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getTeamHierarchy = async (req: Request, res: Response) => {
  try {
    const { empId } = req.params;
    
    // Get the employee using manager_id
    const manager = await getOne<Employee>(`
      SELECT DISTINCT manager_id, name, designation, level, manager_name, gender, status
      FROM employees 
      WHERE manager_id = ?
    `, [empId]);

    if (!manager) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    // Get all direct and indirect reports recursively
    const getAllReports = async (managerName: string, depth = 0): Promise<any[]> => {
      const directReports = await runQuery<Employee[]>(`
        SELECT DISTINCT manager_id, name, designation, level, manager_name, gender, status
        FROM employees 
        WHERE manager_name = ? AND status = 'Active' AND manager_id IS NOT NULL AND manager_id != ''
        GROUP BY manager_id, name
        ORDER BY level DESC, name
      `, [managerName]);

      const reports = [];
      for (const report of directReports) {
        const subReports = await getAllReports(report.name, depth + 1);
        reports.push({
          ...report,
          depth,
          children: subReports
        });
      }
      return reports;
    };

    const hierarchy = {
      ...manager,
      depth: 0,
      children: await getAllReports(manager.name)
    };

    res.json(hierarchy);
  } catch (error) {
    console.error('Error fetching team hierarchy:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getOrganizationalChart = async (req: Request, res: Response) => {
  try {
    console.log('Building organizational chart...');
    
    // Get all active employees with DISTINCT to avoid duplicates
    const allEmployees = await runQuery<Employee[]>(`
      SELECT DISTINCT e.manager_id, e.name, e.designation, e.level, e.manager_name, e.gender, e.status, 
             e.doj, e.total_experience, e.tenure, e.location, e.highest_qualification, e.salary,
             eng.engagement_score, eng.hrbp_tagging
      FROM employees e
      LEFT JOIN engagement eng ON e.name = eng.name
      WHERE e.status = 'Active' AND e.manager_id IS NOT NULL AND e.manager_id != ''
      GROUP BY e.manager_id, e.name
      ORDER BY e.level DESC, e.name
    `);

    console.log(`Found ${allEmployees.length} distinct active employees`);

    // Create a map to easily find employees by name
    const employeeMap = new Map<string, OrgChartEmployee>();
    
    // Initialize all employees in the map with empty directReports
    allEmployees.forEach(emp => {
      employeeMap.set(emp.name, {
        ...emp,
        directReports: []
      });
    });

    // Build the hierarchy by linking employees to their managers
    allEmployees.forEach(emp => {
      if (emp.manager_name && emp.manager_name.trim() !== '' && emp.manager_name !== emp.name) {
        const manager = employeeMap.get(emp.manager_name);
        const employee = employeeMap.get(emp.name);
        
        if (manager && employee) {
          manager.directReports.push(employee);
        }
      }
    });

    // Find top-level employees (L5 or those without managers, or whose managers don't exist)
    const topLevelEmployees = allEmployees.filter(emp => {
      // L5 employees are typically top level
      if (emp.level === 'l5') return true;
      
      // Employees without manager names
      if (!emp.manager_name || emp.manager_name.trim() === '') return true;
      
      // Employees who report to themselves (data inconsistency)
      if (emp.manager_name === emp.name) return true;
      
      // Employees whose managers don't exist in our dataset
      const managerExists = allEmployees.some(e => e.name === emp.manager_name);
      if (!managerExists) return true;
      
      return false;
    });

    console.log(`Found ${topLevelEmployees.length} top-level employees:`, topLevelEmployees.map(e => `${e.name} (${e.level})`));

    // Get the org chart data for top-level employees
    const orgChart = topLevelEmployees.map(emp => employeeMap.get(emp.name)!).filter(Boolean);

    // Sort by level (L5 first, then L4, etc.) and name
    orgChart.sort((a, b) => {
      const levelOrder = { 'l5': 5, 'l4': 4, 'l3': 3, 'l2': 2, 'l1': 1 };
      const aLevel = levelOrder[a.level as keyof typeof levelOrder] || 0;
      const bLevel = levelOrder[b.level as keyof typeof levelOrder] || 0;
      
      if (aLevel !== bLevel) {
        return bLevel - aLevel; // Higher levels first
      }
      
      return a.name.localeCompare(b.name);
    });

    // Function to recursively sort direct reports
    const sortDirectReports = (employee: OrgChartEmployee) => {
      employee.directReports.sort((a, b) => {
        const levelOrder = { 'l5': 5, 'l4': 4, 'l3': 3, 'l2': 2, 'l1': 1 };
        const aLevel = levelOrder[a.level as keyof typeof levelOrder] || 0;
        const bLevel = levelOrder[b.level as keyof typeof levelOrder] || 0;
        
        if (aLevel !== bLevel) {
          return bLevel - aLevel; // Higher levels first
        }
        
        return a.name.localeCompare(b.name);
      });
      
      // Recursively sort direct reports of direct reports
      employee.directReports.forEach(sortDirectReports);
    };

    // Sort all direct reports recursively
    orgChart.forEach(sortDirectReports);

    const totalEmployeesInChart = countEmployeesInChart(orgChart);
    console.log(`Organizational chart built successfully with ${totalEmployeesInChart} total employees`);
    
    res.json(orgChart);
  } catch (error) {
    console.error('Error building organizational chart:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Helper function to count total employees in the org chart
function countEmployeesInChart(employees: OrgChartEmployee[]): number {
  let count = employees.length;
  employees.forEach(emp => {
    count += countEmployeesInChart(emp.directReports);
  });
  return count;
}

export const getEmployeePersonalData = async (req: Request, res: Response) => {
  try {
    const { empId } = req.params;
    
    console.log(`Fetching personal data for employee: ${empId}`);

    // Get the employee's name first to query performance data
    const employee = await getOne<{name: string}>(`
      SELECT name FROM employees WHERE manager_id = ?
    `, [empId]);

    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    // Get performance and aspiration data
    const performanceData = await getOne<{
      performance_rating: string;
      potential_rating: number;
      short_term_aspiration: string;
      short_term_status: string;
      long_term_aspiration: string;
      long_term_status: string;
    }>(`
      SELECT 
        performance_rating,
        potential_rating,
        short_term_aspiration,
        short_term_status,
        long_term_aspiration,
        long_term_status
      FROM performance p
      JOIN employees e ON p.emp_id = e.emp_id 
      WHERE e.name = ?
      ORDER BY p.id DESC
      LIMIT 1
    `, [employee.name]);

    // Get OKR data for learning suggestions
    const okrData = await runQuery<{
      okr_title: string;
      key_results: string;
      status: string;
      progress: number;
    }[]>(`
      SELECT okr_title, key_results, status, progress
      FROM okrs o
      JOIN employees e ON o.emp_id = e.emp_id
      WHERE e.name = ?
      ORDER BY o.okr_year DESC
      LIMIT 3
    `, [employee.name]);

    // Prepare response data
    const aspirations = {
      shortTerm: performanceData?.short_term_aspiration || "Learning & Development",
      shortTermStatus: performanceData?.short_term_status || "In Progress", 
      longTerm: performanceData?.long_term_aspiration || "Leadership Role",
      longTermStatus: performanceData?.long_term_status || "Planning"
    };

    // Map potential rating to text and strengths
    const getPotentialInfo = (rating: number) => {
      if (rating >= 4) {
        return {
          overall: "High Potential",
          strengths: ["Technical Leadership", "Strategic Thinking", "Team Management"],
          developmentAreas: ["Public Speaking", "Cross-functional Collaboration"]
        };
      } else if (rating >= 3) {
        return {
          overall: "Good Potential", 
          strengths: ["Technical Skills", "Problem Solving", "Communication"],
          developmentAreas: ["Leadership Skills", "Project Management"]
        };
      } else {
        return {
          overall: "Developing Potential",
          strengths: ["Technical Foundation", "Learning Agility"],
          developmentAreas: ["Technical Skills", "Communication", "Time Management"]
        };
      }
    };

    const potentialInfo = getPotentialInfo(performanceData?.potential_rating || 2);
    const potentials = {
      overall: potentialInfo.overall,
      rating: performanceData?.potential_rating || 2,
      strengths: potentialInfo.strengths,
      developmentAreas: potentialInfo.developmentAreas
    };

    // Mock WFH balance data (since not available in CSV)
    const wfhBalance = {
      totalWfhDays: Math.floor(Math.random() * 60) + 30, // 30-90 days
      totalOfficeDays: Math.floor(Math.random() * 80) + 40, // 40-120 days
      hybridRatio: "40:60",
      preference: ["Hybrid", "WFH", "Office"][Math.floor(Math.random() * 3)],
      wfhUtilization: Math.floor(Math.random() * 40) + 60 // 60-100%
    };

    // Generate suggestive learning based on performance and OKRs
    const suggestiveLearning = [
      {
        title: "Advanced React Patterns",
        type: "Technical",
        duration: "6 weeks",
        priority: (performanceData?.potential_rating ?? 2) >= 3 ? "High" : "Medium",
        status: "Recommended"
      },
      {
        title: "Leadership Communication", 
        type: "Soft Skills",
        duration: "4 weeks",
        priority: aspirations.longTerm.toLowerCase().includes('leadership') ? "High" : "Medium",
        status: aspirations.longTerm.toLowerCase().includes('leadership') ? "Recommended" : "Optional"
      },
      {
        title: "Cloud Architecture Certification",
        type: "Certification", 
        duration: "8 weeks",
        priority: performanceData?.performance_rating === "Exceeds Expectations" ? "High" : "Medium",
        status: "Recommended"
      }
    ];

    const personalData: EmployeePersonalData = {
      aspirations,
      potentials,
      wfhBalance,
      suggestiveLearning
    };

    console.log(`Personal data fetched successfully for ${employee.name}`);
    res.json(personalData);
  } catch (error) {
    console.error('Error fetching employee personal data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}; 