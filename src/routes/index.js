const userRoute = require('./user.route');
const postRoute = require('./post.route');

const route = (app) => {
  app.use('/api/v1/', userRoute);
  app.use('/api/v1/', postRoute);
};

module.exports = route;
