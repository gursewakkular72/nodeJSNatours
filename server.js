const dotenv = require('dotenv');
dotenv.config({
  path: 'config.env',
});
const app = require('./app');
const mongoose = require('mongoose');
const DB = process.env.DATABASE.replace(
  '<password>',
  process.env.DATABASE_PASSWORD,
);

console.log(DB);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useCreateIndex: true,
    // useFindAndModify: false,
  })
  .then((con) => {
    console.log(con);
  });

// console.log(app, 'from server.js');

// tour Schema:

// creating tour schema
const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Tour name is a required field.'],
    unique: true,
  },
  price: {
    type: Number,
    required: [true, 'Tour price is a required field.'],
  },
});

// creating Tour model. Tour model is an equivalent of collections in mongodb database.

const Tour = mongoose.model('Tour', tourSchema);

//Tour document
const testTour = new Tour({
  name: 'The Forest Hiker',
  price: 500,
  rating: 4.7,
});

testTour
  .save()
  .then((doc) => console.log(doc))
  .catch((err) => console.log('An error has occured', err));

// starting the server
app.listen(process.env.PORT, () => {
  console.log('listening on port 3000');
});

exports.modules = app;
