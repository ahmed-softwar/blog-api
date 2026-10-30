
require("dotenv").config();

const express = require("express");
const path = require("path");

const connection = require("./config/database");
const errorHandler = require("./middleware/errorHandler");

const authRoutes = require("./routes/authRoutes");
const blogRoutes = require("./routes/blogRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => {
    res.status(200).json({
        message: "Blog API is running"
    });
});

app.use("/auth", authRoutes);
app.use("/bloogs", blogRoutes);
app.use("/users", userRoutes);

app.use((req, res) => {
    res.status(404).json({
        message: "Route not found"
    });
});

app.use(errorHandler);

connection.connect((error) => {
    if (error) {
        console.error("Database connection failed:", error.message);
        process.exit(1);
    }

    console.log("Database connected successfully");

    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
});
