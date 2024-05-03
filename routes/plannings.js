import express  from 'express';
import {
    addPlanning,
    updatePlanning,
    deletePlanning,
    // getPlanning,
    getPlannings,
    generateSchedule
} from '../controllers/planningController.js';
import { requireAuth } from '../middleware/requireAuth.js';

const router = express.Router();
router.use(requireAuth);


//route pour ajouter un planning
router.post('/', addPlanning);

//route pour modifier un planning
router.put('/:id', updatePlanning);

//route pour supprimer un planning
router.delete('/:id', deletePlanning);

// //route pour afficher un planning
// router.get('/:id', getPlanning);

//route to get all plannings
router.get('/', getPlannings);

//route pour generer un planning
router.post('/generate', generateSchedule);


export default router