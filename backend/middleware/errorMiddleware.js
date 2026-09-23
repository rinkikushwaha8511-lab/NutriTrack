const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
};

const errorHandler = (err, req, res, next) => {
    // If the status is 200 (default), change it to 500 for a server error
    let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    let message = err.message || 'Server Error';

    // Handle Mongoose Bad ObjectId (CastError)
    if (err.name === 'CastError' && err.kind === 'ObjectId') {
        statusCode = 404;
        message = 'Resource not found';
    }

    // Handle Mongoose Validation Error
    if (err.name === 'ValidationError') {
        statusCode = 400;
        message = Object.values(err.errors).map((val) => val.message).join(', ');
    }

    // Log the error in the server console (detailed)
    console.error(`[Error] ${err.name}: ${err.message}`);
    // console.error(err.stack); // Uncomment for local deep debugging

    // Send consistent JSON response without leaking sensitive info
    res.status(statusCode).json({
        success: false,
        message: message,
        // Optionally include stack in dev mode, but hiding it as requested
        // stack: process.env.NODE_ENV === 'production' ? null : err.stack
    });
};

module.exports = { notFound, errorHandler };
