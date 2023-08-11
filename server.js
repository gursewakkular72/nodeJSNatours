const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');

dotenv.config({
  path: 'config.env',
});
const DB = process.env.DATABASE.replace(
  '<password>',
  process.env.DATABASE_PASSWORD,
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useCreateIndex: true,
    // useFindAndModify: false,
  })
  .then((con) => {
    // console.log(con);
  });

// starting the server
app.listen(process.env.PORT, () => {
  console.log('listening on port 3000');
});

exports.modules = app;
