export const errorMiddleware = (err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    if (err.name === "CastError" && err.kind === "ObjectId") {
        statusCode = 404;
        message = "Resource not found";
    }

    res.status(statusCode).json({
        success: false,
        statusCode,
        message,
    });
};

// error handler with explicit code/message
export const errorHandle = (statusCode, message) => {
    const error = new Error();
    error.statusCode = statusCode;
    error.message = message;
    return error;
};
