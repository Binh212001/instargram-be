const responseHandler = (res, statusCode, data) =>
  res.status(statusCode).json(data);

const ok = (res, data) => {
  responseHandler(res, 200, data);
};

const created = (res, data) => {
  responseHandler(res, 201, data);
};

const badRequest = (res, data) => {
  responseHandler(res, 400, data);
};

const notfound = (res) =>
  responseHandler(res, 404, {
    message: 'Not Found',
  });

const unAuthorization = (res) =>
  responseHandler(res, 403, { message: 'Un Authorization' });

const internalServer = (res, err) =>
  responseHandler(res, 403, { message: err.message });

module.exports = {
  ok,
  created,
  badRequest,
  unAuthorization,
  internalServer,
  notfound,
};
