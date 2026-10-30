const express = require("express");
const { validationResult } = require("express-validator");

const {
    createBlog,
    getBlogs,
    getBlogById,
    updateBlog,
    deleteBlog,
    searchBlogs,
    searchBlogsWithPagination
} = require("../controllers/blogController");

const auth = require("../middleware/auth");
const upload = require("../middleware/upload");

const {
    createBlogValidation,
    updateBlogValidation
} = require("../validations/blogValidation");

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

router.post(
    "/",
    auth,
    upload.single("image"),
    createBlogValidation,
    validateRequest,
    createBlog
);

router.get(
    "/search/pagination",
    searchBlogsWithPagination
);

router.get(
    "/search",
    searchBlogs
);

router.get(
    "/",
    getBlogs
);

router.get(
    "/:id",
    getBlogById
);

router.patch(
    "/:id",
    auth,
    updateBlogValidation,
    validateRequest,
    updateBlog
);

router.delete(
    "/:id",
    auth,
    deleteBlog
);

module.exports = router;