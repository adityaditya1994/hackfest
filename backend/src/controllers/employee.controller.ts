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
}

interface EmployeeWithDetails extends Employee {
  engagement_score?: number;
  performance_rating?: string;
  hrbp_tagging?: string;
  directReports?: Employee[];
}

export const getAllEmployees = async (req: Request, res: Response) => {
  try {
    const employees = await runQuery<Employee[]>(`
      SELECT e.manager_id, e.name, e.designation, e.level, e.manager_name, e.gender, e.status, 
             e.doj, e.total_experience, e.tenure, e.location, e.highest_qualification, e.salary,
             eng.engagement_score, eng.hrbp_tagging
      FROM employees e
      LEFT JOIN engagement eng ON e.name = eng.name
      WHERE e.status = 'Active' AND e.manager_id IS NOT NULL AND e.manager_id != ''
      ORDER BY e.name
    `);

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
      SELECT e.manager_id, e.name, e.designation, e.level, e.manager_name, e.gender, e.status, 
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
      SELECT e.manager_id, e.name, e.designation, e.level, e.manager_name, e.gender, e.status,
             eng.engagement_score, eng.hrbp_tagging
      FROM employees e
      LEFT JOIN engagement eng ON e.name = eng.name
      WHERE e.manager_name = ? AND e.status = 'Active' AND e.manager_id IS NOT NULL AND e.manager_id != ''
      ORDER BY e.name
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
      SELECT e.manager_id, e.name, e.designation, e.level, e.manager_name, e.gender, e.status, 
             e.doj, e.total_experience, e.tenure, e.location,
             eng.engagement_score, eng.hrbp_tagging
      FROM employees e
      LEFT JOIN engagement eng ON e.name = eng.name
      WHERE e.level = ? AND e.status = 'Active' AND e.manager_id IS NOT NULL AND e.manager_id != ''
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
      SELECT manager_id, name, designation, level, manager_name, gender, status
      FROM employees 
      WHERE manager_id = ?
    `, [empId]);

    if (!manager) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    // Get all direct and indirect reports recursively
    const getAllReports = async (managerName: string, depth = 0): Promise<any[]> => {
      const directReports = await runQuery<Employee[]>(`
        SELECT manager_id, name, designation, level, manager_name, gender, status
        FROM employees 
        WHERE manager_name = ? AND status = 'Active' AND manager_id IS NOT NULL AND manager_id != ''
        ORDER BY name
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