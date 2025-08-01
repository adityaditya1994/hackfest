import sqlite3 from 'sqlite3';
import { Database } from 'sqlite3';
import path from 'path';

const dbPath = path.resolve(__dirname, '../../hr_onemind.db');

export const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err);
    return;
  }
  console.log('Connected to SQLite database');
  
  // Enable foreign keys
  db.run('PRAGMA foreign_keys = ON');
  
  // Create tables if they don't exist
  createTables();
});

function createTables() {
  const tables = [
    `CREATE TABLE IF NOT EXISTS employees (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      employee_id TEXT UNIQUE,
      name TEXT NOT NULL,
      email TEXT UNIQUE,
      role TEXT,
      department TEXT,
      location TEXT,
      joining_date DATE,
      reporting_manager TEXT,
      gender TEXT,
      experience FLOAT,
      education TEXT
    )`,
    
    `CREATE TABLE IF NOT EXISTS performance (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      employee_id TEXT,
      rating FLOAT,
      review_date DATE,
      review_type TEXT,
      reviewer TEXT,
      comments TEXT,
      FOREIGN KEY (employee_id) REFERENCES employees(employee_id)
    )`,
    
    `CREATE TABLE IF NOT EXISTS engagement (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      employee_id TEXT,
      survey_date DATE,
      engagement_score FLOAT,
      satisfaction_score FLOAT,
      burnout_risk TEXT,
      comments TEXT,
      FOREIGN KEY (employee_id) REFERENCES employees(employee_id)
    )`,
    
    `CREATE TABLE IF NOT EXISTS skills (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      employee_id TEXT,
      skill_name TEXT,
      proficiency_level TEXT,
      last_used DATE,
      is_primary BOOLEAN,
      FOREIGN KEY (employee_id) REFERENCES employees(employee_id)
    )`,
    
    `CREATE TABLE IF NOT EXISTS positions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      position_id TEXT UNIQUE,
      title TEXT NOT NULL,
      department TEXT,
      location TEXT,
      hiring_manager TEXT,
      status TEXT,
      opened_date DATE,
      salary_range TEXT,
      experience_required FLOAT,
      skills_required TEXT
    )`,
    
    `CREATE TABLE IF NOT EXISTS applications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      position_id TEXT,
      candidate_name TEXT,
      application_date DATE,
      status TEXT,
      current_stage TEXT,
      source TEXT,
      FOREIGN KEY (position_id) REFERENCES positions(position_id)
    )`,
    
    `CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE,
      password TEXT,
      role TEXT,
      department TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`
  ];

  db.serialize(() => {
    tables.forEach(table => {
      db.run(table, (err) => {
        if (err) {
          console.error('Error creating table:', err);
        }
      });
    });
  });
}

// Helper function to run queries with Promise support
export function runQuery<T>(query: string, params: any[] = []): Promise<T> {
  return new Promise((resolve, reject) => {
    db.all(query, params, (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(rows as T);
    });
  });
}

// Helper function for single row queries
export function getOne<T>(query: string, params: any[] = []): Promise<T | null> {
  return new Promise((resolve, reject) => {
    db.get(query, params, (err, row) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(row as T || null);
    });
  });
}

// Helper function for insert/update/delete operations
export function run(query: string, params: any[] = []): Promise<void> {
  return new Promise((resolve, reject) => {
    db.run(query, params, (err) => {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });
  });
} 