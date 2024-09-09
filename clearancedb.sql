-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 09, 2024 at 11:28 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `clearancedb`
--

-- --------------------------------------------------------

--
-- Table structure for table `address`
--

CREATE TABLE `address` (
  `addressID` int(11) NOT NULL,
  `applicantID` int(11) DEFAULT NULL,
  `postal_address` varchar(255) NOT NULL,
  `city` varchar(100) NOT NULL,
  `district` varchar(100) NOT NULL,
  `country` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `applicant`
--

CREATE TABLE `applicant` (
  `applicantID` int(11) NOT NULL,
  `id` int(11) DEFAULT NULL,
  `fname` varchar(100) NOT NULL,
  `lname` varchar(100) NOT NULL,
  `dateOfBirth` date NOT NULL,
  `email_address` varchar(150) NOT NULL,
  `phone_number` varchar(20) NOT NULL,
  `message` text DEFAULT NULL,
  `nationalID_card` varchar(255) NOT NULL,
  `passport_size_photo` varchar(255) NOT NULL,
  `payment_Proof` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `applicantfingerprint`
--

CREATE TABLE `applicantfingerprint` (
  `fingerprintID` int(11) NOT NULL,
  `applicantID` int(11) DEFAULT NULL,
  `fingerprintTemplate` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `criminalfingerprint`
--

CREATE TABLE `criminalfingerprint` (
  `criminalFingerprintID` int(11) NOT NULL,
  `criminalID` int(11) DEFAULT NULL,
  `fingerprintTemplate` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `criminalrecords`
--

CREATE TABLE `criminalrecords` (
  `criminalID` int(11) NOT NULL,
  `applicantID` int(11) DEFAULT NULL,
  `fullName` varchar(150) NOT NULL,
  `criminalDescription` text NOT NULL,
  `sentence` text DEFAULT NULL,
  `dateOfCrime` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `full_name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone_number` varchar(15) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','police-officer','applicant') NOT NULL,
  `status` enum('active','inactive') NOT NULL DEFAULT 'inactive',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `totp_secret` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `full_name`, `email`, `phone_number`, `password`, `role`, `status`, `created_at`, `totp_secret`) VALUES
(2, 'Nelson Bwanali', 'nbwanali@gmail.com', '0998765623', '$2b$10$HeuxBDhdqVvH4sDyuuMIm.Vgj7RYxQC0g6zE9wW/lyn5Wq7oHx1Y6', 'applicant', 'active', '2024-09-01 16:28:24', NULL),
(3, 'zondiwe mhango', 'zondiwemhango214@gmail.com', '0996883007', '$2b$10$PYlyBCcQuJ990.hqTx421OFDV/9o4yxzRUrAbrL0aGBmW97CXdRhm', 'applicant', 'active', '2024-09-02 07:52:44', NULL),
(4, 'SOLOMON', 'zondiwemhango215@gmail.com', '0998765645', '$2b$10$KonxdMsTnXIVtw.HSSlMiuYQME.yzerCVjWaU1UxHIQcP9khCwn7u', 'applicant', 'active', '2024-09-02 09:12:18', NULL),
(5, 'zondiwe mhango', 'zondiwemhango219@gmail.com', '0998765644', '$2b$10$.10UBL/LqL0S7mD.RFFRoefxZCSErJ6EMaq6Oj43EvtWEfKTzwOP.', 'applicant', 'active', '2024-09-02 09:26:06', NULL),
(9, 'Daniel M\'mambo ', 'danielmmambo@gmail.com', '0885384998', '$2b$10$BzMVyLDbiOjHrQoZ9d5QKOPqsHsATFBYpn8yb31z9/a.kIQNgxLPG', 'police-officer', 'active', '2024-09-02 16:30:36', 'LU2EE4TBNZBDGZZ7JRVW4S33OA4SMY2I'),
(10, 'Mac Banda', 'mbanda@gmail.com', '0998764537', '$2b$10$6zgHQvGwZA5xUEa1GRs.AOIPDkfz86ETKb6B4vwzWJeKq9y9QXs4m', 'applicant', 'active', '2024-09-02 21:50:17', NULL),
(11, 'Nowel Phiri', 'nphiri@gmail.com', '0996883007', '$2b$10$/dB65AZEudckW8AqLbnRmeZ/loMavfxIkOllon2vw0FlxDZ53L6L2', 'applicant', 'active', '2024-09-02 23:20:18', NULL),
(12, 'Man Dan', 'danman@gmail.com', '0998764537', '$2b$10$bCTb2VduYLRcqK9HEULKNeRUY0Pg2J/.9uFSwyr0kUZ7ZMhg/lQp2', 'applicant', 'active', '2024-09-03 12:59:17', NULL),
(13, 'Andrew ', 'aluwe@gmail.com', 'luweandrew@gmai', '$2b$10$TRElaLjSos6Szolh7FJ2muckIhddTVfAlpvgywRbaIGpgkZfhKMFW', 'applicant', 'active', '2024-09-03 14:17:37', NULL),
(14, 'Foster Stat', 'sfoster@gmail.com', '0880023373', '$2b$10$Heczpek2j3wz0Y89cCPUuu2MdEQouom8RD1Pk9.U2bxqTbt7q4y.e', 'applicant', 'active', '2024-09-03 14:23:35', NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `address`
--
ALTER TABLE `address`
  ADD PRIMARY KEY (`addressID`),
  ADD KEY `applicantID` (`applicantID`);

--
-- Indexes for table `applicant`
--
ALTER TABLE `applicant`
  ADD PRIMARY KEY (`applicantID`),
  ADD UNIQUE KEY `email_address` (`email_address`),
  ADD KEY `id` (`id`);

--
-- Indexes for table `applicantfingerprint`
--
ALTER TABLE `applicantfingerprint`
  ADD PRIMARY KEY (`fingerprintID`),
  ADD KEY `applicantID` (`applicantID`);

--
-- Indexes for table `criminalfingerprint`
--
ALTER TABLE `criminalfingerprint`
  ADD PRIMARY KEY (`criminalFingerprintID`),
  ADD KEY `criminalID` (`criminalID`);

--
-- Indexes for table `criminalrecords`
--
ALTER TABLE `criminalrecords`
  ADD PRIMARY KEY (`criminalID`),
  ADD KEY `applicantID` (`applicantID`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `address`
--
ALTER TABLE `address`
  MODIFY `addressID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `applicant`
--
ALTER TABLE `applicant`
  MODIFY `applicantID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `applicantfingerprint`
--
ALTER TABLE `applicantfingerprint`
  MODIFY `fingerprintID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `criminalfingerprint`
--
ALTER TABLE `criminalfingerprint`
  MODIFY `criminalFingerprintID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `criminalrecords`
--
ALTER TABLE `criminalrecords`
  MODIFY `criminalID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `address`
--
ALTER TABLE `address`
  ADD CONSTRAINT `address_ibfk_1` FOREIGN KEY (`applicantID`) REFERENCES `applicant` (`applicantID`) ON DELETE CASCADE;

--
-- Constraints for table `applicant`
--
ALTER TABLE `applicant`
  ADD CONSTRAINT `applicant_ibfk_1` FOREIGN KEY (`id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `applicantfingerprint`
--
ALTER TABLE `applicantfingerprint`
  ADD CONSTRAINT `applicantfingerprint_ibfk_1` FOREIGN KEY (`applicantID`) REFERENCES `applicant` (`applicantID`) ON DELETE CASCADE;

--
-- Constraints for table `criminalfingerprint`
--
ALTER TABLE `criminalfingerprint`
  ADD CONSTRAINT `criminalfingerprint_ibfk_1` FOREIGN KEY (`criminalID`) REFERENCES `criminalrecords` (`criminalID`) ON DELETE CASCADE;

--
-- Constraints for table `criminalrecords`
--
ALTER TABLE `criminalrecords`
  ADD CONSTRAINT `criminalrecords_ibfk_1` FOREIGN KEY (`applicantID`) REFERENCES `applicant` (`applicantID`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
