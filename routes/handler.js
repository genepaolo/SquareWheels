const express=require('express');
const { ConsoleWriter } = require('istanbul-lib-report');
const { Schema } = require('mongoose');
const router=express.Router();
const Schemas = require('../models/schemas.js');
var async = require('async');

const cors=require("cors");
const corsOptions ={
   origin:'*', 
   credentials:true,            //access-control-allow-credentials:true
   optionSuccessStatus:200,
}

router.use(cors(corsOptions));

router.get('/users', (req,res)=>{
    const str=[{
        "googleID": "123123123"
    }];
    res.end(JSON.stringify(str));
});

router.get('/addUser', async (req,res)=>{
    const user={ 
        email: 'Emily@gmail.com',
        familyName: 'Wu',
        givenName: 'Emily',
        googleID: '123456'
    };
    const newUser = new Schemas.Users(user);
    //Check if user already exist, if not save the user to the database
    try{
        await newUser.save( async(err, newUserResult) =>{
            console.log('New user created');
            res.end('New user created!');
        });
    } catch(err) {
        console.log(err);
        res.end('User not added!');
    }
});

router.post('/addNewUser', async (req, res)=>{
    var newUser=new Schemas.Users(req.body);
    try{
        await newUser.save( async(err, newUserResult) =>{
            console.log('New user created');
            res.end('New user created!');
        });
    } catch(err) {
        console.log(err);
        res.end('User not added!');
    }
});

module.exports=router;