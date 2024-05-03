import express  from 'express';
import {
    addProf, 
    updateProf, 
    deleteProf, 
    getAllProfs,
    getProf,
    loginProf,
    modifyDisponibilities,
    getDisponibilities ,
    deleteDisponibility  ,
    addDisponibilities
} from '../controllers/profController.js';
import { requireAuth } from '../middleware/requireAuth.js';


const router = express.Router();
router.use(requireAuth);


//route pour ajouter un prof
router.post('/', addProf);

//route pour modifier un prof
router.put('/:id', updateProf);

//route pour supprimer un prof
router.delete('/:id', deleteProf);

//route to get all profs
router.get('/all', getAllProfs);

//route pour afficher un prof
router.get('/:id', getProf);

//route pour se connecter
router.post('/loginprof', loginProf);

//route pour ajouter la disponibilité d'un prof
router.put('/dispo/:id', modifyDisponibilities);

//route pour afficher la disponibilité d'un prof
router.get('/dispo/:id', getDisponibilities);

//route pour supprimer la disponibilité d'un prof
router.delete('/prof/:profId/dispo/:disponibilityId', deleteDisponibility);

//route pour modifier la disponibilité d'un prof
router.put('/dispo/modifier/:id', modifyDisponibilities);

export default router