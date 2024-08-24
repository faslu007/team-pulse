/**
 * Global error handler middleware for structured error responses.
 * @param {Error} err - The error object.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @param {function} next - The next middleware function.
 */
const errorHandler = (err, req, res, next) => {
    // Determine the status code, defaulting to 500 if not set
    const statusCode = res.statusCode || 500;

    // Set the response status code
    res.status(statusCode);

    // Structure the error response
    const errorResponse = {
        success: false,
        message: err.message || 'An unexpected error occurred',
        status: statusCode,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    };
    console.log(errorResponse)
    // Send the JSON response
    res.json(errorResponse);
};

export default errorHandler;
