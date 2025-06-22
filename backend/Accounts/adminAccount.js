const bcrypt = require("bcrypt");
const loginAdmin = async(req, res) => {
    try{
        const Admin_Email = "kadminm@gmail.com";
        const Admin_Password = "M743";
        const { email, password } = req.body;
        if(email != Admin_Email){
            dataToPrintOnConsole = "You are not Admin";
            console.log(dataToPrintOnConsole);
            return res.status(400).json({
                success : false,
                message: `${email} hasn't admin access!`
            })
        }
        else{
            if(password != Admin_Password){
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
                res.status(201).json({
                    success : true,
                    message : `Admin with the ${email} logged in successfully!`,
                    data : {
                        email : Admin_Email
                    }
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

module.exports = loginAdmin;