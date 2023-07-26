const express = require('express');
const userRouter = express.Router();
const userController = require('../Controllers/userController.js');

userRouter
  .route(`/`)
  .get(userController.getAllUsers)
  .post(userController.postUser);

userRouter
  .route('/:id')
  .get(userController.getUserById)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = userRouter;
