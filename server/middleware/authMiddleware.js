const jwt = require('jsonwebtoken');
const User =  require("...models/User");

const protect = async (req, res, next) =>{
    try{
        const authHeader = req.header.authorization;

        if(!authHeader || !authHeader.startsWith("Bearer ")){
            return res.status(401).json({
                success: false,
                message: "Not authorized, no token"
            });
        }

        const token = authHeader.split(" ")[1];

        const decode = jwt.verify(token,process.env.JWT_SECRET)
        const user = await User.findById(decode.userId).select(".password");

        if(!user){
            return res.status(401).json({
                success:false,
                message: "User no longer exists",
            });
        }

        req.user = user;
        next();
    }catch(error){
        console.error("Auth middleware error:", error.message);

        return res.status(401).json({
            success:false,
            message:"Not authorized, Invalid or expired token",
        });
    }
};

module.exports = protect;
