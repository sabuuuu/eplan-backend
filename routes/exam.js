import express  from 'express';
import {
    addExam,
    deleteExam,
    getExams,
    updateExam,
    getExam,
    getAvailableProfsAndSalles
} from '../controllers/examController.js';
import { requireAuth } from '../middleware/requireAuth.js';


const router = express.Router();
router.use(requireAuth);

//route pour ajouter un exam
router.post('/', addExam);

//route pour modifier un exam
router.put('/:id', updateExam);

//route pour supprimer un exam
router.delete('/:id', deleteExam);

//route to get all exams
router.get('/', getExams);

//route pour afficher un exam
router.get('/:id', getExam);

//route to get all available profs and salles
router.get('/search', getAvailableProfsAndSalles);

export default router;