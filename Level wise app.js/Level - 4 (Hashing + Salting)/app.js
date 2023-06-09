require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static("public"));

mongoose.connect('mongodb+srv://Hariharan_A:AVNH1268@cluster0.awnduiy.mongodb.net/userDB', {useNewUrlParser: true});

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

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

    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
        const newUser = new User({        
            email: req.body.username,
            password: hash
        });

        newUser.save();
        res.render("secrets");
    });

});

app.post("/login", async (req, res)=>{
    const username = req.body.username;
    const password = req.body.password;

    const result = await User.findOne({email: username});

    if(!result){
        console.log("No User found");
      }
    else{
        bcrypt.compare(password, result.password, function(err, result) {
            if(result === true){
                res.render("secrets");
          }
        });
    }
});

app.listen(3000, function() {
    console.log("Server started on port 3000");
  });