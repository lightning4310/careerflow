const mongoose = require("mongoose");

const jobApplicationSchema = new mongoose.Schema(
{
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required: true,
    },

    company: {
        type: String,
        required: [true, "Company name is required"],
        trim: true,
    },

    role: {
            type: String,
            required: [true, "Job role is required"],
            trim: true,
        },

        location: {
            type: String,
            trim: true,
        },

        jobType: {
            type: String,
            enum: ["FULL_TIME", "INTERNSHIP", "CONTRACT", "PART_TIME"],
            default: "FULL_TIME",
        },

        workMode: {
            type: String,
            enum: ["ONSITE", "REMOTE", "HYBRID"],
            default: "ONSITE",
        },

        jobLink: {
            type: String,
            trim: true,
        },

        status: {
            type: String,
            enum: [
                "SAVED",
                "APPLIED",
                "ASSESSMENT",
                "INTERVIEW",
                "OFFER",
                "REJECTED",
            ],
            default: "SAVED",
        },

        applicationDate: {
            type: Date,
        },

        deadline: {
            type: Date,
        },

        salary: {
            type: Number,
            min: [0, "Salary cannot be negative"],
        },

        notes: {
            type: String,
            trim: true,
            maxlength: [5000, "Notes cannot exceed 5000 characters"],
        },

        followUpDate: {
            type: Date,
        },

        statusHistory: [
            {
                status: {
                    type: String,
                    enum: [
                        "SAVED",
                        "APPLIED",
                        "ASSESSMENT",
                        "INTERVIEW",
                        "OFFER",
                        "REJECTED",
                    ],
                    required: true,
                },

                note: {
                    type: String,
                    trim: true,
                    maxlength: [1000, "Timeline note cannot exceed 1000 characters"],
                },

                changedAt: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],
    },
    {
        timestamps: true,
    }
);

// Index for efficient user-specific queries
jobApplicationSchema.index({ user: 1, createdAt: -1 });
jobApplicationSchema.index({ user: 1, status: 1 });

const JobApplication = mongoose.model(
    "JobApplication",
    jobApplicationSchema
);

module.exports = JobApplication;
