const express = require('express');
const fs = require('fs');

const app = express();
//set up middle ware
app.use(express.json());
const port = 3000;

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`, 'utf-8')
);
// console.log(tours);

app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      tours,
    },
  });
});

app.post('/api/v1/tours', (req, res) => {
  // console.log('ran');
  // get the the body
  const totalTours = tours.length - 1;
  const newTourId = totalTours + 1;
  const newTour = Object.assign({ id: newTourId }, req.body);

  tours.push(newTour);

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      if (err)
        res.status(500).send('Can not save the tours. Something went wrong :(');
      res.status(201).json(tours);
    }
  );
});

app.listen(port, () => {
  console.log('listening on port 3000');
});
