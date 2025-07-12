import dotenv from 'dotenv';
import app from './app.js'
import { initDB } from './src/db/config.js'

console.log("Starting server initialization...");

dotenv.config();
console.log("Enviroment loaded, NODE_ENV:", process.env.NODE_ENV);

const PORT = process.env.PORT || 4300;

const startServer = () => {
    console.log('Starting Server')
    app.listen(PORT, () => {
        console.log(`Server is running on port https://localhost:${PORT}`);
    }).on('error', (error) => {
        console.error('Error starting server:', error);
        process.exit(1);
    });
};

const init = async () => {
    console.log("Initializing application...");
    try {
        await initDB();
        startServer();
    } catch (error) {
        console.error("Failed to connect to database. Exiting....");
        process.exit(1);
    }
};

init().catch(error => {
    console.error("Fatal error during initialization: ", error);
    process.exit(1);
});



