const express = require("express");
const { validationResult } = require("express-validator");

const {
    getUserById,
    updateUserProfile,
    deleteUser,
    searchUsers,
    updateUser,
    deleteUserByAdmin
} = require("../controllers/userController");

const auth = require("../middleware/auth");
const isAdmin = require("../middleware/isAdmin");

const {
    updateUserValidation
} = require("../validations/userValidation");

const router = express.Router();

const validateRequest = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }

    next();
};

router.patch(
    "/profile",
    auth,
    updateUserValidation,
    validateRequest,
    updateUserProfile
);

router.delete(
    "/profile",
    auth,
    deleteUser
);

router.patch(
    "/:id",
    auth,
    isAdmin,
    updateUserValidation,
    validateRequest,
    updateUser
);

router.delete(
    "/:id",
    auth,
    isAdmin,
    deleteUserByAdmin
);

router.get(
    "/:id",
    auth,
    isAdmin,
    getUserById
);

router.get(
    "/",
    auth,
    isAdmin,
    searchUsers
);

module.exports = router;