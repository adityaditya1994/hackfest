import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse';
import { db } from './db';

const DATA_DIR = path.resolve(__dirname, '../../../data');

// Helper function to parse CSV files
async function parseCSV(filePath: string): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const results: any[] = [];
    fs.createReadStream(filePath)
      .pipe(parse({
        columns: true,
        skip_empty_lines: true,
        trim: true,
      }))
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', (error) => reject(error));
  });
}

async function loadEmployees() {
  console.log('Loading employee data...');
  const filePath = path.join(DATA_DIR, 'Master Data UPDATED.csv');
  const data = await parseCSV(filePath);
  
  const stmt = db.prepare(`
    INSERT INTO employees (
      emp_id, name, last_name, full_name, emp_type, status,
      doj, gender, level, sub_level, designation, department,
      team, skills, location, manager_id, manager_name,
      resignation_date, exit_type, exit_reason, tenure,
      tenure_range, dob, birthday_month, age, age_group,
      marital_status, highest_qualification, education_degree,
      campus, tier, past_experience, total_experience, salary
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const row of data) {
    try {
      stmt.run([
        row['Emp ID'],
        row['Name'],
        row['Last Name'],
        row['Full Name'],
        row['Emp Type'],
        row['Status'],
        row['DOJ (DTDL)'],
        row['Gender'],
        row['Level'],
        row['SUB LEVEL'],
        row['Designation'],
        row['Department'],
        row['Team (Value Stream)'],
        row['Skills'],
        row['Location'],
        row['Manager ID'],
        row['Manager Name'],
        row['Date of Resignation'],
        row['Type of exit (Voluntary/Involuntary)'],
        row['Reason of leaving'],
        row['Tenure'],
        row['Tenure Range'],
        row['DOB'],
        row['Birthday Month'],
        parseInt(row['Age']) || null,
        row['Age Group'],
        row['Marital Status'],
        row['Highest Qualification'],
        row['Education Qualification/Degree'],
        row['Campus/Collage'],
        row['Tier'],
        row['Past Experience'],
        row['Total Exp.'],
        row['Salary']
      ]);
    } catch (error) {
      console.error(`Error inserting employee ${row['Emp ID']}:`, error);
    }
  }
}

async function loadEngagement() {
  console.log('Loading engagement data...');
  const filePath = path.join(DATA_DIR, 'Amber data.csv');
  const data = await parseCSV(filePath);
  
  const stmt = db.prepare(`
    INSERT INTO engagement (
      emp_id, name, last_name, full_name, emp_type,
      designation, manager_name, engagement_score,
      ptm, hrbp_tagging
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const row of data) {
    try {
      stmt.run([
        row['Emp ID'],
        row['Name'],
        row['Last Name'],
        row['Full Name'],
        row['Emp Type'],
        row['Designation'],
        row['Manager Name'],
        parseInt(row['Engagement Score']) || null,
        parseInt(row['PTM']) || null,
        row['HRBP Tagging']
      ]);
    } catch (error) {
      console.error(`Error inserting engagement data for ${row['Emp ID']}:`, error);
    }
  }
}

async function loadPerformanceAndOKR() {
  console.log('Loading performance and OKR data...');
  const filePath = path.join(DATA_DIR, 'Perfromance & OKR UPDATED.csv');
  const data = await parseCSV(filePath);
  
  const perfStmt = db.prepare(`
    INSERT OR IGNORE INTO performance (
      emp_id, performance_rating, goals_completion,
      overall_rating, potential_rating,
      short_term_aspiration, short_term_status,
      long_term_aspiration, long_term_status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const okrStmt = db.prepare(`
    INSERT OR IGNORE INTO okrs (
      okr_id, emp_id, okr_year, okr_title,
      value_stream, key_results, status, progress
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const row of data) {
    try {
      // Insert performance data
      perfStmt.run([
        row['Emp ID'],
        row['performance_rating'],
        parseInt(row['goals_completion']) || null,
        parseInt(row['Performance Rating']) || null,
        parseInt(row['Overall Potential Rating']) || null,
        row['Short Term Aspiration'],
        row['Status Short Term Aspiration'],
        row['Long Term Aspiration'],
        row['Status Long Term Aspiration']
      ]);

      // Insert OKR data if okr_id exists
      if (row['okr_id']) {
        okrStmt.run([
          row['okr_id'],
          row['Emp ID'],
          parseInt(row['okr year']) || null,
          row['okr_title'],
          row['value_stream'],
          row['key results'],
          row['Status'],
          parseInt(row['progress']) || null
        ]);
      }
    } catch (error) {
      console.error(`Error inserting performance/OKR data for ${row['Emp ID']}:`, error);
    }
  }
}

async function loadHiringData() {
  console.log('Loading hiring data...');
  const reqFilePath = path.join(DATA_DIR, 'New Hire Req.csv');
  const offerFilePath = path.join(DATA_DIR, 'Offer Data.csv');
  
  const reqData = await parseCSV(reqFilePath);
  const offerData = await parseCSV(offerFilePath);

  const reqStmt = db.prepare(`
    INSERT OR IGNORE INTO hiring_requisitions (
      requisition_id, position_title, department,
      location, experience_required, status,
      created_date, hiring_manager_id, budget_range
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const offerStmt = db.prepare(`
    INSERT OR IGNORE INTO offers (
      offer_id, requisition_id, candidate_name,
      offer_date, status, expected_joining_date,
      offered_salary, accepted_date
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const row of reqData) {
    try {
      reqStmt.run([
        row['Requisition ID'],
        row['Position'],
        row['Department'],
        row['Location'],
        row['Experience Required'],
        row['Status'],
        row['Created Date'],
        row['Hiring Manager ID'],
        row['Budget Range']
      ]);
    } catch (error) {
      console.error(`Error inserting requisition ${row['Requisition ID']}:`, error);
    }
  }

  for (const row of offerData) {
    try {
      offerStmt.run([
        row['Offer ID'],
        row['Requisition ID'],
        row['Candidate Name'],
        row['Offer Date'],
        row['Status'],
        row['Expected Joining Date'],
        row['Offered Salary'],
        row['Acceptance Date']
      ]);
    } catch (error) {
      console.error(`Error inserting offer ${row['Offer ID']}:`, error);
    }
  }
}

async function loadData() {
  try {
    console.log('Starting data load...');
    
    // Enable foreign keys
    db.run('PRAGMA foreign_keys = ON');
    
    // Begin transaction
    db.run('BEGIN TRANSACTION');

    await loadEmployees();
    await loadEngagement();
    await loadPerformanceAndOKR();
    await loadHiringData();

    // Commit transaction
    db.run('COMMIT');
    
    console.log('Data load completed successfully');
  } catch (error) {
    // Rollback on error
    db.run('ROLLBACK');
    console.error('Error loading data:', error);
    process.exit(1);
  }
}

// Run the data loading
loadData(); 