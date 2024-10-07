const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController'); // Update this to match the correct file

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
router.get('/application',  authController.application);
router.get('/policeDashboard',  authController.policeDashboard);
router.get('/logout', authController.logoutget);

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

