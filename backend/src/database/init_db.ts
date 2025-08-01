import sqlite3 from 'sqlite3';
import fs from 'fs';
import path from 'path';

const dbPath = path.resolve(__dirname, '../../hr_onemind.db');
const schemaPath = path.resolve(__dirname, './schema.sql');

// Create a new database connection
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err);
    process.exit(1);
  }
  console.log('Connected to SQLite database');
});

// Read and execute schema
const schema = fs.readFileSync(schemaPath, 'utf8');
const statements = schema
  .split(';')
  .map(statement => statement.trim())
  .filter(statement => statement.length > 0);

// Enable foreign keys
db.run('PRAGMA foreign_keys = ON');

// Execute each statement in series
db.serialize(() => {
  statements.forEach(statement => {
    db.run(statement, (err) => {
      if (err) {
        console.error('Error executing statement:', err);
        console.error('Statement:', statement);
      }
    });
  });
  
  console.log('Database schema created successfully');
});

// Close the database connection
db.close((err) => {
  if (err) {
    console.error('Error closing database:', err);
    process.exit(1);
  }
  console.log('Database connection closed');
}); 