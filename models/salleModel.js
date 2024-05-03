import mongoose from "mongoose";

const salleSchema = new mongoose.Schema({
    num : {
        type : Number,
        required : true
    },
    type : {
        type : String,
        required : true,
        enum : ["Salle TD", "Amphi"]
    },
    batiment : {
        type : String,
        required : false,
        default : "-"
    },
    capacite : {
        type : Number,
        required : true
    }
}, {timestamps : true})

export const Salle = mongoose.model("Salle", salleSchema)