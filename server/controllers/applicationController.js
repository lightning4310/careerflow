const JobApplication = require("../models/JobApplication");


const ALLOWED_STATUSES = [
    "SAVED",
    "APPLIED",
    "ASSESSMENT",
    "INTERVIEW",
    "OFFER",
    "REJECTED",
];

const createApplication = async (req, res) => {
    try {
        const {
            company,
            role,
            location,
            jobType,
            workMode,
            jobLink,
            status,
            applicationDate,
            deadline,
            salary,
            notes,
            followUpDate,
            statusNote,
        } = req.body;

        if (!company?.trim() || !role?.trim()) {
            return res.status(400).json({
                success: false,
                message: "Company and role are required",
            });
        }

        const initialStatus = status?.toUpperCase() || "SAVED";

        const application = await JobApplication.create({
            user: req.user._id,

            company,
            role,
            location,
            jobType,
            workMode,
            jobLink,
            status: initialStatus,
            applicationDate,
            deadline,
            salary,
            notes,
            followUpDate,
            statusNote,

            statusHistory: [
                {
                    status: initialStatus,
                    note: statusNote || "Application created",
                },
            ],
        });

        res.status(201).json({
            success: true,
            message: "Application created successfully",
            application,
        });
    } catch (error) {
        console.error("Create application error:", error.message);

        if (error.name === "ValidationError") {
            return res.status(400).json({
                success: false,
                message: error.message,
            });
        }

        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};


const getApplications = async (req,res) =>{
    try{
        const {status, search, sort} = req.query;

        const page = Math.max(Number(req.query.page) || 1,1);
        const limit = Math.min(Number(req.query.limit) || 10,50);

        const skip = (page - 1) * limit;

        const filter = {
            user: req.user._id,
        };

        if(status){
            filter.status = status.toUpperCase();
        }

        if(search){
            filter.$or = [
                {company: {$regex: search, $options: "i"}},
                {role: {$regex: search, $options: "i"}},
            ];
        }
        
        let sortOption = {createdAt: -1};

        if(sort === "oldest"){
            sortOption = { createdAt: 1};
        }else if (sort === "deadline"){
            sortOption = {deadline: 1};
        }

        const applications = await JobApplication.find(filter)
        .sort(sortOption)
        .skip(skip)
        .limit(limit);

        const totalApplications = await JobApplication.countDocuments(filter);

        const totalPages = Math.ceil(totalApplications  / limit);

        res.status(200).json({
            success: true,
            count: applications.length,
            totalApplications,
            currentPage: page,
            totalPages,
            limit,
            applications,
        });
    }catch(error){
        console.error("Get applications error", error.message);

        res.status(500).json({
            success: false,
            message: "Server error",
            });
        }
  
};


const updateApplication = async (req, res)=>{
    try{
        const{id} = req.params;

        const application  = await JobApplication.findOne({
            _id: id,
            user: req.user._id,
        });

        if(!application){
            return res.status(404).json({
                success: false,
                message: "Application not found",
            });
        }


        const {
            company,
            role,
            location,
            jobType,
            workMode,
            jobLink,
            status,
            applicationDate,
            deadline,
            salary,
            notes,
            followUpDate,
            statusNote,
        } = req.body;

        if(status !== undefined && !ALLOWED_STATUSES.includes(status.toUpperCase()))
        {
            return res.status(400).json({
                success: false,
                message: "Invalid application status", 
            });
        }

        const oldStatus = application.status;

        //update only provided fields

        const updates = {
            company,
            role,
            location,
            jobType,
            workMode,
            jobLink,
            status: status?.toUpperCase(),
            applicationDate,
            deadline,
            salary,
            notes,
            followUpDate,
        };

        if(company !== undefined && (typeof company !== "string" ||!company.trim()))
        {
            return res.status(400).json({
                success: false,
                message: "Company cannot be empty",
            });
        }

        if(role !== undefined && (typeof role !== "string" || !role.trim()))
            {
                return res.status(400).json({
                    success: false,
                    message: " Role cannnot be empty",
                });
            }

        if(status !== undefined && (typeof status !== "string" || !ALLOWED_STATUSES.includes(status.toUpperCase())))
        {
            return res.status(400).json({
                success: false,
                message: "Invalid application status",
            });
        }

        Object.keys(updates).forEach((key)=>{
            if (updates[key] !== undefined){
                application[key] = updates[key];
            }
        });

        //track status changes

        const newStatus = status?.toUpperCase();

        if(newStatus && newStatus !== oldStatus){
            application.statusHistory.push({
                status: newStatus,
                note: statusNote || `Status changed from &{oldStatus} to ${newStatus}`,
            });
        }


        const updatedApplication =  await application.save();

        res.status(200).json({
            success: true,
            message: "Application updated successfully",
            application: updatedApplication,
        });
    }catch(error){
        console.error("Update application error:", error.message);

        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

const deleteApplication = async (req, res) => {
    try{
        const { id } = req.params;

        const application = await JobApplication.findOneAndDelete({
            _id: id,
            user: req.user._id,
        });

        if(!application){
            return res.status(404).json({
                success: false,
                message: "Application not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Application deleted successfully",
        });
    }catch(error){
        console.error("Delete application error:", error.message);

        res.status(500).json({
            success: false,
            message:"Server Error",
        });
    }
};


const getApplicationById = async(req, res) =>{
    try{
        const {id} = req.params;

        const application = await JobApplication.findOne({
            _id: id,
            user: req.user._id,
        });

        if(!application){
            return res.status(404).json({
                success: false,
                message: "Application not found",
            });
        }

        res.status(200).json({
            success: true,
            application,
        });
    }catch(error){
        console.error("Get Application Error:", error.message);

        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }

};

const getApplicationStats = async (req,res) =>{
    try{
        const stats = await JobApplication.aggregate([
            {
                $match: {
                    user: req.user.id,
                },
            },
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1},
                },
            },
        ]);
        
        const formattedStats = {
            SAVED: 0,
            APPLIED: 0,
            ASSESSMENT: 0,
            INTERVIEW: 0,
            OFFER: 0,
            REJECTED: 0,
        };

        stats.forEach((item) => {
            formattedStats[item._id] = item.count;
        });

        const totalApplications = stats.reduce(
            (total,item) => total + item.count,0
        );

        res.status(200).json({
            success :true,
            totalApplications,
            stats: formattedStats,
        });

    } catch(error){
        console.error("Get application stats report:", error.message);

        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

module.exports = {
    createApplication,
    getApplications,
    updateApplication,
    deleteApplication,
    getApplicationById,
    getApplicationStats,
};
