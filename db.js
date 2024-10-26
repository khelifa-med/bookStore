const { MongoClient } = require('mongodb');

let dbConnection;

module.exports = {
    connectToDb: (cb) => {
        
        MongoClient.connect('mongodb://localhost:27017')
            .then((client) => {
                dbConnection = client.db(); // Initialize dbConnection
                console.log('Connected to the database successfully');
                return cb(); // Callback with no error
            })
            .catch((err) => {
                console.error('Failed to connect to the database:', err); // Log the error
                return cb(err); // Callback with error
            });
    },

    getDb: () => {
        if (!dbConnection) {
            throw new Error('Database not initialized. Call connectToDb first.'); // Ensure dbConnection is initialized
        }
        return dbConnection; // Return the initialized dbConnection
    }
};
