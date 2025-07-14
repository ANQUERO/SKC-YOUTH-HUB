import dotenv from 'dotenv';
import app from './app.js'

console.log("Starting server initialization...");

dotenv.config();
console.log("Enviroment loaded, NODE_ENV:", process.env.NODE_ENV);

const PORT = process.env.PORT || 4300;

const startServer = () => {
    console.log('Starting Server')
    app.listen(PORT, () => {
        console.log(`Server is running on port http://localhost:${PORT}`);
    }).on('error', (error) => {
        console.error('Error starting server:', error);
        process.exit(1);
    });
};
