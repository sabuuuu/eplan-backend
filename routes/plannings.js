import express from 'express';
import {
    addPlanning,
    updatePlanning,
    deletePlanning,
    getPlanningFiltre,
    getAllPlannings,
    generateSchedule,
    getPlanning
} from '../controllers/planningController.js';
import { requireAuth } from '../middleware/requireAuth.js';

const router = express.Router();
router.use(requireAuth);

//route pour ajouter un planning
router.post('/', addPlanning);

//route to get all plannings
router.get('/all', getAllPlannings);

//route pour generer un planning
router.post('/generate', generateSchedule);

//route pour filtrer les plannings
router.get('/filtre', getPlanningFiltre);

//route pour modifier un planning
router.put('/:id', updatePlanning);

//route pour supprimer un planning
router.delete('/:id', deletePlanning);

//route pour afficher un planning
router.get('/:id', getPlanning);

export default router;