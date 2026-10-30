const { body } = require("express-validator");

const createBlogValidation = [
    body("b_title")
        .trim()
        .notEmpty()
        .withMessage("Blog title is required"),

    body("b_content")
        .trim()
        .notEmpty()
        .withMessage("Blog content is required")
];

const updateBlogValidation = [
    body("b_title")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Blog title cannot be empty"),

    body("b_content")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Blog content cannot be empty")
];

module.exports = {
    createBlogValidation,
    updateBlogValidation
};