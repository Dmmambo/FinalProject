const mysql = require('mysql2/promise');

// Create a connection pool to the clearance application database
const db = mysql.createPool({
    host: 'localhost',      
    user: 'root',          
    password: '',           
    database: 'clearancedb', 
    waitForConnections: true,
    connectionLimit: 10,    
    queueLimit: 0           
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



