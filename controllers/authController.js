const db = require('../db');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const speakeasy = require('speakeasy');
const axion = require('axios');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Home page
const home = (req, res) => {
    res.render('homePage', { user: req.session.user });
};

const application = (req, res) => {
    res.render('application');
}
const policeDashboard = (req, res) => (
    res.render('policeDashboard')
);
// exports.revisedDashboard = (req, res) => (
//     res.render('revisedDashboard')
// );

const manageApplication = (req, res) => (
    res.render('manageApplication')
);

const generateCertificate = (req, res) => (
    res.render('generateCertificate')
);

const reports = (req, res) => (
    res.render('reports')
);
const adminPanel = (req, res) => (
    res.render('adminPanel')
);

const manageUsers = (req, res) => (
    res.render('manageUsers')
);
const adduser = (req, res) => (
    res.render('adduser')
);
const login = (req, res) => {
    res.render('login');
};

const verifyGet = (req, res) => {
    res.render('verifyTOTP', { message: 'Hello! verify its you!' });
};

const status = (req, res) => {
    // Retrieve the applicant's application status from the database
    const applicationId = '12345'; 
    const status = 'In Progress'; 
    const dateSubmitted = '2024-08-10'; 
    const lastUpdated = '2024-08-15'; 
    const remarks = 'Your application is being processed.'; 

    // Render the status page and pass the data
    res.render('statusPage', {
        applicationId,
        status,
        dateSubmitted,
        lastUpdated,
        remarks
    });
};

// Applicant Registration Route
const createAccountPost = async(req, res) => {
    const { fullName, email, phone, password, confirmPassword } = req.body;
    console.log(req.body);

    // Validate input
    if (!fullName || !email || !phone || !password || !confirmPassword) {
        return res.status(400).json({ error: "All fields are required" });
    }

    // Check if passwords match
    if (password !== confirmPassword) {
        return res.status(400).json({ error: "Passwords do not match" });
    }

    try {
        // Check if the user already exists
        const [existingUser] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

        if (existingUser.length > 0) {
            return res.status(400).json({ error: "User already exists" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert new user into the database with role 'applicant'
        const newUser = {
            full_name: fullName,
            email: email,
            phone_number: phone,
            password: hashedPassword,
            role: 'applicant', // Automatically assign role
            status: 'active' // Or 'inactive' based on your requirements
        };

        await db.query('INSERT INTO users SET ?', newUser);

        res.redirect('/login');
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
};

// Admin Add User Route
const addUser = async (req, res) => {
    try {
        const { fullName, email, phone, password, confirmPassword, role } = req.body;

        // Validate the request body
        if (!fullName || !email || !phone || !password || !confirmPassword || !role) {
            return res.status(400).json({ error: "All fields are required" });
        }

        // Validate the password strength
        if (password.length < 8) {
            return res.status(400).json({ error: "Password must be at least 8 characters long" });
        }

        // Check if the passwords match
        if (password !== confirmPassword) {
            return res.status(400).json({ error: "Passwords do not match" });
        }

        // Check if the user already exists
        const [existingUser] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (existingUser.length > 0) {
            return res.status(400).json({ error: "User already exists" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert new user into the database
        const newUser = {
            full_name: fullName,
            email: email,
            phone_number: phone,
            password: hashedPassword,
            role: role,
            status: 'active'
        };

        await db.query('INSERT INTO users SET ?', newUser);

        return res.status(201).json({ message: "User added successfully" });
    } catch (err) {
        console.error("Server error:", err);
        return res.status(500).json({ error: "Server error" });
    }
};

const loginPost = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if the user exists
        const [user] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

        if (user.length === 0) {
            return res.status(400).json({ error: "User does not exist" });
        }

        const foundUser = user[0];

        // Check if the password is correct
        const isMatch = await bcrypt.compare(password, foundUser.password);

        if (!isMatch) {
            return res.status(400).json({ error: "Invalid credentials" });
        }

        // Check the role to determine authentication method
        if (foundUser.role === 'applicant') {
            req.session.user = foundUser;
            req.session.save();
            return res.redirect(302, '/application');
        } else if (foundUser.role === 'admin' || foundUser.role === 'police-officer') {
            // Two-factor authentication for admins and police officers

            // Generate a TOTP secret if not already present
            if (!foundUser.totp_secret) {
                const secret = speakeasy.generateSecret({ length: 20 });
                foundUser.totp_secret = secret.base32;

                // Store the TOTP secret in the database
                await db.query('UPDATE users SET totp_secret = ? WHERE email = ?', [foundUser.totp_secret, email]);
            }

            // Generate a TOTP code
            const token = speakeasy.totp({
                secret: foundUser.totp_secret,
                encoding: 'base32 '
            });

            console.log("Generated TOTP Token:", token);

            // Send the TOTP code via email
            const transporter = nodemailer.createTransport({
                host: 'smtp-relay.brevo.com',
                port: 587,
                secure: false,
                auth: {
                    user: '7a7963001@smtp-brevo.com',
                    pass: 'GhyEZzIbJ5S6YHkc',
                },
            });

            await transporter.sendMail({
                from: '"Your Service Name" <danielmmambo@gmail.com>',
                to: foundUser.email,
                subject: 'Your Login Verification Code',
                text: `Your verification code is: ${token}. It is valid for 5 minutes.`
            });

            // Save user information in session and redirect to verification page
            req.session.user = foundUser;
            req.session.save();
            return res.redirect('/verifyTOTP');
        } else {
            return res.status(400).json({ error: "Invalid user role" });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Server error" });
    }
};

const verifyPost = async (req, res) => {
    const { code } = req.body;

    try {
        const user = req.session.user;

        if (!user) {
            return res.status(400).json({ error: "No user in session" });
        }

        // Verify the TOTP code
        const expectedToken = speakeasy.totp({
            secret: user.totp_secret,
            encoding: 'base32',
        });

        const isVerified = speakeasy.totp.verify({
            secret: user.totp_secret,
            encoding: 'base32',
            token: code,
            window: 2, // 1-minute window for potential time drift
        });

        if (isVerified) {
            // Clear TOTP from session
            delete req.session.user.totp_secret;
            req.session.isAuthenticated = true;

            if (user.role === 'admin') {
                return res.redirect('/adminPanel');
            } else if (user.role === 'police-officer') {
                return res.redirect('/policeDashboard');
            }
        } else {
            console.log("Verification failed!");
            return res.status(400).json({ error: "Invalid verification code" });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Server error" });
    }
};

const logoutget = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session: ', err);
            return res.redirect('/dashboard');
        }

        // Redirect to the login page after successful logout
        return res.redirect('/login');
    });
};

// authController.js

module.exports = {
    createAccountPost,
    addUser,
    loginPost,
    verifyPost,
    logoutget,
    home,
    application,
    policeDashboard,
    manageApplication,
    generateCertificate,
    reports,
    adminPanel,
    manageUsers,
    adduser,
    login,
    verifyGet,
    status,
};

//
// const uploadDir = './uploads/fingerprints';

// fs.mkdir(uploadDir, { recursive: true }, (err) => {
//   if (err) {
//     console.error(err);
//   }
// });

// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, './uploads/fingerprints'); // Store fingerprint images in a directory
//     },
//     filename: (req, file, cb) => {
//         cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
//     }
// });

// const upload = multer({ storage: storage });

// exports.addRecords = async (req, res) => {
//     try {
//       // Get form data
//       const { fullName, crimeDiscription, sentence, dateOfCrime } = req.body;
//       console.log(req.body);
  
//       // Check if all required fields are present
//       if (!fullName || !crimeDiscription || !sentence || !dateOfCrime) {
//         return res.status(400).send('All fields are required');
//       }
  
//       // Check if fingerprint image was uploaded
//       if (!req.file) {
//         return res.status(400).send('Fingerprint image is required');
//       }
  
//       const fingerprintPath = req.file.path; // Path to uploaded fingerprint image
//       console.log(fingerprintPath);
  
//       // Validate dateOfCrime
//       const date = new Date(dateOfCrime);
//       if (isNaN(date.getTime())) {
//         return res.status(400).send('Invalid date format for dateOfCrime');
//       }
  
//       // Insert criminal details into CriminalRecords table
//       const [result] = await db.execute(
//         'INSERT INTO criminalrecords (fullName, crimeDiscription, sentence, dateOfCrime) VALUES (?, ?, ?, ?)',
//         [fullName, crimeDiscription, sentence, dateOfCrime]
//       );
  
//       const criminalId = result.insertId;
//       console.log(criminalId);
  
//       // Insert fingerprint data into CriminalFingerprints table
//       await db.execute(
//         'INSERT INTO criminalfingerprint (criminalID, fingerprintTemplate) VALUES (?, ?)',
//         [criminalId, fingerprintPath]
//       );
  
//       res.redirect('/policeDashboard'); // Redirect back to police dashboard after submission
//     } catch (error) {
//       console.error(error);
//       res.status(500).send('Error adding criminal record');
//     }
//   };

//   //Application form Logic
//   const uploadDirectory = './uploads';

//     fs.mkdir(uploadDirectory, { recursive: true }, (err) => {
//     if (err) {
//         console.error(err);
//     }
//     });
//   const uploadFiles = multer({
//     dest: 'uploads/', // Folder where files will be temporarily stored
//     limits: { fileSize: 2 * 1024 * 1024 }, // Max file size: 2MB
//     fileFilter: (req, file, cb) => {
//         const ext = path.extname(file.originalname).toLowerCase();
//         if (ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png' && ext !== '.pdf') {
//             return cb(new Error('Only images and PDFs are allowed'));
//         }
//         cb(null, true);
//     }
// });

// // Route to handle form submission
// exports.applyClearance = uploadFiles.fields([
//     { name: 'passportPhoto', maxCount: 1 },
//     { name: 'nationalID', maxCount: 1 },
//     { name: 'fingerprintdata', maxCount: 1 },
//     { name: 'paymentProof', maxCount: 1 }
// ]), async(req, res) => {
//     const {
//         firstName, lastName, dateOfBirth, email, phoneNumber, address, city, district, country, message
//     } = req.body;
//     console.log(req.body);

//     // Get the uploaded files
//     const passportPhoto = req.files['passportPhoto'][0];
//     const nationalID = req.files['nationalID'][0];
//     const paymentProof = req.files['paymentProof'][0];

//     // Insert applicant details into the database
//     const query = `INSERT INTO applicant 
//         (fname, lname, dateOfBirth, email_address, phone_number, message , nationalID_card, passport_size_photo, payment_Proof) 
//         VALUES (?, ?, ?, ?, ?, ?)`;

//     const values = [
//         firstName, lastName, dateOfBirth, email, phoneNumber, message, nationalID.path, passportPhoto.path, paymentProof.path
//     ];

//     db.query(query, values, (err, result) => {
//         if (err) {
//             console.error(err);
//             return res.status(500).json({ error: 'Failed to submit application' });
//         }

//         const applicantID = result.insertId;

//         // Insert address details into the database
//         const addressQuery = `INSERT INTO address (applicantID, postal_address, city, district, country) VALUES (?, ?, ?, ?, ?)`;
//         const addressValues = [applicantID, address, city, district, country];

//         db.query(addressQuery, addressValues, (err) => {
//             if (err) {
//                 console.error(err);
//                 return res.status(500).json({ error: 'Failed to save address' });
//             }

//             // Insert fingerprint data if provided
//             const fingerprintData = req.files['fingerprintdata'] ? req.files['fingerprintdata'][0] : null;

//             if (fingerprintData) {
//                 const fingerprintQuery = `INSERT INTO applicantFingerprint (applicantID, fingerprintTemplate) VALUES (?, ?)`;
//                 const fingerprintValues = [applicantID, fingerprintData.path];

//                 db.query(fingerprintQuery, fingerprintValues, (err) => {
//                     if (err) {
//                         console.error(err);
//                         return res.status(500).json({ error: 'Failed to save fingerprint data' });
//                     }

//                     return res.status(200).json({ message: 'Application submitted successfully' });
//                 });
//             } else {
//                 return res.status(200).json({ message: 'Application submitted successfully' });
//             }
//         });
//     });
// };


  
  


