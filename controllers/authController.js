
const bcrypt = require("bcrypt");
const connection = require("../config/database");
const jwt = require("jsonwebtoken");

const signup = (req, res, next) => {
    const {
        fname,
        lname,
        email,
        password,
        confirm_password
    } = req.body;

    if (password !== confirm_password) {
        return res.status(400).json({
            message: "Passwords do not match"
        });
    }

    const checkEmail = `
        SELECT id
        FROM users
        WHERE email = ?
    `;

    connection.execute(checkEmail, [email], async (error, data) => {
        if (error) {
            return next(error);
        }

        if (data.length) {
            return res.status(409).json({
                message: "Email already exists"
            });
        }

        try {
            const hashedPassword = await bcrypt.hash(password, 10);

            const sql = `
                INSERT INTO users
                (fname, lname, email, password)
                VALUES (?, ?, ?, ?)
            `;

            connection.execute(
                sql,
                [fname, lname, email, hashedPassword],
                (error, result) => {
                    if (error) {
                        if (error.code === "ER_DUP_ENTRY") {
                            return res.status(409).json({
                                message: "Email already exists"
                            });
                        }

                        return next(error);
                    }

                    return res.status(201).json({
                        message: "Signup successfully",
                        userId: result.insertId
                    });
                }
            );
        } catch (error) {
            return next(error);
        }
    });
};

const login = (req, res, next) => {
    const { email, password } = req.body;

    if (!process.env.JWT_SECRET) {
        return next(new Error("JWT_SECRET is not configured"));
    }

    const sql = `
        SELECT id, email, password, role
        FROM users
        WHERE email = ?
    `;

    connection.execute(sql, [email], async (error, data) => {
        if (error) {
            return next(error);
        }

        if (!data.length) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        try {
            const user = data[0];

            const passwordMatch = await bcrypt.compare(
                password,
                user.password
            );

            if (!passwordMatch) {
                return res.status(401).json({
                    message: "Invalid email or password"
                });
            }

            const token = jwt.sign(
                {
                    id: user.id,
                    role: user.role
                },
                process.env.JWT_SECRET,
                {
                    expiresIn: "1h"
                }
            );

            return res.status(200).json({
                message: "Login successfully",
                token
            });
        } catch (error) {
            return next(error);
        }
    });
};

module.exports = {
    signup,
    login
};
