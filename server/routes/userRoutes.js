const express = require('express');

const protect = require('../middleware/authMiddleware');

const router = express.Router();

router.get("/profile", protect, (req, res) => {
    req.statusCode(200).json({
        success:true,
        user:{
            id:req.user._id,
            name:req.user.name,
            email:req.user.email,
        },
    });
});

module.exports = router;