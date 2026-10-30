const { body } = require("express-validator");

const signupValidation = [
    body("fname")
        .trim()
        .notEmpty()
        .withMessage("First name is required"),

    body("lname")
        .trim()
        .notEmpty()
        .withMessage("Last name is required"),

    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .bail()
        .isEmail()
        .withMessage("Invalid email")
        .normalizeEmail(),

    body("password")
        .notEmpty()
        .withMessage("Password is required")
        .bail()
        .isLength({ min: 8 })
        .withMessage("Password must be at least 8 characters"),

    body("confirm_password")
        .notEmpty()
        .withMessage("Confirm password is required")
        .bail()
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error("Passwords do not match");
            }

            return true;
        })
];

const loginValidation = [
    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .bail()
        .isEmail()
        .withMessage("Enter a valid email")
        .normalizeEmail(),

    body("password")
        .notEmpty()
        .withMessage("Password is required")
];

module.exports = {
    signupValidation,
    loginValidation
};