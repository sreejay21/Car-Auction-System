module.exports = {
  Ok: function (result, res) {
    res.status(200).send({ status: true, responsecode: 200, result });
  },
  successCreate: function (result, res) {
    res.status(201).send({ status: true, responsecode: 201, result });
  },
  accepted: function (result, res) {
    res.status(202).send({ status: true, responsecode: 202, result });
  },
  noContent: function (res) {
    res.status(204).send({ status: true, responsecode: 204, result: null });
  },
  successDelete: function (res, message) {
    res.status(200).send({ status: true, responsecode: 200, message });
  },

  // Error responses
  badRequest: function (res) {
    res.status(400).send({ status: false, responsecode: 400, error: "Bad request" });
  },
  unAuthorized: function (res) {
    res.status(401).send({ status: false, responsecode: 401, error: "Unauthorized" });
  },
  forbidden: function (res, message) {
    res.status(403).send({ status: false, responsecode: 403, error: message });
  },
  notFound: function (res, message) {
    res.status(404).send({ status: false, responsecode: 404, error: message });
  },
  internalServerError: function (res, error) {
    res.status(500).send({ status: false, responsecode: 500, error });
  },
  getValidationError: function (res, error) {
    res.status(400).send({ status: false, responsecode: 400, error });
  }
};
