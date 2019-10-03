const AppError = require('./../utils/appError');

const handleCastErrorDB = error => {
    const message = `Invalid ${error.path}: ${error.value}`;
    return new AppError(message, 400);
};

const handleDuplicateFieldsDB = error => {
    const value = error.errmsg.match(/(["'])(\\?.)*?\1/)[0];
    const message = `Duplicate field value: ${value}. Please use another value!`;
    return new AppError(message, 400);
};

const handleValidationErrorDB = error => {
    const errs = Object.values(error.errs).map(el => el.message);

    const message = `Invalid input data. ${errs.join('. ')}`;
    return new AppError(message, 400);
};

const handleJWTError = error =>
    new AppError('Invalid token. Please log in again', 401);

const handleJWTExpiredError = error =>
    new AppError('Your token has expired. Please log in again', 401);

const sendErrorDev = (error, req, res) => {
    // API
    if (req.originalUrl.startsWith('/api')) {
        return res.status(error.statusCode).json({
            status: error.status,
            error,
            message: error.message,
            stack: error.stack
        });
    }
    // RENDERED WEBSITE
    return res.status(error.statusCode).render('error', {
        title: 'Something went wrong!',
        msg: error.message
    });
};

const sendErrorProd = (error, req, res) => {
    // a) API
    if (req.originalUrl.startsWith('/api')) {
        // Operational, trusted error: send message to client
        if (error.isOperational) {
            return res.status(error.statusCode).json({
                status: error.status,
                message: error.message
            });
            // Programing or other unknown error: dont leak error details
        }
        // 1) Log error
        console.error(error);

        //2) Send generic message
        return res.status(500).json({
            status: 'error',
            message: 'Something went very wrong'
        });
    }
    // b) RENDERED WEBSITE
    // Operational, trusted error: send message to client
    if (error.isOperational) {
        return res.status(error.statusCode).json({
            status: error.status,
            message: error.message
        });
        // Programing or other unknown error: dont leak error details
    }
    // 1) Log error
    console.error(error);

    //2) Send generic message
    return res.status(error.statusCode).render('error', {
        title: 'Something went wrong!',
        msg: 'Please try again later.'
    });
};

module.exports = (error, req, res, next) => {
    error.statusCode = error.statusCode || 500;
    error.status = error.status || 'error';

    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(error, req, res);
    } else if (process.env.NODE_ENV === 'production') {
        let err = { ...error };
        err.message = error.message;

        if (err.name === 'CastError') err = handleCastErrorDB(err);
        if (err.code === 11000) err = handleDuplicateFieldsDB(err);
        if (err.name === 'ValidationError') err = handleValidationErrorDB(err);
        if (err.name === 'JsonWebTokenError') err = handleJWTError(err);
        if (err.name === 'TokenExpiredError') err = handleJWTExpiredError(err);

        sendErrorProd(err, req, res);
    }
};
