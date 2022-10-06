const express = require('express');
const mongoose = require('mongoose');

const feedRoutes = require('./routes/feed');

const MONGODB_URI = 'mongodb+srv://user815:9TMiDci0cy0Pd92m@cluster0.ns3cqzi.mongodb.net/blog?retryWrites=true&w=majority';

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Method', 'GET, POST, PUT, DELETE, PATCH');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use('/feed', feedRoutes);

mongoose
  .connect(MONGODB_URI)
  .then(() => app.listen(8080))
  .catch(err => console.log(err));