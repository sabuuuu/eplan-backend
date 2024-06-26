import express  from 'express';
import {
    addSalle, 
    updateSalle, 
    deleteSalle, 
    getAllSalles,
    getSalle
} from '../controllers/salleController.js';
import { requireAuth } from '../middleware/requireAuth.js';


const router = express.Router();
router.use(requireAuth);

//route pour ajouter une Salle
router.post('/', addSalle);

//route pour modifier une Salle
router.put('/:id', updateSalle);

//route pour supprimer une Salle
router.delete('/:id', deleteSalle);

//route to get all Salles
router.get('/all', getAllSalles);

//route pour afficher une Salle
router.get('/:id', getSalle);


export default router