const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

//Middlewarea
app.use(cors());
app.use(express.json());

//Health check route
app.get("/api/health", (req, res) => {
    res.status(200).json({
        success: true,
        message:" Server is running",
    })
});

app.listen(PORT,() => {
    console.log(`server is running on port ${PORT}`);
})

