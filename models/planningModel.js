import mongoose from "mongoose";

const planningSchema = new mongoose.Schema({
    exams : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "Exam"
    }],
    faculte : {
        type : String,
        required : true
    },
    departement : {
        type : String,
        required : true
    },
    filiere : {
        type : String,
        required : true
    },
    annee : {
        type : String,
        required : true
    },
    semestre : {
        type : String,
        required : true
    },
    type : {
        type : String,
        required : true,
        enum : ["Normal", "Remplacement" ,"Rattrapage"]
    }
}, {timestamps : true});

export const Planning = mongoose.model("Planning", planningSchema)