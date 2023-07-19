require('dotenv').config();  //to require dotenv(.env)
const express = require("express");
const app = express();
const path = require("path");
const hbs = require("hbs");
const bcrypt = require("bcryptjs");
require("./db/conn");
const port = process.env.PORT || 3000;

// one dot(.) is used to come out from file and two dot(..) is to come out from folder 
const Register = require("./models/registers");
const { log } = require('console');
// const bcrypt = require("bcryptjs/dist/bcrypt");

const static_path = path.join(__dirname, "../public");
const template_path = path.join(__dirname, "../templates/views");
const partials_path = path.join(__dirname, "../templates/partials");

app.use(express.json());
app.use(express.urlencoded({extended:false}));  //data is getting instead of undefined

app.use(express.static(static_path));
app.set("view engine", "hbs");
app.set("views", template_path);
hbs.registerPartials(partials_path);


app.get("/", (req,res) => {
    res.render("index");
});
app.get("/register", (req,res) => {
    res.render("register");
});
app.get("/login", (req,res) => {
    res.render("login");
});

// (Registeration)create a new user in our database
app.post("/register", async(req,res) => { 
    try{

        //to check password
        const password = req.body.password;
        const confirmpassword = req.body.confirmpassword;
        if(password === confirmpassword){  // "===" is to check datatype of password
                  //instance(document)
            const registeremployee = new Register({
                name: req.body.name,
                email: req.body.email,
                phone: req.body.phone,
                age: req.body.age,
                password: password,  //req.body.password
                confirmpassword: confirmpassword,  //req.body.confirmpassword
            })

            // to hash the password we have to implement bcryptjs in registers.js (schema) file

            console.log("the success part"+ registeremployee);
            //to generate token, we have to define a function in register.js file
            const token = await registeremployee.generateAuthToken();
            console.log("the token part"+ token);

            const registered = await registeremployee.save();
            res.status(201).render("index");

        } else{
            res.send("password is not matching");
        
        }
    } catch(err){
        res.status(400).send(err);
    }
});

//login defination or validation
app.post("/login", async(req,res) => {
    try{

        const email = req.body.email;
        const password = req.body.password;
        
                                     // database-email : user-entered-email
        const useremail = await Register.findOne({email:email});
        // res.send(useremail.password);  //to get the password of entered email id

        //to check user password and hash password
        const isMatch = await bcrypt.compare(password, useremail.password);

        //token add after login
        const token = await useremail.generateAuthToken();
        console.log("the token part"+ token);

                      // db-password === user-entered-password
        if(isMatch){  //useremail.password === password
            res.status(201).render("index");  

        }else{
            res.send("Invalid email OR password")
        }

    } catch(err){
        res.status(400).send("Invalid Email") //it will show when email is incorrect
    }
})


// const jwt = require("jsonwebtoken");

// const createToken = async() => { //payload                          //secret key(min 32 char)                                      //time of token to validate
//     const token = await jwt.sign({_id:"64b6415935ac4667fd03b5f1"}, "mynameisvivekandthisissecretkeyofatleastthirstytwocharacters", {expiresIn:"2 seconds"});
//     console.log(token);
//     //The first part(encoded data) of token represent header which contains algorithm and type of token(jsonwebtoken). The second encoded data is payload or body data(id). Third data defines the user uniquely.

//     //to verify token
//     const userVer = await jwt.verify(token, "mynameisvivekandthisissecretkeyofatleastthirstytwocharacters");
//     console.log(userVer);
// }
// createToken();

app.listen(port, () => {
    console.log(`server is running at port no ${port}` );
})

//how to delete dependencies ?
//should i do both web dev and app dev to become sde