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
        required : false
    },
    dispo: [{
        jour: String,  
        debut: String,  
        fin: String  
    }],
})

//static login method
profSchema.statics.login = async function (matricule, birthdate) {
    //validation
    if(!matricule || !birthdate){
        throw Error('All fields must be filled')
    }
    const prof = await this.findOne({matricule, birthdate});
    if(!prof){
        throw Error('Incorrect matricule or birthdate')
    }
    return prof;
}

export const Prof = mongoose.model("Prof", profSchema)