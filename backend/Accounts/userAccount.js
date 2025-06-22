require("dotenv").config();
const {User} = require("../Databases/userDatabase.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_KEY;
const signupUser = async(req, res) => {
    try{
        const { userName, email, password } = req.body;
        const existingUserWith_email = await User.findOne({ email });
        if (existingUserWith_email) {
            return res.status(400).json({
                success: false,
                message: `User already exists with the email ${email}. Please try again with a different email.`
            });
        }
        else{
            const salt  = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            const newUser = await User.create({
                userName,
                email,
                password : hashedPassword
            })
            res.status(201).json({
                success : true,
                message : `User with the ${email} registered successfully!`,
                data : {
                    name : newUser.userName,
                    email : newUser.email
                }
            })
        }
    }
    catch(error){
        console.error("Signup Error:", error); // Add this line
        res.status(500).json({
            success: false,
            message: 'Something went wrong during registration, please try again later!'
        })
    }
}

const loginUser = async(req, res) => {
    try{
        let dataToPrintOnConsole = "";
        const { email, password } = req.body;
        const existingUserWith_email = await User.findOne({ email });
        if(!existingUserWith_email){
            dataToPrintOnConsole = "Not Registered or Not existed!";
            console.log(dataToPrintOnConsole);
            return res.status(400).json({
                success : false,
                message: `User with the email ${email} was not signed up. Please sign up first!`
            })
        }
        else{
            const comparePassword = await bcrypt.compare(password, existingUserWith_email.password);
            if(!comparePassword){
                dataToPrintOnConsole = "Password doesn't match, Please try again with the another password!";
                console.log(dataToPrintOnConsole);
                return res.status(400).json({
                    success : false,
                    message : "Invalid Password"
                })
            }
            else{
                dataToPrintOnConsole = "Logged in successfully!";
                console.log(dataToPrintOnConsole);
                const token = jwt.sign({ userName: existingUserWith_email.userName, email: existingUserWith_email.email }, SECRET_KEY, { expiresIn: "7d" });
                res.status(201).json({
                    success : true,
                    message : `User with the ${email} logged in successfully!`,
                    token
                })
                
            }
        }
    }

    catch(error){
        console.error("Login Error:", error);
        res.status(500).json({
            success: false,
            message: 'Something went wrong during login, please try again later!'
        })
    }
}

module.exports = {
    signupUser,
    loginUser
}