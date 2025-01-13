const express = require("express");
const path = require('path');
const http = require('http');

const app = express();

const messages = [];

app.use(express.static(path.join(__dirname, 'client')))

const server = http.createServer(app);

server.listen(8000, () => {
  console.log('Server is running on port: 8000');
});