import mongoose from "mongoose";

const examSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    date : {
        type : String,
        required : true
    },
    time :[{
        debut: String, // Heure de début (par exemple: "9:00")
        fin: String // Heure de fin (par exemple: "12:00")
    }],
    profs :[{
        type : mongoose.Schema.Types.ObjectId,
        ref : "Prof"
    }],
    salle : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Salle"
    }
});

export const Exam = mongoose.model("Exam", examSchema)