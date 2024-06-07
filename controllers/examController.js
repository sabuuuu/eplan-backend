import express from 'express';
import {Exam} from '../models/examModel.js'
import { Prof } from '../models/profModel.js';
import {Salle} from '../models/salleModel.js';
import { requireAuth } from '../middleware/requireAuth.js';
import nodemailer from 'nodemailer';
import mongoose from 'mongoose';
const router = express.Router();

router.use(requireAuth);

const emailBody = `
<div style="font-family: Helvetica, Arial, sans-serif; min-width: 1000px; overflow: auto; line-height: 2">
    <div style="margin: 50px auto; width: 70%; padding: 20px 0">
        <div style="border-bottom: 1px solid #eee">
            <a href="https://e-plan-prof.vercel.app/" style="font-size: 1.4em; color: #00466a; text-decoration: none; font-weight: 600">E-Plan</a>
        </div>
        <p style="font-size: 1.1em">Bonjour,</p>
        <p>
            Nous souhaitons vous informer qu'un planning d'examen auquel vous êtes concerné en tant que surveillant a été établi. 
            Vous pouvez consulter ce planning en ligne sur notre site web.
        </p>
        <p>
            Veuillez cliquer sur le lien suivant pour accéder au planning des examens : 
            <a href="https://e-plan-prof.vercel.app/" style="color: #00466a; text-decoration: none; font-weight: 600">Consulter le planning</a>
        </p>
        <p>Merci pour votre collaboration et votre engagement.</p>
        <p>Cordialement,</p>
        <p>L'équipe E-Plan</p>
    </div>
</div>
`;

const emailSender = async (email) => {
    try{
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth : {
                user : 'eplanning06@gmail.com',
                pass : 'cyek nnam lgwn weur'
            },
        });
    
        const mailOptions = {
            from : 'eplanning06@gmail.com',
            to : email,
            subject : 'Planning d\'examen',
            html : emailBody
        };
        const info = await transporter.sendMail(mailOptions);
        console.log("message envoyé : " + info.messageId);
    }
    catch(error){
        console.log(error);
    }
}

//route pour ajouter un exam
export const addExam = async(req, res) => {
    try {
        if (!req.body.name || !req.body.date || !req.body.time || !req.body.profs || !req.body.salle) {
            return res.status(400).json({message: "Veillez remplir tous les champs"})
        }
        const newExam = {
            _id: req.body._id,
            name: req.body.name,
            date: req.body.date,
            time: req.body.time,
            profs: req.body.profs,
            salle: req.body.salle,
        }

        const professors = await Prof.find({ _id: { $in: req.body.profs } });
        const emails = professors.map(prof => prof.email);

        // Send emails to all professors
        emails.forEach(email => {
            emailSender(email);
        });
        
        const exam = await Exam.create(newExam)
        res.status(201).send(exam)
    } catch (error) {
        console.log(error)
        res.status(500).json({error: error.message})
    }
}

//route pour modifier un exam
export const updateExam = async (req, res) => {
    try {
        if (!req.body.name || !req.body.date || !req.body.time || !req.body.profs || !req.body.salle) {
            return res.status(400).json({message: "Veillez remplir tous les champs"});
        }
        const {id} = req.params;
        const updatedFields = {
            name: req.body.name,
            date: req.body.date,
            time: req.body.time,
            profs: req.body.profs,
            salle: req.body.salle
        };
        const exam = await Exam.findByIdAndUpdate(id, updatedFields);
        if (!exam) {
            return res.status(404).json({message: "Examen non trouvé"});
        }
        return res.status(200).json({message: "Examen mis à jour"});
    } catch (error) {
        console.log(error);
        res.status(500).json({error: error.message});
    }
}

//route pour supprimer un exam
export const deleteExam = async (req, res) => {
    try {
        const {id} = req.params;
        const exam = await Exam.findByIdAndDelete(id);
        if (!exam) {
            return res.status(404).json({message: "Examen non trouvé"});
        }
        return res.status(200).json({message: "Examen supprimé"});
    } catch (error) {
        console.log(error);
        res.status(500).json({error: error.message});
    }
}

//route pour afficher tous les examens
export const getExams = async (req, res) => {
    try {
        const exams = await Exam.find();
        return res.status(200).json({
            count: exams.length,
            data: exams
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({error: error.message});
    }
}

//route pour afficher un exam
export const getExam = async (req, res) => {
    try {
        const {id} = req.params;
        const exam = await Exam.findById(id);
        if (!exam) {
            return res.status(404).json({message: "Examen non trouvé"});
        }
        return res.status(200).send(exam);
    } catch (error) {
        console.log(error);
        res.status(500).json({error: error.message});
    }
}

//search available profs and salles for an exam
export const getAvailableProfsAndSalles = async (req, res) => {
    const { date, dayOfWeek, startTime, endTime } = req.query;
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    try {
        const availableProfessors = await Prof.find({
            dispo: { $elemMatch: { jour: daysOfWeek[dayOfWeek], debut: { $lt: endTime }, fin: { $gt: startTime } } },
            exams: { $nin: await Prof.aggregate([
              { $unwind: '$exams' }, // Unwind exams array
              { $match: { 'exams.time.debut': { $lt: endTime }, 'exams.time.fin': { $gt: startTime } } },  
            ]) },
          });
          
      res.status(200).json({ professors: availableProfessors});
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error checking availability' });
    }
}