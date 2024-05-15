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
    time :{
        type : String,
        required : true
    },
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