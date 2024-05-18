import mongoose from "mongoose";

const profSchema = new mongoose.Schema({
    matricule : {
        type : Number,
        required : true,
        unique : true
    },
    birthdate : {
        type : String,
        required : true
    },
    name : {
        type : String,
        required : true
    },
    surname :{
        type : String,
        required : true
    },
    grade : {
        type : String,
        required : true
    },
    dispo: [{
        jour: String,  
        debut: String,  
        fin: String  
    }],
    email : {
        type : String,
        required : true
    }
})

//static login method
profSchema.statics.login = async function (matricule, birthdate) {
    //validation
    if(!matricule || !birthdate){
        throw Error('Veuillez remplir tout les champs avant de continuer ❗️')
    }
    const prof = await this.findOne({matricule, birthdate});
    if(!prof){
        throw Error('Matricule ou Date de naissance incorrecte ❌')
    }
    return prof;
}

export const Prof = mongoose.model("Prof", profSchema)