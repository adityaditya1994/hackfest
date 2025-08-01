import sqlite3 from 'sqlite3';
import path from 'path';

export interface TableMetadata {
  tableName: string;
  columns: ColumnMetadata[];
  description: string;
  examples: string[];
}

export interface ColumnMetadata {
  name: string;
  type: string;
  description: string;
  sampleValues?: string[];
}

export class DatabaseService {
  private db: sqlite3.Database;
  private metadata: TableMetadata[] = [];

  constructor() {
    // Connect to the main HR database
    const dbPath = path.join(__dirname, '../../../../backend/hr_onemind.db');
    this.db = new sqlite3.Database(dbPath);
    this.initializeMetadata();
  }

  private initializeMetadata() {
    this.metadata = [
      {
        tableName: 'employees',
        description: 'Contains all employee information including personal and professional details',
        examples: [
          'How many employees are in my team?',
          'What is the gender ratio in OneAI team?',
          'How many PhDs work in OneMind value stream?',
          'Show me employees by location',
          'What is the age distribution of our team?'
        ],
        columns: [
          { name: 'emp_id', type: 'TEXT', description: 'Employee ID' },
          { name: 'name', type: 'TEXT', description: 'Employee full name' },
          { name: 'gender', type: 'TEXT', description: 'Employee gender (Male/Female)', sampleValues: ['Male', 'Female'] },
          { name: 'level', type: 'TEXT', description: 'Employee level (l1, l2, l3, l4, l5)', sampleValues: ['l1', 'l2', 'l3', 'l4', 'l5'] },
          { name: 'designation', type: 'TEXT', description: 'Job title/designation' },
          { name: 'department', type: 'TEXT', description: 'Department name' },
          { name: 'team', type: 'TEXT', description: 'Team/Value stream (OneAI, Commerce, OneMind)', sampleValues: ['OneAI', 'Commerce', 'OneMind'] },
          { name: 'location', type: 'TEXT', description: 'Work location (Gurgaon, Bangalore, etc.)' },
          { name: 'manager_name', type: 'TEXT', description: 'Direct manager name' },
          { name: 'highest_qualification', type: 'TEXT', description: 'Highest education (PhD, Masters, Bachelor, etc.)', sampleValues: ['PhD', 'Masters', 'Bachelor', 'MCA', 'MBA'] },
          { name: 'age', type: 'INTEGER', description: 'Employee age' },
          { name: 'age_group', type: 'TEXT', description: 'Age group (20-25, 25-30, 30-35, etc.)' },
          { name: 'total_experience', type: 'TEXT', description: 'Total years of experience' },
          { name: 'tenure', type: 'TEXT', description: 'Years at current company' },
          { name: 'status', type: 'TEXT', description: 'Employment status (Active/Inactive)', sampleValues: ['Active', 'Inactive'] },
          { name: 'doj', type: 'TEXT', description: 'Date of joining' },
          { name: 'marital_status', type: 'TEXT', description: 'Marital status' }
        ]
      },
      {
        tableName: 'engagement',
        description: 'Employee engagement scores and HRBP feedback',
        examples: [
          'What is the average engagement score?',
          'How many employees have green HRBP tagging?',
          'Show engagement scores by team'
        ],
        columns: [
          { name: 'name', type: 'TEXT', description: 'Employee name' },
          { name: 'engagement_score', type: 'INTEGER', description: 'Engagement score out of 100' },
          { name: 'hrbp_tagging', type: 'TEXT', description: 'HRBP feedback (Green/Amber/Red)', sampleValues: ['Green', 'Amber', 'Red'] }
        ]
      },
      {
        tableName: 'performance',
        description: 'Employee performance ratings and aspirations',
        examples: [
          'How many employees exceed expectations?',
          'What are the common career aspirations?',
          'Show performance ratings by level'
        ],
        columns: [
          { name: 'emp_id', type: 'TEXT', description: 'Employee ID' },
          { name: 'performance_rating', type: 'TEXT', description: 'Performance rating', sampleValues: ['Exceeds Expectations', 'Meets Expectations', 'Needs Improvement'] },
          { name: 'potential_rating', type: 'INTEGER', description: 'Potential rating (1-5 scale)' },
          { name: 'short_term_aspiration', type: 'TEXT', description: 'Short term career aspiration' },
          { name: 'long_term_aspiration', type: 'TEXT', description: 'Long term career aspiration' }
        ]
      }
    ];
  }

  public getMetadata(): TableMetadata[] {
    return this.metadata;
  }

  public async executeQuery(sql: string): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this.db.all(sql, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  public async getTableInfo(tableName: string): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this.db.all(`PRAGMA table_info(${tableName})`, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  public async getSampleData(tableName: string, limit: number = 5): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this.db.all(`SELECT * FROM ${tableName} LIMIT ${limit}`, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  public close() {
    this.db.close();
  }
} 