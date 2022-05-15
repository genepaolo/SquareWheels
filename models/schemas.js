const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const userSchema=mongoose.Schema({
    //_id
    email: {type:String, required:true},
    familyName: {type:String},
    givenName: {type: String},
    googleID: {type: String, required: true}  
});

const Users = mongoose.model('users', userSchema);
const mySchemas={'Users':Users};

module.exports=mySchemas;