const express = require("express");
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
    host: "localhost",
    user: "user",
    password: "",
    database: "studyverse",
    port: 5432 // Default PostgreSQL port
});

app.post('/signup', async (req, res) => {
    const sql = "INSERT INTO Users (Username, Password, LastName, FirstName, Gender, Educational-Level, Academic-Interest) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *";
    const values = [
        req.body.username,
        req.body.password,
        req.body.lastname,
        req.body.firstname,
        req.body.education,
        req.body.academic,
        req.body.gender 
    ];

    try {
        const result = await pool.query(sql, values);
        res.json(result.rows[0]);
    } catch (err) {
        res.json("Error");
    }
});

app.post('/login', async (req, res) => {
    const sql = "SELECT * FROM Login WHERE username = $1 AND password = $2";
    const values = [
        req.body.username,
        req.body.password
    ];

    try {
        const result = await pool.query(sql, values);
        if (result.rows.length > 0) {
            res.json("Success");
        } else {
            res.json("Failed");
        }
    } catch (err) {
        res.json("Error");
    }
});

app.listen(8081, () => {
    console.log("listening");
});
