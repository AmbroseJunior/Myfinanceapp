const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bcrypt = require("bcrypt");

const app = express();
app.use(cors());

//mysql connection
const db = mysql.createConnection({
    user: "root",
    host: "localhost",
    password: "Nnamdi90!",
    database: "financeapp",
});

//connect to db
db.connect((err) => {
    if (err) {
        console.log("Error connecting to database: " + err);
        return;
    }
    console.log("Connected to database");
});

//test route
app.get("/", (req, res) => {
    res.send("Backend is running");
});

//post/ add user
app.post("/user", (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const hashedPassword = bcrypt.hashSync(password, 10);
    const sql = "INSERT INTO user (name, email, password) VALUES (?,?,?)";
    db.query(sql, [name, email, hashedPassword], (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send("User added successfully");
        }
    });
});


//get All users
app.get("/users", (req, res) => {
    const sql = "SELECT * FROM user";
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});


//start server
const PORT = 3001;
app.listen(3001, () => {
    console.log(`Server started on port ${PORT}`);
})