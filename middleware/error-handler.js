const errorHandler = (err, req, res, next) => {
  const error = {
    statusCode: err.statusCode || 500,
    message: err.message || 'Something went wrong, try again'
  }

  // mongoose bad ObjectId
  if (err.name === 'CastError') {
    error.message = 'Resource not found'
    error.statusCode = 404
  }

  // mongoose duplicate key
  if (err.code === 11000) {
    error.message = 'Duplicate field value entered'
    error.statusCode = 400
  }

  // mongoose validation error
  if (err.name === 'ValidationError') {
    error.message = Object.values(err.errors).map(item => item.message).join(', ')
    error.statusCode = 400
  }

  console.log(err)
  return res.status(error.statusCode).json({ error: error.message })
}

export default errorHandler