// routes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Define the upload directory
const uploadDir = path.join(__dirname, '..', 'images', 'applicants');

// Ensure the upload directory exists
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

const authController = require('../controllers/authController'); // Update this to match the correct file
const applicantController = require('../controllers/applicant'); // Update this to match the correct file

// middlewares/auth.js
// function ensureAuthenticated(req, res, next) {
//     if (req.session.isAuthenticated) {
//         return next();
//     } else {
//         res.redirect('/login');
//     }
// }
/*
function (req, res, next) {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('Vary', 'Accept-Encoding, User-Agent');
    next();
}
*/

// Define routes
router.get('/', authController.home);
router.get('/login', authController.login);
router.get('/verifyTOTP', authController.verifyGet);
router.get('/policeDashboard',  authController.policeDashboard);
router.get('/logout', authController.logoutget);

//  application routes

router.get('/application',  authController.application);
// router.post('/application/create',  applicantController.application);
router.post('/add-participant', upload.fields([
    { name: 'passportPhoto', maxCount: 1 },
    { name: 'nationalID', maxCount: 1 },
    { name: 'fingerprintdata', maxCount: 1 },
    { name: 'paymentProof', maxCount: 1 }
]), applicantController.addParticipant);

router.get('/manageApplication', authController.manageApplication);
router.get('/generateCertificate', authController.generateCertificate);
router.get('/reports', authController.reports);
router.get('/adminPanel',  authController.adminPanel);
router.get('/manageUsers', authController.manageUsers);
// router.get('/register', authController.createAccount);

// router.get('/adduser', authController.adduser);
router.get('/application/statusPage', authController.status);

// routes.js
/*
router.post('/register', authController.createAccountPost);
router.post('/manageUsers/add-user', authController.addUser);
router.post('/login', authController.loginPost);
router.post('/verifyTOTP', authController.verifyPost);
router.post('/addCriminal', authController.addRecords);
router.post('/submit-application', authController.applyClearance);
*/
module.exports = router;

