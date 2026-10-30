const errorHandler = (err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }

    if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
            message: "File size must not exceed 5 MB"
        });
    }

    if (err.code === "LIMIT_UNEXPECTED_FILE") {
        return res.status(400).json({
            message: "Unexpected file field"
        });
    }

    if (err.name === "MulterError") {
        return res.status(400).json({
            message: err.message
        });
    }

    if (
        err.message === "Only JPG, PNG and WEBP images are allowed"
    ) {
        return res.status(400).json({
            message: err.message
        });
    }

    if (err.code === "ER_DUP_ENTRY") {
        return res.status(409).json({
            message: "This record already exists"
        });
    }

    console.error(err);

    return res.status(500).json({
        message: "Internal server error"
    });
};

module.exports = errorHandler;