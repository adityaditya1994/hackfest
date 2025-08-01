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

export const getDashboardMetrics = async (req: Request, res: Response) => {
  try {
    const { role, department, empId } = req.query;

    // Base filters for different roles
    let employeeFilter = "WHERE e.status = 'Active'";

    // Apply role-based filtering
    if (role === 'manager' && empId) {
      // Manager view: Show only their direct and indirect reports
      employeeFilter += ` AND (e.manager_id = '${empId}' OR e.manager_name IN (
        SELECT name FROM employees WHERE manager_id = '${empId}'
      ))`;
    } else if (role === 'leader' && department) {
      // Leader view: Show department-level data
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
    `);

    // Get engagement metrics with proper filtering
    const engagementMetrics = await runQuery<EngagementMetrics[]>(`
      SELECT
        AVG(eng.engagement_score) as avg_engagement,
        COUNT(CASE WHEN eng.engagement_score < 60 THEN 1 END) as low_engagement_count
      FROM engagement eng
      ${role === 'manager' || role === 'leader' ? 
        `JOIN employees e ON eng.name = e.name 
         WHERE e.status = 'Active' ${
           role === 'manager' && empId ? ` AND (e.manager_id = '${empId}' OR e.manager_name IN (SELECT name FROM employees WHERE manager_id = '${empId}'))` :
           role === 'leader' && department ? ` AND e.team = '${department}'` : ''
         }` 
        : 'WHERE 1=1'}
    `);

    // For performance metrics, since we can't link them properly, we'll calculate based on engagement scores
    // High engagement (80+) = High performer, Low engagement (<60) = Needs improvement
    const performanceFromEngagement = await runQuery<{high_performers: number, needs_improvement: number}[]>(`
      SELECT
        COUNT(DISTINCT CASE WHEN eng.engagement_score >= 80 THEN eng.name END) as high_performers,
        COUNT(DISTINCT CASE WHEN eng.engagement_score < 60 THEN eng.name END) as needs_improvement
      FROM engagement eng
      ${role === 'manager' || role === 'leader' ? 
        `JOIN employees e ON eng.name = e.name 
         WHERE e.status = 'Active' ${
           role === 'manager' && empId ? ` AND (e.manager_id = '${empId}' OR e.manager_name IN (SELECT name FROM employees WHERE manager_id = '${empId}'))` :
           role === 'leader' && department ? ` AND e.team = '${department}'` : ''
         }` 
        : 'WHERE 1=1'}
    `);

    // Get hiring metrics (not filtered by role as it's organizational level)
    const hiringMetrics = await runQuery<HiringMetrics[]>(`
      SELECT
        COUNT(CASE WHEN status = 'open' THEN 1 END) as open_positions,
        COUNT(CASE WHEN status = 'interviewing' THEN 1 END) as in_progress
      FROM hiring_requisitions
    `);

    // Get attrition risk based on low engagement
    const attritionRisk = await runQuery<AttritionRisk[]>(`
      SELECT
        COUNT(DISTINCT e.name) as at_risk_count
      FROM engagement eng
      JOIN employees e ON eng.name = e.name
      WHERE eng.engagement_score < 60
      AND e.status = 'Active'
      ${role === 'manager' && empId ? ` AND (e.manager_id = '${empId}' OR e.manager_name IN (SELECT name FROM employees WHERE manager_id = '${empId}'))` :
        role === 'leader' && department ? ` AND e.team = '${department}'` : ''}
    `);

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
        scope: role === 'hr' ? 'company-wide' : role === 'leader' ? 'department' : 'team'
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

    // Apply role-based filtering
    if (role === 'manager' && empId) {
      employeeFilter += ` AND (e.manager_id = '${empId}' OR e.manager_name IN (
        SELECT name FROM employees WHERE manager_id = '${empId}'
      ))`;
    } else if (role === 'leader' && department) {
      employeeFilter += ` AND e.team = '${department}'`;
    }

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
    `);

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

    // Apply role-based filtering
    if (role === 'manager' && empId) {
      employeeFilter += ` AND (e.manager_id = '${empId}' OR e.manager_name IN (
        SELECT name FROM employees WHERE manager_id = '${empId}'
      ))`;
    } else if (role === 'leader' && department) {
      employeeFilter += ` AND e.team = '${department}'`;
    }

    const seniorityMixData = await runQuery<SeniorityMixData[]>(`
      SELECT 
        UPPER(e.level) as level,
        COUNT(*) as count
      FROM employees e
      ${employeeFilter}
      GROUP BY e.level
      ORDER BY 
        CASE 
          WHEN e.level = 'l1' THEN 1
          WHEN e.level = 'l2' THEN 2
          WHEN e.level = 'l3' THEN 3
          WHEN e.level = 'l4' THEN 4
          WHEN e.level = 'l5' THEN 5
          ELSE 6
        END
    `);

    res.json(seniorityMixData);
  } catch (error) {
    console.error('Error fetching seniority mix data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}; 