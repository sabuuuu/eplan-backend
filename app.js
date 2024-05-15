import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import {PORT , mongoDBURL } from './config.js'


import userRoutes from './routes/user.js';
import salleRoutes from './routes/salle.js';
import profRoutes from './routes/prof.js';
import examRoutes from './routes/exam.js';
import planningsRoutes from './routes/plannings.js';

const app = express();
app.use(express.json());
//cors to allow frontend requests
app.use(cors())

app.get('/', (req, res) => {
  res.send('Hello World!');
})

app.use('/', userRoutes);
app.use('/salles', salleRoutes);
app.use('/profs', profRoutes);
app.use('/exams', examRoutes);
app.use('/plannings', planningsRoutes);

mongoose.connect(mongoDBURL)
    .then(() => {
        console.log('MongoDB connected');
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        }) 
    }).catch((err) => {
        console.log(err);
    })