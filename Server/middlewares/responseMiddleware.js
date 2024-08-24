/**
 * Formats the API response.
 * @param {boolean} success - Indicates if the operation was successful.
 * @param {object|null} data - The data to include in the response (if successful).
 * @param {string|null} error - The error message (if unsuccessful).
 * @param {number} status - The HTTP status code.
 * @returns {object} - The formatted response object.
 */
function formatResponse(success, data = null, error = null, status) {
    return {
        success,
        data,
        error,
        status
    };
}

/**
 * Middleware to format the response for consistency.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @param {function} next - The next middleware function.
 */
export function responseMiddleware(req, res, next) {
    // Store the original res.json function
    const originalJson = res.json;

    // Override res.json to format responses consistently
    res.json = function (responseData) {
        // Default status code if not set
        const statusCode = res.statusCode || 200;

        // Ensure the response data is always formatted
        const isError = responseData instanceof Error;
        const isCustomSuccessResponse = responseData?.success !== undefined;
        const isErrorStatusCode = statusCode >= 400;

        let formattedResponse;

        if (isError) {
            formattedResponse = formatResponse(
                false,
                null,
                responseData.message || 'An unexpected error occurred',
                statusCode
            );
        } else if (isCustomSuccessResponse) {
            formattedResponse = {
                ...responseData,
                status: statusCode
            };
        } else if (isErrorStatusCode) {
            formattedResponse = formatResponse(
                false,
                null,
                responseData || 'An unexpected error occurred',
                statusCode
            );
        } else {
            formattedResponse = formatResponse(
                true,
                responseData,
                null,
                statusCode
            );
        }

        // Call the original res.json function with the formatted response
        return originalJson.call(this, formattedResponse);
    };

    // Proceed to the next middleware
    next();
}
