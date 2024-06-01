import express from 'express';
import mysql from 'mysql2/promise';
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());

const db = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', 
    database: 'user'
});

console.log('Connected to MySQL database.');

// Create a new user
app.post('/users', async (req, res) => {
    const { email, name, age, about } = req.body;
    const sql = 'INSERT INTO users (email, name, age, about) VALUES (?, ?, ?, ?)';
    try {
        const [result] = await db.query(sql, [email, name, age, about]);
        res.status(201).send(result);
    } catch (err) {
        res.status(500).send(err);
    }
});

// Read all users
app.get('/users', async (req, res) => {
    const sql = 'SELECT * FROM users';
    try {
        const [result] = await db.query(sql);
        res.status(200).send(result);
    } catch (err) {
        res.status(500).send(err);
    }
});

// Read a single user
app.get('/users/:email', async (req, res) => {
    const { email } = req.params;
    const sql = 'SELECT * FROM users WHERE email = ?';
    try {
        const [result] = await db.query(sql, [email]);
        res.status(200).send(result);
    } catch (err) {
        res.status(500).send(err);
    }
});

// Update a user
app.put('/users/:email', async (req, res) => {
    const { email } = req.params;
    const { name, age, about } = req.body;
    const sql = 'UPDATE users SET name = ?, age = ?, about = ? WHERE email = ?';
    try {
        const [result] = await db.query(sql, [name, age, about, email]);
        res.status(200).send(result);
    } catch (err) {
        res.status(500).send(err);
    }
});

// Delete a user
app.delete('/users/:email', async (req, res) => {
    const { email } = req.params;
    const sql = 'DELETE FROM users WHERE email = ?';
    try {
        const [result] = await db.query(sql, [email]);
        res.status(200).send(result);
    } catch (err) {
        res.status(500).send(err);
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
