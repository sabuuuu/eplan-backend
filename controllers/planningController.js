import express from 'express';
import {Planning} from '../models/planningModel.js';
import { Prof } from '../models/profModel.js';
import {Salle} from '../models/salleModel.js';
import {Exam} from '../models/examModel.js'
import { requireAuth } from '../middleware/requireAuth.js';

import moment from 'moment/moment.js';
import { ObjectId } from 'mongodb';

const router = express.Router();

router.use(requireAuth);

//route ajouter un planning
export const addPlanning = async (req, res) => {
    try {
        if (!req.body.exams || !req.body.faculte || !req.body.departement || !req.body.filiere || !req.body.annee || !req.body.semestre || !req.body.type) {
            return res.status(400).json({ message: "Veillez remplir tous les champs" });
        }
        const newPlanning = {
            exams: req.body.exams,
            faculte: req.body.faculte,
            departement: req.body.departement,
            filiere: req.body.filiere,
            annee: req.body.annee,
            semestre: req.body.semestre,
            type: req.body.type,
        }
        const planning = await Planning.create(newPlanning);
        res.status(201).send(planning);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
}

//route modifier un planning
export const updatePlanning = async (req, res) => {
    try {
        if (!req.body.exams ||!req.body.faculte || !req.body.departement || !req.body.filiere || !req.body.annee || !req.body.semestre || !req.body.type) {
            return res.status(400).json({ message: "Veillez remplir tous les champs" });
        }
        const { id } = req.params;
        const updatedFields = {
            exams: req.body.exams,
            faculte: req.body.faculte,
            departement: req.body.departement,
            filiere: req.body.filiere,
            annee: req.body.annee,
            semestre: req.body.semestre,
            type: req.body.type
        }
        const planning = await Planning.findByIdAndUpdate(id, updatedFields);
        if (!planning) {
            return res.status(404).json({ message: "Planning non trouvé" });
        }
        return res.status(200).send(planning);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
}

//route supprimer un planning
export const deletePlanning = async (req, res) => {
    try {
        const { id } = req.params;
        const planning = await Planning.findByIdAndDelete(id);
        if (!planning) {
            return res.status(404).json({ message: "Planning non trouvé" });
        }
        return res.status(200).json({ message: "Planning supprimé" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
}

//route afficher tous les plannings
export const getALLPlannings = async (req, res) => {
    try {
        const plannings = await Planning.find({});
        console.log(plannings);
        return res.status(200).json({ data: plannings ,count : plannings.length});
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
}

//route afficher un planning
export const getPlanningById= async (req, res) => {
    try {
        const { id } = req.params;
        const planning = await Planning.findById(id).populate({
            path: 'exams',
            populate: {
                path: 'prof',
                select: 'name',
            },
            populate: {
                path: 'salle',
                select: 'num type batiment',
            },
        });
        if (!planning) {
            return res.status(404).json({ message: "Planning non trouvé" });
        }
        return res.status(200).json({ data: planning });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
}

//generer un planning automatiquement avec les contraintes 

export const generateSchedule = async (req, res) => {
    try {
        const examNames = req.body.examNames;
        const profs = req.body.profs;
        const salles = req.body.salles;
        if (!examNames || !Array.isArray(examNames) || examNames.length === 0) {
            return res.status(400).json({ error: 'Invalid exam names provided' });
        }
        const exams = examNames.map(name => ({ _id: new ObjectId() ,name, time: '', date: '' , profs: [], salle: ''}));

        //Gerer les jour d'examinations en ignorant les jours Vendredi et Samedi avec les horaires
        let currentDate = new Date(); //Commencer par la date courante 
        const timeSlots = ["8h00-9h30", "9h40-11h10", "11h20-12h50", "13h00-14h30", "14h40-16h10"];
        shuffleArray(timeSlots);
        function shuffleArray(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
        }
        for (let i = 0; i < exams.length; i++) {
            let examDate = new Date(currentDate.getTime());
            do {
                examDate.setDate(examDate.getDate() + 2);
            } while (examDate.getDay() === 5 || examDate.getDay() === 6);
            exams[i].date = examDate.toISOString().split('T')[0];
            exams[i].time = getTimeSlot(i);
            currentDate.setDate(examDate.getDate() + 1);  
        }
        function getTimeSlot(index) {
            return timeSlots[index % timeSlots.length];  
        }

        // Parse time slots to extract start and end times
        const parsedTimeSlots = timeSlots.map(slot => {
            const [start, end] = slot.split('-');
            return { start: start.replace('h', ':'), end: end.replace('h', ':') };
        });

        for (let i = 0; i < exams.length; i++) {
            const examDate = exams[i].date;
            const examTimeSlot = exams[i].time;
            console.log(`Exam date: ${examDate}`);

            const availableProfessors = profs.filter(prof => {
                // Check if the professor is available on the exam date
                const availability = prof.dispo.find(slot => {
                    const dispoDate = moment.utc(slot.jour).format('YYYY-MM-DD'); // Convert to UTC
                    console.log(`Comparing exam date ${examDate} (UTC) with professor availability date ${dispoDate} (UTC)`);
                    return dispoDate === examDate; // Both dates in UTC
                });
                
                if (!availability) {
                    return false; // Professor is not available on the exam date
                }

                const checkAvailability = (professorStart, professorEnd, examTimeSlot, examDate) => {
                    const [examStart, examEnd] = examTimeSlot.split('-');
                    const examStartTime = moment(`${examDate} ${examStart.replace('h', ':')}`, 'YYYY-MM-DD HH:mm');
                    const examEndTime = moment(`${examDate} ${examEnd.replace('h', ':')}`, 'YYYY-MM-DD HH:mm');
                
                    const professorStartTime = moment(`${examDate} ${professorStart}`, 'YYYY-MM-DD HH:mm');
                    const professorEndTime = moment(`${examDate} ${professorEnd}`, 'YYYY-MM-DD HH:mm');
                
                    return (
                        examStartTime.isSameOrAfter(professorStartTime) &&
                        examEndTime.isSameOrBefore(professorEndTime)
                    );
                };
                
                // Check if the exam time slot fits within the professor's availability
                const professorStart = availability.debut;
                const professorEnd = availability.fin;

                return checkAvailability(professorStart, professorEnd, examTimeSlot, examDate);
            });

            // Randomly select three professors from the available professors
            let selectedProfessors = [];
            if (availableProfessors.length === 0) {
                // No professors available for this exam
                selectedProfessors = [{ name: 'No professor found' }];
            } else {
                while (selectedProfessors.length < 3 && availableProfessors.length > 0) {
                    const randomIndex = Math.floor(Math.random() * availableProfessors.length);
                    const selectedProfessor = availableProfessors.splice(randomIndex, 1)[0];
                    selectedProfessors.push(selectedProfessor);
                }
            }

            // Assign the selected professors to supervise the exam
            exams[i].profs = selectedProfessors;
            console.log(`Exam ${exams[i].name} on ${examDate} will be supervised by:`, selectedProfessors.map(prof => prof.name));
        }
        
        const shuffle = (array) => {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
            return array;
        }
        // Shuffle the list of available rooms
        const shuffledRooms = shuffle(salles);

        // Iterate through each exam
        for (let i = 0; i < exams.length; i++) {
            // Randomly select a room for the exam
            let selectedRoom ;

            // Find the first available room that is not already assigned to another exam
            for (const salle of shuffledRooms) {
                // Check if the salle is available and not already assigned to another exam
                const isSalleAvailable = !exams.some(exam => exam.salle === salle._id);

                if (isSalleAvailable) {
                    // Assign the salle to the exam
                    selectedRoom = {
                        _id: salle._id,
                        num: salle.num,
                        type: salle.type,
                        batiment: salle.batiment
                    };
                    break; // Exit the loop once a salle is found
                }
            }

            // Assign the selected salle to the exam
            exams[i].salle = selectedRoom ? selectedRoom : { name: 'No available room found' };
        }

        return res.status(200).json({ data: exams });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
}

// afficher un planning avec des filtres
export const getPlanningFiltre = async (req, res) => {
    try {
        const { faculte, departement , filiere, annee, semestre, type } = req.query;
        const query = {};
    
        if (faculte) query.faculte = faculte;
        if (departement) query.departement = departement;
        if (filiere) query.filiere = filiere;
        if (annee) query.annee = annee;
        if (semestre) query.semestre = semestre;
        if (type) query.type = type;
    
        const schedule = await Planning.find(query).populate({
            path: 'exams',
            populate: {
                path: 'prof',
                select: 'name',
            },
            populate: {
                path: 'salle',
                select: 'num type batiment',
            },
        })
        res.status(200).json(schedule);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
      }
}