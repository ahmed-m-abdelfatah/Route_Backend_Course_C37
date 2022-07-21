const express = require('express');
const app = express();
const { nanoid } = require('nanoid');

const port = 3000 || 5000;

// array of users
let users = [
  { id: 1, name: 'John', age: 20, email: 'John@gmail.com' },
  { id: 2, name: 'Peter', age: 30, email: 'Peter@gmail.com' },
  { id: 3, name: 'Alice', age: 25, email: 'Alice@gmail.com' },
  { id: 4, name: 'Oliver', age: 15, email: 'Oliver@gmail.com' },
];

// middleware
app.use(express.json());

// home page
app.get('/', (req, res) => {
  res.status(200).send('Home Page');
});

// get all users
app.get('/users', (req, res) => {
  res.status(200).json(users);
});

// get all users ( reversed )
app.get('/users/reversed', (req, res) => {
  res.status(200).json([...users].reverse());
});

// add new user
app.post('/users/add', (req, res) => {
  const user = req.body;

  const foundUser = users.find(u => {
    return u.email == user.email;
  });

  if (foundUser) {
    res.status(409).send('User already exists');
  } else {
    user.id = nanoid();
    users.push(user);
    res.status(201).send('User added');
  }
});

// add new user page
app.get('/users/add', (req, res) =>
  res.status(200).send('No Data Here, you need to use POST method'),
);

// delete user
app.delete('/users/delete/:id', (req, res) => {
  const { id } = req.params;

  const user = users.find(u => u.id == id);

  if (!user) {
    res.status(409).send('User not found');
  } else {
    users = users.filter(u => u.id != id);

    res.setHeader('Content-Type', 'application/json');
    res.write('User deleted Successfully \n' + JSON.stringify(users));
    res.status(200);
    res.end();
  }
});

// delete user page
app.get('/users/delete/:id', (req, res) =>
  res.status(200).send('No Data Here, you need to use DELETE method'),
);

// update user
app.patch('/users/update/:id', (req, res) => {
  const { id } = req.params;
  const { name, age, email } = req.body;

  const user = users.find(u => u.id == id);

  if (!user) {
    res.status(409).send('User not found');
  } else {
    user.name = name;
    user.age = age;
    user.email = email;

    res.setHeader('Content-Type', 'application/json');
    res.write('User updated Successfully \n' + JSON.stringify(users));
    res.status(200);
    res.end();
  }
});

// update user page
app.get('/users/update/:id', (req, res) =>
  res.status(200).send('No Data Here, you need to use PATCH method'),
);

app.listen(port, () => {
  console.log(`Server is running on port ${port} using express`);
});
