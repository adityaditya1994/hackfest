import { runQuery, getOne } from '../database/db';

interface Position {
  id: number;
  position_id: string;
  title: string;
  department: string;
  location: string;
  hiring_manager: string;
  status: string;
  opened_date: string;
  salary_range: string;
  experience_required: number;
  skills_required: string;
}

interface Application {
  id: number;
  position_id: string;
  candidate_name: string;
  application_date: string;
  status: string;
  current_stage: string;
  source: string;
}

interface PositionDetails extends Position {
  applications: Application[];
  pipeline_metrics: {
    total: number;
    by_stage: Record<string, number>;
    by_source: Record<string, number>;
  };
}

export class HiringService {
  async getAllPositions(): Promise<Position[]> {
    return runQuery<Position[]>('SELECT * FROM positions ORDER BY opened_date DESC');
  }

  async getPositionById(positionId: string): Promise<PositionDetails | null> {
    const position = await getOne<Position>(
      'SELECT * FROM positions WHERE position_id = ?',
      [positionId]
    );

    if (!position) return null;

    const applications = await runQuery<Application[]>(
      'SELECT * FROM applications WHERE position_id = ? ORDER BY application_date DESC',
      [positionId]
    );

    // Calculate pipeline metrics
    const pipelineMetrics = {
      total: applications.length,
      by_stage: applications.reduce((acc, app) => {
        acc[app.current_stage] = (acc[app.current_stage] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      by_source: applications.reduce((acc, app) => {
        acc[app.source] = (acc[app.source] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
    };

    return {
      ...position,
      applications,
      pipeline_metrics: pipelineMetrics,
    };
  }

  async getPositionsByDepartment(department: string): Promise<Position[]> {
    return runQuery<Position[]>(
      'SELECT * FROM positions WHERE department = ? ORDER BY opened_date DESC',
      [department]
    );
  }

  async getPositionsByManager(managerId: string): Promise<Position[]> {
    return runQuery<Position[]>(
      'SELECT * FROM positions WHERE hiring_manager = ? ORDER BY opened_date DESC',
      [managerId]
    );
  }

  async getDepartmentHiringMetrics(department: string) {
    const positions = await this.getPositionsByDepartment(department);
    const positionIds = positions.map(pos => pos.position_id);

    if (positionIds.length === 0) {
      return {
        open_positions: 0,
        total_applications: 0,
        average_time_to_fill: 0,
        pipeline_health: {
          screening: 0,
          interview: 0,
          offer: 0,
        },
      };
    }

    const applications = await runQuery<Application[]>(
      'SELECT * FROM applications WHERE position_id IN (' + positionIds.map(() => '?').join(',') + ')',
      positionIds
    );

    const pipelineStages = {
      screening: applications.filter(app => app.current_stage === 'screening').length,
      interview: applications.filter(app => ['technical', 'culture'].includes(app.current_stage)).length,
      offer: applications.filter(app => app.current_stage === 'offer').length,
    };

    // Calculate average time to fill for closed positions
    const closedPositions = positions.filter(pos => pos.status === 'closed');
    const avgTimeToFill = closedPositions.length > 0
      ? closedPositions.reduce((acc, pos) => {
          const openDate = new Date(pos.opened_date);
          // Assuming closed_date is the latest application date that was accepted
          const latestAcceptedApp = applications.find(
            app => app.position_id === pos.position_id && app.status === 'accepted'
          );
          if (!latestAcceptedApp) return acc;
          const closeDate = new Date(latestAcceptedApp.application_date);
          return acc + (closeDate.getTime() - openDate.getTime()) / (1000 * 60 * 60 * 24);
        }, 0) / closedPositions.length
      : 0;

    return {
      open_positions: positions.filter(pos => pos.status === 'open').length,
      total_applications: applications.length,
      average_time_to_fill: Math.round(avgTimeToFill),
      pipeline_health: pipelineStages,
    };
  }

  async getApplicationMetrics() {
    const applications = await runQuery<Application[]>('SELECT * FROM applications');
    
    const last30Days = new Date();
    last30Days.setDate(last30Days.getDate() - 30);

    const recent = applications.filter(
      app => new Date(app.application_date) >= last30Days
    );

    return {
      total: applications.length,
      last_30_days: recent.length,
      by_source: applications.reduce((acc, app) => {
        acc[app.source] = (acc[app.source] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      by_stage: applications.reduce((acc, app) => {
        acc[app.current_stage] = (acc[app.current_stage] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      conversion_rate: {
        screening_to_interview: this.calculateConversionRate(applications, 'screening', ['technical', 'culture']),
        interview_to_offer: this.calculateConversionRate(applications, ['technical', 'culture'], ['offer']),
        offer_to_acceptance: this.calculateConversionRate(applications, 'offer', ['offer_accepted']),
      },
    };
  }

  private calculateConversionRate(
    applications: Application[],
    fromStages: string | string[],
    toStages: string[]
  ): number {
    const fromStagesList = Array.isArray(fromStages) ? fromStages : [fromStages];
    const fromCount = applications.filter(app => fromStagesList.includes(app.current_stage)).length;
    const toCount = applications.filter(app => toStages.includes(app.current_stage)).length;
    return fromCount > 0 ? (toCount / fromCount) * 100 : 0;
  }
} 