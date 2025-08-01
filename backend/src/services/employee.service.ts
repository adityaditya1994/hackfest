import { runQuery, getOne } from '../database/db';

interface Employee {
  id: number;
  employee_id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  location: string;
  joining_date: string;
  reporting_manager: string;
  gender: string;
  experience: number;
  education: string;
}

interface EmployeePerformance {
  rating: number;
  review_date: string;
  review_type: string;
  reviewer: string;
  comments: string;
}

interface EmployeeEngagement {
  survey_date: string;
  engagement_score: number;
  satisfaction_score: number;
  burnout_risk: string;
  comments: string;
}

interface EmployeeSkill {
  skill_name: string;
  proficiency_level: string;
  last_used: string;
  is_primary: boolean;
}

interface EmployeeDetails extends Employee {
  performance: EmployeePerformance[];
  engagement: EmployeeEngagement[];
  skills: EmployeeSkill[];
  team?: Employee[];
}

export class EmployeeService {
  async getAllEmployees(): Promise<Employee[]> {
    return runQuery<Employee[]>('SELECT * FROM employees');
  }

  async getEmployeeById(employeeId: string): Promise<EmployeeDetails | null> {
    const employee = await getOne<Employee>(
      'SELECT * FROM employees WHERE employee_id = ?',
      [employeeId]
    );

    if (!employee) return null;

    const performance = await runQuery<EmployeePerformance[]>(
      'SELECT rating, review_date, review_type, reviewer, comments FROM performance WHERE employee_id = ? ORDER BY review_date DESC',
      [employeeId]
    );

    const engagement = await runQuery<EmployeeEngagement[]>(
      'SELECT survey_date, engagement_score, satisfaction_score, burnout_risk, comments FROM engagement WHERE employee_id = ? ORDER BY survey_date DESC',
      [employeeId]
    );

    const skills = await runQuery<EmployeeSkill[]>(
      'SELECT skill_name, proficiency_level, last_used, is_primary FROM skills WHERE employee_id = ?',
      [employeeId]
    );

    const team = await runQuery<Employee[]>(
      'SELECT * FROM employees WHERE reporting_manager = ?',
      [employeeId]
    );

    return {
      ...employee,
      performance,
      engagement,
      skills,
      team: team.length > 0 ? team : undefined,
    };
  }

  async getTeamMetrics(managerId: string) {
    const teamMembers = await runQuery<Employee[]>(
      'SELECT * FROM employees WHERE reporting_manager = ?',
      [managerId]
    );

    const teamMemberIds = teamMembers.map(member => member.employee_id);
    
    if (teamMemberIds.length === 0) {
      return {
        totalEmployees: 0,
        genderRatio: { male: 0, female: 0, other: 0 },
        averageExperience: 0,
        averageTenure: 0,
        riskMetrics: {
          highRisk: 0,
          mediumRisk: 0,
          lowRisk: 0,
        },
        performanceMetrics: {
          averageRating: 0,
          topPerformers: 0,
          needsImprovement: 0,
        },
      };
    }

    // Calculate gender ratio
    const genderCounts = teamMembers.reduce(
      (acc, member) => {
        if (member.gender.toLowerCase() === 'male') acc.male++;
        else if (member.gender.toLowerCase() === 'female') acc.female++;
        else acc.other++;
        return acc;
      },
      { male: 0, female: 0, other: 0 }
    );

    // Get latest performance ratings
    const performanceData = await Promise.all(
      teamMemberIds.map(async (id) => {
        const latestReview = await getOne<EmployeePerformance>(
          'SELECT rating FROM performance WHERE employee_id = ? ORDER BY review_date DESC LIMIT 1',
          [id]
        );
        return latestReview?.rating || 0;
      })
    );

    // Get latest engagement data
    const engagementData = await Promise.all(
      teamMemberIds.map(async (id) => {
        const latestEngagement = await getOne<EmployeeEngagement>(
          'SELECT burnout_risk FROM engagement WHERE employee_id = ? ORDER BY survey_date DESC LIMIT 1',
          [id]
        );
        return latestEngagement?.burnout_risk || 'low';
      })
    );

    const averageRating = performanceData.reduce((a, b) => a + b, 0) / performanceData.length;
    const topPerformers = performanceData.filter(rating => rating >= 4.0).length;
    const needsImprovement = performanceData.filter(rating => rating < 3.0).length;

    const riskCounts = engagementData.reduce(
      (acc, risk) => {
        if (risk === 'high') acc.highRisk++;
        else if (risk === 'medium') acc.mediumRisk++;
        else acc.lowRisk++;
        return acc;
      },
      { highRisk: 0, mediumRisk: 0, lowRisk: 0 }
    );

    // Calculate average experience and tenure
    const averageExperience = teamMembers.reduce((acc, member) => acc + member.experience, 0) / teamMembers.length;
    const now = new Date();
    const averageTenure = teamMembers.reduce((acc, member) => {
      const joiningDate = new Date(member.joining_date);
      const tenureYears = (now.getTime() - joiningDate.getTime()) / (1000 * 60 * 60 * 24 * 365);
      return acc + tenureYears;
    }, 0) / teamMembers.length;

    return {
      totalEmployees: teamMembers.length,
      genderRatio: {
        male: (genderCounts.male / teamMembers.length) * 100,
        female: (genderCounts.female / teamMembers.length) * 100,
        other: (genderCounts.other / teamMembers.length) * 100,
      },
      averageExperience,
      averageTenure,
      riskMetrics: riskCounts,
      performanceMetrics: {
        averageRating,
        topPerformers,
        needsImprovement,
      },
    };
  }

  async getDepartmentMetrics(department: string) {
    const employees = await runQuery<Employee[]>(
      'SELECT * FROM employees WHERE department = ?',
      [department]
    );

    if (employees.length === 0) {
      return null;
    }

    const employeeIds = employees.map(emp => emp.employee_id);

    // Get latest performance and engagement data
    const performanceData = await Promise.all(
      employeeIds.map(async (id) => {
        const latestReview = await getOne<EmployeePerformance>(
          'SELECT rating FROM performance WHERE employee_id = ? ORDER BY review_date DESC LIMIT 1',
          [id]
        );
        return latestReview?.rating || 0;
      })
    );

    const engagementData = await Promise.all(
      employeeIds.map(async (id) => {
        const latestEngagement = await getOne<EmployeeEngagement>(
          'SELECT engagement_score, satisfaction_score FROM engagement WHERE employee_id = ? ORDER BY survey_date DESC LIMIT 1',
          [id]
        );
        return latestEngagement || { engagement_score: 0, satisfaction_score: 0 };
      })
    );

    const averageEngagement = engagementData.reduce((acc, data) => acc + data.engagement_score, 0) / engagementData.length;
    const averageSatisfaction = engagementData.reduce((acc, data) => acc + data.satisfaction_score, 0) / engagementData.length;
    const averagePerformance = performanceData.reduce((a, b) => a + b, 0) / performanceData.length;

    return {
      totalEmployees: employees.length,
      averageEngagement,
      averageSatisfaction,
      averagePerformance,
      seniorityDistribution: employees.reduce((acc, emp) => {
        const level = emp.role.toLowerCase().includes('senior') ? 'senior' :
                     emp.role.toLowerCase().includes('lead') || emp.role.toLowerCase().includes('manager') ? 'lead' :
                     'junior';
        acc[level] = (acc[level] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
    };
  }
} 