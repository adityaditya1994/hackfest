-- Drop existing tables if they exist
DROP TABLE IF EXISTS offers;
DROP TABLE IF EXISTS hiring_requisitions;
DROP TABLE IF EXISTS leave_records;
DROP TABLE IF EXISTS okrs;
DROP TABLE IF EXISTS performance;
DROP TABLE IF EXISTS engagement;
DROP TABLE IF EXISTS employees;

-- Master Employee Data
CREATE TABLE IF NOT EXISTS employees (
    emp_id TEXT PRIMARY KEY,
    name TEXT,
    last_name TEXT,
    full_name TEXT,
    emp_type TEXT,
    status TEXT,
    doj TEXT,  -- DOJ (DTDL)
    gender TEXT,
    level TEXT,
    sub_level TEXT,
    designation TEXT,
    department TEXT,
    team TEXT,  -- Team (Value Stream)
    skills TEXT,
    location TEXT,
    manager_id TEXT,
    manager_name TEXT,
    resignation_date TEXT,  -- Date of Resignation
    exit_type TEXT,  -- Type of exit (Voluntary/Involuntary)
    exit_reason TEXT,  -- Reason of leaving
    tenure TEXT,
    tenure_range TEXT,
    dob TEXT,
    birthday_month TEXT,
    age INTEGER,
    age_group TEXT,
    marital_status TEXT,
    highest_qualification TEXT,
    education_degree TEXT,  -- Education Qualification/Degree
    campus TEXT,  -- Campus/Collage
    tier TEXT,
    past_experience TEXT,  -- Past Experience
    total_experience TEXT,  -- Total Exp.
    salary TEXT
);

-- Engagement Data (Amber)
CREATE TABLE IF NOT EXISTS engagement (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    emp_id TEXT,
    name TEXT,
    last_name TEXT,
    full_name TEXT,
    emp_type TEXT,
    designation TEXT,
    manager_name TEXT,
    engagement_score INTEGER,
    ptm INTEGER,
    hrbp_tagging TEXT,
    FOREIGN KEY (emp_id) REFERENCES employees(emp_id)
);

-- Performance Data
CREATE TABLE IF NOT EXISTS performance (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    emp_id TEXT,
    performance_rating TEXT,
    goals_completion INTEGER,
    overall_rating INTEGER,
    potential_rating INTEGER,
    short_term_aspiration TEXT,
    short_term_status TEXT,
    long_term_aspiration TEXT,
    long_term_status TEXT,
    FOREIGN KEY (emp_id) REFERENCES employees(emp_id)
);

-- OKR Data
CREATE TABLE IF NOT EXISTS okrs (
    okr_id TEXT PRIMARY KEY,
    emp_id TEXT,
    okr_year INTEGER,
    okr_title TEXT,
    value_stream TEXT,
    key_results TEXT,
    status TEXT,
    progress INTEGER,
    FOREIGN KEY (emp_id) REFERENCES employees(emp_id)
);

-- Leave Data
CREATE TABLE IF NOT EXISTS leave_records (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    emp_id TEXT,
    leave_type TEXT,
    start_date TEXT,
    end_date TEXT,
    duration FLOAT,
    status TEXT,
    FOREIGN KEY (emp_id) REFERENCES employees(emp_id)
);

-- Hiring Data
CREATE TABLE IF NOT EXISTS hiring_requisitions (
    requisition_id TEXT PRIMARY KEY,
    position_title TEXT,
    department TEXT,
    location TEXT,
    experience_required TEXT,
    status TEXT,
    created_date TEXT,
    hiring_manager_id TEXT,
    budget_range TEXT,
    FOREIGN KEY (hiring_manager_id) REFERENCES employees(emp_id)
);

CREATE TABLE IF NOT EXISTS offers (
    offer_id TEXT PRIMARY KEY,
    requisition_id TEXT,
    candidate_name TEXT,
    offer_date TEXT,
    status TEXT,
    expected_joining_date TEXT,
    offered_salary TEXT,
    accepted_date TEXT,
    FOREIGN KEY (requisition_id) REFERENCES hiring_requisitions(requisition_id)
); 