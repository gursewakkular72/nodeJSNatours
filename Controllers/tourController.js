const fs = require('fs');

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`, 'utf-8')
);
// console.log(tours);

exports.validateId = (req, res, next) => {
  const { id } = req.params;
  // converting 'id' to number by multiplying it by one;
  console.log('executed validate iD');

  if (id * 1 > tours.length - 1 || id * 1 <= 0) {
    res.status(404).json({
      status: 'Failed',
      message: 'Invalid Id',
    });
  }

  next();
};

exports.getAllTours = (req, res) => {
  console.log('called');
  res.status(200).json({
    status: 'success',
    requestedAt: req.requesTime,
    data: {
      tours,
    },
  });
};

exports.postTour = (req, res) => {
  // get the the body
  const totalTours = tours.length - 1;
  const newTourId = totalTours + 1;
  const newTour = Object.assign({ id: newTourId }, req.body);

  tours.push(newTour);

  fs.writeFile(
    `${__dirname}/../dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      if (err)
        res.status(500).send('Can not save the tours. Something went wrong :(');
      res.status(201).json(tours);
    }
  );
};

exports.getTourByID = (req, res) => {
  const { id } = req.params;
  const tour = tours.find((el) => el.id === id * 1);
  return res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
};

// this method is not doing anything actually, it's just for demonstration purpose
exports.updateTour = (req, res) => {
  return res.status(200).json({
    status: 'success',
    message: '< updated>',
  });
};

// this method is not doing anything actually, it's just for demonstration purpose

exports.deleteTour = (req, res) => {
  const { id } = req.params;

  return res.status(204).json({
    status: 'success',
    data: null,
  });
};