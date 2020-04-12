const jwt = require("jsonwebtoken");

//Method that check the authentification with hashed code stored in  header "Authorization" 
module.exports =(req,res,next) =>{
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        req.userData = decoded;
        next();
    }catch(error){
        return res.status(401).json({
            message:"Auth failed"
        })
    }
};
