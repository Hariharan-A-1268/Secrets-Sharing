require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const encrypt = require("mongoose-encryption");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static("public"));

// console.log(process.env.API_KEY);

mongoose.connect('mongodb+srv://Hariharan_A:AVNH1268@cluster0.awnduiy.mongodb.net/userDB', {useNewUrlParser: true});

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

userSchema.plugin(encrypt,{secret: process.env.SECRET, encryptedFields: ["password"]});

const User = new mongoose.model("User", userSchema);

app.get("/",function(req,res){
    res.render("home");
});

app.get("/login",function(req,res){
    res.render("login");
});

app.get("/register",function(req,res){
    res.render("register");
});

app.post("/register", function(req,res){
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    });

    newUser.save();

    res.render("secrets");
    
});

app.post("/login", async (req, res)=>{
    const username = req.body.username;
    const password = req.body.password;

    const result = await User.findOne({email: username});

    if(!result){
        console.log("No User found");
      }
    else{
        if(result.password === password){
            res.render("secrets");
      }
    }
});

app.listen(3000, function() {
    console.log("Server started on port 3000");
  });