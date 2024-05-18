import mongoose from "mongoose";
import bcrypt from "bcrypt";
import  validator  from "validator";

const userSchema = new mongoose.Schema({
    email : {
        type : String,
        required : true,
        unique : true
    },
    password : {
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
})

//static signup method
userSchema.statics.signup = async function (email, password ,name, surname) {

    //validation
    if(!email ){
        throw Error('Veuillez saisir votre email 📝')
    }
    if(!password ){
        throw Error('Veuillez saisir votre mot de passe 📝')
    }
    if(!surname ){
        throw Error('Veuillez saisir votre prénom 📝')
    }
    if(!name ){
        throw Error('Veuillez saisir votre nom 📝')
    }

    if(!validator.isEmail(email)){
        throw Error('Email invalide 📧')
    }
    if(!validator.isStrongPassword(password)){
        throw Error('Mot de passe pas assez fort 🔓')
    }

    const exists = await this.findOne({email})
    if(exists){
        throw Error('Utilisateur existe déja 👩🏽‍💻')
    }

    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)
    
    const user = await this.create({email, password : hash , name, surname });
    return user;
}

//static login method
userSchema.statics.login = async function (email, password) {
    //validation
    if(!email || !password){
        throw Error('Veuillez remplir tout les champs avant de continuer ❗️')
    }

    const user = await this.findOne({email})
    if(!user){
        throw Error('Email incorrect ❌')
    }

    const match = await bcrypt.compare(password, user.password); 
    if(!match){
        throw Error('Mot de passe incorrect ❌')
    }

    return user
}


export const User = mongoose.model('User', userSchema);