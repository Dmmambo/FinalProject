// applicant.js (controller)
const pool = require('../db');
const path = require('path');

const addParticipant = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      dateOfBirth,
      email,
      phoneNumber,
      address,
      city,
      district,
      country,
      message
    } = req.body;

    // Check if all required files are present
    if (!req.files || !req.files['passportPhoto'] || !req.files['nationalID'] || !req.files['paymentProof']) {
      return res.status(400).json({ message: 'Missing required files' });
    }

    // Get file paths relative to the upload directory
    const getRelativePath = (file) => path.relative(path.join(__dirname, '..'), file.path);

    const passportPhoto = getRelativePath(req.files['passportPhoto'][0]);
    const nationalID = getRelativePath(req.files['nationalID'][0]);
    const paymentProof = getRelativePath(req.files['paymentProof'][0]);
    const fingerprintdata = req.files['fingerprintdata'] ? getRelativePath(req.files['fingerprintdata'][0]) : null;

    // Insert data into the database
    const query = `
      INSERT INTO applicant (
        fname, lname, dateOfBirth, email_address, phone_number, 
        message, 
        passport_size_photo, nationalID_card, payment_Proof
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    

    const values = [
      firstName, lastName, dateOfBirth, email, phoneNumber,
      message,
      passportPhoto, nationalID, paymentProof
    ];

    await pool.query(query, values);

    res.status(201).json({ message: 'Application submitted successfully' });
  } catch (error) {
    console.error('Error adding participant:', error);
    res.status(500).json({ message: 'An error occurred while submitting the application' });
  }
};

module.exports = {
    addParticipant,
};