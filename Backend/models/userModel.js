import mongoose from 'mongoose';

const userModel = new mongoose.Schema({

    fullname:{
        type:String,
        required:true
    },
    userName:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    profilePic:{
        type:String,
        default:"https://iconarchive.com/download/i107272/Flat-UI-Icons/User-Interface-Icons/user.ico"
    },
    gender:{
        type:String,
        enum:["male","female","other"]
    }
}, {
    timestamps:true
});

export const User = mongoose.model("User", userModel);

