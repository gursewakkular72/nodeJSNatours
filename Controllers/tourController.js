const Tour = require('../Model/tourModel');

// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`, 'utf-8'),
// );
// console.log(tours);

// create a checkbody middleware
//check if body contains the name and price property
// If not, send back 404, bad request
// Add it to the post handler stack

exports.validateBody = (req, res, next) => {
  if (!req.body.name) {
    res.status(404).send({
      status: 'failed',
      message: 'Missing the name',
    });
  }

  if (!req.body.price) {
    res.status(404).send({
      status: 'failed',
      message: 'Missing the price',
    });
  }
  next();
};

// exports.validateId = (req, res, next) => {
//   const { id } = req.params;
//   // converting 'id' to number by multiplying it by one;

//   // if (id * 1 > tours.length - 1 || id * 1 <= 0) {
//   res.status(404).json({
//     status: 'Failed',
//     message: 'Invalid Id',
//   });

//   next();
// };

exports.getAllTours = async (req, res) => {
  try {
    const queryObj = { ...req.query };
    // exclude: page, sort, limit, fields.
    const excludeFields = ['page', 'sort', 'limit', 'fields'];

    excludeFields.forEach((el) => delete queryObj[el]);

    // fetching based on the operators
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`);
    queryStr = JSON.parse(queryStr);

    let query = Tour.find(queryStr);

    // fetching based on sorting
    if (req.query.sort) {
      let sortBy = req.query.sort;
      if (req.query.sort.includes(','))
        sortBy = req.query.sort.split(',').join(' ');
      console.log(sortBy, 'sortBy----');
      query = query.sort(sortBy);
    }

    // fetching based on the fields
    if (req.query.fields) {
      let fields = req.query.fields;
      if (req.query.fields.includes(','))
        fields = req.query.fields.split(',').join(' ');
      query.select(fields);
    }

    // if we await this following call rightaway, we would not be able to chain the other query methods
    // so we need to await the entire desired results using all the desired query methods later.
    // const query =  Tour.find()
    //   .where('duration')
    //   .equals(9)
    //   .where('difficulty')
    //   .equals('easy');
    // const tours = await Tour.find(query);

    const tours = await query;

    res.status(200).json({
      status: 'success',
      data: {
        tours,
      },
    });
  } catch (err) {
    res.status(400).send({
      status: 'failed',
      message: 'Error 404. No Tours are found!',
    });
  }
};

exports.createTour = async (req, res) => {
  try {
    // get the the body

    // create the Tour document and saving it to the database
    const newTour = await Tour.create(req.body);

    res.status(201).send({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      status: 'failed',
      message: 'error 404. Bad request',
    });
  }
};

exports.getTourByID = async (req, res) => {
  const { id } = req.params;
  // const tour = tours.find((el) => el.id === id * 1);
  // console.log(id);

  try {
    const tour = await Tour.findById(id);
    res.status(200).send({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (error) {
    res.status(400).send({
      status: 'failed',
      message: 'Erorr 404. The Tour does not exist.',
    });
  }
};

// this method is not doing anything actually, it's just for demonstration purpose
exports.updateTour = async (req, res) => {
  const { id } = req.params;

  try {
    const tour = await Tour.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    return res.status(200).send({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (error) {
    return res.status(404).send({
      status: 'failed',
      message: 'Error 404. The Tour can not be updated.',
    });
  }
};

// this method is not doing anything actually, it's just for demonstration purpose

exports.deleteTour = async (req, res) => {
  const { id } = req.params;
  // console.log('deleted ran.');
  try {
    await Tour.findByIdAndDelete(id);

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    res.send(404).send({
      status: 'failed',
      message: 'Error 404. Unable to delete the tour.',
    });
  }
};
