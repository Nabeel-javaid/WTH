const userController = require('../Controllers/UserController');
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// Function to check if user is a student
function isStudent(req, res, next) {
    if (req.user.userType === 'student') {
        next();
    } else {
        res.status(401).json({ message: 'Unauthorized' });
    }
}

// Function to check if user is an employer
function isEmployer(req, res, next) {
    if (req.user.userType === 'employer') {
        next();
    } else {
        res.status(402).json({ message: 'Unauthorized' });
    }
}

// Function to check if user is a placement officer
// function isPlacementOfficer(req, res, next) {
//     if (req.user.userType === 'placementofficer') {
//         next();
//     } else {
//         res.status(403).json({ message: 'Unauthorized' });
//     }
// }

// Middleware to Verify JWT Token
let verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader;
    
    if (token == null) {
        return res.status(406).json({ message: 'Unauthorized' });
    }
    
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            return res.status(405).json({ message: 'Forbidden' });
        }
        req.user = user;
        next();
    });
}

// Routes
router.post('/register', userController.RegisterUser);
router.post('/login', userController.LoginUser);
router.post('/postjob', verifyToken, isEmployer, userController.PostJob);

router.get('/jobs/search', userController.SearchQuery);

router.get('/jobself', verifyToken, isEmployer, userController.JobEmployer)
router.get('/alljobs', userController.GetAllJobs);

router.get('/getjobs/:jobId', verifyToken, isEmployer, userController.ViewStudents);
router.post('/upload/:jobId', verifyToken, isStudent, userController.UploadFile);

router.put('/forgot', userController.Forgot)

module.exports = router;