const express = require("express");

const protect = require("../middleware/authMiddleware");

const {
    createApplication,
    getApplications,
    updateApplication,
    deleteApplication,
    getApplicationById,
    getApplicationStats,
} = require("../controllers/applicationController");

const router = express.Router();

router.post("/", protect, createApplication);

router.get("/", protect, getApplications);

router.get("/stats", protect, getApplicationStats);

router.put("/:id", protect, updateApplication);

router.delete("/:id", protect, deleteApplication);

router.get("/:id", protect, getApplicationById);

module.exports = router;