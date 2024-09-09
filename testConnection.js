const mysql = require('mysql2/promise');

// Create a connection pool to the clearance application database
const db = mysql.createPool({
    host: 'localhost',      // The hostname of the database server
    user: 'root',           // Your MySQL username
    password: '',           // Your MySQL password (leave blank if no password)
    database: 'bit4', // Name of your database
    waitForConnections: true, // Determines whether or not the pool should queue connection requests
    connectionLimit: 10,    // The maximum number of connections to create at once
    queueLimit: 0           // The maximum number of connection requests the pool will queue before returning an error from getConnection
});

// Test the connection to ensure it's working
async function testDBConnection() {
    try {
        const connection = await db.getConnection();
        console.log('Connected to clearance application database.');

        // Test a simple query to ensure the connection is working
        const [rows, fields] = await connection.query('SELECT 1');
        console.log('Test query successful:', rows);

        // Release the connection back to the pool
        connection.release();
    } catch (err) {
        console.error('Database connection failed: ' + err.stack);
    }
}

// Call the test function to check the connection
testDBConnection();

module.exports = db;
