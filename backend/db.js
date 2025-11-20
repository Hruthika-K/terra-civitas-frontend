const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, 'users.json');

function readDB() {
  try {
    if (!fs.existsSync(DB_FILE)) return { users: [] };
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw || '{"users":[]}');
  } catch (err) {
    console.error('Failed to read DB file', err);
    return { users: [] };
  }
}

function writeDB(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to write DB file', err);
  }
}

function getUserByEmail(email) {
  const db = readDB();
  return db.users.find(u => u.email === email) || null;
}

function createUser(email, hashedPassword) {
  const db = readDB();
  const id = (db.users.length > 0 ? Math.max(...db.users.map(u => u.id)) : 0) + 1;
  const user = { id, email, password: hashedPassword, created_at: new Date().toISOString() };
  db.users.push(user);
  writeDB(db);
  return { id: user.id, email: user.email };
}

module.exports = { getUserByEmail, createUser };
