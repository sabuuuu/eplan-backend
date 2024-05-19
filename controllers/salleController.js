import express from 'express';
import {Salle} from '../models/salleModel.js';
import { requireAuth } from '../middleware/requireAuth.js';

const router = express.Router();

router.use(requireAuth);

//route pour ajouter une Salle
export const addSalle = async (req, res) => {  
    try {
        if (!req.body.num || !req.body.type || !req.body.capacite ){
            return res.status(400).json({message: "Numéro et type sont obligatoires"});
        }

        const newSalle = {
            num: req.body.num,
            type: req.body.type,
            batiment: req.body.batiment,
            capacite: req.body.capacite,
        };

        const salle = await Salle.create(newSalle);
        res.status(201).json(salle);
    }catch (error) {
        console.log(error);    
        res.status(500).json({error: error.message});
    }
};

//route pour modifier une Salle
export const updateSalle = async (req, res) => {
    try {
        if (!req.body.num || !req.body.type) {
            return res.status(400).json({message: "Numéro et type sont obligatoires"});
        }
        const {id} = req.params;

        const updatedFields = {
            num: req.body.num,
            type: req.body.type,
            batiment: req.body.batiment
            ,capacite: req.body.capacite
        };
        const salle = await Salle.findByIdAndUpdate(id, updatedFields);
        if (!salle) {
            return res.status(404).json({message: "Salle non trouvée"});
        }
        return res.status(200).send(salle);
    }catch (error) {
        console.log(error);
        res.status(500).json({error: error.message});
    }
}

//route pour supprimer une Salle    
export const deleteSalle = async (req, res) => {
    try {
        const {id} = req.params;
        const salle = await Salle.findByIdAndDelete(id);
        if (!salle) {
            return res.status(404).json({message: "Salle non trouvée"});
        }
        return res.status(200).json({message: "Salle supprimée"});
    }catch (error) {
        console.log(error);
        res.status(500).json({error: error.message});
    }
}

//route to get all Salles
export const getAllSalles = async (req, res) => {
    try {
        const salles = await Salle.find({});
        return res.status(200).json({
            count : salles.length,
            data : salles
        });
    }catch (error) {
        console.log(error);
        res.status(500).json({error: error.message});
    }
}

//route to get one Salle
export const getSalle = async (req, res) => {
    try {
        const {id} = req.params;
        const salle = await Salle.findById(id);
        console.log(salle);
        if (!salle) {
            return res.status(404).json({message: "Salle non trouvée"});
        }
        return res.status(200).json(salle);
    }catch (error) {
        console.log(error);
        res.status(500).json({error: error.message});
    }
}