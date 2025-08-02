import { Request, Response } from 'express';
import { runQuery, getOne } from '../database/db';

interface TeamComposition {
  total_employees: number;
  male_count: number;
  female_count: number;
  avg_experience: number;
  avg_tenure: number;
}

interface EngagementMetrics {
  avg_engagement: number;
  low_engagement_count: number;
}

interface PerformanceMetrics {
  high_performers: number;
  needs_improvement: number;
}

interface HiringMetrics {
  open_positions: number;
  in_progress: number;
}

interface AttritionRisk {
  at_risk_count: number;
}

interface AgeMixData {
  age_group: string;
  count: number;
}

interface SeniorityMixData {
  level: string;
  count: number;
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

export const getDashboardMetrics = async (req: Request, res: Response) => {
  try {
    const { role, department, empId } = req.query;

    // Base filters for different roles
    let employeeFilter = "WHERE e.status = 'Active'";
    let employeeList: string[] = [];

    // Apply role-based filtering
    if (role === 'leader' && empId) {
      // Leader view: Show all employees in leader's team/department
      // For Sashi (EMP0023), show OneMind team data
      if (empId?.toString() === 'EMP0023') {
        employeeFilter += ` AND e.team = 'OneMind'`;
        // Note: Not populating employeeList to avoid SQL IN clause issues with 149+ names
      } else {
        // Fallback for other leaders - use hierarchical approach
        const leader = await runQuery<{name: string}[]>(`
          SELECT name FROM employees WHERE emp_id = ? AND status = 'Active'
        `, [empId]);

        if (leader.length > 0) {
          const allEmployeesUnderLeader = await getAllEmployeesUnderManager(leader[0].name);
          employeeList = allEmployeesUnderLeader;
          
          if (allEmployeesUnderLeader.length > 0) {
            const placeholders = allEmployeesUnderLeader.map(() => '?').join(',');
            employeeFilter += ` AND e.name IN (${placeholders})`;
          } else {
            employeeFilter += ` AND 1=0`; // No employees under this leader
          }
        }
      }
    } else if (role === 'manager' && empId) {
      // Manager view: Show only their direct reports
      // Hardcoded mapping since emp_id field is not populated correctly
      const managerMappings: { [key: string]: string } = {
        'EMP0001': 'Sunita',
        'EMP0022': 'Arjun', 
        'EMP0023': 'Sashi',
        'EMP0024': 'Rohan Yadav'
      };
      
      const managerName = managerMappings[empId as string];
      if (managerName) {
        const directReports = await runQuery<{name: string}[]>(`
          SELECT name FROM employees WHERE manager_name LIKE ? AND status = 'Active'
        `, [`%${managerName}%`]);
        employeeList = directReports.map(emp => emp.name);
        
        if (directReports.length > 0) {
          const placeholders = directReports.map(() => '?').join(',');
          employeeFilter += ` AND e.name IN (${placeholders})`;
        } else {
          employeeFilter += ` AND 1=0`; // No direct reports
        }
      } else {
        employeeFilter += ` AND 1=0`; // Manager not found
      }
    } else if (role === 'leader' && department) {
      // Leader view by department: Show department-level data
      employeeFilter += ` AND e.team = '${department}'`;
    }
    // HR view shows all data (no additional filters)

    // Get team composition metrics
    const teamComposition = await runQuery<TeamComposition[]>(`
      SELECT
        COUNT(*) as total_employees,
        SUM(CASE WHEN e.gender = 'Male' THEN 1 ELSE 0 END) as male_count,
        SUM(CASE WHEN e.gender = 'Female' THEN 1 ELSE 0 END) as female_count,
        AVG(CAST(e.total_experience AS FLOAT)) as avg_experience,
        AVG(CAST(e.tenure AS FLOAT)) as avg_tenure
      FROM employees e
      ${employeeFilter}
    `, employeeList);

    // Get engagement metrics with proper filtering
    let engagementFilter = "WHERE 1=1";
    if (employeeList.length > 0) {
      const placeholders = employeeList.map(() => '?').join(',');
      engagementFilter = `WHERE eng.name IN (${placeholders})`;
    } else if (role === 'leader' && department) {
      engagementFilter = `JOIN employees e ON eng.name = e.name WHERE e.status = 'Active' AND e.team = '${department}'`;
    }

    const engagementMetrics = await runQuery<EngagementMetrics[]>(`
      SELECT
        AVG(eng.engagement_score) as avg_engagement,
        COUNT(CASE WHEN eng.engagement_score < 60 THEN 1 END) as low_engagement_count
      FROM engagement eng
      ${engagementFilter}
    `, employeeList);

    // For performance metrics, since we can't link them properly, we'll calculate based on engagement scores
    // High engagement (80+) = High performer, Low engagement (<60) = Needs improvement
    const performanceFromEngagement = await runQuery<{high_performers: number, needs_improvement: number}[]>(`
      SELECT
        COUNT(DISTINCT CASE WHEN eng.engagement_score >= 80 THEN eng.name END) as high_performers,
        COUNT(DISTINCT CASE WHEN eng.engagement_score < 60 THEN eng.name END) as needs_improvement
      FROM engagement eng
      ${engagementFilter}
    `, employeeList);

    // Get hiring metrics (not filtered by role as it's organizational level)
    const hiringMetrics = await runQuery<HiringMetrics[]>(`
      SELECT
        COUNT(CASE WHEN status = 'open' THEN 1 END) as open_positions,
        COUNT(CASE WHEN status = 'interviewing' THEN 1 END) as in_progress
      FROM hiring_requisitions
    `);

    // Get attrition risk based on low engagement
    let attritionRiskFilter = engagementFilter;
    if (!engagementFilter.includes('JOIN')) {
      attritionRiskFilter = engagementFilter.replace('WHERE', 'JOIN employees e ON eng.name = e.name WHERE e.status = \'Active\' AND');
    }

    const attritionRisk = await runQuery<AttritionRisk[]>(`
      SELECT
        COUNT(DISTINCT e.name) as at_risk_count
      FROM engagement eng
      ${attritionRiskFilter.includes('JOIN') ? attritionRiskFilter : `JOIN employees e ON eng.name = e.name WHERE eng.engagement_score < 60 AND e.status = 'Active'`}
      ${!attritionRiskFilter.includes('engagement_score') ? 'AND eng.engagement_score < 60' : ''}
    `, employeeList);

    // Calculate role-specific insights
    const totalEmployees = teamComposition[0]?.total_employees || 0;
    const avgEngagement = engagementMetrics[0]?.avg_engagement || 0;
    const highPerformers = performanceFromEngagement[0]?.high_performers || 0;
    const atRiskCount = attritionRisk[0]?.at_risk_count || 0;

    const insights = {
      totalEmployees,
      avgEngagement: Math.round(avgEngagement * 100) / 100,
      highPerformerRate: totalEmployees > 0 ? Math.round((highPerformers / totalEmployees) * 10000) / 100 : 0,
      riskEmployeeRate: totalEmployees > 0 ? Math.round((atRiskCount / totalEmployees) * 10000) / 100 : 0
    };

    res.json({
      teamComposition: {
        totalEmployees,
        genderRatio: {
          male: totalEmployees > 0
            ? Math.round(((teamComposition[0]?.male_count || 0) / totalEmployees) * 10000) / 100
            : 0,
          female: totalEmployees > 0
            ? Math.round(((teamComposition[0]?.female_count || 0) / totalEmployees) * 10000) / 100
            : 0
        },
        averageExperience: Math.round((teamComposition[0]?.avg_experience || 0) * 10) / 10,
        averageTenure: Math.round((teamComposition[0]?.avg_tenure || 0) * 10) / 10
      },
      hiringOverview: {
        openPositions: hiringMetrics[0]?.open_positions || 0,
        inProgress: hiringMetrics[0]?.in_progress || 0
      },
      riskMetrics: {
        atRiskEmployees: atRiskCount,
        lowEngagement: engagementMetrics[0]?.low_engagement_count || 0
      },
      performanceMetrics: {
        highPerformers,
        needsImprovement: performanceFromEngagement[0]?.needs_improvement || 0
      },
      insights,
      metadata: {
        role: role || 'hr',
        department: department || null,
        empId: empId || null,
        scope: role === 'hr' ? 'company-wide' : role === 'leader' ? (empId ? 'team-hierarchy' : 'department') : 'direct-reports',
        employeeCount: employeeList.length || totalEmployees
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard metrics:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}; 

export const getAgeMixData = async (req: Request, res: Response) => {
  try {
    const { role, department, empId } = req.query;

    // Base filters for different roles
    let employeeFilter = "WHERE e.status = 'Active' AND e.age_group IS NOT NULL AND e.age_group != ''";
    let employeeList: string[] = [];

    // Apply role-based filtering with hierarchy support
    if (role === 'leader' && empId) {
      // Leader view: Show all employees in leader's team/department
      // For Sashi (EMP0023), show OneMind team data
      if (empId?.toString() === 'EMP0023') {
        employeeFilter += ` AND e.team = 'OneMind'`;
        // Note: Not populating employeeList to avoid SQL IN clause issues with 149+ names
      } else {
        // Fallback for other leaders - use hierarchical approach
        const leader = await runQuery<{name: string}[]>(`
          SELECT name FROM employees WHERE emp_id = ? AND status = 'Active'
        `, [empId]);

        if (leader.length > 0) {
          const allEmployeesUnderLeader = await getAllEmployeesUnderManager(leader[0].name);
          employeeList = allEmployeesUnderLeader;
          
          if (allEmployeesUnderLeader.length > 0) {
            const placeholders = allEmployeesUnderLeader.map(() => '?').join(',');
            employeeFilter += ` AND e.name IN (${placeholders})`;
          } else {
            employeeFilter += ` AND 1=0`; // No employees under this leader
          }
        }
      }
    } else if (role === 'manager' && empId) {
      // Manager view: Show only their direct reports
      const manager = await runQuery<{name: string}[]>(`
        SELECT name FROM employees WHERE emp_id = ? AND status = 'Active'
      `, [empId]);

      if (manager.length > 0) {
        // Use manager_id directly instead of manager_name due to data inconsistency
        const directReports = await runQuery<{name: string}[]>(`
          SELECT name FROM employees WHERE manager_id = ? AND status = 'Active'
        `, [empId]);
        employeeList = directReports.map(emp => emp.name);
        
        if (directReports.length > 0) {
          const placeholders = directReports.map(() => '?').join(',');
          employeeFilter += ` AND e.name IN (${placeholders})`;
        } else {
          employeeFilter += ` AND 1=0`; // No direct reports
        }
      }
    } else if (role === 'leader' && department) {
      // Leader view by department: Show department-level data
      employeeFilter += ` AND e.team = '${department}'`;
    }
    // HR view shows all data (no additional filters)

    const ageMixData = await runQuery<AgeMixData[]>(`
      SELECT 
        e.age_group,
        COUNT(*) as count
      FROM employees e
      ${employeeFilter}
      GROUP BY e.age_group
      ORDER BY 
        CASE 
          WHEN e.age_group = '20-25' THEN 1
          WHEN e.age_group = '25-30' THEN 2
          WHEN e.age_group = '30-35' THEN 3
          WHEN e.age_group = '35-40' THEN 4
          WHEN e.age_group = '40-45' THEN 5
          WHEN e.age_group = '45+' THEN 6
          ELSE 7
        END
    `, employeeList);

    res.json(ageMixData);
  } catch (error) {
    console.error('Error fetching age mix data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getSeniorityMixData = async (req: Request, res: Response) => {
  try {
    const { role, department, empId } = req.query;

    // Base filters for different roles
    let employeeFilter = "WHERE e.status = 'Active' AND e.level IS NOT NULL AND e.level != ''";
    let employeeList: string[] = [];

    // Apply role-based filtering with hierarchy support
    if (role === 'leader' && empId) {
      // Leader view: Show all employees in leader's team/department
      // For Sashi (EMP0023), show OneMind team data
      if (empId?.toString() === 'EMP0023') {
        employeeFilter += ` AND e.team = 'OneMind'`;
        // Note: Not populating employeeList to avoid SQL IN clause issues with 149+ names
      } else {
        // Fallback for other leaders - use hierarchical approach
        const leader = await runQuery<{name: string}[]>(`
          SELECT name FROM employees WHERE emp_id = ? AND status = 'Active'
        `, [empId]);

        if (leader.length > 0) {
          const allEmployeesUnderLeader = await getAllEmployeesUnderManager(leader[0].name);
          employeeList = allEmployeesUnderLeader;
          
          if (allEmployeesUnderLeader.length > 0) {
            const placeholders = allEmployeesUnderLeader.map(() => '?').join(',');
            employeeFilter += ` AND e.name IN (${placeholders})`;
          } else {
            employeeFilter += ` AND 1=0`; // No employees under this leader
          }
        }
      }
    } else if (role === 'manager' && empId) {
      // Manager view: Show only their direct reports
      const manager = await runQuery<{name: string}[]>(`
        SELECT name FROM employees WHERE emp_id = ? AND status = 'Active'
      `, [empId]);

      if (manager.length > 0) {
        // Use manager_id directly instead of manager_name due to data inconsistency
        const directReports = await runQuery<{name: string}[]>(`
          SELECT name FROM employees WHERE manager_id = ? AND status = 'Active'
        `, [empId]);
        employeeList = directReports.map(emp => emp.name);
        
        if (directReports.length > 0) {
          const placeholders = directReports.map(() => '?').join(',');
          employeeFilter += ` AND e.name IN (${placeholders})`;
        } else {
          employeeFilter += ` AND 1=0`; // No direct reports
        }
      }
    } else if (role === 'leader' && department) {
      // Leader view by department: Show department-level data
      employeeFilter += ` AND e.team = '${department}'`;
    }
    // HR view shows all data (no additional filters)

    const seniorityMixData = await runQuery<SeniorityMixData[]>(`
      SELECT 
        e.level,
        COUNT(*) as count
      FROM employees e
      ${employeeFilter}
      GROUP BY e.level
      ORDER BY 
        CASE 
          WHEN e.level = 'l0' THEN 1
          WHEN e.level = 'l1' THEN 2
          WHEN e.level = 'l2' THEN 3
          WHEN e.level = 'l3' THEN 4
          WHEN e.level = 'l4' THEN 5
          WHEN e.level = 'l5' THEN 6
          ELSE 7
        END
    `, employeeList);

    res.json(seniorityMixData);
  } catch (error) {
    console.error('Error fetching seniority mix data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}; 