const express = require('express');
const app = express();
const port = 9000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, '127.0.0.1', () => {
  console.log(`Test server running at http://127.0.0.1:${port}`);
});