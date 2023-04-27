const User = require('../Models/UserModel');
const Job = require('../Models/JobModel');
const jwt = require('jsonwebtoken');
const fs = require('fs');

// Functions to put in routes in Routes Folder

//Get all jobs listed
GetAllJobs = async (req, res) => {
    try {
        const jobs = await Job.find();
        res.json(jobs);
    } catch (err) {
        res.json({ message: err });
    }
};

//Register User
RegisterUser = async (req, res) => {
    const { name, email, contact, userType, password } = req.body;

    curruser = await User.findOne({ email });
    if (curruser) {
        return res.status(449).json({ message: 'User already exists' });
    }

    const user = new User({
        name,
        email,
        contact,
        userType,
        password
    });
    try {
        const savedUser = await user.save();
        res.json(savedUser);
    } catch (err) {
        res.status(450).json({ message: err });
    }
}

//Login User and get token
LoginUser = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        return res.status(420).json({ message: 'Invalid email' });
    }

    if (password !== user.password) {
        return res.status(409).json({ message: 'Invalid password' });
    }

    const token = generateToken(user);
    
    res.json({ 
        "token": token, 
        "type": user.userType,
    });
}

//  Function that Employers can post job openings on the portal.
PostJob = async (req, res) => {
    const title = req.body.title;
    const description = req.body.description;
    const address = req.body.address;
    const salary = req.body.salary;
    const skills = req.body.skills;

    const employer = req.user.id;

    const job = new Job({
        title,
        description,
        address,
        salary,
        skills,
        employer
    });
    try {
        const savedJob = await job.save();

        var jobfolder = "" + title + " by " + employer + "";
        fs.mkdirSync("./Uploads/" + jobfolder, { recursive: true });

        res.json(savedJob);
    } catch (err) {
        res.status(467).json({ message: err });
    }
}

// Function that Students can upload files.
UploadFile = async (req, res) => {
    if (req.files === null) {
        return res.status(400).json({ message: 'No file uploaded' });
    }
    const file = req.files.resume;
    const message = req.files.coverLetter;
    const folder = req.user.email;

    try {
        const job = await Job.findById(req.params.jobId);

        var jobFolder = "" + job.title + " by " + job.employer + "";

        fs.mkdirSync("./Uploads/" + jobFolder + "/" + folder, {recursive: true});

        var path = "./Uploads/" + jobFolder + "/" + folder;

        file.mv(path + "/" + file.name, (err) => {
            if (err) {
                res.send(err);
            }
        });

        message.mv(path + "/" + message.name, (err) => {
            if (err) {
                res.send(err);
            }
        });

        mess = "Resume Path: {" + path + "/" + file.name + "} Cover Letter Path: {" + path + "/" + message.name + "} by " + folder

        if(job.students.includes(mess)) {
            res.status(430).json({ Error: "You have already applied for this job" });
        }

        job.students.push(mess);
        const savedJob = await job.save();

        res.json("File " + file.name + " and " + message.name + " uploaded successfully");
    } catch (err) {
        res.status(435).json({ Error: err });
    }

}

JobEmployer = async (req, res) => {
    try {
        const jobs = await Job.find();
        jobPosted = jobs.filter(job => job.employer === req.user.id);
        res.json(jobPosted);
   }
    catch (err) {
        res.json({ Error: err });
    }
}

// Function that Employers can view the list of students who have applied for the job.
ViewStudents = async (req, res) => {
    try {
        const job = await Job.findById(req.params.jobId);
        res.json(job.students);
    } catch (err) {
        res.json({ Error: err });
    }
}

// Function for searching query
SearchQuery = async (req, res) => {
    try {
        const keyword = req.query.keyword;

        const job = await Job.find({
            $or: [
                { title: { $regex: keyword, $options: 'i' } },
                { description: { $regex: keyword, $options: 'i' } },
                { address: { $regex: keyword, $options: 'i' } },
                { salary: { $regex: keyword, $options: 'i' } },
                { skills: { $regex: keyword, $options: 'i' } }
            ]
        });

        res.json(job);
    } catch (err) {
        res.json({ Error: err });
    }
}

Forgot = async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        const user = await User.findOne({ email });

        id = user.id;
        
        User.findByIdAndUpdate(id, { password: password }, {new: true})
        .then((updatedUser) => {
        });

        message = "Your password has been changed.";
        res.json({ message: message });
    }
    catch (err) {
        res.json({ Error: err });
    }
}

function generateToken(user) {
    const payload = {
        id: user._id,
        email: user.email,
        userType: user.userType
    };
    const options = { expiresIn: '1h' };
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, options);
}

// Export functions to be used in Routes
module.exports = {
    RegisterUser,
    LoginUser,
    PostJob,
    UploadFile,
    ViewStudents,
    SearchQuery,
    GetAllJobs,
    JobEmployer,
    Forgot
}