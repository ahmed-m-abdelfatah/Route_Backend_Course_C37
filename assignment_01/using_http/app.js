const http = require('http');
const { nanoid } = require('nanoid');

const port = 3000 || 5000;

// array of users
let users = [
  { id: 1, name: 'John', age: 20, email: 'John@gmail.com' },
  { id: 2, name: 'Peter', age: 30, email: 'Peter@gmail.com' },
  { id: 3, name: 'Alice', age: 25, email: 'Alice@gmail.com' },
  { id: 4, name: 'Oliver', age: 15, email: 'Oliver@gmail.com' },
];

// server
let server = http.createServer((req, res) => {
  const { url, method } = req;

  switch (true) {
    // home page
    case url === '/' && method === 'GET': {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('Home Page');

      return;
    }

    // get all users
    case url === '/users' && method === 'GET': {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(users));

      return;
    }

    // get all users ( reversed )
    case url === '/users/reversed' && method === 'GET': {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify([...users].reverse()));

      return;
    }

    // add new user
    case url === '/users/add' && method === 'POST': {
      let body;

      req.on('data', chunk => {
        body = chunk;
      });

      req.on('end', () => {
        const user = JSON.parse(body);

        const foundUser = users.find(u => {
          return u.email == user.email;
        });

        if (foundUser) {
          //  https://datatracker.ietf.org/doc/html/draft-ietf-httpbis-p2-semantics-18#section-7.4.10
          res.writeHead(409, { 'Content-Type': 'text/plain' });
          res.end('This user already exists');
        } else {
          user.id = nanoid();
          users.push(user);

          // https://datatracker.ietf.org/doc/html/draft-ietf-httpbis-p2-semantics-18#section-7.2.2
          res.writeHead(201, { 'Content-Type': 'text/plain' });
          res.end('User added');
        }
      });

      return;
    }

    // add new user page
    case url === '/users/add' && method === 'GET': {
      // https://datatracker.ietf.org/doc/html/draft-ietf-httpbis-p2-semantics-18#section-7.2.5
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('No Data Here, you need to use POST method');

      return;
    }

    // delete user
    case url.startsWith('/users/delete') && method === 'DELETE': {
      const id = url.split('/')[3];

      const foundUser = users.find(u => u.id == id);

      if (foundUser) {
        users = users.filter(u => u.id != id);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.write('User deleted Successfully \n');
        res.end(JSON.stringify(users));
      } else {
        res.writeHead(409, { 'Content-Type': 'text/plain' });
        res.end('This user dose not exists');
      }

      return;
    }

    // delete user page
    case url.startsWith('/users/delete') && method === 'GET': {
      // https://datatracker.ietf.org/doc/html/draft-ietf-httpbis-p2-semantics-18#section-7.2.5
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('No Data Here, you need to use DELETE method');

      return;
    }

    // update user
    case url.startsWith('/users/update') && method === 'PATCH': {
      const id = url.split('/')[3];
      let body;

      req.on('data', chunk => {
        body = chunk;
      });

      req.on('end', () => {
        const foundUserIndex = users.findIndex(u => u.id == id);

        if (foundUserIndex != -1) {
          const updatedUser = JSON.parse(body);
          users[foundUserIndex] = { ...users[foundUserIndex], ...updatedUser };

          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.write('User updated Successfully \n');
          res.end(JSON.stringify(users));
        } else {
          res.writeHead(409, { 'Content-Type': 'text/plain' });
          res.end('This user dose not exists');
        }
      });

      return;
    }

    // update user page
    case url.startsWith('/users/update') && method === 'GET': {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('No Data Here, you need to use PATCH method');

      return;
    }

    // not found
    default: {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Page Not Found');

      return;
    }
  }
});

// run server
server.listen(port, () => {
  console.log(`Server is running on port ${port} using http`);
});
