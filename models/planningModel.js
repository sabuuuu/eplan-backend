import mongoose from "mongoose";

const planningSchema = new mongoose.Schema({
    exams : [{
            type : mongoose.Schema.Types.ObjectId,
            ref : "Exams"
    }],
    date : [{
        debut : String,
        fin : String        
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
        type : Number,
        required : true
    },
    semestre : {
        type : Number,
        required : true
    },
    type : {
        type : String,
        required : true,
        enum : ["Normal", "Remplacement" ,"Rattrapage"]
    }
}, {timestamps : true});

export const Planning = mongoose.model("Planning", planningSchema)