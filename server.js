const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const PORT = 3000;

app.use(bodyParser.json());

const readUsers = () => {
  const data = fs.readFileSync('users.json');
  return JSON.parse(data);
};

const writeUsers = (data) => {
  fs.writeFileSync('users.json', JSON.stringify(data, null, 2));
};

// Get all users
app.get('/users', (req, res) => {
  const data = readUsers();
  res.json(data.users);
});

// Get user by id
app.get('/users/:id', (req, res) => {
  const data = readUsers();
  const user = data.users.find(u => u.id === req.params.id);
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

// Create a new user
app.post('/users', (req, res) => {
  const data = readUsers();
  const newUser = req.body;
  data.users.push(newUser);
  writeUsers(data);
  res.status(201).json(newUser);
});

// Update a user by id
app.put('/users/:id', (req, res) => {
  const data = readUsers();
  const index = data.users.findIndex(u => u.id === req.params.id);
  if (index !== -1) {
    data.users[index] = req.body;
    writeUsers(data);
    res.json(data.users[index]);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

// Delete a user by id
app.delete('/users/:id', (req, res) => {
  const data = readUsers();
  const index = data.users.findIndex(u => u.id === req.params.id);
  if (index !== -1) {
    const deletedUser = data.users.splice(index, 1);
    writeUsers(data);
    res.json(deletedUser);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
