const Tour = require('../Model/tourModel');
const APIFeatures = require('../Utils/apiFeatures');

//Middle ware for the 5 cheapest tours

exports.getCheapTours = (req, res, next) => {
  req.query.sort = '-price';
  req.query.fields = 'name,summary,price,ratingAverage';
  req.query.limit = 5;
  next();
};

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

exports.getAllTours = async (req, res) => {
  try {
    // if we await this following call rightaway, we would not be able to chain the other query methods
    // so we need to await the entire desired results using all the desired query methods later.
    // 'awaiting' a query executes it and queries the database, otherwise it does not executed and a request is not sent to the database.

    const features = new APIFeatures(Tour, req.query).filter().sort().fields();

    const tours = await features.query;

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

  try {
    await Tour.findByIdAndDelete(id);

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    res.status(404).send({
      status: 'failed',
      message: 'Error 404. Unable to delete the tour.',
    });
  }
};

// using aggregate pipelines.
exports.getTourStats = async (req, res) => {
  try {
    const stats = await Tour.aggregate([
      // here we are fetching the data with a ratingsAverage greater than 4.7.
      {
        $match: { ratingsAverage: { $gte: 4.7 } },
      },

      // here we are grouping the data by field named 'difficult'
      {
        $group: {
          _id: '$difficulty',
          numOfTour: { $sum: 1 }, // here we are adding 1 to the numOfTour whenever we go through a document.
          minPrice: { $min: '$price' },
          avgRatings: { $avg: '$ratingsAverage' },
        },
      },

      // here we are sorting the fetched results by minPrice. '1' means sort by ascending order

      {
        $sort: { minPrice: 1 },
      },
    ]);

    res.status(201).send({
      status: 'success',
      data: {
        stats,
      },
    });
  } catch (error) {
    res.status(400).send({
      status: 'failed',
      message: error,
    });
  }
};

exports.getMonthlyPlan = async (req, res) => {
  const { year } = req.query;

  console.log(year);

  // const stats = await Tour.aggregate([
  //   {
  //     $unwind: '$startDates',
  //   },
  //   {
  //     $match: { startDates: { $gte: new Date(`${year}-01-01`) } },
  //   },
  // ]);

  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year * 1}-01-01`),
          $lte: new Date(`${year * 1}-12-31`),
        },
      },
    },

    {
      $group: {
        _id: `$name`,
        numOfTours: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },

    {
      $addFields: { month: '$_id' },
    },

    {
      $project: {
        _id: 0,
      },
    },

    {
      $sort: { duration: 1 },
    },
    {
      $limit: 12,
    },
  ]);
  res.status(200).send({
    status: 'success',
    data: {
      plan,
    },
  });
};
