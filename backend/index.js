require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getUserByEmail, createUser } = require('./db');

const app = express();
const PORT = process.env.PORT || 8000;
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => res.json({ ok: true, message: 'Terra-Civitas auth server' }));

// Register: expects { email, password }
app.post('/auth/register', async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ detail: 'Email and password required' });

    const existing = getUserByEmail(email);
    if (existing) return res.status(409).json({ detail: 'Email already registered' });

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    const user = createUser(email, hash);
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

    return res.status(201).json({ token, user: { id: user.id, email: user.email } });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ detail: 'Server error' });
  }
});

// Login: expects { email, password }
app.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ detail: 'Email and password required' });

    const user = getUserByEmail(email);
    if (!user) return res.status(401).json({ detail: 'Invalid credentials' });

    const match = bcrypt.compareSync(password, user.password);
    if (!match) return res.status(401).json({ detail: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    return res.json({ token, user: { id: user.id, email: user.email } });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ detail: 'Server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Auth server running on http://localhost:${PORT}`);
});
