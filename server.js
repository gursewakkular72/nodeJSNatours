const app = require('./app.js');

const port = 3000;

// console.log(app, 'from server.js');

// starting the server
app.listen(port, () => {
  console.log('listening on port 3000');
});

exports.modules = app;
