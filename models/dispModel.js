import mongoose from "mongoose";

const dispoSchema = new mongoose.Schema({
    jour : {
        type : String,
        required : true
    },
    debut : {
        type : String,
        required : true
    },
    fin : {
        type : String,
        required : true
    }
})

export const Dispo = mongoose.model("Dispo", dispoSchema)