
const connection = require("../config/database");

const getPagination = (query) => {
    const page = Number.parseInt(query.page, 10);
    const limit = Number.parseInt(query.limit, 10);

    const validPage = Number.isSafeInteger(page) && page > 0
        ? page
        : 1;

    const validLimit = Number.isSafeInteger(limit) && limit > 0
        ? Math.min(limit, 50)
        : 5;

    return {
        page: validPage,
        limit: validLimit,
        offset: (validPage - 1) * validLimit
    };
};

const getValidId = (value) => {
    const id = Number(value);

    if (!Number.isSafeInteger(id) || id <= 0) {
        return null;
    }

    return id;
};

const createBlog = (req, res, next) => {
    const { b_title, b_content } = req.body;
    const userId = getValidId(req.user.id);
    const image = req.file ? req.file.filename : null;

    if (!userId) {
        return res.status(401).json({
            message: "Invalid user"
        });
    }

    const checkUser = `
        SELECT id
        FROM users
        WHERE id = ?
    `;

    connection.execute(checkUser, [userId], (error, data) => {
        if (error) {
            return next(error);
        }

        if (!data.length) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const sql = `
            INSERT INTO bloogs
            (b_title, b_content, id, image)
            VALUES (?, ?, ?, ?)
        `;

        connection.execute(
            sql,
            [b_title, b_content, userId, image],
            (error, result) => {
                if (error) {
                    return next(error);
                }

                return res.status(201).json({
                    message: "Blog created successfully",
                    blogId: result.insertId,
                    image
                });
            }
        );
    });
};

const getBlogs = (req, res, next) => {
    const { page, limit, offset } = getPagination(req.query);

    const sql = `
        SELECT *
        FROM bloogs
        ORDER BY b_id DESC
        LIMIT ? OFFSET ?
    `;

    connection.execute(sql, [limit, offset], (error, data) => {
        if (error) {
            return next(error);
        }

        return res.status(200).json({
            page,
            limit,
            data
        });
    });
};

const getBlogById = (req, res, next) => {
    const id = getValidId(req.params.id);

    if (!id) {
        return res.status(400).json({
            message: "Invalid blog ID"
        });
    }

    const sql = `
        SELECT *
        FROM bloogs
        WHERE b_id = ?
    `;

    connection.execute(sql, [id], (error, data) => {
        if (error) {
            return next(error);
        }

        if (!data.length) {
            return res.status(404).json({
                message: "Blog not found"
            });
        }

        return res.status(200).json(data[0]);
    });
};

const updateBlog = (req, res, next) => {
    const blogId = getValidId(req.params.id);
    const userId = getValidId(req.user.id);
    const userRole = req.user.role;

    if (!blogId) {
        return res.status(400).json({
            message: "Invalid blog ID"
        });
    }

    if (!userId) {
        return res.status(401).json({
            message: "Invalid user"
        });
    }

    const { b_title, b_content } = req.body;

    const fields = [];
    const values = [];

    if (b_title !== undefined) {
        fields.push("b_title = ?");
        values.push(b_title);
    }

    if (b_content !== undefined) {
        fields.push("b_content = ?");
        values.push(b_content);
    }

    if (!fields.length) {
        return res.status(400).json({
            message: "At least one field is required"
        });
    }

    const checkSql = `
        SELECT id
        FROM bloogs
        WHERE b_id = ?
    `;

    connection.execute(checkSql, [blogId], (error, data) => {
        if (error) {
            return next(error);
        }

        if (!data.length) {
            return res.status(404).json({
                message: "Blog not found"
            });
        }

        const blogOwnerId = Number(data[0].id);

        if (userRole !== "admin" && blogOwnerId !== userId) {
            return res.status(403).json({
                message: "You are not allowed to update this blog"
            });
        }

        const updateSql = `
            UPDATE bloogs
            SET ${fields.join(", ")}
            WHERE b_id = ?
        `;

        values.push(blogId);

        connection.execute(updateSql, values, (error) => {
            if (error) {
                return next(error);
            }

            return res.status(200).json({
                message: "Blog updated successfully"
            });
        });
    });
};

const deleteBlog = (req, res, next) => {
    const blogId = getValidId(req.params.id);
    const userId = getValidId(req.user.id);
    const userRole = req.user.role;

    if (!blogId) {
        return res.status(400).json({
            message: "Invalid blog ID"
        });
    }

    if (!userId) {
        return res.status(401).json({
            message: "Invalid user"
        });
    }

    const checkSql = `
        SELECT id
        FROM bloogs
        WHERE b_id = ?
    `;

    connection.execute(checkSql, [blogId], (error, data) => {
        if (error) {
            return next(error);
        }

        if (!data.length) {
            return res.status(404).json({
                message: "Blog not found"
            });
        }

        const blogOwnerId = Number(data[0].id);

        if (userRole !== "admin" && blogOwnerId !== userId) {
            return res.status(403).json({
                message: "You are not allowed to delete this blog"
            });
        }

        const deleteSql = `
            DELETE FROM bloogs
            WHERE b_id = ?
        `;

        connection.execute(deleteSql, [blogId], (error) => {
            if (error) {
                return next(error);
            }

            return res.status(200).json({
                message: "Blog deleted successfully"
            });
        });
    });
};

const searchBlogs = (req, res, next) => {
    const searchkey = typeof req.query.searchkey === "string"
        ? req.query.searchkey.trim()
        : "";

    if (!searchkey) {
        return res.status(400).json({
            message: "Search keyword is required"
        });
    }

    const sql = `
        SELECT *
        FROM bloogs
        WHERE b_title LIKE ?
        ORDER BY b_id DESC
    `;

    connection.execute(sql, [`%${searchkey}%`], (error, data) => {
        if (error) {
            return next(error);
        }

        return res.status(200).json({
            search: searchkey,
            data
        });
    });
};

const searchBlogsWithPagination = (req, res, next) => {
    const searchkey = typeof req.query.searchkey === "string"
        ? req.query.searchkey.trim()
        : "";

    if (!searchkey) {
        return res.status(400).json({
            message: "Search keyword is required"
        });
    }

    const { page, limit, offset } = getPagination(req.query);

    const sql = `
        SELECT *
        FROM bloogs
        WHERE b_title LIKE ?
        ORDER BY b_id DESC
        LIMIT ? OFFSET ?
    `;

    connection.execute(
        sql,
        [`%${searchkey}%`, limit, offset],
        (error, data) => {
            if (error) {
                return next(error);
            }

            return res.status(200).json({
                search: searchkey,
                page,
                limit,
                data
            });
        }
    );
};

module.exports = {
    createBlog,
    getBlogs,
    getBlogById,
    updateBlog,
    deleteBlog,
    searchBlogs,
    searchBlogsWithPagination
};
