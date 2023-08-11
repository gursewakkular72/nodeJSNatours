const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('../../Model/tourModel');

dotenv.config({
  path: 'config.env',
});

const data = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, `utf-8`),
);

const DB = process.env.DATABASE.replace(
  '<password>',
  process.env.DATABASE_PASSWORD,
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((con) => {
    console.log('connected to db');
  });

const importData = async () => {
  try {
    await Tour.create(data);
    console.log('data saved successfull');
  } catch (error) {
    console.log(error);
  }
  process.exit();
};

const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log('data deleted successfull');
  } catch (error) {
    console.log(error);
  }
};

if (process.argv[2] === '--import') importData();
if (process.argv[2] === '--delete') deleteData();
