
const connection = require("../config/database");

const getValidId = (value) => {
    const id = Number(value);

    if (!Number.isSafeInteger(id) || id <= 0) {
        return null;
    }

    return id;
};

const buildUpdate = (body) => {
    const fields = [];
    const values = [];

    const allowedFields = ["fname", "lname", "email"];

    for (const field of allowedFields) {
        if (body[field] !== undefined) {
            fields.push(`${field} = ?`);
            values.push(body[field]);
        }
    }

    return { fields, values };
};

const getUserById = (req, res, next) => {
    const id = getValidId(req.params.id);

    if (!id) {
        return res.status(400).json({
            message: "Invalid user ID"
        });
    }

    const sql = `
        SELECT id, fname, lname, email, role
        FROM users
        WHERE id = ?
    `;

    connection.execute(sql, [id], (error, data) => {
        if (error) {
            return next(error);
        }

        if (!data.length) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        return res.status(200).json(data[0]);
    });
};

const updateUserProfile = (req, res, next) => {
    const userId = getValidId(req.user.id);

    if (!userId) {
        return res.status(401).json({
            message: "Invalid user"
        });
    }

    const { fields, values } = buildUpdate(req.body);

    if (!fields.length) {
        return res.status(400).json({
            message: "At least one field is required"
        });
    }

    const sql = `
        UPDATE users
        SET ${fields.join(", ")}
        WHERE id = ?
    `;

    values.push(userId);

    connection.execute(sql, values, (error, data) => {
        if (error) {
            return next(error);
        }

        if (!data.affectedRows) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        return res.status(200).json({
            message: "Profile updated successfully"
        });
    });
};

const deleteUser = (req, res, next) => {
    const userId = getValidId(req.user.id);

    if (!userId) {
        return res.status(401).json({
            message: "Invalid user"
        });
    }

    const sql = `
        DELETE FROM users
        WHERE id = ?
    `;

    connection.execute(sql, [userId], (error, data) => {
        if (error) {
            return next(error);
        }

        if (!data.affectedRows) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        return res.status(200).json({
            message: "User deleted successfully"
        });
    });
};

const searchUsers = (req, res, next) => {
    const searchkey = typeof req.query.searchkey === "string"
        ? req.query.searchkey.trim()
        : "";

    if (!searchkey) {
        return res.status(400).json({
            message: "Search keyword is required"
        });
    }

    const sql = `
        SELECT id, fname, lname, email, role
        FROM users
        WHERE fname LIKE ?
        ORDER BY id DESC
    `;

    connection.execute(sql, [`${searchkey}%`], (error, data) => {
        if (error) {
            return next(error);
        }

        return res.status(200).json({
            search: searchkey,
            data
        });
    });
};

const updateUser = (req, res, next) => {
    const id = getValidId(req.params.id);

    if (!id) {
        return res.status(400).json({
            message: "Invalid user ID"
        });
    }

    const { fields, values } = buildUpdate(req.body);

    if (!fields.length) {
        return res.status(400).json({
            message: "At least one field is required"
        });
    }

    const sql = `
        UPDATE users
        SET ${fields.join(", ")}
        WHERE id = ?
    `;

    values.push(id);

    connection.execute(sql, values, (error, data) => {
        if (error) {
            return next(error);
        }

        if (!data.affectedRows) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        return res.status(200).json({
            message: "User updated successfully"
        });
    });
};

const deleteUserByAdmin = (req, res, next) => {
    const id = getValidId(req.params.id);

    if (!id) {
        return res.status(400).json({
            message: "Invalid user ID"
        });
    }

    const sql = `
        DELETE FROM users
        WHERE id = ?
    `;

    connection.execute(sql, [id], (error, data) => {
        if (error) {
            return next(error);
        }

        if (!data.affectedRows) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        return res.status(200).json({
            message: "User deleted successfully"
        });
    });
};

module.exports = {
    getUserById,
    updateUserProfile,
    deleteUser,
    searchUsers,
    updateUser,
    deleteUserByAdmin
};
