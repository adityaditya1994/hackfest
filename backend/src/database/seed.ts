import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse';
import { db, run } from './db';

const DATA_DIR = path.resolve(__dirname, '../../../data');

interface CSVMapping {
  fileName: string;
  tableName: string;
  transform?: (record: any) => any;
}

const csvMappings: CSVMapping[] = [
  {
    fileName: 'employees.csv',
    tableName: 'employees',
    transform: (record) => ({
      ...record,
      joining_date: new Date(record.joining_date).toISOString(),
    }),
  },
  {
    fileName: 'performance.csv',
    tableName: 'performance',
    transform: (record) => ({
      ...record,
      review_date: new Date(record.review_date).toISOString(),
    }),
  },
  {
    fileName: 'engagement.csv',
    tableName: 'engagement',
    transform: (record) => ({
      ...record,
      survey_date: new Date(record.survey_date).toISOString(),
    }),
  },
  {
    fileName: 'skills.csv',
    tableName: 'skills',
    transform: (record) => ({
      ...record,
      last_used: record.last_used ? new Date(record.last_used).toISOString() : null,
      is_primary: record.is_primary === 'true',
    }),
  },
  {
    fileName: 'positions.csv',
    tableName: 'positions',
    transform: (record) => ({
      ...record,
      opened_date: new Date(record.opened_date).toISOString(),
    }),
  },
  {
    fileName: 'applications.csv',
    tableName: 'applications',
    transform: (record) => ({
      ...record,
      application_date: new Date(record.application_date).toISOString(),
    }),
  },
];

async function loadCSV(filePath: string): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const records: any[] = [];
    fs.createReadStream(filePath)
      .pipe(parse({
        columns: true,
        skip_empty_lines: true,
      }))
      .on('data', (record) => records.push(record))
      .on('end', () => resolve(records))
      .on('error', reject);
  });
}

async function insertRecords(tableName: string, records: any[]): Promise<void> {
  if (records.length === 0) return;

  const columns = Object.keys(records[0]);
  const placeholders = columns.map(() => '?').join(',');
  const query = `INSERT INTO ${tableName} (${columns.join(',')}) VALUES (${placeholders})`;

  for (const record of records) {
    const values = columns.map(col => record[col]);
    try {
      await run(query, values);
    } catch (error) {
      console.error(`Error inserting record into ${tableName}:`, error);
      console.error('Record:', record);
    }
  }
}

async function seedDatabase() {
  console.log('Starting database seeding...');

  for (const mapping of csvMappings) {
    const filePath = path.join(DATA_DIR, mapping.fileName);
    
    try {
      if (!fs.existsSync(filePath)) {
        console.warn(`Warning: ${mapping.fileName} not found in data directory`);
        continue;
      }

      console.log(`Loading data from ${mapping.fileName}...`);
      let records = await loadCSV(filePath);
      
      if (mapping.transform) {
        records = records.map(mapping.transform);
      }

      console.log(`Inserting ${records.length} records into ${mapping.tableName}...`);
      await insertRecords(mapping.tableName, records);
      console.log(`Completed loading ${mapping.fileName}`);
    } catch (error) {
      console.error(`Error processing ${mapping.fileName}:`, error);
    }
  }

  console.log('Database seeding completed');
}

// Create admin user
async function createAdminUser() {
  const adminUser = {
    email: 'admin@hronemind.com',
    password: '$2a$10$xxxxxxxxxxx', // This should be properly hashed
    role: 'admin',
    department: 'HR',
  };

  try {
    await run(
      'INSERT OR IGNORE INTO users (email, password, role, department) VALUES (?, ?, ?, ?)',
      [adminUser.email, adminUser.password, adminUser.role, adminUser.department]
    );
    console.log('Admin user created or already exists');
  } catch (error) {
    console.error('Error creating admin user:', error);
  }
}

// Run the seeding process
db.serialize(async () => {
  try {
    await seedDatabase();
    await createAdminUser();
    console.log('All seeding operations completed');
    process.exit(0);
  } catch (error) {
    console.error('Error during seeding:', error);
    process.exit(1);
  }
}); 