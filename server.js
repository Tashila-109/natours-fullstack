const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Uncaught exception Handler
process.on('uncaughtException', err => {
    console.log('UNCAUGHT EXCEPTION! Shutting down...');
    console.log(err.name, err.message);
    process.exit(1);
});

dotenv.config({ path: './config.env' });
const app = require('./app');

// Database Connection: MONGODB
const DB = process.env.DATABASE.replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD
);

mongoose
    .connect(DB, {
        // Deprecation Warnings (settings should be set as below)
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true
    })
    .then(() => console.log('DB connection successfull!'));

// Server connection
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
    console.log(`App running on port ${port}...`);
});

// Unhandled Rejection handler
process.on('unhandledRejection', err => {
    console.log('UNHANDLED REJECTION! Shutting down...');
    console.log(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});

// Responding to SIGTERM Signal
process.on('SIGTERM', () => {
    console.log('SIGTERM RECIEVED, Shutting down gracefully!');
    server.close(() => {
        console.log('Process terminated!');
    });
});
