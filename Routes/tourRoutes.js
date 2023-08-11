const express = require('express');

const tourRouter = express.Router();

const tourController = require('../Controllers/tourController');

// param middleware, only executes if we pass an Id to URL
// tourRouter.param('id', tourController.validateId);

// the following chain executes for the base URL: '/'
tourRouter
  .route(`/`)
  .get(tourController.getAllTours)
  .post(tourController.createTour); // chaining middleware

// the following chain executes for the URL having an 'Id' param after the Base URL.
tourRouter
  .route(`/:id`)
  .get(tourController.getTourByID)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = tourRouter;
