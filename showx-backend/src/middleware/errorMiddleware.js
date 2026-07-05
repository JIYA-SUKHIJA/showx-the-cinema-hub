// Jab koi route hi nahi milta (galat URL), ye chalega
export const notFound = (req, res, next) => {
  const error = new Error(`Route not found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// Central error handler - saare errors yahan aakar handle honge
export const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  // Mongoose "CastError" - galat format ki MongoDB ID bheji gayi ho
  if (err.name === "CastError") {
    statusCode = 400;
    message = "Resource not found - invalid ID format";
  }

  // Mongoose Validation Error - schema ke rules follow nahi hue
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((val) => val.message)
      .join(", ");
  }

  // Duplicate key error (jaise same email se dobara register)
  if (err.code === 11000) {
    statusCode = 400;
    message = "Duplicate field value entered";
  }

  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};