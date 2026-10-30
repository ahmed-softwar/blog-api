const { body } = require("express-validator");

const updateUserValidation = [
    body("fname")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("First name cannot be empty"),

    body("lname")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Last name cannot be empty"),

    body("email")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Email cannot be empty")
        .bail()
        .isEmail()
        .withMessage("Invalid email")
        .normalizeEmail()
];

module.exports = {
    updateUserValidation
};