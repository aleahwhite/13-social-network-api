const mongoose = require('mongoose');
const connection = require('../config/connection'); 
const { users, thoughts } = require('./data');
const User = require('../models/user.model');
const Thought = require('../models/thought.model');


connection.on('error', (err) => console.error(`Connection error: ${err}`));

connection.once('open', async () => {
  console.log('connected');

  await User.deleteMany({});
  await Thought.deleteMany({});

  await User.insertMany(users);
  await Thought.insertMany(thoughts);

  console.log('Seeding complete! 🌱');
  process.exit(0);
});
