const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Tour name is a required field.'],
    unique: true,
  },
  rating: {
    type: Number,
    default: 4.5,
  },
  price: {
    type: Number,
    required: [true, 'Tour price is a required field.'],
  },
});

// creating Tour model. Tour model is an equivalent of collections in mongodb database.
const Tour = mongoose.model('Tour', tourSchema);
