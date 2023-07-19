const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const employeeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone:{
        type: Number,
        required: true
    },
    age:{
        type: Number,
        required: true
    },
    password:{
        type: String,
        required: true,
        // unique: true
    },
    confirmpassword:{
        type: String,
        required: true,
        // unique: true
    },
    tokens:[{
        token:{
         type: String,
        required: true
        } 
    }]
})

//to generate token
//.method , becoz 'registeremployee' is an instance
employeeSchema.methods.generateAuthToken = async function(){
    try{
        console.log(this._id)
        const token = jwt.sign({_id:this._id.toString()}, process.env.SECRET_KEY);
                                //token object : generated token
        this.tokens = this.tokens.concat({token:token});  //token
        await this.save();
        return token;
    } catch(error){
        res.send("the error part"+ error);
        console.log("the error part"+ error);
    }
}

// hashing the password after getting data from user and before saving it in database
employeeSchema.pre("save", async function(next) {  //(middleware)

    if(this.isModified("password")){
        // console.log(`the current password is ${this.password}`);  //user password will print 
        this.password = await bcrypt.hash(this.password, 12);   //10
        // console.log(`the current password is ${this.password}`);  //user password will print in hash form

        // this.confirmpassword = undefined; //now we don't need confirmpassword
        this.confirmpassword = await bcrypt.hash(this.password, 12);
    }

    next(); //necessary for middleware
})

//to create collection
      //class                     //collection
const Register = new mongoose.model("Register", employeeSchema);

module.exports = Register;

//this is how bcrypt hashing works
// const bcrypt = require("bcryptjs");
// const securePassword = async (password) =>{
//                                                 //(salt)rounds(by default 10)
//     const passwordHash = await bcrypt.hash(password, 12);
//     console.log(passwordHash);

//     //to check password during login
//     const passwordMatch = await bcrypt.compare(password, passwordHash);
//     console.log(passwordMatch);
// }
// securePassword("abcd");
