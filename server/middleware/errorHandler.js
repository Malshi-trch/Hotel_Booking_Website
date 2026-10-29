// Runs when no route matches
exports.notFound = (req, res) => {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
};

// Runs when any controller passes an error with next(err)
exports.errorHandler = (err, req, res, next) => {
  let status = err.statusCode || err.status || 500;
  let message = err.message || "Server error";

  if (err.name === "ValidationError") {
    status = 400;
    message = Object.values(err.errors)
      .map((e) => (e.name === "CastError" ? `${e.path} has an invalid value` : e.message))
      .join(". ");
  } else if (err.name === "CastError") {
    status = 404;
    message = "Resource not found";
  } else if (err.code === 11000) {
    status = 400;
    message = "That value is already in use";
  } else if (err.type === "entity.parse.failed") {
    status = 400;
    message = "Invalid JSON in request body";
  }

  if (status === 500) {
    console.error(err);
    message = "Something went wrong on the server";
  }

  res.status(status).json({ message });
};