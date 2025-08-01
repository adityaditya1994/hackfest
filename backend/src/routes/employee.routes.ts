import { Router } from 'express';
import { 
  getAllEmployees, 
  getEmployeeById, 
  getEmployeesByLevel, 
  getTeamHierarchy 
} from '../controllers/employee.controller';

const router = Router();

router.get('/', getAllEmployees);
router.get('/level/:level', getEmployeesByLevel);
router.get('/:empId', getEmployeeById);
router.get('/:empId/hierarchy', getTeamHierarchy);

export default router; 