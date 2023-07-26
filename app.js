const express = require('express');
// const app = require('./server.js');
const morgan = require('morgan');
const tourRouter = require('./Routes/tourRoutes.js');
const userRouter = require('./Routes/userRoutes.js');
// const app = require('./server.js');

const app = express();

console.log('app.js ran');

// setting up middlewares
app.use(express.json());
app.use(morgan('dev'));

// 'api/v1/tours' is the root URL for tourRouters
app.use('/api/v1/tours', tourRouter);
// 'api/v1/users' is the root URL for userRouters
app.use('/api/v1/users', userRouter);
//set up middle ware

app.use((req, res, next) => {
  req.requesTime = new Date().toISOString();
  next();
});

module.exports = app;
