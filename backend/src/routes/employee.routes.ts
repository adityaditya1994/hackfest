import { Router } from 'express';
import { 
  getAllEmployees, 
  getEmployeeById, 
  getEmployeesByLevel, 
  getTeamHierarchy,
  getOrganizationalChart,
  getEmployeePersonalData
} from '../controllers/employee.controller';

const router = Router();

// Get all employees (with optional hierarchy filtering)
router.get('/', getAllEmployees);

// Get organizational chart
router.get('/orgchart', getOrganizationalChart);

// Get employees by level
router.get('/level/:level', getEmployeesByLevel);

// Get employee by ID
router.get('/:empId', getEmployeeById);

// Get employee personal data (aspirations, potentials, etc.)
router.get('/:empId/personal', getEmployeePersonalData);

// Get team hierarchy for a specific employee
router.get('/:empId/hierarchy', getTeamHierarchy);

export default router; 