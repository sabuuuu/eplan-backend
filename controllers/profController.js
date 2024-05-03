import express from 'express';
import {Prof} from '../models/profModel.js'


//ajouter un prof
export const addProf = async (req, res) => {
    try {
        if (!req.body.matricule || !req.body.birthdate || !req.body.name || !req.body.surname) {
            return res.status(400).json({message: "Veuillez remplir tous les champs"});
        }
        const user_id = req.user._id;
        const newProf = {
            matricule: req.body.matricule,
            birthdate: req.body.birthdate,
            name: req.body.name,
            surname: req.body.surname,
            grade: req.body.grade,
            dispo: req.body.dispo,
            user_id
        }

        const prof = await Prof.create(newProf);
        res.status(201).send(prof);
    } catch (error) {
        console.log(error);
        res.status(500).json({error: error.message});
    }
}

//modifier un prof
export const updateProf = async (req, res) => {
    try {
        if (!req.body.matricule || !req.body.birthdate || !req.body.name || !req.body.surname) {
            return res.status(400).json({message: "Veuillez remplir tous les champs"});
        }
        const {id} = req.params;
        const updatedFields = {
            matricule: req.body.matricule,
            birthdate: req.body.birthdate,
            name: req.body.name,
            surname: req.body.surname,
            grade: req.body.grade,
            dispo: req.body.dispo
        };
        const prof = await Prof.findByIdAndUpdate(id, updatedFields);
        if (!prof) {
            return res.status(404).json({message: "Prof non trouvée"});
        }
        return res.status(200).send(prof);
    } catch (error) {
        console.log(error);
        res.status(500).json({error: error.message});
    }    
}

//supprimer un prof
export const deleteProf = async (req, res) => {
    try {
        const {id} = req.params;
        const prof = await Prof.findByIdAndDelete(id);
        if (!prof) {
            return res.status(404).json({message: "Prof non trouvée"});
        }
        return res.status(200).send(prof);
    } catch (error) {
        console.log(error);
        res.status(500).json({error: error.message});
    }
}

//afficher tous les profs
export const getAllProfs = async (req, res) => {
    try{
        const profs = await Prof.find({});
        return res.status(200).json({
            count : profs.length,
            data : profs
        });
    }catch(err){
        console.log(err.message);
        res.status(500).send({message: err.message});
    }
}

//afficher un prof
export const getProf = async (req, res) => {
    try {
        const {id} = req.params;
        const prof = await Prof.findById(id);
        return res.status(200).json({
            data: prof
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({error: error.message});
    }
}

import { requireProfAuth } from '../middleware/requireAuth.js';

import jwt from "jsonwebtoken";
import {JWT_SECRET} from "../config.js"
const createToken = (_id) => {
    return jwt.sign({_id}, JWT_SECRET, {expiresIn: '30d'})
}

const router = express.Router();


//login prof
export const loginProf = async (req, res) => {
    const {matricule, birthdate} = req.body;

    try{
        const user = await Prof.login(matricule, birthdate);
        //create token
        const token = createToken(user._id);

        res.status(200).json({
            matricule , token , user
        })
    }catch(error){
        res.status(400).json({
            error : error.message
        })
    }
};
router.use(requireProfAuth);

export const modifyDisponibilities = async (req, res) => {
    try {
        const { id } = req.params;

        // Find the professor by ID
        const prof = await Prof.findById(id);
        if (!prof) {
            return res.status(404).json({ message: 'Prof not found' });
        }

        // Add new disponibilities
        prof.dispo.push(req.body.dispo);

        // Save the changes to the database
        await prof.save();

        res.status(200).json({ message: 'Disponibilities added successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error adding disponibilities' });
    }
};

//modifer une disponibilité
export const addDisponibilities = async (req, res) => {
    try {
        const { id } = req.params;
        const { disponibilityId } = req.body; // New disponibility ID to modify
        const updatedDisponibility = req.body.dispo; // Updated disponibility object

        // Find the professor by ID
        const prof = await Prof.findById(id);
        if (!prof) {
            return res.status(404).json({ message: 'Prof not found' });
        }

        // Find the index of the disponibility to modify
        const index = prof.dispo.findIndex(dispo => dispo._id === disponibilityId);
        if (index === -1) {
            return res.status(404).json({ message: 'Disponibility not found' });
        }

        // Update the disponibility at the specified index
        prof.dispo[index] = updatedDisponibility;

        // Save the changes to the database
        await prof.save();

        res.status(200).json({ message: 'Disponibility modified successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error modifying disponibility' });
    }
};


//get disponibilities
export const getDisponibilities = async (req, res) => {
    try {
        const { id } = req.params;

        // Find the professor by ID
        const prof = await Prof.findById(id);
        if (!prof) {
            return res.status(404).json({ message: 'Prof not found' });
        }

        // Return the disponibilities
        res.status(200).json({ disponibilities: prof.dispo });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching disponibilities' });
    }
};

//supprimer une disponibilité
export const deleteDisponibility = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the disponibility by ID and delete it
    await Prof.findOneAndUpdate(
      { _id: req.user._id },
      { $pull: { dispo: { _id: id } } }
    );

    res.status(200).json({ message: 'Disponibility deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};